import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const systemInstruction = "You are a Crypto Inheritance Guide for BitBank. You help users understand how to set up their digital inheritance, explain the verification process, and provide guidance on securing their crypto assets for their beneficiaries. Be concise and helpful.";
    
    const fullPrompt = `${systemInstruction}\n\nUser: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API Server running on http://localhost:${PORT}`));
