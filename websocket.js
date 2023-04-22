const websocket = require('ws')

const wss = new websocket.Server({ port: 3001 })

const connectedUsers = {}

wss.on('connection', (ws, req) => {
    const userId = req.url.split('?id=')[1]
    connectedUsers[userId] = ws
    console.log('user connected', userId)
    ws.on('close', () => {
        console.log('user disconnected', userId)
        delete connectedUsers[userId]
    })
    ws.on('message', (msg) => {
        const { authorId, recipients, message } = JSON.parse(msg)
        recipients.forEach((recipient) => {
            if (connectedUsers[recipient]) {
                connectedUsers[recipient].send(JSON.stringify({ authorId, message }))
            }
        })
        console.log('message received', authorId, recipients, message)
        connectedUsers[authorId].send(JSON.stringify({ authorId, message }))
    })
    ws.on('error', (err) => {
        console.log('error', err)
    })
})