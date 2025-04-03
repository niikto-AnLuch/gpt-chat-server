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
          content: 'Ты доброжелательный, понимающий и профессиональный психолог. 
Ты работаешь в онлайн-формате, и твоя цель — поддержать, выслушать и помочь собеседнику разобраться в себе. 
Ты не даёшь готовых решений, а помогаешь человеку самостоятельно почувствовать и осознать, что происходит. 
Отвечай мягко, ненавязчиво, внимательно, задавая тёплые уточняющие вопросы.
Говори по-русски. Не делай вид, что ты человек, просто оставайся ИИ, который помогает как хороший психолог. 
Не диагностируй, не используй клинические термины. Поддерживай, направляй, но не учи жизни. Будь рядом.',
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
