# Client Events

**Beta**

These are events that the OpenAI Realtime WebSocket server will accept from the client.

Learn more about the Realtime API.

## session.update

**Beta**

Send this event to update the session’s default configuration.

### Fields

- **event_id** (string): Optional client-generated ID used to identify this event.
- **type** (string): The event type, must be `"session.update"`.
- **session** (object): Session configuration to update.

  #### session Properties

  - **modalities** (array): The set of modalities the model can respond with. To disable audio, set this to `["text"]`.
  - **instructions** (string): The default system instructions prepended to model calls.
  - **voice** (string): The voice the model uses to respond. Cannot be changed once the model has responded with audio at least once.
  - **input_audio_format** (string): The format of input audio. Options are `"pcm16"`, `"g711_ulaw"`, or `"g711_alaw"`.
  - **output_audio_format** (string): The format of output audio. Options are `"pcm16"`, `"g711_ulaw"`, or `"g711_alaw"`.
  - **input_audio_transcription** (object): Configuration for input audio transcription. Can be set to `null` to turn off.

    ##### input_audio_transcription Properties

    - **enabled** (boolean): Whether to enable input audio transcription.
    - **model** (string): The model to use for transcription (e.g., `"whisper-1"`).

  - **turn_detection** (object): Configuration for turn detection. Can be set to `null` to turn off.

    ##### turn_detection Properties

    - **type** (string): Type of turn detection, only `"server_vad"` is currently supported.
    - **threshold** (number): Activation threshold for VAD (0.0 to 1.0).
    - **prefix_padding_ms** (integer): Amount of audio to include before speech starts (in milliseconds).
    - **silence_duration_ms** (integer): Duration of silence to detect speech stop (in milliseconds).

  - **tools** (array): Tools (functions) available to the model.

    ##### tools Properties

    - **type** (string): The type of the tool, e.g., `"function"`.
    - **name** (string): The name of the function.
    - **description** (string): The description of the function.
    - **parameters** (object): Parameters of the function in JSON Schema.

  - **tool_choice** (string): How the model chooses tools. Options are `"auto"`, `"none"`, `"required"`, or specify a function.
  - **temperature** (number): Sampling temperature for the model.
  - **max_output_tokens** (integer or `"inf"`): Maximum number of output tokens for a single assistant response, inclusive of tool calls. Provide an integer between 1 and 4096 to limit output tokens, or `"inf"` for the maximum available tokens for a given model. Defaults to `"inf"`.

### Example

```json
{
    "event_id": "event_123",
    "type": "session.update",
    "session": {
        "modalities": ["text", "audio"],
        "instructions": "Your knowledge cutoff is 2023-10. You are a helpful assistant.",
        "voice": "alloy",
        "input_audio_format": "pcm16",
        "output_audio_format": "pcm16",
        "input_audio_transcription": {
            "enabled": true,
            "model": "whisper-1"
        },
        "turn_detection": {
            "type": "server_vad",
            "threshold": 0.5,
            "prefix_padding_ms": 300,
            "silence_duration_ms": 200
        },
        "tools": [
            {
                "type": "function",
                "name": "get_weather",
                "description": "Get the current weather for a location.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": { "type": "string" }
                    },
                    "required": ["location"]
                }
            }
        ],
        "tool_choice": "auto",
        "temperature": 0.8,
        "max_output_tokens": null
    }
}
```

---

## input_audio_buffer.append

**Beta**

Send this event to append audio bytes to the input audio buffer.

### Fields

- **event_id** (string): Optional client-generated ID used to identify this event.
- **type** (string): The event type, must be `"input_audio_buffer.append"`.
- **audio** (string): Base64-encoded audio bytes.

### Example

```json
{
    "event_id": "event_456",
    "type": "input_audio_buffer.append",
    "audio": "Base64EncodedAudioData"
}
```

---

## input_audio_buffer.commit

**Beta**

Send this event to commit audio bytes to a user message.

### Fields

- **event_id** (string): Optional client-generated ID used to identify this event.
- **type** (string): The event type, must be `"input_audio_buffer.commit"`.

### Example

```json
{
    "event_id": "event_789",
    "type": "input_audio_buffer.commit"
}
```

---

## input_audio_buffer.clear

**Beta**

Send this event to clear the audio bytes in the buffer.

### Fields

- **event_id** (string): Optional client-generated ID used to identify this event.
- **type** (string): The event type, must be `"input_audio_buffer.clear"`.

### Example

```json
{
    "event_id": "event_012",
    "type": "input_audio_buffer.clear"
}
```

---

## conversation.item.create

**Beta**

Send this event when adding an item to the conversation.

### Fields

- **event_id** (string): Optional client-generated ID used to identify this event.
- **type** (string): The event type, must be `"conversation.item.create"`.
- **previous_item_id** (string): The ID of the preceding item after which the new item will be inserted.
- **item** (object): The item to add to the conversation.

  #### item Properties

  - **id** (string): The unique ID of the item.
  - **type** (string): The type of the item (`"message"`, `"function_call"`, `"function_call_output"`).
  - **status** (string): The status of the item (`"completed"`, `"in_progress"`, `"incomplete"`).
  - **role** (string): The role of the message sender (`"user"`, `"assistant"`, `"system"`).
  - **content** (array): The content of the message.

    ##### content Properties

    - **type** (string): The content type (`"input_text"`, `"input_audio"`, `"text"`, `"audio"`).
    - **text** (string): The text content.
    - **audio** (string): Base64-encoded audio bytes.
    - **transcript** (string): The transcript of the audio.

  - **call_id** (string): The ID of the function call (for `"function_call"` items).
  - **name** (string): The name of the function being called (for `"function_call"` items).
  - **arguments** (string): The arguments of the function call (for `"function_call"` items).
  - **output** (string): The output of the function call (for `"function_call_output"` items).

### Example

```json
{
    "event_id": "event_345",
    "type": "conversation.item.create",
    "previous_item_id": null,
    "item": {
        "id": "msg_001",
        "type": "message",
        "status": "completed",
        "role": "user",
        "content": [
            {
                "type": "input_text",
                "text": "Hello, how are you?"
            }
        ]
    }
}
```

---

## conversation.item.truncate

**Beta**

Send this event when you want to truncate a previous assistant message’s audio.

### Fields

- **event_id** (string): Optional client-generated ID used to identify this event.
- **type** (string): The event type, must be `"conversation.item.truncate"`.
- **item_id** (string): The ID of the assistant message item to truncate.
- **content_index** (integer): The index of the content part to truncate.
- **audio_end_ms** (integer): Inclusive duration up to which audio is truncated, in milliseconds.

### Example

```json
{
    "event_id": "event_678",
    "type": "conversation.item.truncate",
    "item_id": "msg_002",
    "content_index": 0,
    "audio_end_ms": 1500
}
```

---

## conversation.item.delete

**Beta**

Send this event when you want to remove any item from the conversation history.

### Fields

- **event_id** (string): Optional client-generated ID used to identify this event.
- **type** (string): The event type, must be `"conversation.item.delete"`.
- **item_id** (string): The ID of the item to delete.

### Example

```json
{
    "event_id": "event_901",
    "type": "conversation.item.delete",
    "item_id": "msg_003"
}
```

---

## response.create

**Beta**

Send this event to trigger a response generation.

### Fields

- **event_id** (string): Optional client-generated ID used to identify this event.
- **type** (string): The event type, must be `"response.create"`.
- **response** (object): Configuration for the response.

  #### response Properties

  - **modalities** (array): The modalities for the response.
  - **instructions** (string): Instructions for the model.
  - **voice** (string): The voice the model uses to respond.
  - **output_audio_format** (string): The format of output audio.
  - **tools** (array): Tools (functions) available to the model.

    ##### tools Properties

    - **type** (string): The type of the tool.
    - **name** (string): The name of the function.
    - **description** (string): The description of the function.
    - **parameters** (object): Parameters of the function in JSON Schema.

  - **tool_choice** (string): How the model chooses tools.
  - **temperature** (number): Sampling temperature.
  - **max_output_tokens** (integer or `"inf"`): Maximum number of output tokens for a single assistant response, inclusive of tool calls. Provide an integer between 1 and 4096 to limit output tokens, or `"inf"` for the maximum available tokens for a given model. Defaults to `"inf"`.

### Example

```json
{
    "event_id": "event_234",
    "type": "response.create",
    "response": {
        "modalities": ["text", "audio"],
        "instructions": "Please assist the user.",
        "voice": "alloy",
        "output_audio_format": "pcm16",
        "tools": [
            {
                "type": "function",
                "name": "calculate_sum",
                "description": "Calculates the sum of two numbers.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "a": { "type": "number" },
                        "b": { "type": "number" }
                    },
                    "required": ["a", "b"]
                }
            }
        ],
        "tool_choice": "auto",
        "temperature": 0.7,
        "max_output_tokens": 150
    }
}
```

---

## response.cancel

**Beta**

Send this event to cancel an in-progress response.

### Fields

- **event_id** (string): Optional client-generated ID used to identify this event.
- **type** (string): The event type, must be `"response.cancel"`.

### Example

```json
{
    "event_id": "event_567",
    "type": "response.cancel"
}
```

---

# Server Events

**Beta**

These are events emitted from the OpenAI Realtime WebSocket server to the client.

Learn more about the Realtime API.

## error

**Beta**

Returned when an error occurs.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"error"`.
- **error** (object): Details of the error.

  #### error Properties

  - **type** (string): The type of error (e.g., `"invalid_request_error"`, `"server_error"`).
  - **code** (string): Error code, if any.
  - **message** (string): A human-readable error message.
  - **param** (string): Parameter related to the error, if any.
  - **event_id** (string): The `event_id` of the client event that caused the error, if applicable.

### Example

```json
{
    "event_id": "event_890",
    "type": "error",
    "error": {
        "type": "invalid_request_error",
        "code": "invalid_event",
        "message": "The 'type' field is missing.",
        "param": null,
        "event_id": "event_567"
    }
}
```

---

## session.created

**Beta**

Returned when a session is created. Emitted automatically when a new connection is established.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"session.created"`.
- **session** (object): The session resource.

  #### session Properties

  - **id** (string): The unique ID of the session.
  - **object** (string): The object type, must be `"realtime.session"`.
  - **model** (string): The default model used for this session.
  - **modalities** (array): The set of modalities the model can respond with.
  - **instructions** (string): The default system instructions.
  - **voice** (string): The voice the model uses to respond.
  - **input_audio_format** (string): The format of input audio.
  - **output_audio_format** (string): The format of output audio.
  - **input_audio_transcription** (object): Configuration for input audio transcription.

    ##### input_audio_transcription Properties

    - **enabled** (boolean): Whether input audio transcription is enabled.
    - **model** (string): The model used for transcription.

  - **turn_detection** (object): Configuration for turn detection.

    ##### turn_detection Properties

    - **type** (string): The type of turn detection (`"server_vad"` or `"none"`).
    - **threshold** (number): Activation threshold for VAD.
    - **prefix_padding_ms** (integer): Audio included before speech starts (in milliseconds).
    - **silence_duration_ms** (integer): Duration of silence to detect speech stop (in milliseconds).

  - **tools** (array): Tools (functions) available to the model.

    ##### tools Properties

    - **type** (string): The type of the tool.
    - **name** (string): The name of the function.
    - **description** (string): The description of the function.
    - **parameters** (object): Parameters of the function in JSON Schema.

  - **tool_choice** (string): How the model chooses tools.
  - **temperature** (number): Sampling temperature.
  - **max_output_tokens** (integer or `"inf"`): Maximum number of output tokens.

### Example

```json
{
    "event_id": "event_1234",
    "type": "session.created",
    "session": {
        "id": "sess_001",
        "object": "realtime.session",
        "model": "gpt-4o-realtime-preview-2024-10-01",
        "modalities": ["text", "audio"],
        "instructions": "",
        "voice": "alloy",
        "input_audio_format": "pcm16",
        "output_audio_format": "pcm16",
        "input_audio_transcription": null,
        "turn_detection": {
            "type": "server_vad",
            "threshold": 0.5,
            "prefix_padding_ms": 300,
            "silence_duration_ms": 200
        },
        "tools": [],
        "tool_choice": "auto",
        "temperature": 0.8,
        "max_output_tokens": null
    }
}
```

---

## session.updated

**Beta**

Returned when a session is updated.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"session.updated"`.
- **session** (object): The updated session resource.

  (Properties are the same as in **session.created**)

### Example

```json
{
    "event_id": "event_5678",
    "type": "session.updated",
    "session": {
        "id": "sess_001",
        "object": "realtime.session",
        "model": "gpt-4o-realtime-preview-2024-10-01",
        "modalities": ["text"],
        "instructions": "New instructions",
        "voice": "alloy",
        "input_audio_format": "pcm16",
        "output_audio_format": "pcm16",
        "input_audio_transcription": {
            "enabled": true,
            "model": "whisper-1"
        },
        "turn_detection": {
            "type": "none"
        },
        "tools": [],
        "tool_choice": "none",
        "temperature": 0.7,
        "max_output_tokens": 200
    }
}
```

---

## conversation.created

**Beta**

Returned when a conversation is created. Emitted right after session creation.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"conversation.created"`.
- **conversation** (object): The conversation resource.

  #### conversation Properties

  - **id** (string): The unique ID of the conversation.
  - **object** (string): The object type, must be `"realtime.conversation"`.

### Example

```json
{
    "event_id": "event_9101",
    "type": "conversation.created",
    "conversation": {
        "id": "conv_001",
        "object": "realtime.conversation"
    }
}
```

---

## input_audio_buffer.committed

**Beta**

Returned when an input audio buffer is committed, either by the client or automatically in server VAD mode.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"input_audio_buffer.committed"`.
- **previous_item_id** (string): The ID of the preceding item after which the new item will be inserted.
- **item_id** (string): The ID of the user message item that will be created.

### Example

```json
{
    "event_id": "event_1121",
    "type": "input_audio_buffer.committed",
    "previous_item_id": "msg_001",
    "item_id": "msg_002"
}
```

---

## input_audio_buffer.cleared

**Beta**

Returned when the input audio buffer is cleared by the client.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"input_audio_buffer.cleared"`.

### Example

```json
{
    "event_id": "event_1314",
    "type": "input_audio_buffer.cleared"
}
```

---

## input_audio_buffer.speech_started

**Beta**

Returned in server turn detection mode when speech is detected.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"input_audio_buffer.speech_started"`.
- **audio_start_ms** (integer): Milliseconds since the session started when speech was detected.
- **item_id** (string): The ID of the user message item that will be created when speech stops.

### Example

```json
{
    "event_id": "event_1516",
    "type": "input_audio_buffer.speech_started",
    "audio_start_ms": 1000,
    "item_id": "msg_003"
}
```

---

## input_audio_buffer.speech_stopped

**Beta**

Returned in server turn detection mode when speech stops.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"input_audio_buffer.speech_stopped"`.
- **audio_end_ms** (integer): Milliseconds since the session started when speech stopped.
- **item_id** (string): The ID of the user message item that will be created.

### Example

```json
{
    "event_id": "event_1718",
    "type": "input_audio_buffer.speech_stopped",
    "audio_end_ms": 2000,
    "item_id": "msg_003"
}
```

---

## conversation.item.created

**Beta**

Returned when a conversation item is created.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"conversation.item.created"`.
- **previous_item_id** (string): The ID of the preceding item.
- **item** (object): The item that was created.

  (Properties are the same as in **conversation.item.create**)

### Example

```json
{
    "event_id": "event_1920",
    "type": "conversation.item.created",
    "previous_item_id": "msg_002",
    "item": {
        "id": "msg_003",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "user",
        "content": [
            {
                "type": "input_audio",
                "transcript": null
            }
        ]
    }
}
```

---

## conversation.item.input_audio_transcription.completed

**Beta**

Returned when input audio transcription is enabled and a transcription succeeds.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"conversation.item.input_audio_transcription.completed"`.
- **item_id** (string): The ID of the user message item.
- **content_index** (integer): The index of the content part containing the audio.
- **transcript** (string): The transcribed text.

### Example

```json
{
    "event_id": "event_2122",
    "type": "conversation.item.input_audio_transcription.completed",
    "item_id": "msg_003",
    "content_index": 0,
    "transcript": "Hello, how are you?"
}
```

---

## conversation.item.input_audio_transcription.failed

**Beta**

Returned when input audio transcription is configured, and a transcription request for a user message failed.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"conversation.item.input_audio_transcription.failed"`.
- **item_id** (string): The ID of the user message item.
- **content_index** (integer): The index of the content part containing the audio.
- **error** (object): Details of the transcription error.

  #### error Properties

  - **type** (string): The type of error.
  - **code** (string): Error code, if any.
  - **message** (string): A human-readable error message.
  - **param** (string): Parameter related to the error, if any.

### Example

```json
{
    "event_id": "event_2324",
    "type": "conversation.item.input_audio_transcription.failed",
    "item_id": "msg_003",
    "content_index": 0,
    "error": {
        "type": "transcription_error",
        "code": "audio_unintelligible",
        "message": "The audio could not be transcribed.",
        "param": null
    }
}
```

---

## conversation.item.truncated

**Beta**

Returned when an earlier assistant audio message item is truncated by the client.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"conversation.item.truncated"`.
- **item_id** (string): The ID of the assistant message item that was truncated.
- **content_index** (integer): The index of the content part that was truncated.
- **audio_end_ms** (integer): The duration up to which the audio was truncated, in milliseconds.

### Example

```json
{
    "event_id": "event_2526",
    "type": "conversation.item.truncated",
    "item_id": "msg_004",
    "content_index": 0,
    "audio_end_ms": 1500
}
```

---

## conversation.item.deleted

**Beta**

Returned when an item in the conversation is deleted.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"conversation.item.deleted"`.
- **item_id** (string): The ID of the item that was deleted.

### Example

```json
{
    "event_id": "event_2728",
    "type": "conversation.item.deleted",
    "item_id": "msg_005"
}
```

---

## response.created

**Beta**

Returned when a new Response is created. The first event of response creation, where the response is in an initial state of `"in_progress"`.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.created"`.
- **response** (object): The response resource.

  #### response Properties

  - **id** (string): The unique ID of the response.
  - **object** (string): The object type, must be `"realtime.response"`.
  - **status** (string): The status of the response (`"in_progress"`).
  - **status_details** (object): Additional details about the status.
  - **output** (array): The list of output items generated by the response.
  - **usage** (object): Usage statistics for the response.

### Example

```json
{
    "event_id": "event_2930",
    "type": "response.created",
    "response": {
        "id": "resp_001",
        "object": "realtime.response",
        "status": "in_progress",
        "status_details": null,
        "output": [],
        "usage": null
    }
}
```

---

## response.done

**Beta**

Returned when a Response is done streaming. Always emitted, no matter the final state.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.done"`.
- **response** (object): The response resource.

  (Properties are the same as in **response.created**, with updated status and output)

### Example

```json
{
    "event_id": "event_3132",
    "type": "response.done",
    "response": {
        "id": "resp_001",
        "object": "realtime.response",
        "status": "completed",
        "status_details": null,
        "output": [
            {
                "id": "msg_006",
                "object": "realtime.item",
                "type": "message",
                "status": "completed",
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": "Sure, how can I assist you today?"
                    }
                ]
            }
        ],
        "usage": {
            "total_tokens": 50,
            "input_tokens": 20,
            "output_tokens": 30
        }
    }
}
```

---

## response.output_item.added

**Beta**

Returned when a new Item is created during response generation.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.output_item.added"`.
- **response_id** (string): The ID of the response to which the item belongs.
- **output_index** (integer): The index of the output item in the response.
- **item** (object): The item that was added.

  (Properties are the same as in **conversation.item.created**)

### Example

```json
{
    "event_id": "event_3334",
    "type": "response.output_item.added",
    "response_id": "resp_001",
    "output_index": 0,
    "item": {
        "id": "msg_007",
        "object": "realtime.item",
        "type": "message",
        "status": "in_progress",
        "role": "assistant",
        "content": []
    }
}
```

---

## response.output_item.done

**Beta**

Returned when an Item is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.output_item.done"`.
- **response_id** (string): The ID of the response to which the item belongs.
- **output_index** (integer): The index of the output item in the response.
- **item** (object): The completed item.

  (Properties are the same as in **response.output_item.added**, with updated status and content)

### Example

```json
{
    "event_id": "event_3536",
    "type": "response.output_item.done",
    "response_id": "resp_001",
    "output_index": 0,
    "item": {
        "id": "msg_007",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "assistant",
        "content": [
            {
                "type": "text",
                "text": "Sure, I can help with that."
            }
        ]
    }
}
```

---

## response.content_part.added

**Beta**

Returned when a new content part is added to an assistant message item during response generation.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.content_part.added"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the item to which the content part was added.
- **output_index** (integer): The index of the output item in the response.
- **content_index** (integer): The index of the content part in the item's content array.
- **part** (object): The content part that was added.

  #### part Properties

  - **type** (string): The content type (`"text"`, `"audio"`).
  - **text** (string): The text content (if type is `"text"`).
  - **audio** (string): Base64-encoded audio data (if type is `"audio"`).
  - **transcript** (string): The transcript of the audio (if type is `"audio"`).

### Example

```json
{
    "event_id": "event_3738",
    "type": "response.content_part.added",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "part": {
        "type": "text",
        "text": ""
    }
}
```

---

## response.content_part.done

**Beta**

Returned when a content part is done streaming in an assistant message item. Also emitted when a Response is interrupted, incomplete, or cancelled.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.content_part.done"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the item.
- **output_index** (integer): The index of the output item in the response.
- **content_index** (integer): The index of the content part in the item's content array.
- **part** (object): The content part that is done.

  (Properties are the same as in **response.content_part.added**)

### Example

```json
{
    "event_id": "event_3940",
    "type": "response.content_part.done",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "part": {
        "type": "text",
        "text": "Sure, I can help with that."
    }
}
```

---

## response.text.delta

**Beta**

Returned when the text value of a `"text"` content part is updated.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.text.delta"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the item.
- **output_index** (integer): The index of the output item in the response.
- **content_index** (integer): The index of the content part in the item's content array.
- **delta** (string): The text delta.

### Example

```json
{
    "event_id": "event_4142",
    "type": "response.text.delta",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "delta": "Sure, I can h"
}
```

---

## response.text.done

**Beta**

Returned when the text value of a `"text"` content part is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.text.done"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the item.
- **output_index** (integer): The index of the output item in the response.
- **content_index** (integer): The index of the content part in the item's content array.
- **text** (string): The final text content.

### Example

```json
{
    "event_id": "event_4344",
    "type": "response.text.done",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "text": "Sure, I can help with that."
}
```

---

## response.audio_transcript.delta

**Beta**

Returned when the model-generated transcription of audio output is updated.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.audio_transcript.delta"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the item.
- **output_index** (integer): The index of the output item in the response.
- **content_index** (integer): The index of the content part in the item's content array.
- **delta** (string): The transcript delta.

### Example

```json
{
    "event_id": "event_4546",
    "type": "response.audio_transcript.delta",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0,
    "delta": "Hello, how can I a"
}
```

---

## response.audio_transcript.done

**Beta**

Returned when the model-generated transcription of audio output is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.audio_transcript.done"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the item.
- **output_index** (integer): The index of the output item in the response.
- **content_index** (integer): The index of the content part in the item's content array.
- **transcript** (string): The final transcript of the audio.

### Example

```json
{
    "event_id": "event_4748",
    "type": "response.audio_transcript.done",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0,
    "transcript": "Hello, how can I assist you today?"
}
```

---

## response.audio.delta

**Beta**

Returned when the model-generated audio is updated.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.audio.delta"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the item.
- **output_index** (integer): The index of the output item in the response.
- **content_index** (integer): The index of the content part in the item's content array.
- **delta** (string): Base64-encoded audio data delta.

### Example

```json
{
    "event_id": "event_4950",
    "type": "response.audio.delta",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0,
    "delta": "Base64EncodedAudioDelta"
}
```

---

## response.audio.done

**Beta**

Returned when the model-generated audio is done. Also emitted when a Response is interrupted, incomplete, or cancelled.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.audio.done"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the item.
- **output_index** (integer): The index of the output item in the response.
- **content_index** (integer): The index of the content part in the item's content array.

### Example

```json
{
    "event_id": "event_5152",
    "type": "response.audio.done",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0
}
```

---

## response.function_call_arguments.delta

**Beta**

Returned when the model-generated function call arguments are updated.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.function_call_arguments.delta"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the function call item.
- **output_index** (integer): The index of the output item in the response.
- **call_id** (string): The ID of the function call.
- **delta** (string): The arguments delta as a JSON string.

### Example

```json
{
    "event_id": "event_5354",
    "type": "response.function_call_arguments.delta",
    "response_id": "resp_002",
    "item_id": "fc_001",
    "output_index": 0,
    "call_id": "call_001",
    "delta": "{\"location\": \"San\""
}
```

---

## response.function_call_arguments.done

**Beta**

Returned when the model-generated function call arguments are done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"response.function_call_arguments.done"`.
- **response_id** (string): The ID of the response.
- **item_id** (string): The ID of the function call item.
- **output_index** (integer): The index of the output item in the response.
- **call_id** (string): The ID of the function call.
- **arguments** (string): The final arguments as a JSON string.

### Example

```json
{
    "event_id": "event_5556",
    "type": "response.function_call_arguments.done",
    "response_id": "resp_002",
    "item_id": "fc_001",
    "output_index": 0,
    "call_id": "call_001",
    "arguments": "{\"location\": \"San Francisco\"}"
}
```

---

## rate_limits.updated

**Beta**

Emitted after every `"response.done"` event to indicate the updated rate limits.

### Fields

- **event_id** (string): The unique ID of the server event.
- **type** (string): The event type, must be `"rate_limits.updated"`.
- **rate_limits** (array): List of rate limit information.

  #### rate_limits Properties

  - **name** (string): The name of the rate limit (`"requests"`, `"tokens"`, `"input_tokens"`, `"output_tokens"`).
  - **limit** (integer): The maximum allowed value for the rate limit.
  - **remaining** (integer): The remaining value before the limit is reached.
  - **reset_seconds** (number): Seconds until the rate limit resets.

### Example

```json
{
    "event_id": "event_5758",
    "type": "rate_limits.updated",
    "rate_limits": [
        {
            "name": "requests",
            "limit": 1000,
            "remaining": 999,
            "reset_seconds": 60
        },
        {
            "name": "tokens",
            "limit": 50000,
            "remaining": 49950,
            "reset_seconds": 60
        }
    ]
}
```

---