import {membershipModel} from '../models/membership.model.js';
import {Mistral} from '@mistralai/mistralai';
import {Pinecone} from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();
const mistralClient = new Mistral({apiKey : process.env.MISTRAL_API_KEY});
const pineconeClient = new Pinecone({apiKey : process.env.PINECONE_API_KEY});
async function callMistralWithRetry(fn, retries = 5, delay = 10000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn()
        } catch (err) {
            if (err.statusCode === 429 && i < retries - 1) {
                console.log(`Rate limited, retrying in ${delay/1000}s... (attempt ${i + 1})`)
                await new Promise(resolve => setTimeout(resolve, delay))
            } else {
                throw err
            }
        }
    }
}
export async function askProjectController(req, res){
    try{
    const workspace = req.params.workspaceId;
    const user = req.user.id;
    const {question} = req.body;
    const membershipCheck = await membershipModel.findOne({
        workspace : workspace,
        user : user
    })
    if(!membershipCheck){
        return res.status(403).json({
            message : "Forbidden Request"
        })
    }
    console.log("Embedding call shuru")
    const mistralResponse = await mistralClient.embeddings.create({
        model : 'mistral-embed',
        inputs : [question]
    })
    console.log("Embedding call successful")
    const vector = mistralResponse.data[0].embedding;
    const index = pineconeClient.index("synac-message");
    const searchResults = await index.query({
        vector : vector,
        topK : 5,
        includeMetadata : true,
        filter : {
            workspace : workspace
        }

}
    )
    const contextTexts = searchResults.matches.map(match => match.metadata.text);
    const context = contextTexts.join("\n");
    console.log("Chat call shuru")
     const chatResponse = await callMistralWithRetry(() =>
            mistralClient.chat.complete({
                model: 'mistral-small-latest',
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful assistant. Answer the user's question based on the provided context. If the context does not contain relevant information, respond with "I'm sorry, I don't have enough information to answer that question."
                        Context: ${context}`
                    },
                    { role: "user", content: question }
                ]
            })
        )

console.log("Chat call successful")
res.status(200).json({
    answer : chatResponse.choices[0].message.content
})
    }
catch(err){
    console.error("ASK_PROJECT_ERROR", err.message);
    res.status(500).json({
        message : "Something Went Wrong"
    })

}
}