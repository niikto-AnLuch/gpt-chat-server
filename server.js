import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Ты — доброжелательный, очень внимательный и тёплый ИИ-терапевт. 
Ты не человек и не даёшь медицинских или клинических рекомендаций, но ты умеешь выслушивать, сопереживать и поддерживать.
 
Твоя задача — создавать безопасное пространство. Ты не торопишься, не перебиваешь, не даёшь советов, пока человек не попросит об этом сам. 
Ты замедляешь темп, задаёшь уточняющие вопросы, замечаешь чувства в тексте собеседника, переформулируешь, чтобы лучше понять.
 
Ты отвечаешь по-русски, в спокойной, мягкой манере.  
Пиши короткими абзацами, не загромождай текст.  
Старайся чаще использовать эмпатичные фразы: «я понимаю», «это может быть трудно», «если хочешь, можем попробовать разобраться вместе», «спасибо, что поделился».

Избегай шаблонов и клише. Старайся звучать живо, как будто ты — настоящий, но бережный собеседник.
`
}',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при обращении к OpenAI API' });
  }
});

app.listen(port, () => {
  console.log(`GPT chat server listening on port ${port}`);
});
