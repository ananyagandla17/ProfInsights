// scripts/seedprofessors.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Professor = require('../models/Professor');

// ✅ Load environment variables
dotenv.config({ path: './config/config.env' });

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

// ✅ Sample seed data
const professors = [
  {
    name: 'Dr. Vivek Kumar Mishra',
    course: 'Computational Finance with Applications',
    code: 'CS3235',
    credits: 3,
    department: 'Finance',
    nextLecture: 'May 05, 2025 [05:35 PM]'
  },
  {
    name: 'Veeraiah Talagondapati',
    course: 'Computer Networks',
    code: 'CS2202',
    credits: 4,
    department: 'Computer Science',
    nextLecture: 'May 05, 2025 [03:35 PM]'
  },
  {
    name: 'Mr. Rahul Roy',
    course: 'Deep Neural Networks',
    code: 'CS3223',
    credits: 4,
    department: 'AI/ML',
    nextLecture: 'May 05, 2025 [01:35 PM]'
  },
  {
    name: 'Dr. Raghu Kishore Neelisetty',
    course: 'Information Security Risk Assessment and Assurance',
    code: 'CS4179',
    credits: 3,
    department: 'Cybersecurity',
    nextLecture: 'May 08, 2025 [11:35 AM]'
  },
  {
    name: 'Prof. Salome Benhur',
    course: 'Introduction to Professional Development',
    code: 'HS3201',
    credits: 2,
    department: 'Humanities',
    nextLecture: 'May 06, 2025 [10:35 AM]'
  },
  {
    name: 'Dr. Yajulu Medury, Dr. Shivdasini S Amin',
    course: 'Organizational Behaviour',
    code: 'HS3226',
    credits: 2,
    department: 'Humanities',
    nextLecture: 'May 08, 2025 [09:25 AM]'
  },
  {
    name: 'Mrs. Sowmini Devi Veeramachaneni, Mr. Murali Krishna Bukkasamudram, Ms. Nartkannai K',
    course: 'Programming Workshop',
    code: 'CS3204',
    credits: 1,
    department: 'Computer Science',
    nextLecture: 'May 05, 2025 [10:35 AM]'
  },
  {
    name: 'Dr. Vijay Rao Duddu',
    course: 'Software Engineering',
    code: 'CS3201',
    credits: 3,
    department: 'Computer Science',
    nextLecture: 'May 05, 2025 [02:35 PM]'
  }
];

// ✅ Insert data
const seedData = async () => {
  try {
    await connectDB();
    await Professor.deleteMany();
    await Professor.insertMany(professors);
    console.log('✅ Professors inserted!');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedData();
