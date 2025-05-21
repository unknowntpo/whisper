# Whisper Chat

A chat application built with React and TypeScript.

## Design

This is a real time chatroom which can allow multiple anonymous user to chat in a single room, currently, all anonymous user will be assigned with a random uuid as user id, and shared a single room.

Frontend is built from vite, react, tailwindcss, websocket and backend is built from FastAPI, PostgreSQL.

Now, frontend has some template code as starter kit, please create a page called `WhisperChat` and add a sidebar link to it.


You need to implement test with vitest, and mock the bakcend server and user for testing.

for mocking websocket, use https://www.npmjs.com/package/jest-websocket-mock

### Frontend Workflow:

When user open the `WhisperChat` page, they will see a chatroom interface with a sidebar.

The chatroom is a single page application, which means you need to handle the chatroom page load and update when user send message or receive message.

When the page is loaded, it will connect to the websocket server and start to receive message.

WebSocket server url:
```
/v1/chat/ws
```

And also retrieve the message history from the backend.

```
/v1/chat/messages
```

When user send message, the message will be sent to the websocket server, and message will be saved in the database, and this message will be gotton from websocket when backend saved this message.

```
{
    "type": "messages",
	"data": [
		{
			"user_id": "example-uuid",	
			"content": "Hello, world!"
		},
		{
			"user_id": "example-uuid2",
			"content": "Hello from user2"
		}
	]
}
```

When send success, the backend will return the message ULID, and client can use this ULID to display the `sent` status of the message in the chatroom, just beside each message.

TODO: Resend message when send failed.

When user receive message, the message will be displayed in the chatroom.

```	
{
    "type": "messages",
    "data": [
        {
            "user_id": "example-uuid",
            "content": "Hello, world from user1"
        }
    ]
}
```

When other user send message, the message will be sent by the websocket server and displayed in the chatroom.

```
{
    "type": "messages",
    "data": [
        {
            "user_id": "example-uuid2",
            "content": "Hello from user2"
        }
    ]
}
```

### Backend Workflow:

Client can retrieve the message history from the backend.

```
/v1/chat/messages
```

Request data:

No request data.

Response data:

```
{
	"type": "messages",
	"data": [
		{
			"id": "example-message-ulid",
			"user_id": "example-uuid",
			"content": "Hello, world from user1"
		},
		{
			"id": "example-message-ulid2",
			"user_id": "example-uuid2",
			"content": "Hello from user2"
		}
	]
}
```

Response data:

```
{
	"type": "message_ids",
	"status": "success",
	"message_ids": [
		"example-message-ulid",
		"example-message-ulid2"
	]
}
```

When backend receive message, it will save the message in the database and send the message to all clients through websocket.

```
{
	"type": "messages",
	"data": [
		{
			"user_id": "example-uuid",
			"content": "Hello, world!"
		},
		{
			"user_id": "example-uuid2",
			"content": "Hello from user2"
		}
	]
}
