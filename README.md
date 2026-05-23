# Memory Gallery Web App

Memory Gallery is a full-stack web application where users can upload and share memories/photos from trips, workshops, events, and activities.

## Technologies Used

### Frontend
- React.js
- Vite
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas

### AWS Services
- Amazon S3 (Frontend Hosting)
- AWS Elastic Beanstalk (Backend Deployment)
- MongoDB Atlas (Database)

---

## Features

- Upload images
- Add captions and activity/location details
- View memories in gallery/feed
- Responsive and clean UI
- REST APIs for upload and fetch

---

## Live Project

### Frontend
http://memory-gallery-frontend.s3-website-us-east-1.amazonaws.com/

### Backend
http://my-node-backend-env.eba-mg2ktcxe.us-east-1.elasticbeanstalk.com/

---

## Installation

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

---

## Deployment

### Frontend Deployment
- Built using:
```bash
npm run build
```
- Uploaded `dist` folder contents to AWS S3
- Enabled static website hosting

### Backend Deployment
- Deployed using AWS Elastic Beanstalk
- Added MongoDB URI in Elastic Beanstalk environment properties

---

## AWS Architecture

User → React Frontend (AWS S3) → Node.js Backend (Elastic Beanstalk) → MongoDB Atlas

---

