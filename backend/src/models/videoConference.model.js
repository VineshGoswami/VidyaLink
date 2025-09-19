import mongoose from 'mongoose';

const VideoConferenceSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date }
  }],
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const VideoConference = mongoose.model('VideoConference', VideoConferenceSchema);

export default VideoConference;