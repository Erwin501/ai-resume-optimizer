import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 从 Vercel 环境变量中读取
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({ message: "Missing resume text" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume optimizer. Help improve grammar, tone, and clarity.",
        },
        { role: "user", content: resumeText },
      ],
    });

    const optimizedText = completion.choices[0].message.content;

    res.status(200).json({ optimizedText });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
}
