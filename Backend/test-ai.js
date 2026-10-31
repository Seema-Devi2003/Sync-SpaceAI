import {Mistral} from '@mistralai/mistralai'
import dotenv from 'dotenv'
dotenv.config()
const client = new Mistral({
 apiKey:process.env.MISTRAL_API_KEY
})
async function detectMessageType(message){
    const response = await client.chat.complete({
        model : 'mistral-small-latest',
        response_format :{type : "json_object"},
        messages : [
                        {
                role: "system",
                content: `You are a message classifier. Given a chat message, classify it as one of: "commitment", "decision", "blocker", or "normal".
                A commitment is when someone promises to do something.
                A decision is when someone decides on an approach or choice.
                A blocker is when someone is stuck or facing an obstacle.
                Respond ONLY with valid JSON in this exact format, nothing else:
                {"type": "commitment", "summary": "short summary here"}`
            },

            {
            role : "user",
            content : message
            }
        ]
             

    })
    console.log(response.choices[0].message.content)
}

async function runTests() {
    await detectMessageType("I'll finish the login page by tomorrow")
    await detectMessageType("Let's use PostgreSQL instead of MongoDB for this feature")
    await detectMessageType("I'm stuck, the API keeps returning 500 error")
    await detectMessageType("Good morning everyone!")
}

runTests()