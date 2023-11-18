const OpenAI = require('openai');


async function main () {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const thread = await openai.beta.threads.create()
    console.log(thread)

    const question = 'Hello world?'

    try {
        const message = await openai.beta.threads.messages.create(thread.id, {
            role:'user',
            content:question
        }
        )
    
        console.log(message)

    } catch (error) {
        console.log(error)
    }



    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID,
    })
    console.log(run)

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)



    while (runStatus.status !== 'completed') {
        if (runStatus.status === 'failed') {
            console.log('Request failed')
            console.log(runStatus)
            return
        }
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
        console.log(runStatus)
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    messages = await openai.beta.threads.messages.list(thread.id)
    console.log(messages.data[0].content[0].text.value)

}

main()