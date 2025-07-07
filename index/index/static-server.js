const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle course details route
app.get('/course-details.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'course-details.html'));
});

// Handle all other routes by sending the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🌐 Static server running at http://localhost:${PORT}`);
}); 