/* global Office, console */

import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import MessageList from "./MessageList";
import UserInput from "./UserInput";
import OpenAI from "openai";
import {
  writeToCellOperation,
  readFromCellOperation,
  formatCellOperation,
  addChartOperation,
  getRangeData,
  writeToSelectedRange,
  getSelectedRangeInfo,
  analyzeData,
  getWorksheetNames,
  addPivotTableOperation,
  manageWorksheet,
  filterDataOperation,
  sortDataOperation,
  mergeCellsOperation,
  unmergeCellsOperation,
  autofitColumnsOperation,
  autofitRowsOperation,
  applyConditionalFormat,
  clearConditionalFormats,
  getActiveWorksheetName,
} from "../excelOperations";
import { ChartType, Filters, PivotAggregationFunction } from "./App";
import { embedWorksheet, embedAllWorksheets, initializeOpenAI } from "../embedding_operations";

const DEFAULT_API_KEY = "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";

const useStyles = makeStyles({
  chatInterface: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    opacity: 0,
    transition: "opacity 1s ease-in",
  },
  fadeIn: {
    opacity: 1,
  },
  messageListContainer: {
    flexGrow: 1,
    overflowY: "auto",
    padding: "20px",
  },
});

interface ChatInterfaceProps {
  apiKey: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey, setIsLoading }) => {
  const styles = useStyles();
  const [messages, setMessages] = React.useState<Array<{ text: string; isUser: boolean }>>([]);
  const [worksheetNames, setWorksheetNames] = React.useState<string[]>([]);
  const [activeWorksheet, setActiveWorksheet] = React.useState<string>("");

  // Use the provided apiKey or the default one
  const effectiveApiKey = apiKey || DEFAULT_API_KEY;

  // Create OpenAI instance using useRef to persist across renders
  const openaiRef = React.useRef<OpenAI | null>(null);
  React.useEffect(() => {
    openaiRef.current = new OpenAI({ apiKey: effectiveApiKey, dangerouslyAllowBrowser: true });
  }, [effectiveApiKey]);

  const openai = React.useMemo(() => initializeOpenAI(effectiveApiKey), [effectiveApiKey]);

  const handleSendMessage = async (text: string, taggedSheets: string[]) => {
    setIsLoading(true);
    const currentActiveWorksheet = await getActiveWorksheetName();
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `[Active Worksheet: ${currentActiveWorksheet}] ${text}`, isUser: true },
    ]);

    if (!effectiveApiKey) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Please set your API key in the settings.", isUser: false },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      if (taggedSheets.includes("workbook")) {
        await handleEmbedAllWorksheets();
      } else {
        // Embed tagged sheets
        for (const sheetName of taggedSheets) {
          await handleEmbedding(sheetName);
        }
      }

      const { address, rowCount, columnCount } = await getSelectedRangeInfo();

      const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
        {
          type: "function",
          function: {
            name: "write_to_excel",
            description: "Write values to a range of cells in Excel",
            parameters: {
              type: "object",
              properties: {
                startCell: {
                  type: "string",
                  description: "The starting cell address (e.g., 'A1')",
                },
                values: {
                  type: "array",
                  items: {
                    type: "array",
                    items: {
                      type: ["string", "number", "boolean", "null"],
                    },
                  },
                  description: "The values to write to the cells. Should be a 2D array.",
                },
              },
              required: ["startCell", "values"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "read_from_excel",
            description: "Read a value from a specific cell in Excel",
            parameters: {
              type: "object",
              properties: {
                cellAddress: { type: "string", description: "The cell address to read from (e.g., 'A1', 'B2')." },
              },
              required: ["cellAddress"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "format_cell",
            description: "Format a cell in Excel",
            parameters: {
              type: "object",
              properties: {
                cellAddress: { type: "string", description: "The cell address to format (e.g., 'A1', 'B2')" },
                fontColor: { type: "string", description: "The font color (e.g., '#FF0000' for red)" },
                backgroundColor: { type: "string", description: "The background color (e.g., '#FFFF00' for yellow)" },
                bold: { type: "boolean", description: "Whether to make the text bold" },
              },
              required: ["cellAddress"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "add_chart",
            description: "Add a chart to the Excel worksheet",
            parameters: {
              type: "object",
              properties: {
                dataRange: {
                  type: "string",
                  description:
                    "The range of cells containing the data for the chart. Specify using standard Excel range notation",
                },
                chartType: {
                  type: "string",
                  enum: Object.values(ChartType),
                  description: "The type of chart to create",
                },
              },
              required: ["dataRange", "chartType"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "analyze_selected_range",
            description: "Analyze the data in the currently selected range in Excel",
            parameters: {
              type: "object",
              properties: {
                analysisType: {
                  type: "string",
                  enum: ["summary", "trend", "distribution"],
                  description: "The type of analysis to perform on the selected data",
                },
              },
              required: ["analysisType"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "write_to_selected_range",
            description: `Write values to the currently selected range in Excel (${address}, ${rowCount}x${columnCount}). If the input is larger, it will be trimmed to fit.`,
            parameters: {
              type: "object",
              properties: {
                values: {
                  type: "array",
                  items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  description: `The values to write to the selected range. Should be a 2D array of strings, ideally ${rowCount}x${columnCount} to fit the selected range.`,
                },
              },
              required: ["values"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "read_range",
            description: "Read values from a specific range or the currently selected range in Excel",
            parameters: {
              type: "object",
              properties: {
                rangeAddress: {
                  type: "string",
                  description:
                    "The range address to read from (e.g., 'A1:B5'). If not provided, reads from the currently selected range.",
                },
              },
            },
          },
        },
        {
          type: "function",
          function: {
            name: "add_pivot",
            description: "Add a pivot table to the Excel worksheet",
            parameters: {
              type: "object",
              properties: {
                sourceDataRange: {
                  type: "string",
                  description:
                    "The range of cells containing the source data for the pivot table. Specify using standard Excel range notation (e.g., 'A1:D10').",
                },
                destinationCell: {
                  type: "string",
                  description: "The cell where the pivot table should be placed (e.g., 'G1').",
                },
                rowFields: {
                  type: "array",
                  items: { type: "string" },
                  description: "An array of field names to use as row labels.",
                },
                columnFields: {
                  type: "array",
                  items: { type: "string" },
                  description: "An array of field names to use as column labels.",
                },
                dataFields: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      function: {
                        type: "string",
                        enum: Object.values(PivotAggregationFunction),
                      },
                    },
                    required: ["name", "function"],
                  },
                  description: "An array of objects specifying the data fields and their aggregation functions.",
                },
                filterFields: {
                  type: "array",
                  items: { type: "string" },
                  description: "An optional array of field names to use as filters.",
                },
              },
              required: ["sourceDataRange", "destinationCell", "rowFields", "columnFields", "dataFields"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "manage_worksheet",
            description: "Create a new worksheet or delete an existing one in Excel",
            parameters: {
              type: "object",
              properties: {
                action: {
                  type: "string",
                  enum: ["create", "delete"],
                  description: "The action to perform on the worksheet",
                },
                sheetName: {
                  type: "string",
                  description: "The name of the worksheet to create or delete",
                },
              },
              required: ["action", "sheetName"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "filter_data",
            description: "Filter data in Excel based on specified criteria",
            parameters: {
              type: "object",
              properties: {
                range: {
                  type: "string",
                  description: "The range to filter (e.g., 'A1:D10'). If not provided, uses the current selection.",
                },
                column: {
                  type: "string",
                  description: "The column to apply the filter to (e.g., 'A', 'B', 'C')",
                },
                filterType: {
                  type: "string",
                  enum: ["Equals", "GreaterThan", "LessThan", "Between", "Contains", "Values"],
                  description: "The type of filter to apply",
                },
                criteria: {
                  type: "object",
                  description: "The criteria for the filter, depends on the filterType.",
                },
              },
              required: ["column", "filterType", "criteria"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "sort_data",
            description: "Sort data in an Excel range based on specified criteria",
            parameters: {
              type: "object",
              properties: {
                range: {
                  type: "string",
                  description: "The range to sort (e.g., 'A1:D10'). If not provided, uses the current selection.",
                },
                sortFields: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: { type: "number", description: "The column index to sort by (0-based)" },
                      ascending: {
                        type: "boolean",
                        description: "Sort in ascending order if true, descending if false",
                      },
                      color: { type: "string", description: "The color to sort by (if sorting by color)" },
                      dataOption: {
                        type: "string",
                        enum: ["normal", "textAsNumber"],
                        description: "How to sort text values",
                      },
                    },
                    required: ["key", "ascending"],
                  },
                  description: "An array of sort criteria to apply",
                },
                matchCase: { type: "boolean", description: "Whether to match case when sorting" },
                hasHeaders: { type: "boolean", description: "Whether the range has a header row" },
              },
              required: ["sortFields"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "merge_cells",
            description: "Merge cells in a specified range",
            parameters: {
              type: "object",
              properties: {
                range: {
                  type: "string",
                  description: "The range to merge (e.g., 'A1:B2')",
                },
                across: {
                  type: "boolean",
                  description:
                    "If true, merges cells in each row separately. If false or omitted, merges the entire range.",
                },
              },
              required: ["range"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "unmerge_cells",
            description: "Unmerge cells in a specified range",
            parameters: {
              type: "object",
              properties: {
                range: {
                  type: "string",
                  description: "The range to unmerge (e.g., 'A1:B2')",
                },
              },
              required: ["range"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "autofit_columns",
            description: "Auto-fit columns in a specified range",
            parameters: {
              type: "object",
              properties: {
                range: {
                  type: "string",
                  description: "The range to auto-fit columns (e.g., 'A:C' or 'A1:C10')",
                },
              },
              required: ["range"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "autofit_rows",
            description: "Auto-fit rows in a specified range",
            parameters: {
              type: "object",
              properties: {
                range: {
                  type: "string",
                  description: "The range to auto-fit rows (e.g., '1:3' or 'A1:C10')",
                },
              },
              required: ["range"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "apply_conditional_format",
            description: "Apply a conditional format to a range in Excel",
            parameters: {
              type: "object",
              properties: {
                range: {
                  type: "string",
                  description: "The range to apply conditional formatting to (e.g., 'A1:D10')",
                },
                formatType: {
                  type: "string",
                  enum: [
                    "cellValue",
                    "colorScale",
                    "dataBar",
                    "iconSet",
                    "topBottom",
                    "presetCriteria",
                    "containsText",
                    "custom",
                  ],
                  description: "The type of conditional format to apply",
                },
                rule: {
                  type: "object",
                  description: "The rule for the conditional format, depends on the formatType",
                },
                format: {
                  type: "object",
                  description: "The format to apply when the condition is met",
                },
              },
              required: ["range", "formatType", "rule"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "clear_conditional_formats",
            description: "Clear all conditional formats from a range in Excel",
            parameters: {
              type: "object",
              properties: {
                range: {
                  type: "string",
                  description: "The range to clear conditional formatting from (e.g., 'A1:D10')",
                },
              },
              required: ["range"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "get_worksheet_names",
            description: "Get the names of all worksheets in the current workbook",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "get_active_worksheet_name",
            description: "Get the name of the currently active worksheet",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
      ];
      // System prompt
      const completion = await openaiRef.current?.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that interacts with Excel. You can access multiple worksheets in the workbook. The currently active worksheet is "${activeWorksheet}". Use the get_worksheet_names function to get a list of all available worksheets, and get_active_worksheet_name to check which worksheet is currently active. Follow the user's instructions to manipulate Excel spreadsheets, using the provided functions. You can create charts, pivot tables, filter data using a wide range of criteria, and perform various data operations. Ensure your responses are clear and formatted using markdown for better readability. You can use tables to present data when appropriate. Assure you use the functions in the appropriate order to achieve the desired result (i.e. don't use execute all functions at once).`,
          },
          ...messages.map((msg) => ({
            role: msg.isUser ? ("user" as const) : ("assistant" as const),
            content: msg.text,
          })),
          { role: "user", content: text },
        ],
        model: "gpt-4o-2024-08-06",
        tools: tools,
        tool_choice: "auto",
      });
      if (completion?.choices[0]?.message?.tool_calls) {
        const toolCalls = completion.choices[0].message.tool_calls;
        const toolResults = await Promise.all(
          toolCalls.map(async (toolCall) => {
            const args = JSON.parse(toolCall.function.arguments);
            let functionResult = "";

            try {
              switch (toolCall.function.name) {
                case "write_to_excel":
                  await writeToCellOperation(args.startCell, args.values);
                  functionResult = `Values written to range starting at ${args.startCell}`;
                  break;
                case "read_from_excel":
                  const cellValue = await readFromCellOperation(args.cellAddress);
                  functionResult = `The value in cell ${args.cellAddress} is "${cellValue}"`;
                  break;
                case "format_cell":
                  await formatCellOperation(args.cellAddress, {
                    fontColor: args.fontColor,
                    backgroundColor: args.backgroundColor,
                    bold: args.bold,
                  });
                  functionResult = `Cell ${args.cellAddress} formatted as requested`;
                  break;
                case "add_chart":
                  const chartType = args.chartType as ChartType;
                  if (!Object.values(ChartType).includes(chartType)) {
                    throw new Error(`Invalid chart type: ${args.chartType}`);
                  }
                  const dataRange = args.dataRange;
                  if (!dataRange) {
                    throw new Error("Data range is required to create a chart.");
                  }
                  await addChartOperation(dataRange, chartType);
                  functionResult = `Added ${args.chartType} chart using data from range ${dataRange}`;
                  break;
                case "analyze_selected_range":
                  try {
                    const { address, values } = await getRangeData();
                    const analysisResult = await analyzeData(values, args.analysisType);
                    functionResult = `Analysis of selected range ${address}:\n${analysisResult}`;
                  } catch (error) {
                    console.error("Error in analyze_selected_range:", error);
                    functionResult = `Failed to analyze the selected range. ${error instanceof Error ? error.message : "Unknown error occurred"}`;
                  }
                  break;
                case "read_range":
                  try {
                    const { address, values } = await getRangeData(args.rangeAddress);
                    functionResult = `The values in range ${address} are:\n${JSON.stringify(values)}`;
                  } catch (error) {
                    console.error("Error in read_range:", error);
                    functionResult = `Failed to read range. ${error instanceof Error ? error.message : "Unknown error occurred"}`;
                  }
                  break;
                case "add_pivot":
                  await addPivotTableOperation(
                    args.sourceDataRange,
                    args.destinationCell,
                    args.rowFields,
                    args.columnFields,
                    args.dataFields,
                    args.filterFields
                  );
                  functionResult = `Added pivot table using data from range ${args.sourceDataRange} and placed at ${args.destinationCell}`;
                  break;
                case "manage_worksheet":
                  functionResult = await manageWorksheet(args.action, args.sheetName);
                  break;
                case "filter_data":
                  const filterResult = await filterDataOperation(
                    args.range,
                    args.column,
                    args.filterType as Filters,
                    args.criteria
                  );
                  functionResult = `Data filtered in range ${filterResult.range}. ${filterResult.filteredCount} rows match the criteria.`;
                  break;
                case "sort_data":
                  const sortResult = await sortDataOperation(
                    args.range,
                    args.sortFields,
                    args.matchCase,
                    args.hasHeaders
                  );
                  functionResult = sortResult;
                  break;
                case "merge_cells":
                  functionResult = await mergeCellsOperation(args.range, args.across);
                  break;
                case "unmerge_cells":
                  functionResult = await unmergeCellsOperation(args.range);
                  break;
                case "autofit_columns":
                  functionResult = await autofitColumnsOperation(args.range);
                  break;
                case "autofit_rows":
                  functionResult = await autofitRowsOperation(args.range);
                  break;
                case "apply_conditional_format":
                  functionResult = await applyConditionalFormat(args.range, args.formatType, args.rule, args.format);
                  break;
                case "clear_conditional_formats":
                  functionResult = await clearConditionalFormats(args.range);
                  break;
                case "get_worksheet_names":
                  const worksheetNames = await getWorksheetNames();
                  functionResult = `The worksheets in this workbook are: ${worksheetNames.join(", ")}`;
                  break;
                case "get_active_worksheet_name":
                  const activeWorksheetName = await getActiveWorksheetName();
                  functionResult = `The currently active worksheet is: ${activeWorksheetName}`;
                  break;
                default:
                  functionResult = "I'm not sure how to perform that action.";
              }
            } catch (error: unknown) {
              if (error instanceof Error) {
                functionResult = `Error: ${error.message}`;
              } else {
                functionResult = "An unknown error occurred.";
              }
            }

            return {
              tool_call_id: toolCall.id,
              role: "tool" as const,
              content: functionResult,
            };
          })
        );

        // Prepare the chat completion call payload with all tool results
        const completionPayload: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
          model: "gpt-4o-2024-08-06",
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant that interacts with Excel. You can access multiple worksheets in the workbook. The currently active worksheet is "${activeWorksheet}". Use the get_worksheet_names function to get a list of all available worksheets, and get_active_worksheet_name to check which worksheet is currently active. Follow the user's instructions to manipulate Excel spreadsheets, using the provided functions. You can create charts, pivot tables, filter data using a wide range of criteria, and perform various data operations. Ensure your responses are clear and formatted using markdown for better readability. You can use tables to present data when appropriate.`,
            },
            ...messages.map(
              (msg): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
                role: msg.isUser ? "user" : "assistant",
                content: msg.text,
              })
            ),
            { role: "user", content: text },
            completion.choices[0].message,
            ...toolResults,
          ],
          tools: tools,
          tool_choice: "auto",
        };

        // Call the OpenAI API again with all tool call results
        const finalResponse = await openaiRef.current?.chat.completions.create(completionPayload);

        // Use the final response to update the UI
        if (finalResponse?.choices[0]?.message?.content) {
          const aiResponse = finalResponse.choices[0].message.content;
          setMessages((prevMessages) => [...prevMessages, { text: aiResponse, isUser: false }]);
        }
      } else if (completion?.choices[0]?.message?.content) {
        const aiResponse = completion.choices[0].message.content;
        setMessages((prevMessages) => [...prevMessages, { text: aiResponse, isUser: false }]);
      }
    } catch (error: unknown) {
      console.error("Error calling OpenAI API:", error);
      let errorMessage = "Sorry, I encountered an error. Please try again.";

      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      } else if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as { response?: { status?: number } };
        if (apiError.response?.status === 401) {
          errorMessage = "Invalid API key. Please check your settings.";
        }
      }

      setMessages((prevMessages) => [...prevMessages, { text: errorMessage, isUser: false }]);
    } finally {
      setIsLoading(false); // Ensure loading is set to false after everything is done
    }
  };

  const [fadeIn, setFadeIn] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  React.useEffect(() => {
    const fetchWorksheetNames = async () => {
      try {
        const names = await getWorksheetNames();
        setWorksheetNames(names);
      } catch (error) {
        console.error("Error fetching worksheet names:", error);
      }
    };

    fetchWorksheetNames();
  }, []);

  React.useEffect(() => {
    const updateActiveWorksheet = async () => {
      try {
        const name = await getActiveWorksheetName();
        setActiveWorksheet(name);
      } catch (error) {
        console.error("Error fetching active worksheet name:", error);
      }
    };

    updateActiveWorksheet();

    // Set up an event listener for worksheet activation
    Office.context.document.addHandlerAsync(Office.EventType.ActiveViewChanged, updateActiveWorksheet);

    return () => {
      // Clean up the event listener
      Office.context.document.removeHandlerAsync(Office.EventType.ActiveViewChanged, updateActiveWorksheet);
    };
  }, []);

  const handleEmbedding = async (sheetName: string): Promise<number[]> => {
    try {
      const embeddingResult = await embedWorksheet(openai, sheetName);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Embedding for worksheet "${sheetName}" created successfully.`, isUser: false },
      ]);
      console.log("Embedding result:", embeddingResult);
      return embeddingResult;
    } catch (error) {
      console.error("Error creating embedding:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error creating embedding. Please try again.", isUser: false },
      ]);
      throw error;
    }
  };

  const handleEmbedAllWorksheets = async (): Promise<{ [key: string]: number[] }> => {
    try {
      const embeddingResults = await embedAllWorksheets(openai);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Embeddings for all worksheets created successfully.", isUser: false },
      ]);
      console.log("All worksheet embeddings:", embeddingResults);
      return embeddingResults;
    } catch (error) {
      console.error("Error creating embeddings for all worksheets:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error creating embeddings for all worksheets. Please try again.", isUser: false },
      ]);
      throw error;
    }
  };

  return (
    <div className={`${styles.chatInterface} ${fadeIn ? styles.fadeIn : ""}`}>
      <div className={styles.messageListContainer}>
        <MessageList messages={messages} worksheetNames={worksheetNames} />
      </div>
      <UserInput onSendMessage={handleSendMessage} worksheetNames={worksheetNames} />
    </div>
  );
};

export default ChatInterface;
