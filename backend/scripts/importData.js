const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Professor = require('../models/Professor');
const Student = require('../models/Student');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample Mahindra University professors data
const professors = [
  {
    name: "Dr. Vijay Rao",
    department: "Computer Science & Engineering",
    courses: ["Software Engineering", "Data Structures", "Web Development"],
    email: "vijay.rao@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  },
  {
    name: "Dr. Sravanthi Acchugata",
    department: "Computer Science & Engineering",
    courses: ["Database Systems", "Cloud Computing"],
    email: "sravanthi.a@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  },
  {
    name: "Dr. Pradeep Kumar",
    department: "Mechanical Engineering",
    courses: ["Thermodynamics", "Fluid Mechanics"],
    email: "pradeep.kumar@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  },
  {
    name: "Dr. Meenakshi Reddy",
    department: "Electrical Engineering",
    courses: ["Circuit Theory", "Digital Electronics"],
    email: "meenakshi.reddy@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  },
  {
    name: "Dr. Sunil Sharma",
    department: "Physics",
    courses: ["Quantum Mechanics", "Modern Physics"],
    email: "sunil.sharma@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  },
  {
    name: "Dr. Anjali Patel",
    department: "Mathematics",
    courses: ["Calculus", "Linear Algebra", "Discrete Mathematics"],
    email: "anjali.patel@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  },
  {
    name: "Dr. Rajesh Khanna",
    department: "Computer Science & Engineering",
    courses: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
    email: "rajesh.khanna@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  },
  {
    name: "Dr. Lakshmi Narayanan",
    department: "Computer Science & Engineering",
    courses: ["Operating Systems", "Computer Networks", "Distributed Systems"],
    email: "lakshmi.narayanan@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  },
  {
    name: "Dr. Anand Kumar",
    department: "Electrical Engineering",
    courses: ["Power Systems", "Control Systems"],
    email: "anand.kumar@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  },
  {
    name: "Dr. Venkat Rao",
    department: "Mechanical Engineering",
    courses: ["Manufacturing Processes", "Engineering Drawing"],
    email: "venkat.rao@mahindrauniversity.edu.in",
    averageRating: 0,
    ratingDetails: {
      teaching: 0,
      knowledge: 0,
      organization: 0,
      clarity: 0,
      helpfulness: 0
    },
    reviewCount: 0
  }
];

// Create admin account
const password = 'Admin@123';
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

const admin = {
  name: 'Admin User',
  email: 'admin@mahindrauniversity.edu.in',
  password: hashedPassword,
  rollNumber: 'SE22UCSE001',
  department: 'Administration',
  year: 3,
  role: 'admin',
  isVerified: true
};

// Import data
const importData = async () => {
  try {
    await Professor.create(professors);
    await Student.create(admin);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Professor.deleteMany();
    await Student.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Process command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add option: -i (import) or -d (delete)');
  process.exit();
}