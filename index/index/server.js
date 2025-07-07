const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/elearning")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Schemas
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const courseSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  image: String,
  duration: String,
  price: Number,
  instructor: String,
  totalStudents: Number,
  modules: [{
    title: String,
    lessons: [{
      title: String,
      type: String,
      content: String,
      completed: {
        type: Boolean,
        default: false
      }
    }]
  }]
});

const enrollmentSchema = new mongoose.Schema({
  courseId: String,
  studentName: String,
  email: String,
  phone: String,
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    default: 'pending'
  }
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Models
const User = mongoose.model("User", userSchema, "Login/Signup");
const Course = mongoose.model("Course", courseSchema);
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
const Contact = mongoose.model("Contact", contactSchema);

// Routes

// Get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Get single course
app.get("/api/courses/:id", async (req, res) => {
  try {
    console.log('Fetching course with ID:', req.params.id);
    const course = await Course.findOne({ id: req.params.id });
    
    if (!course) {
      console.log('Course not found:', req.params.id);
      return res.status(404).json({ 
        success: false,
        message: "Course not found" 
      });
    }
    
    console.log('Course found:', course);
    res.json({
      success: true,
      ...course.toObject()
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching course details" 
    });
  }
});

// Check enrollment status
app.get("/api/check-enrollment", async (req, res) => {
    try {
        const { email, courseId } = req.query;
        
        if (!email || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Email and courseId are required"
            });
        }

        const enrollment = await Enrollment.findOne({ email, courseId });
        
        res.json({
            success: true,
            enrolled: !!enrollment
        });
    } catch (error) {
        console.error('Error checking enrollment:', error);
        res.status(500).json({
            success: false,
            message: "Error checking enrollment status"
        });
    }
});

// Enroll in a course
app.post("/api/enroll", async (req, res) => {
    try {
        const { courseId, studentName, email, phone } = req.body;
        
        console.log('Received enrollment request:', { courseId, studentName, email, phone });

        // Input validation
        if (!courseId || !studentName || !email || !phone) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ email, courseId });
        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course"
            });
        }

        // Validate course exists
        const course = await Course.findOne({ id: courseId });
        if (!course) {
            console.log('Course not found:', courseId);
            return res.status(404).json({ 
                success: false,
                message: "Course not found" 
            });
        }

        // Create enrollment
        const enrollment = new Enrollment({
            courseId,
            studentName,
            email,
            phone,
            enrollmentDate: new Date(),
            paymentStatus: 'completed' // Free course
        });

        await enrollment.save();
        console.log('Enrollment saved successfully:', enrollment._id);

        // Update course total students
        await Course.findOneAndUpdate(
            { id: courseId },
            { $inc: { totalStudents: 1 } }
        );

        res.json({ 
            success: true,
            message: "✅ Successfully enrolled in the course!",
            enrollmentId: enrollment._id 
        });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ 
            success: false,
            message: "❌ Enrollment failed. Please try again." 
        });
    }
});

// Contact form
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.json({ message: "✅ Message submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Server error. Try again later." });
  }
});

// Authentication Routes
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Received signup request:', { name, email });

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        success: false, 
        message: "User already exists with this email" 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      createdAt: new Date()
    });

    await user.save();
    console.log('User created successfully:', { id: user._id, email: user.email });

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error during signup: " + error.message 
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received login request for:', email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    console.log('Login successful for user:', email);
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login: " + error.message
    });
  }
});

// Add a route to get all users (for testing purposes)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });
  }
});

// Add course content
app.post("/api/courses", async (req, res) => {
  try {
    const courseData = req.body;
    const course = new Course(courseData);
    await course.save();
    res.json({ 
      success: true, 
      message: "Course added successfully",
      courseId: course._id 
    });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error adding course" 
    });
  }
});

// Update lesson completion status
app.put("/api/courses/:courseId/modules/:moduleIndex/lessons/:lessonIndex", async (req, res) => {
  try {
    const { courseId, moduleIndex, lessonIndex } = req.params;
    const { completed } = req.body;
    
    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (!course.modules[moduleIndex] || !course.modules[moduleIndex].lessons[lessonIndex]) {
      return res.status(404).json({ success: false, message: "Module or lesson not found" });
    }

    course.modules[moduleIndex].lessons[lessonIndex].completed = completed;
    await course.save();

    res.json({ 
      success: true, 
      message: "Lesson status updated successfully" 
    });
  } catch (error) {
    console.error('Error updating lesson status:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating lesson status" 
    });
  }
});

// Get course progress
app.get("/api/courses/:courseId/progress", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { email } = req.query;

    const course = await Course.findOne({ id: courseId });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const totalLessons = course.modules.reduce((total, module) => 
      total + module.lessons.length, 0);
    
    const completedLessons = course.modules.reduce((total, module) => 
      total + module.lessons.filter(lesson => lesson.completed).length, 0);

    res.json({
      success: true,
      progress: {
        totalLessons,
        completedLessons,
        percentage: (completedLessons / totalLessons) * 100
      }
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching course progress" 
    });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
