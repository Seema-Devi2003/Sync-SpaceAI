 import http from 'http'
import dotenv from 'dotenv'
import { app } from './src/app.js'
import { Mistral } from '@mistralai/mistralai'
import { connectToDB } from './src/config/database.js'
import { messageModel } from './src/models/message.model.js'
import { detectedActionModel } from './src/models/detectedAction.model.js'
import { Pinecone } from '@pinecone-database/pinecone'
import { Server } from "socket.io"

dotenv.config()

connectToDB()

const aiClient = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
const pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

async function classifyMessage(messageText) {
    const response = await aiClient.chat.complete({
        model: "mistral-small-latest",
        response_format: { type: "json_object" },
        messages: [
            {
                role: "system",
                content: `You are a message classifier. Given a chat message, classify it as one of: "commitment", "decision", "blocker", or "normal".
                A commitment is when someone promises to do something.
                A decision is when someone decides on an approach or choice.
                A blocker is when someone is stuck or facing an obstacle.
                Respond ONLY with valid JSON in this exact format, nothing else:
                {"type": "commitment", "summary": "short summary here"}`
            },
            { role: "user", content: messageText }
        ]
    })

    return JSON.parse(response.choices[0].message.content)
}

async function storeMessageEmbedding(messageText, messageId, workspaceId) {
    const embeddingResponse = await aiClient.embeddings.create({
        model: "mistral-embed",
        inputs: [messageText]
    })
    const vector = embeddingResponse.data[0].embedding
    const index = pineconeClient.index("synac-message")
    await index.upsert({
        records: [
            {
                id: messageId,
                values: vector,
                metadata: {
                    text: messageText,
                    workspace: workspaceId
                }
            }
        ]
    })
}

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: true,
        credentials: true
    }
})

io.on("connection", (socket) => {
    console.log("A user is connected:", socket.id)

    socket.on("joinWorkspace", (workspaceId) => {
        socket.join(workspaceId)
        console.log(`user ${socket.id} joined workspace ${workspaceId}`)
    })

    socket.on("sendMessage", async (data) => {
        try {
            const saveMessage = await messageModel.create({
                workspace: data.workspaceId,
                sender: data.senderId,
                message: data.message
            })

            const populatedMessage = await saveMessage.populate("sender", "username")

            io.to(data.workspaceId).emit("newMessage", populatedMessage)

            const result = await classifyMessage(data.message)
            if (result.type !== "normal") {
                await detectedActionModel.create({
                    action: result.type,
                    summary: result.summary,
                    workspace: data.workspaceId,
                    message: saveMessage._id,
                    createdBy: data.senderId
                })
            }

            await storeMessageEmbedding(data.message, saveMessage._id.toString(), data.workspaceId)

        } catch (err) {
            console.error("SAVE_MESSAGE_ERROR", err.message)
            socket.emit("errorMessage", "failed to send message")
        }
    })

    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id)
    })
})

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000")
})