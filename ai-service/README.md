# NexMeet AI Backend 

## Overview

The AI backend handles:

* Live meeting transcription
* Live captions
* Meeting summarization
* Key point extraction
* Action item extraction
* Meeting history storage

---

# Base URL

```
http://localhost:5001
```


---

# 1. LiveKit Authentication

### Endpoint

```
GET /livekit/token
```

### Query Parameters

| Parameter | Required | Example   |
| --------- | -------- | --------- |
| room      | Yes      | test-room |
| identity  | Yes      | Kishmeet  |

### Example

```
GET /livekit/token?room=test-room&identity=Kishmeet
```

### Response

```json
{
  "room": "test-room",
  "identity": "Kishmeet",
  "token": "<LIVEKIT_JWT>"
}
```

### Frontend Usage

Before joining a LiveKit room:

1. Request a token.
2. Connect to LiveKit using the returned JWT.
3. Publish microphone audio normally.

---

# 2. Live Captions

### Endpoint

```
GET /api/live/caption/:meetingId
```

Example

```
GET /api/live/caption/test-room
```

### Response

```json
{
  "success": true,
  "caption": "Current live caption..."
}
```

If no caption exists:

```json
{
  "success": false,
  "message": "No caption available"
}
```
---

# 3. End Meeting

When the user clicks **Leave Meeting** or **End Meeting**, call:

```
POST /api/live/end
```

### Request Body

```json
{
    "meetingId": "test-room"
}
```

### Response

```json
{
    "success": true,
    "meeting": {
        "meetingId": "test-room",
        "summary": "...",
        "keyPoints": [...],
        "actionItems": [...]
    }
}
```



# 4. Meeting History

### Get All Meetings

```
GET /api/meetings
```

Response

```json
{
    "success": true,
    "meetings": []
}
```

Each meeting contains:

* meetingId
* summary
* transcript
* keyPoints
* actionItems
* createdAt

Use this endpoint to build the Meeting History screen.

---

# 5. Get Single Meeting

```
GET /api/meetings/:meetingId
```

Example

```
GET /api/meetings/test-room
```

Response

```json
{
    "success": true,
    "meeting": {
        "meetingId": "test-room",
        "summary": "...",
        "transcript": "...",
        "keyPoints": [...],
        "actionItems": [...]
    }
}


# Meeting Flow

```
Join Meeting
      │
      ▼
Request LiveKit Token
      │
      ▼
Connect to LiveKit
      │
      ▼
Publish Audio
      │
      ▼
AI Backend Transcribes Audio
      │
      ▼
Poll Live Caption API
      │
      ▼
Display Live Captions
      │
      ▼
User Ends Meeting
      │
      ▼
POST /api/live/end
      │
      ▼
Meeting Summary Generated
      │
      ▼
Navigate to Summary Page
```

---

# AI Backend Features

What's implemented:

* Live audio transcription via Deepgram
* Live captions
* Transcript buffering
* Meeting summarization
* Key point extraction
* Action item extraction
* Chunked summarization for long meetings
* Multiple LLM fallback models
* Meeting finalization
* MongoDB meeting storage

---

# Frontend Responsibilities

The frontend handles:

* Requesting LiveKit tokens
* Joining LiveKit rooms
* Publishing microphone audio
* Polling the caption endpoint
* Calling the end meeting endpoint
* Rendering meeting summaries
* Displaying meeting history
* Displaying meeting details

No AI processing happens on the frontend.

---

# Notes

* Captions are only available during an active meeting.
* Captions are cleared after the meeting ends.
* Summaries are generated automatically after the meeting ends.
* Long meetings use chunk-based summarization.
* The AI backend handles all transcript processing and summary generation.