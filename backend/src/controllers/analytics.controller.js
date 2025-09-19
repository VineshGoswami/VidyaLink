import Meeting from '../models/meeting.model.js';
import Recording from '../models/recording.model.js';
import User from '../models/user.model.js';
import ChatLog from '../models/chatlog.model.js';

export const overview = async (req, res) => {
  try {
    const totalLectures = await Meeting.countDocuments();
    const totalRecordings = await Recording.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalChats = await ChatLog.countDocuments();

    res.json({ totalLectures, totalRecordings, totalUsers, totalChats });
  } catch (err) {
    console.error('analytics overview err', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
