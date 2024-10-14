# Instruction Manual: Creating Sophisticated Function Calls with GPT-4 Models

Welcome! This step-by-step guide is designed to help you, even if you have never coded before, learn how to create sophisticated function calls using OpenAI's GPT-4 models. By the end of this manual, you'll be able to empower AI assistants with new capabilities and integrate advanced functions into your applications.

## Table of Contents

1. **Introduction**
2. **Prerequisites**
3. **Understanding Function Calling**
4. **Setting Up Your Environment**
5. **Defining a Function**
6. **Describing Your Function to the Model**
7. **Sending Messages and Function Definitions to the Model**
8. **Handling the Model's Response**
9. **Executing the Function and Returning Results**
10. **Advanced Topics**
    - Handling Edge Cases
    - Using Structured Outputs
    - Customizing Function Calling Behavior
11. **Tips and Best Practices**
12. **Additional Resources**

---

## 1. Introduction

Function calling allows you to connect GPT-4 models to external tools and systems. This enables AI assistants to perform tasks like fetching data, taking actions, performing computations, and more. By teaching the model about your functions, you can create deep integrations between your applications and the AI.

## 2. Prerequisites

Before you begin, you'll need:

- **An OpenAI Account**: Sign up at [OpenAI](https://openai.com/).
- **Basic Understanding of JavaScript**: We'll use JavaScript (Node.js) in examples.
- **Node.js Installed**: Download and install from [nodejs.org](https://nodejs.org/).
- **OpenAI SDK for Node.js**: Install by running `npm install openai`.

*Don't worry if you're new to coding—we'll explain each step in detail!*

## 3. Understanding Function Calling

Function calling is a way for the AI model to suggest calling functions in your code. The model doesn't execute the functions itself; instead, it provides parameters that you can use to run the functions in your application. This allows you to maintain control while leveraging the AI's capabilities.

## 4. Setting Up Your Environment

### Step 1: Install Node.js

If you haven't already, download and install Node.js from [nodejs.org](https://nodejs.org/).

### Step 2: Create a Project Folder

Create a new folder for your project:

```bash
mkdir ai-function-calling
cd ai-function-calling
```

### Step 3: Initialize Your Project

Initialize a new Node.js project:

```bash
npm init -y
```

### Step 4: Install OpenAI SDK

Install the OpenAI SDK:

```bash
npm install openai
```

## 5. Defining a Function

Think about a function you want the AI to be able to call. For this guide, we'll use an example function that gets the delivery date of an order.

### Example Function: `getDeliveryDate`

```javascript
// getDeliveryDate.js
async function getDeliveryDate(orderId) {
  // Simulate fetching delivery date from a database
  const deliveryDates = {
    'order_12345': '2023-12-01',
    'order_67890': '2023-12-05',
  };
  return deliveryDates[orderId] || 'Order not found';
}

module.exports = getDeliveryDate;
```

*This function accepts an `orderId` and returns the delivery date.*

## 6. Describing Your Function to the Model

You need to tell the AI model about your function so it knows how and when to use it.

### Create a Function Definition

The function definition describes:

- **Name**: What the function is called.
- **Description**: What the function does and when to use it.
- **Parameters**: What inputs the function accepts.

### Example Function Definition

```javascript
const functionDefinition = {
  name: 'get_delivery_date',
  description: 'Get the delivery date for a customer\'s order. Use this when a customer asks about their order delivery date.',
  parameters: {
    type: 'object',
    properties: {
      order_id: {
        type: 'string',
        description: 'The customer\'s order ID.',
      },
    },
    required: ['order_id'],
    additionalProperties: false,
  },
};
```

*This tells the AI what your function does and what input it needs.*

## 7. Sending Messages and Function Definitions to the Model

Now, you'll send a conversation (messages) and the function definitions to the AI model.

### Step 1: Import Required Modules

```javascript
const { OpenAIApi, Configuration } = require('openai');
const getDeliveryDate = require('./getDeliveryDate');

// Replace 'YOUR_API_KEY' with your actual OpenAI API key
const configuration = new Configuration({
  apiKey: 'YOUR_API_KEY',
});

const openai = new OpenAIApi(configuration);
```

### Step 2: Prepare Messages

Create an array of messages representing the conversation:

```javascript
const messages = [
  { role: 'system', content: 'You are a helpful customer support assistant.' },
  { role: 'user', content: 'Hi, can you tell me the delivery date for my order?' },
];
```

### Step 3: Provide Function Definitions

Create an array of available functions (tools):

```javascript
const tools = [
  {
    type: 'function',
    function: functionDefinition,
  },
];
```

### Step 4: Send Request to the Model

```javascript
(async () => {
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: messages,
    tools: tools,
  });

  // Handle the response (we'll cover this next)
})();
```

## 8. Handling the Model's Response

The model's response may or may not include a function call.

### Case 1: No Function Call

If the model doesn't call a function, it will reply directly to the user.

**Example Response:**

```json
{
  "role": "assistant",
  "content": "Sure! Can you please provide your order ID?"
}
```

**Action:** Send the assistant's message to the user and wait for their reply.

### Case 2: Model Calls a Function

If the model decides to call a function, it will provide the function name and arguments.

**Example Response:**

```json
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_1",
      "function": {
        "name": "get_delivery_date",
        "arguments": "{\"order_id\":\"order_12345\"}"
      },
      "type": "function"
    }
  ]
}
```

**Action:** Extract the function name and arguments to execute the function.

## 9. Executing the Function and Returning Results

### Step 1: Extract Function Call Information

```javascript
const toolCall = response.data.choices[0].message.tool_calls[0];
const functionName = toolCall.function.name;
const args = JSON.parse(toolCall.function.arguments);
```

### Step 2: Execute the Function

```javascript
let functionResult;

if (functionName === 'get_delivery_date') {
  functionResult = await getDeliveryDate(args.order_id);
}
```

### Step 3: Send Function Result Back to the Model

Add the function result to the conversation:

```javascript
messages.push(response.data.choices[0].message); // The assistant's function call
messages.push({
  role: 'tool',
  content: JSON.stringify({ order_id: args.order_id, delivery_date: functionResult }),
  tool_call_id: toolCall.id,
});
```

### Step 4: Get the Final Response from the Model

```javascript
const finalResponse = await openai.createChatCompletion({
  model: 'gpt-4',
  messages: messages,
});

console.log(finalResponse.data.choices[0].message.content);
```

**Example Output:**

```
The delivery date for your order order_12345 is 2023-12-01. Is there anything else I can assist you with?
```

*You can now present this message to the user!*

## 10. Advanced Topics

### Handling Edge Cases

In production, you need to handle situations where:

- The model's response is cut off due to token limits.
- The model refuses to comply due to safety reasons.
- The model outputs unexpected data.

**Example Edge Case Handling:**

```javascript
const finishReason = response.data.choices[0].finish_reason;

if (finishReason === 'length') {
  // Handle conversation too long
} else if (finishReason === 'content_filter') {
  // Handle content filtering
} else if (finishReason === 'tool_calls') {
  // Handle function call
} else if (finishReason === 'stop') {
  // Handle normal response
} else {
  // Handle unexpected cases
}
```

### Using Structured Outputs

Structured Outputs ensure that the arguments generated by the model exactly match your function's JSON Schema.

**Enabling Structured Outputs:**

Add `"strict": true` to your function definition.

```javascript
const functionDefinition = {
  // ... previous fields
  strict: true,
  // ... rest of the definition
};
```

### Customizing Function Calling Behavior

You can control how and when the model calls functions.

- **Force a Function Call:** Set `tool_choice: "required"` to make the model always call a function.
- **Specify a Function to Call:** Use `tool_choice` with the function's name.
- **Disable Function Calling:** Set `tool_choice: "none"`.

**Example:**

```javascript
const response = await openai.createChatCompletion({
  model: 'gpt-4',
  messages: messages,
  tools: tools,
  tool_choice: 'required',
});
```

## 11. Tips and Best Practices

- **Use Clear Names and Descriptions:** Make function and parameter names intuitive.
- **Provide Detailed Instructions:** Include guidance in your system message.
- **Limit the Number of Functions:** Use no more than 20 functions for better accuracy.
- **Use Enums for Fixed Values:** Specify allowed values for parameters.
- **Turn on Structured Outputs:** Enable `strict: true` for reliable outputs.
- **Validate Model Outputs:** Always check the model's output before using it.

## 12. Additional Resources

- **OpenAI Documentation:** [Function Calling Guide](https://platform.openai.com/docs/guides/gpt/function-calling)
- **OpenAI Cookbook Examples:**
  - [How to Call Functions with Chat Models](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_call_functions_with_chat_models.ipynb)
  - [Using Functions with a Knowledge Base](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_use_functions_with_a_knowledge_base.ipynb)
- **Node.js and JavaScript Tutorials:**
  - [JavaScript for Beginners](https://www.javascript.com/learn/javascript/strings)
  - [Node.js Official Documentation](https://nodejs.org/en/docs)

---

Congratulations! You've learned how to create sophisticated function calls with GPT-4 models. With this knowledge, you can build powerful AI assistants and integrate them into your applications, even without prior coding experience.

Feel free to explore the additional resources for more advanced use cases and examples. Happy coding!