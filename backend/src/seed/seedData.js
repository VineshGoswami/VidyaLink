import mongoose from 'mongoose';
import User from '../models/user.model.js';
import Meeting from '../models/meeting.model.js';
import ChatLog from '../models/chatlog.model.js';
import VideoConference from '../models/videoConference.model.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://vineshgoswami45_db_user:O4upcYOrnlXmNE78@cluster0.skq1hww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Meeting.deleteMany({});
    await ChatLog.deleteMany({});
    await VideoConference.deleteMany({});
    console.log('Cleared existing data');
  } catch (error) {
    console.error('Error clearing data:', error);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const users = [
      {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student'
      },
      {
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'educator'
      },
      {
        name: 'Admin User',
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      }
    ];

    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Seed meetings
const seedMeetings = async (users) => {
  try {
    const meetings = [
      {
        title: 'Introduction to React',
        description: 'Learn the basics of React',
        host: users[1]._id, // Jane (educator)
        participants: [users[0]._id, users[1]._id], // John (student) and Jane (educator)
        startTime: new Date('2023-10-15T10:00:00Z'),
        endTime: new Date('2023-10-15T11:30:00Z')
      },
      {
        title: 'Advanced JavaScript Concepts',
        description: 'Deep dive into JavaScript',
        host: users[1]._id, // Jane (educator)
        participants: [users[0]._id, users[1]._id, users[2]._id], // All users
        startTime: new Date('2023-10-16T14:00:00Z'),
        endTime: new Date('2023-10-16T16:00:00Z')
      }
    ];

    const createdMeetings = await Meeting.create(meetings);
    console.log(`Created ${createdMeetings.length} meetings`);
    return createdMeetings;
  } catch (error) {
    console.error('Error seeding meetings:', error);
    process.exit(1);
  }
};

// Seed chat logs
const seedChatLogs = async (users, meetings) => {
  try {
    const chatLogs = [
      {
        lecture: meetings[0]._id,
        user: users[0]._id, // John (student)
        message: 'Can you explain props again?',
        createdAt: new Date('2023-10-15T10:15:00Z')
      },
      {
        lecture: meetings[0]._id,
        user: users[1]._id, // Jane (educator)
        message: 'Props are properties passed from parent to child components',
        createdAt: new Date('2023-10-15T10:16:00Z')
      },
      {
        lecture: meetings[1]._id,
        user: users[0]._id, // John (student)
        message: 'What is the difference between let and const?',
        createdAt: new Date('2023-10-16T14:30:00Z')
      },
      {
        lecture: meetings[1]._id,
        user: users[1]._id, // Jane (educator)
        message: 'let allows reassignment, const does not',
        createdAt: new Date('2023-10-16T14:31:00Z')
      }
    ];

    const createdChatLogs = await ChatLog.create(chatLogs);
    console.log(`Created ${createdChatLogs.length} chat logs`);
  } catch (error) {
    console.error('Error seeding chat logs:', error);
    process.exit(1);
  }
};

// Seed video conferences
const seedVideoConferences = async (users) => {
  try {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const videoConferences = [
      {
        roomId: 'room-123456',
        title: 'React Hooks Workshop',
        host: users[1]._id, // Jane (educator)
        participants: [
          { userId: users[1]._id, joinedAt: yesterday, leftAt: yesterday },
          { userId: users[0]._id, joinedAt: yesterday, leftAt: yesterday }
        ],
        messages: [
          {
            sender: users[0]._id,
            content: 'How do useEffect dependencies work?',
            timestamp: yesterday
          },
          {
            sender: users[1]._id,
            content: 'They determine when the effect should re-run',
            timestamp: yesterday
          }
        ],
        startTime: yesterday,
        endTime: yesterday,
        isActive: false
      },
      {
        roomId: 'room-789012',
        title: 'Ongoing Node.js Discussion',
        host: users[1]._id, // Jane (educator)
        participants: [
          { userId: users[1]._id, joinedAt: now }
        ],
        messages: [],
        startTime: now,
        isActive: true
      }
    ];

    const createdConferences = await VideoConference.create(videoConferences);
    console.log(`Created ${createdConferences.length} video conferences`);
  } catch (error) {
    console.error('Error seeding video conferences:', error);
    process.exit(1);
  }
};

// Run the seed process
const seedDatabase = async () => {
  try {
    await connectDB();
    await clearData();
    const users = await seedUsers();
    const meetings = await seedMeetings(users);
    await seedChatLogs(users, meetings);
    await seedVideoConferences(users);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Execute the seed function
seedDatabase();