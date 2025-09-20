import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectionDb = await mongoose.connect(
  "mongodb+srv://vineshgoswami45_db_user:O4upcYOrnlXmNE78@cluster0.skq1hww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

// Sample user data
const users = [
  {
    name: 'Student User',
    email: 'student@vidyant.edu',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Educator User',
    email: 'educator@vidyant.edu',
    password: 'educator123',
    role: 'teacher'
  },
  {
    name: 'Admin User',
    email: 'admin@vidyant.edu',
    password: 'admin123',
    role: 'admin'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users with hashed passwords
    const createdUsers = [];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role
      });

      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
      console.log(`Created user: ${user.email}`);
    }

    console.log('Database seeded successfully!');
    return createdUsers;
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Seeding completed. Disconnecting...');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Seeding failed:', err);
    mongoose.disconnect();
    process.exit(1);
  });