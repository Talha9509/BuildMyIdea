import { openai } from "../utils/aiClient.js";
import { Request, Response } from 'express'

export const ai = async (req: Request, res: Response) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        { role: "system", content: "You are a helpful assistant for software developers." },
        { role: "user", content: "Say hello and give me a 1-sentence motivational quote for coding." }
      ],
      max_tokens: 5, 
    });

    // @ts-ignore
    const aiMessage = response.choices[0].message.content;

    res.json({ success: true, message: aiMessage });

  } catch (error: any) {
    console.error("AI API Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}