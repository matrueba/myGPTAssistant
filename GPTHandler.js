const OpenAI = require('openai');
import axios from 'axios';


export default class GPTHandler {
    constructor() {
        this.openai = axios.create({
            baseURL: 'https://api.openai.com/v1',
            headers: {
                'Authorization': 'Bearer '  + process.env.OPENAI_API_KEY,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v1'
            }
        });
        this.threadId = null
    }

    async initThread() {
        try {
            const response = await this.openai.post('/threads')
            this.threadId = response.data.id
        } catch (error) {
            console.log("Error creating thread")
            console.log(error)
        }
    }


    async getGPTResponse(question) {
        try {

            const setMessageResponse = await this.openai.post(`/threads/${this.threadId}/messages`, {
                role: 'user',
                content: question
                })

            const runResponse = await this.openai.post(`/threads/${this.threadId}/runs`, {
                assistant_id: 'asst_n4DAs9EcIKylP1Udq0sPRPXp'
                })
            const runId = runResponse.data.id

            let runStatusResponse = await this.openai.get(`/threads/${this.threadId}/runs/${runId}`)
            console.log("Runing request")

            while (runStatusResponse.data.status !== 'completed') {
            if (runStatusResponse.data.status === 'failed') {
                console.log('Request failed')
                console.log(runStatusResponse.data)
                return
            }
                runStatusResponse = await this.openai.get(`/threads/${this.threadId}/runs/${runId}`)
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
            console.log("Request completed")

            const getMessagesResponse = await this.openai.get(`/threads/${this.threadId}/messages`)
            const message = getMessagesResponse.data.data[0].content[0].text.value
            return message
        } catch (error) {
            console.log(error)
            return null
        }
    }
}
