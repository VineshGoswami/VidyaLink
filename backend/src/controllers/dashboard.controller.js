import User from "../models/user.model.js";
import Meeting from "../models/meeting.model.js";
import Recording from "../models/recording.model.js";
import httpStatus from "http-status";

// Get student dashboard data
export const getStudentDashboard = async (req, res) => {
    try {
        const { token } = req.query;
        
        // Find user by token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        // Get user's meetings/sessions
        const userId = user.username || user.email;
        const meetings = await Meeting.find({ user_id: userId }).sort({ createdAt: -1 }).limit(5);
        
        // Get recordings
        const recordings = await Recording.find().sort({ createdAt: -1 }).limit(5);
        
        // Format user data
        const userData = {
            name: user.name,
            role: user.role,
            id: user._id,
            email: user.email
        };
        
        // Return dashboard data
        return res.status(httpStatus.OK).json({
            success: true,
            data: {
                user: userData,
                upcomingSessions: meetings,
                recordedLectures: recordings
            }
        });
    } catch (err) {
        console.error("Error fetching student dashboard:", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching dashboard data"
        });
    }
};

// Get educator dashboard data
export const getEducatorDashboard = async (req, res) => {
    try {
        const { token } = req.query;
        
        // Find user by token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        // Get educator's sessions
        const userId = user.username || user.email;
        const sessions = await Meeting.find({ user_id: userId }).sort({ createdAt: -1 }).limit(5);
        
        // Format user data
        const userData = {
            name: user.name,
            role: user.role,
            id: user._id,
            email: user.email,
            specialization: "" // Add this field to user model if needed
        };
        
        // Return dashboard data
        return res.status(httpStatus.OK).json({
            success: true,
            data: {
                user: userData,
                sessions: sessions,
                upcomingSessions: sessions // Using same data for now
            }
        });
    } catch (err) {
        console.error("Error fetching educator dashboard:", err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching dashboard data"
        });
    }
};