import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  joinedAt: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);
export default Attendance;
