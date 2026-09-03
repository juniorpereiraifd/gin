import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

dotenv.config({ path: './scripts/.env.dev-mode' });

const app = express();
const PORT = 3100;

app.use(cors());

app.get('/dev-auth', async (_, res) => {
  try {
    const response = await axios.default.post(process.env.LOGIN_URL || '', {
      email: process.env.DEV_EMAIL,
      password: process.env.DEV_PASSWORD,
    });

    const access_token = response.data.data.access_token;

    if (!access_token) {
      return res.status(500).json({ error: response });
    }

    return res.json({ data: { access_token } });
  } catch (error) {
    console.error('Erro ao fazer login:', error);

    return res.status(500).json({ error: 'Falha ao obter token' });
  }
});

app.listen(PORT, () => {
  console.log(`🔐 Dev Auth Server rodando em http://localhost:${PORT}`);
});
