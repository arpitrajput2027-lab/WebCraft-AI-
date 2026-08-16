const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions'
const model = 'deepseek/deepseek-chat'

export const generateResponse = async (prompt) => {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is not set. Add it to your backend .env')
    }

    const res = await fetch(openRouterUrl, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [
                {
                    role: 'system',
                    content: "You must return only valid raw JSON",
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.2,
        }),
    })

    if (!res.ok) {
        const errText = await res.text()
        throw new Error(`OpenRouter error (status ${res.status}): ${errText}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content
}