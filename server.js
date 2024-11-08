const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Ensure userdata directory exists
const userdataDir = path.join(__dirname, 'userdata');
if (!fs.existsSync(userdataDir)){
    fs.mkdirSync(userdataDir);
}

// Serve static files from the 'userdata' directory
app.use('/userdata', express.static(userdataDir));

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, userdataDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'resume.html'));
});

app.post('/api/share-resume', upload.single('profilePicture'), (req, res) => {
    try {
        const { name, email, contactNo, address } = req.body;
        const education = JSON.parse(req.body.education);
        const experience = JSON.parse(req.body.experience);
        const skills = JSON.parse(req.body.skills);
        const profilePicture = req.file ? `/userdata/${req.file.filename}` : '';

        const uniqueId = generateUniqueId(name);
        const fileName = `${uniqueId}.html`;
        const filePath = path.join(userdataDir, fileName);

        const resumeContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${name}'s Resume</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                    h2 { color: #2980b9; }
                    .section { margin-bottom: 20px; }
                    .profilePicture { max-width: 150px; border-radius: 50%; float: right; }
                </style>
            </head>
            <body>
                <img src="${profilePicture}" alt="Profile Picture" class="profilePicture">
                <h1>${name}'s Resume</h1>
                <div class="section">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Contact:</strong> ${contactNo}</p>
                    <p><strong>Address:</strong> ${address}</p>
                </div>
                <div class="section">
                    <h2>Education</h2>
                    ${education.map(item => `<p>${item}</p>`).join('')}
                </div>
                <div class="section">
                    <h2>Experience</h2>
                    ${experience.map(item => `<p>${item}</p>`).join('')}
                </div>
                <div class="section">
                    <h2>Skills</h2>
                    ${skills.map(item => `<p>${item}</p>`).join('')}
                </div>
            </body>
            </html>
        `;

        fs.writeFile(filePath, resumeContent, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).json({ success: false, error: 'Error writing file' });
            } else {
                const shareableLink = `http://localhost:${port}/userdata/${fileName}`;
                res.json({ success: true, shareableLink });
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

function generateUniqueId(name) {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const timestamp = Date.now().toString(36);
    return `${cleanName}-${timestamp}`;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
