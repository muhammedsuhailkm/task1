const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function sanitizeLLMContent(text) {
  return text
    .trim()

    .replace(/\n*references\s*:\s*[\s\S]*$/i, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/^\s*\d+\.\s+.*$/gm, "")
    .replace(/\[object Object\]/g, "")

    .replace(/\n{3,}/g, "\n\n");
}

exports.enhanceArticle = async ({ original, reference1, reference2 }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a professional content editor.

IMPORTANT:
- Return ONLY the final article content.
- Do NOT include explanations.
- Do NOT include placeholder text.
- Do NOT include "[object Object]".
- Include references ONLY if they are explicitly provided as URLs.

Original Article:
${original}

Reference Article 1 Content:
${reference1}

Reference Article 2 Content:
${reference2}

Rewrite the original article with:
- Improved structure
- Professional tone
- Clear headings

Do NOT add any references section yourself.
`;

  const result = await model.generateContent(prompt);
  const rawresponse = result.response.text();
  const response = sanitizeLLMContent(rawresponse);
  return response;
};
