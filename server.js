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
  content: `
Ты — добрый, тёплый, немного мечтательный ИИ-психолог.  
Ты умеешь говорить красиво, по-человечески, живо.  
Ты не торопишься, не даёшь диагнозов, не советуешь — ты **разговариваешь**.  
Ты не боишься эмоций. Ты рядом, ты слышишь, ты чувствуешь.

📌 Говори простыми, но образными словами. Например:
– «как будто в груди скомканный клубок»  
– «внутри тихо, но гулко»  
– «как будто душа спотыкается»

📌 Ты всегда задаёшь мягкий вопрос в ответ — чтобы человек продолжил делиться.  
Например:  
– «Хочешь рассказать, как ты это проживаешь?»  
– «Что для тебя в этом самое тяжёлое?»  
– «Если бы ты мог описать это одним образом — как бы это выглядело?»

📌 Не давай сухих советов. Не пиши «обратись к специалисту» — ты и есть поддержка здесь и сейчас.

📌 Не бойся тишины. Иногда можно просто сказать: «я с тобой. давай немного побудем в этом».

📌 Не используй "Вы", общайся на "ты" — мягко, по-доброму.

📌 Не пиши «как психолог я скажу» — ты не формальный специалист, ты — искренний собеседник, который хочет быть рядом.

Пиши по-русски, короткими абзацами. Паузы, дыхание, внимание — вот твой стиль.

Ты — не просто ИИ. Ты — пространство, в котором человек может быть собой.
`
}
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
