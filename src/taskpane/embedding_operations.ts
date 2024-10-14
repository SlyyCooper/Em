import OpenAI from "openai";
import { getCurrentSheetContent, getWorksheetNames } from "./excelOperations";

// Add this function at the beginning of the file
export function initializeOpenAI(apiKey: string) {
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

// Update the getEmbedding function to accept an OpenAI instance
async function getEmbedding(openai: OpenAI, text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
      encoding_format: "float",
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error getting embedding:", error);
    throw error;
  }
}

// Update the embedWorksheet and embedAllWorksheets functions to accept an OpenAI instance
export async function embedWorksheet(openai: OpenAI, sheetName: string): Promise<number[]> {
  try {
    const sheetContent = await getCurrentSheetContent({ includeMetadata: true, sheetName });
    const embedding = await getEmbedding(openai, sheetContent);
    return embedding;
  } catch (error) {
    console.error("Error embedding worksheet:", error);
    throw error;
  }
}

export async function embedAllWorksheets(openai: OpenAI): Promise<{ [key: string]: number[] }> {
  const worksheetNames = await getWorksheetNames();
  const embeddings: { [key: string]: number[] } = {};

  for (const name of worksheetNames) {
    try {
      const sheetContent = await getCurrentSheetContent({ includeMetadata: true, sheetName: name });
      const embedding = await getEmbedding(openai, sheetContent);
      embeddings[name] = embedding;
    } catch (error) {
      console.error(`Error embedding worksheet ${name}:`, error);
      // You might want to handle this error differently, depending on your requirements
    }
  }

  return embeddings;
}
