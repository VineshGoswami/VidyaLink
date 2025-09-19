import httpStatus from "http-status";
import User from "../models/user.model.js";

import bcrypt, { hash } from "bcrypt"

import crypto from "crypto"
import Meeting from "../models/meeting.model.js";
const login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing email or password" })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "User Not Found" })
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            // Update user role if provided
            if (role && ['student', 'teacher', 'admin'].includes(role)) {
                user.role = role;
            }
            
            user.token = token;
            await user.save();
            
            return res.status(httpStatus.OK).json({ 
                success: true,
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'student'
                }
            })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid email or password" })
        }

    } catch (e) {
        return res.status(500).json({ success: false, message: `Something went wrong ${e}` })
    }
}


const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            name: name,
            email: email,
            password: hashedPassword
        };

        // Add role if provided
        if (role && ['student', 'teacher', 'admin'].includes(role)) {
            userData.role = role;
        }

        const newUser = new User(userData);
        await newUser.save();

        // Generate token for auto-login
        let token = crypto.randomBytes(20).toString("hex");
        newUser.token = token;
        await newUser.save();

        res.status(httpStatus.CREATED).json({
            success: true,
            message: "User Registered",
            token: token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role || 'student'
            }
        });

    } catch (e) {
        res.status(500).json({ success: false, message: `Something went wrong ${e}` });
    }
}


const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "User not found" });
        }
        
        const userId = user.username || user.email;
        const meetings = await Meeting.find({ user_id: userId });
        res.status(httpStatus.OK).json({ success: true, data: meetings });
    } catch (e) {
        res.status(500).json({ success: false, message: `Something went wrong ${e}` });
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "User not found" });
        }

        const userId = user.username || user.email;
        const newMeeting = new Meeting({
            user_id: userId,
            meetingCode: meeting_code
        });

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ success: true, message: "Added code to history" });
    } catch (e) {
        res.status(500).json({ success: false, message: `Something went wrong ${e}` });
    }
}


export { login, register, getUserHistory, addToHistory }