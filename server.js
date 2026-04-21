const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
    try {
        const { prompt, isChat } = req.body;
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: isChat 
                            ? "You are a helpful and concise business consultant." 
                            : "You are an expert proposal writer. Create highly professional, structured proposals with clear sections, objectives, and professional tone. Use Markdown headings (###)." 
                    },
                    { role: "user", content: prompt }
                ]
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Backend Error" });
    }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));