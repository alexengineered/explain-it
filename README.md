# ExplainIt — AI PDF Explainer for Engineers


A web-based PDF analysis tool that helps engineers and technical professionals understand complex documents using AI-powered explanations.

## Features

- **PDF Viewer** — Upload and view PDF documents directly in browser
- **Multi-Selection** — Highlight multiple text passages for explanation (with individual delete buttons)
- **AI Explanations** — Get clear explanations tailored to your expertise level
- **Expertise Slider** — Adjust explanations from Student to Professional level
- **Follow-up Chat** — Ask clarifying questions in a conversational interface
- **Export Conversations** — Save explanations as text files
- **BYOK Model** — Bring Your Own API Key for complete control over costs

## Who This Is For

ExplainIt is designed for engineers and technical professionals reading:
• design reports
• specifications
• standards
• research papers
• technical manuals

It is not intended for:
• scanned PDFs without selectable text
• general-purpose document summarization
• non-technical reading

## Supported AI Providers

| Provider | Best For |
|----------|----------|
| Claude | Technical docs, highest accuracy |
| OpenAI | Strong reasoning, versatile |
| Gemini | Balance of quality & speed |
| Qwen | Quality output, low cost |
| DeepSeek | Budget-friendly analysis |

## Getting Started

1. Visit [explainit.alex.com](https://explainit.alex.com)
2. Click **Settings** and select your AI provider
3. Paste your API key (stored locally in your browser)
4. Upload a PDF
5. Highlight confusing text
6. Adjust expertise level and click **Explain**

## How It Works

```
Your Browser → Cloudflare Worker (proxy) → AI Provider
```

Your API key is sent securely via HTTPS to the Cloudflare Worker, which forwards requests to your chosen AI provider. Keys are never exposed in browser network logs to third parties.

## Privacy & Security

- API keys stored in browser localStorage only
- Keys transmitted via encrypted HTTPS
- No server-side key storage
- No analytics or tracking
- 
## Tech Stack

- PDF.js for document rendering
- Cloudflare Pages for hosting
- Cloudflare Workers for secure API proxy
- Vanilla JavaScript (no frameworks)
- AI APIs: Claude, OpenAI, Gemini, Qwen, DeepSeek

## Deploy Your Own

### 1. Deploy the Worker (API Proxy)
1. Go to Cloudflare Dashboard → Workers & Pages → Create Worker
2. Paste contents of `explainit-worker.js`
3. Click Deploy → copy your Worker URL

### 2. Configure the App
1. Open `index.html`
2. Find `const WORKER_URL = 'https://explainit-proxy.xxx.workers.dev'`
3. Replace with your Worker URL

### 3. Host the App
Upload `index.html` and `logo.png` to any static host (Cloudflare Pages, GitHub Pages, Netlify, etc.)

## License

Free to use and adapt for personal, educational, or internal business use.  
Not permitted for resale or inclusion in paid products.

### Feedback

Found a bug or have a suggestion? Send feedback to contact@alexengineered.com

---

*Built for civil engineers who value their time.*
