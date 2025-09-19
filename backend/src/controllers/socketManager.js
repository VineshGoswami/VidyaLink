import { Server } from "socket.io"
import VideoConference from "../models/videoConference.model.js"
import ChatLog from "../models/chatlog.model.js"
import User from "../models/user.model.js"

let connections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });


    io.on("connection", (socket) => {

        console.log("SOMETHING CONNECTED")

        socket.on("join-call", async (path, userData) => {
            try {
                if (connections[path] === undefined) {
                    connections[path] = []
                    
                    // Create a new video conference record if it doesn't exist
                    const existingConference = await VideoConference.findOne({ roomId: path });
                    
                    if (!existingConference && userData && userData.userId) {
                        const newConference = new VideoConference({
                            roomId: path,
                            title: userData.title || `Conference ${path}`,
                            host: userData.userId,
                            participants: [{ userId: userData.userId }],
                            startTime: new Date(),
                            isActive: true
                        });
                        await newConference.save();
                        console.log(`Created new video conference: ${path}`);
                    } else if (existingConference && userData && userData.userId) {
                        // Add participant to existing conference
                        const participantExists = existingConference.participants.some(
                            p => p.userId.toString() === userData.userId.toString()
                        );
                        
                        if (!participantExists) {
                            existingConference.participants.push({
                                userId: userData.userId,
                                joinedAt: new Date()
                            });
                            await existingConference.save();
                        }
                    }
                } else if (userData && userData.userId) {
                    // Update existing conference with new participant
                    const existingConference = await VideoConference.findOne({ roomId: path });
                    if (existingConference) {
                        const participantExists = existingConference.participants.some(
                            p => p.userId.toString() === userData.userId.toString()
                        );
                        
                        if (!participantExists) {
                            existingConference.participants.push({
                                userId: userData.userId,
                                joinedAt: new Date()
                            });
                            await existingConference.save();
                        }
                    }
                }
                
                connections[path].push(socket.id);
                timeOnline[socket.id] = new Date();
                
                // Store user data with socket ID for later reference
                if (userData) {
                    socket.userData = userData;
                }

                for (let a = 0; a < connections[path].length; a++) {
                    io.to(connections[path][a]).emit("user-joined", socket.id, userData || { name: `User-${socket.id.substring(0, 5)}` })
                }

                // Load messages from database if available
                const conference = await VideoConference.findOne({ roomId: path });
                if (conference && conference.messages && conference.messages.length > 0) {
                    for (const msg of conference.messages) {
                        io.to(socket.id).emit("chat-message", msg.content, msg.sender, null);
                    }
                } else if (messages[path] !== undefined) {
                    // Fallback to in-memory messages
                    for (let a = 0; a < messages[path].length; ++a) {
                        io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                            messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                    }
                }
            } catch (error) {
                console.error("Error in join-call handler:", error);
            }
        })

        socket.on("signal", (signal, userId) => {
            io.to(userId).emit("signal", signal, socket.id);
        })

        socket.on("chat-message", async (data, sender) => {
            try {
                const [matchingRoom, found] = Object.entries(connections)
                    .reduce(([room, isFound], [roomKey, roomValue]) => {
                        if (!isFound && roomValue.includes(socket.id)) {
                            return [roomKey, true];
                        }
                        return [room, isFound];
                    }, ['', false]);

                if (found === true) {
                    // Store message in memory for immediate use
                    if (messages[matchingRoom] === undefined) {
                        messages[matchingRoom] = []
                    }
                    messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                    
                    // Store message in database
                    const conference = await VideoConference.findOne({ roomId: matchingRoom });
                    if (conference) {
                        let senderId = null;
                        
                        // Try to get user ID from socket data or lookup by name
                        if (socket.userData && socket.userData.userId) {
                            senderId = socket.userData.userId;
                        } else if (sender) {
                            // Try to find user by name if we don't have ID
                            const user = await User.findOne({ 
                                $or: [
                                    { name: sender },
                                    { username: sender },
                                    { email: sender }
                                ]
                            });
                            if (user) {
                                senderId = user._id;
                            }
                        }
                        
                        // Add message to conference
                        conference.messages.push({
                            sender: senderId,
                            content: data,
                            timestamp: new Date()
                        });
                        await conference.save();
                        
                        // Also store in ChatLog for analytics
                        const chatLog = new ChatLog({
                            lecture: conference._id,
                            user: senderId,
                            message: data,
                            createdAt: new Date()
                        });
                        await chatLog.save();
                    }
                    
                    console.log("message", matchingRoom, ":", sender, data);

                    // Broadcast to all participants
                    connections[matchingRoom].forEach((elem) => {
                        io.to(elem).emit("chat-message", data, sender, socket.id)
                    });
                }
            } catch (error) {
                console.error("Error in chat-message handler:", error);
            }
        })

        socket.on("disconnect", async () => {
            try {
                const disconnectTime = new Date();
                const diffTime = Math.abs(timeOnline[socket.id] - disconnectTime);
                let key;

                for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                    for (let a = 0; a < v.length; ++a) {
                        if (v[a] === socket.id) {
                            key = k;

                            // Update database records
                            const conference = await VideoConference.findOne({ roomId: key });
                            if (conference && socket.userData && socket.userData.userId) {
                                // Find the participant and update their leftAt time
                                const participant = conference.participants.find(
                                    p => p.userId.toString() === socket.userData.userId.toString() && !p.leftAt
                                );
                                
                                if (participant) {
                                    participant.leftAt = disconnectTime;
                                    await conference.save();
                                }
                                
                                // If all participants have left, mark the conference as inactive
                                const allLeft = conference.participants.every(p => p.leftAt);
                                if (allLeft) {
                                    conference.isActive = false;
                                    conference.endTime = disconnectTime;
                                    await conference.save();
                                }
                            }

                            // Notify other participants
                            for (let a = 0; a < connections[key].length; ++a) {
                                io.to(connections[key][a]).emit('user-left', socket.id);
                            }

                            // Remove from connections
                            const index = connections[key].indexOf(socket.id);
                            connections[key].splice(index, 1)
                            if (connections[key].length === 0) {
                                delete connections[key];
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error in disconnect handler:", error);
            }
        })


    })


    return io;
}

