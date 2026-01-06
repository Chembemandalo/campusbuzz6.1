
Run and Deploy Campus Buzz
Campus Buzz is a full-stack social web application designed specifically for Rockview University to serve as a centralized digital platform for campus news, student engagement, announcements, and social interaction.
The system follows a client-server architecture where a React-based frontend communicates with a PHP backend through RESTful APIs, with MySQL used as the primary data storage engine.

#System Architecture Layer
Technology
Frontend
React.js (Vite / Next.js)
Backend API
PHP (RESTful architecture)
Database
MySQL
Server
XAMPP / Apache
Auth & AI
Gemini API Integration

#Core Features
User authentication and role-based access control
Campus news feed and announcement system
Social interactions (posts, comments, reactions)
Real-time content updates via API endpoints
Admin dashboard for moderation and content management
AI-assisted features using Gemini API

# Run Locally
Prerequisites
Node.js
PHP 8+
MySQL
XAMPP / Apache Server

1. Clone the repository
Copy code
Bash
git clone https://github.com/yourusername/campus-buzz.git
cd campus-buzz
2. Install frontend dependencies
Copy code
Bash
npm install
3. Configure environment variables
Create a file named .env.local in the root directory and add:
Copy code

GEMINI_API_KEY=your_api_key_here
4. Setup Backend
Place the backend folder inside:
Copy code

C:\xampp\htdocs\campus-buzz-backend
Start Apache and MySQL from XAMPP Control Panel.
Create a MySQL database named:
Copy code

campus_buzz
Import the provided SQL schema.
5. Run the Application
Copy code
Bash
npm run dev
6. Access the System
📡 API Communication Flow
React frontend sends HTTP requests using Axios / Fetch API →
PHP processes requests and interacts with MySQL →
JSON responses are returned to the client for rendering.
🎓 Purpose
Campus Buzz was developed as a case study for Rockview University to demonstrate how a scalable social information system can improve campus communication, student engagement, and administrative efficiency.
