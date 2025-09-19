import Leaderboard from '../models/leaderboard.model.js';

export const getTop = async (req, res) => {
  try {
    const top = await Leaderboard.find()
      .populate('user', 'name email')
      .sort({ points: -1 })
      .limit(50);

    res.json(top);
  } catch (err) {
    console.error('leaderboard err', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
