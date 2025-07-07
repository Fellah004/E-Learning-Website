const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/elearning")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Course Schema (same as in server.js)
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

const Course = mongoose.model("Course", courseSchema);

// Initial course data
const coursesData = [
  {
    id: 'web-dev',
    title: 'Web Development for Beginners',
    description: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript',
    image: 'Images/web-dev.jpg',
    duration: '12 weeks',
    price: 0, // Free course
    instructor: 'John Smith',
    totalStudents: 1500,
    modules: [
      {
        title: 'Module 1: HTML Fundamentals',
        lessons: [
          {
            title: 'Introduction to HTML',
            type: 'video',
            content: 'https://www.youtube.com/embed/qz0aGYrrlhU',
            completed: false
          },
          {
            title: 'HTML Elements and Tags',
            type: 'video',
            content: 'https://www.youtube.com/embed/UB1O30fR-EE',
            completed: false
          },
          {
            title: 'HTML Forms and Input',
            type: 'video',
            content: 'https://www.youtube.com/embed/fNcJuPIZ2WE',
            completed: false
          }
        ]
      },
      {
        title: 'Module 2: CSS Styling',
        lessons: [
          {
            title: 'CSS Basics',
            type: 'video',
            content: 'https://www.youtube.com/embed/1PnVor36_40',
            completed: false
          },
          {
            title: 'CSS Layout and Flexbox',
            type: 'video',
            content: 'https://www.youtube.com/embed/JJSoEo8JSnc',
            completed: false
          },
          {
            title: 'Responsive Design',
            type: 'video',
            content: 'https://www.youtube.com/embed/srvUrASNj0s',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'app-dev',
    title: 'App Development with Flutter',
    description: 'Build cross-platform mobile apps with Flutter and Dart',
    image: 'Images/app-dev.jpg',
    duration: '10 weeks',
    price: 0,
    instructor: 'Sarah Johnson',
    totalStudents: 1200,
    modules: [
      {
        title: 'Module 1: Flutter Basics',
        lessons: [
          {
            title: 'Introduction to Flutter',
            type: 'video',
            content: 'https://www.youtube.com/embed/pTJJsmejUOQ',
            completed: false
          },
          {
            title: 'Dart Programming Language',
            type: 'video',
            content: 'https://www.youtube.com/embed/Ej_Pcr4uC2Q',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'data-science',
    title: 'Data Science for Beginners',
    description: 'Learn data analysis and machine learning with Python',
    image: 'Images/data-science.jpg',
    duration: '14 weeks',
    price: 0,
    instructor: 'Michael Chen',
    totalStudents: 900,
    modules: [
      {
        title: 'Module 1: Python Basics',
        lessons: [
          {
            title: 'Introduction to Python',
            type: 'video',
            content: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
            completed: false
          },
          {
            title: 'Data Types and Variables',
            type: 'video',
            content: 'https://www.youtube.com/embed/khKv-8q7YmY',
            completed: false
          }
        ]
      }
    ]
  }
];

// Function to populate the database
async function populateDatabase() {
  try {
    // Clear existing courses
    await Course.deleteMany({});
    console.log('✅ Cleared existing courses');

    // Insert new courses
    await Course.insertMany(coursesData);
    console.log('✅ Added new courses');

    console.log('✅ Database populated successfully!');
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the population script
populateDatabase(); 