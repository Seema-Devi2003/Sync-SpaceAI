import { Mistral } from '@mistralai/mistralai'
import { Pinecone } from '@pinecone-database/pinecone'
import dotenv from 'dotenv'

dotenv.config()

const mistralClient = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
const pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY })

async function testEmbeddingFlow() {
    // Step 1 — Mistral se embedding banao
    const embeddingResponse = await mistralClient.embeddings.create({
        model: "mistral-embed",
        inputs: ["We'll use PostgreSQL instead of MongoDB for this feature"]
    })

    const vector = embeddingResponse.data[0].embedding
    console.log("Embedding banaya, length:", vector.length)

    // Step 2 — Pinecone mein store karo
    const index = pineconeClient.index("synac-message")

   await index.upsert({
    records: [
        {
            id: "test-message-1",
            values: vector,
            metadata: { text: "We'll use PostgreSQL instead of MongoDB for this feature" }
        }
    ]
})

    console.log("Pinecone mein store ho gaya!")
}

testEmbeddingFlow()
async function testSearch() {
    // Ek naya query banao, isse embedding mein convert karo
    const queryEmbedding = await mistralClient.embeddings.create({
        model: "mistral-embed",
        inputs: ["What database did we decide to use?"]
    })

    const queryVector = queryEmbedding.data[0].embedding

    // Pinecone mein sabse similar vectors dhoondo
    const index = pineconeClient.index("synac-message")

    const searchResults = await index.query({
        vector: queryVector,
        topK: 3,
        includeMetadata: true
    })

    console.log(JSON.stringify(searchResults, null, 2))
}

testSearch()