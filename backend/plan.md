ChatRouter

websocket

- request

```
{
	"type": "chat_messages_request",
	"data": [
		{
			"user_id": "user1",
			"content": "Hello from user1"
		},
		{
			"user_id": "user1",
			"content": "How are you?"
		}
	]
}
```

- response

receive message id from server, the request messages will be inserted into the database.

- Ok response

```
{
	"type": "chat_messages_response",
	"status": 200,
    "message_ids": [1,2,3]
}
```

- Error response

```
{
	"type": "chat_messages_response",
	"status": 400,
	"error": "Bad Request"
}
```