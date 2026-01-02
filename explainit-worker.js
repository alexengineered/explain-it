export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        try {
            const { provider, apiKey, messages, systemPrompt } = await request.json();

            if (!provider || !apiKey || !messages) {
                return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                });
            }

            let response;

            switch (provider) {
                case 'openai':
                    response = await callOpenAI(apiKey, messages, systemPrompt);
                    break;
                case 'claude':
                    response = await callClaude(apiKey, messages, systemPrompt);
                    break;
                case 'gemini':
                    response = await callGemini(apiKey, messages, systemPrompt);
                    break;
                case 'qwen':
                    response = await callQwen(apiKey, messages, systemPrompt);
                    break;
                case 'deepseek':
                    response = await callDeepSeek(apiKey, messages, systemPrompt);
                    break;
                default:
                    return new Response(JSON.stringify({ error: 'Unknown provider' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    });
            }

            return new Response(JSON.stringify(response), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });

        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
        }
    },
};

// OpenAI
async function callOpenAI(apiKey, messages, systemPrompt) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenAI error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return { content: data.choices[0].message.content };
}

// Claude (Anthropic)
async function callClaude(apiKey, messages, systemPrompt) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            system: systemPrompt,
            messages: messages,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Claude error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return { content: data.content[0].text };
}

// Gemini (Google)
async function callGemini(apiKey, messages, systemPrompt) {
    // Convert messages to Gemini format
    const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: contents,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return { content: data.candidates[0].content.parts[0].text };
}

// Qwen (Alibaba - via DashScope)
async function callQwen(apiKey, messages, systemPrompt) {
    const res = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'qwen-max',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Qwen error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return { content: data.choices[0].message.content };
}

// DeepSeek
async function callDeepSeek(apiKey, messages, systemPrompt) {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`DeepSeek error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return { content: data.choices[0].message.content };
}