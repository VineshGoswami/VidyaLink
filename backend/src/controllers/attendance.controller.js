// attendance.controller.js
import Attendance from '../models/attendance.model.js'; // adjust your model import

export const join = async (req, res) => {
  try {
    const { lectureId } = req.body;
    const userId = req.user.id;

    const existing = await Attendance.findOne({ lecture: lectureId, user: userId });
    if (existing) return res.status(400).json({ msg: 'Already joined' });

    const attendance = new Attendance({ lecture: lectureId, user: userId });
    await attendance.save();

    res.json({ msg: 'Joined successfully', attendance });
  } catch (err) {
    console.error('attendance join err', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const leave = async (req, res) => {
  try {
    const { lectureId } = req.body;
    const userId = req.user.id;

    await Attendance.findOneAndDelete({ lecture: lectureId, user: userId });

    res.json({ msg: 'Left lecture successfully' });
  } catch (err) {
    console.error('attendance leave err', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
