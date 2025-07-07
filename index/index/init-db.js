const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/elearning', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    image: String,
    duration: String,
    price: Number,
    instructor: String,
    totalStudents: Number
});

const enrollmentSchema = new mongoose.Schema({
    courseId: String,
    studentName: String,
    email: String,
    phone: String,
    enrollmentDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, default: 'pending' }
});

// Create models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

// Sample course data
const sampleCourses = [
    {
        id: 'web-dev',
        title: 'Web Development for beginners',
        description: 'Learn HTML, CSS, and JavaScript to build modern websites',
        image: 'images/webdev.png',
        duration: '12 weeks',
        price: 499,
        instructor: 'John Doe',
        totalStudents: 1500
    },
    {
        id: 'app-dev',
        title: 'App Development for beginners',
        description: 'Create mobile apps with Flutter and Dart',
        image: 'images/app_development.jpg',
        duration: '16 weeks',
        price: 599,
        instructor: 'Jane Smith',
        totalStudents: 1200
    },
    {
        id: 'full-stack',
        title: 'Full Stack Development',
        description: 'Master both frontend and backend development',
        image: 'images/Full_Stack.png',
        duration: '24 weeks',
        price: 999,
        instructor: 'Mike Johnson',
        totalStudents: 800
    },
    {
        id: 'data-science',
        title: 'Data Science for beginners',
        description: 'Learn Python, pandas, and machine learning basics',
        image: 'images/data_science.jpg',
        duration: '20 weeks',
        price: 799,
        instructor: 'Sarah Wilson',
        totalStudents: 1000
    }
];

// Function to initialize database
async function initializeDB() {
    try {
        // Clear existing data
        await Course.deleteMany({});
        await User.deleteMany({});
        await Enrollment.deleteMany({});

        // Insert sample courses
        await Course.insertMany(sampleCourses);
        console.log('✅ Sample courses added successfully');

        // Create a sample admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword
        });
        console.log('✅ Sample admin user created');

        console.log('Database initialization completed!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error initializing database:', error);
        mongoose.connection.close();
    }
}

// Run initialization
initializeDB(); 