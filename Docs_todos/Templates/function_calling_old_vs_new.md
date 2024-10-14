# OpenAI Function Calling Comparison (Updated August 2024)

| Feature | Old (Pre-August 2024) | New (August 2024) |
|---------|------------------------|---------------------|
| **Terminology** | Functions | Tools (Functions are now referred to as tools) |
| **Structured Outputs** | Not available | Introduced. Set `strict: true` for exact JSON Schema matching |
| **Configuration** | Used `functions` and `function_call` parameters | Uses `tools` and `tool_choice` parameters |
| **Parallel Function Calling** | Not available for older models | Supported for models released on or after Nov 6, 2023 |
| **New Models** | Older versions of GPT-4 and GPT-3.5 | Added support for gpt-4o, gpt-4o-2024-08-06, gpt-4o-2024-05-13, gpt-4o-mini, gpt-4o-mini-2024-07-18 |
| **Customization Options** | Limited options for function calling behavior | Enhanced `tool_choice` parameter with more options (e.g., force specific function, always call a function, disable function calling) |
| **Best Practices** | Basic guidelines | More detailed tips, including guidance on naming, using enums, and setting up evals |
| **Fine-tuning** | Limited emphasis | Greater emphasis on fine-tuning for improved function calling accuracy |
| **Response Monitoring** | Checked for `function_call` | Now checks for `finish_reason: "tool_calls"` |
| **Schema Processing** | N/A | First request with a new schema incurs additional latency for preprocessing |
| **Function Limit** | Not specified | Recommended to use no more than 20 functions in a single tool call |
| **Error Handling** | Basic | More comprehensive, including handling of length errors and content filtering |
| **Zero Data Retention** | N/A | Schemas used with Structured Outputs are not eligible for zero data retention |
| **Providing Function Results** | Used `function_call` in message object | Uses `tool_calls` array in message object, with `tool_call_id` in result message |

## Side-by-Side Code Examples

### 1. Basic Function/Tool Definition

<table>
<tr>
<th>Old (Pre-August 2024)</th>
<th>New (August 2024)</th>
</tr>
<tr>
<td>

```javascript
const functions = [
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA",
        },
        unit: { type: "string", enum: ["celsius", "fahrenheit"] },
      },
      required: ["location"],
    },
  },
];

const response = await openai.createChatCompletion({
  model: "gpt-3.5-turbo-0613",
  messages: [{ role: "user", content: "What's the weather like in Boston?" }],
  functions: functions,
  function_call: "auto",
});
```

</td>
<td>

```javascript
const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
      strict: true,
    },
  },
];

const response = await openai.chat.completions.create({
  model: "gpt-4o-2024-08-06",
  messages: [{ role: "user", content: "What's the weather like in Boston?" }],
  tools: tools,
  tool_choice: "auto",
});
```

</td>
</tr>
</table>

### 2. Handling Function/Tool Calls

<table>
<tr>
<th>Old (Pre-August 2024)</th>
<th>New (August 2024)</th>
</tr>
<tr>
<td>

```javascript
if (response.choices[0].message.function_call) {
  const functionName = response.choices[0].message.function_call.name;
  const functionArgs = JSON.parse(response.choices[0].message.function_call.arguments);
  
  if (functionName === "get_weather") {
    const weatherData = await getWeather(functionArgs.location, functionArgs.unit);
    // Use weatherData...
  }
}
```

</td>
<td>

```javascript
if (response.choices[0].finish_reason === "tool_calls") {
  for (const toolCall of response.choices[0].message.tool_calls) {
    if (toolCall.function.name === "get_weather") {
      const args = JSON.parse(toolCall.function.arguments);
      const weatherData = await getWeather(args.location, args.unit);
      // Use weatherData...
    }
  }
}
```

</td>
</tr>
</table>

### 3. Parallel Function Calling (New Feature)

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4o-2024-08-06",
  messages: [{ role: "user", content: "Compare the weather in New York, London, and Tokyo." }],
  tools: weatherTools,
  tool_choice: "auto",
});

if (response.choices[0].finish_reason === "tool_calls") {
  const toolCalls = response.choices[0].message.tool_calls;
  const results = await Promise.all(toolCalls.map(async (call) => {
    const args = JSON.parse(call.function.arguments);
    return {
      id: call.id,
      result: await getWeather(args.location, args.unit)
    };
  }));
  
  // Use results...
}
```

### 4. Using Structured Outputs

```javascript
const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
      strict: true,  // Enable Structured Outputs
    },
  },
];

// The rest of the API call remains the same
```

### 5. Providing Function/Tool Call Results Back to the Model

<table>
<tr>
<th>Old (Pre-August 2024)</th>
<th>New (August 2024)</th>
</tr>
<tr>
<td>

```javascript
// Simulate the function call response
const response = {
    choices: [
        {
            message: {
                function_call: { name: "get_delivery_date" }
            }
        }
    ]
};

// Create a message containing the result of the function call
const function_call_result_message = {
    role: "function",
    name: "get_delivery_date",
    content: JSON.stringify({
        order_id: "order_12345",
        delivery_date: "2024-08-30 15:30:00"
    })
};

// Prepare the chat completion call payload
const completion_payload = {
    model: "gpt-3.5-turbo-0613",
    messages: [
        { role: "system", content: "You are a helpful customer support assistant. Use the supplied functions to assist the user." },
        { role: "user", content: "Hi, can you tell me the delivery date for my order?" },
        { role: "assistant", content: "Certainly! I'd be happy to help you with that. Could you please provide me with your order ID?" },
        { role: "user", content: "I think it is order_12345" },
        response.choices[0].message,
        function_call_result_message
    ]
};

// Call the OpenAI API's chat completions endpoint to send the function call result back to the model
const final_response = await openai.createChatCompletion(completion_payload);

console.log(final_response);
```

</td>
<td>

```javascript
// Simulate the order_id and delivery_date
const order_id = "order_12345";
const delivery_date = moment();

// Simulate the tool call response
const response = {
    choices: [
        {
            message: {
                tool_calls: [
                    { id: "tool_call_1" }
                ]
            }
        }
    ]
};

// Create a message containing the result of the function call
const function_call_result_message = {
    role: "tool",
    content: JSON.stringify({
        order_id: order_id,
        delivery_date: delivery_date.format('YYYY-MM-DD HH:mm:ss')
    }),
    tool_call_id: response.choices[0].message.tool_calls[0].id
};

// Prepare the chat completion call payload
const completion_payload = {
    model: "gpt-4o",
    messages: [
        { role: "system", content: "You are a helpful customer support assistant. Use the supplied tools to assist the user." },
        { role: "user", content: "Hi, can you tell me the delivery date for my order?" },
        { role: "assistant", content: "Hi there! I can help with that. Can you please provide your order ID?" },
        { role: "user", content: "i think it is order_12345" },
        response.choices[0].message,
        function_call_result_message
    ]
};

// Call the OpenAI API's chat completions endpoint to send the tool call result back to the model
const final_response = await openai.chat.completions.create({
    model: completion_payload.model,
    messages: completion_payload.messages
});

console.log(final_response);
```

</td>
</tr>
</table>

These side-by-side code examples illustrate the key differences and new features in the August 2024 update to OpenAI's function calling (now tools) API.