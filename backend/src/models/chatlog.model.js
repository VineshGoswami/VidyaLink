import mongoose from 'mongoose';

const ChatLogSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  lang: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now }
});

const ChatLog = mongoose.model('ChatLog', ChatLogSchema);
export default ChatLog;
