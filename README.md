# 🏠 AI Rent & Flatmate Finder

An AI-powered full-stack web application that helps users find suitable rental properties and compatible flatmates based on their preferences and requirements.

## 🚀 Features

- User registration and login
- JWT-based authentication
- Tenant profile creation
- Property listing and management
- AI-powered tenant-listing compatibility scoring
- Personalized rental recommendations
- Real-time chat using Socket.IO
- Interest/request management
- Email notifications
- Owner and tenant dashboards
- Admin dashboard

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- Axios
- Tailwind CSS
- Redux

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Socket.IO
- Nodemailer

### Database
- MongoDB

### AI
- Google Gemini API

## 🤖 AI Integration

Google Gemini is integrated into the application to analyze tenant preferences and property information.

The system generates compatibility scores and personalized recommendations to help tenants find suitable rental properties and compatible flatmates.

## 📁 Project Structure

```text
rent-flatmate-finder/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── .gitignore
└── README.md
