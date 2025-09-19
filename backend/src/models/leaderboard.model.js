import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  points: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);
export default Leaderboard;
