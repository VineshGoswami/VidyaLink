import axios from 'axios';
import ChatLog from '../models/chatlog.model.js';

export const ask = async (req, res) => {
  try {
    const { question, lang = 'en', lectureId } = req.body;
    if (!question) return res.status(400).json({ msg: 'Question required' });

    const resp = await axios.post(process.env.AI_CHATBOT_URL, { question, lang });
    const answer = resp.data.answer || resp.data;

    const log = new ChatLog({ lecture: lectureId, user: req.user.id, message: question, lang });
    await log.save();

    res.json({ answer });
  } catch (err) {
    console.error('chatbot ask err', err);
    res.status(500).json({ msg: 'Chatbot error' });
  }
};
