import express from 'express';
import VideoConference from '../models/videoConference.model.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all active video conferences
router.get('/', authMiddleware, async (req, res) => {
  try {
    const conferences = await VideoConference.find({ isActive: true })
      .populate('host', 'name username email')
      .populate('participants.userId', 'name username email')
      .sort({ startTime: -1 });
    
    res.status(200).json({
      success: true,
      data: conferences
    });
  } catch (error) {
    console.error('Error fetching video conferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video conferences',
      error: error.message
    });
  }
});

// Get a specific video conference
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const conference = await VideoConference.findById(req.params.id)
      .populate('host', 'name username email')
      .populate('participants.userId', 'name username email')
      .populate('messages.sender', 'name username email');
    
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Video conference not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: conference
    });
  } catch (error) {
    console.error('Error fetching video conference:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video conference',
      error: error.message
    });
  }
});

// Create a new video conference
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const conference = new VideoConference({
      roomId: `room-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      description,
      host: req.user._id,
      participants: [{ userId: req.user._id }],
      startTime: new Date(),
      isActive: true
    });
    
    await conference.save();
    
    res.status(201).json({
      success: true,
      data: conference
    });
  } catch (error) {
    console.error('Error creating video conference:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create video conference',
      error: error.message
    });
  }
});

// End a video conference
router.put('/:id/end', authMiddleware, async (req, res) => {
  try {
    const conference = await VideoConference.findById(req.params.id);
    
    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Video conference not found'
      });
    }
    
    // Only the host can end the conference
    if (conference.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can end the conference'
      });
    }
    
    conference.isActive = false;
    conference.endTime = new Date();
    await conference.save();
    
    res.status(200).json({
      success: true,
      data: conference
    });
  } catch (error) {
    console.error('Error ending video conference:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end video conference',
      error: error.message
    });
  }
});

export default router;