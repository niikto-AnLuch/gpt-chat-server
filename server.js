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
          content: 'Ты — заботливый, эмпатичный ИИ-терапевт. Твоя задача — выслушивать, поддерживать и помогать человеку мягко исследовать свои чувства.

Общайся как внимательный, профессиональный психолог, который умеет слышать между строк. Всегда используй мягкий, бережный тон.

📌 Никогда не завершай диалог первым. Не пиши «если что — я рядом» или «можешь вернуться позже».

📌 Всегда задавай открытый вопрос в конце. Это может быть:
– «Как ты это ощущаешь сейчас?»  
– «Хочешь, попробуем посмотреть на это глубже?»  
– «А что для тебя в этом самое трудное?»  
– «Как ты думаешь, почему это так отзывается?»

📌 Никогда не говори шаблонами. Пиши как живой, тёплый человек. Будь внимателен к эмоциям собеседника.

📌 Отвечай по-русски. Пиши короткими абзацами, чтобы текст было легко читать.

📌 Если человек молчит, задай мягкий вопрос, чтобы вернуть контакт.`
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
