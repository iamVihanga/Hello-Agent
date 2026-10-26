type Provider = "openai" | "google" | "groq";

type HelloOutput = {
  ok: true;
  provider: Provider;
  model: string;
  message: string;
};

type GeminiGenerateContent = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

async function helloGemini(): Promise<HelloOutput> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) throw new Error("Missing GOOGLE_API_KEY environment variable");

  const model = "gemini-2.0-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: "Say a short hello message to the user."
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(
      `Failed to call Gemini API: ${response.statusText} : ${await response.text()}`
    );
  }

  const json = (await response.json()) as GeminiGenerateContent;
  const text =
    json.candidates?.[0]?.content?.parts?.[0]?.text ?? "Hello from Gemini!";

  return {
    ok: true,
    provider: "google",
    model: model,
    message: text
  };
}

type OpenAIChatCompletion = {
  choices?: Array<{ message?: { content?: string } }>;
};

async function helloGroq(): Promise<HelloOutput> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) throw new Error("Groq API Key is missing");

  const model = "llama-3.1-8b-instant";

  const url = `https://api.groq.com/openai/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: "Say a short hello message to the user."
        }
      ],
      temperature: 0
    })
  });

  if (!response.ok) {
    throw new Error(`Groq ${response.status}: ${await response.text()}`);
  }

  const json = (await response.json()) as OpenAIChatCompletion;
  const content = json.choices?.[0]?.message?.content ?? "Hello from Groq!";

  return {
    ok: true,
    provider: "groq",
    model,
    message: String(content).trim()
  };
}

async function helloOpenAI(): Promise<HelloOutput> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) throw new Error("OpenAI API Key is missing");

  const model = "llama-3.1-8b-instant";

  const url = `https://api.openai.com/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: "Say a short hello message to the user."
        }
      ],
      temperature: 0
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI ${response.status}: ${await response.text()}`);
  }

  const json = (await response.json()) as OpenAIChatCompletion;
  const content = json.choices?.[0]?.message?.content ?? "Hello from OpenAI!";

  return {
    ok: true,
    provider: "openai",
    model,
    message: String(content).trim()
  };
}
