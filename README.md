# QuickBite

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite) ![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js) ![Express](https://img.shields.io/badge/Express.js-5.x-000000?logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb) ![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

**Live Demo:** https://quickbite-webapp.onrender.com

QuickBite is a modern full-stack food ordering platform built with the MERN stack that delivers a seamless online food ordering experience. The application enables users to browse restaurants, explore menus, add items to their cart, securely place orders, and manage their profile through an elegant and responsive interface.

Designed with a production-ready architecture, QuickBite combines a React frontend with an Express and MongoDB backend to provide a fast, scalable, and user-friendly experience. The project demonstrates industry-standard full-stack development practices including authentication, secure REST APIs, cloud image management, responsive UI design, and efficient state management.

---

## ✨ Features

- Beautiful modern landing page
- Secure user authentication and authorization
- Browse restaurants and food items
- Smart search and category filtering
- Restaurant and food details pages
- Shopping cart management
- Online food ordering
- Secure checkout flow
- User profile management
- Order history and tracking
- Admin dashboard for user,restaurant own and delivery boy
- Responsive UI for all devices
- Cloudinary image upload support
- Toast notifications and loading states
- Optimized performance and clean architecture

---

## 🛠 Tech Stack

| Category | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Styling | Tailwind CSS |
| Media Handling | Cloudinary, Multer |
| State Management | React Context API / Redux (update as applicable) |
| Notifications | React Hot Toast / Sonner |
| Deployment | Render |

---

## 🏗 Architecture

QuickBite follows a scalable client-server architecture.

```text
Client (React)
        │
        ▼
REST API
        │
        ▼
Express Server
        │
        ▼
MongoDB Database
```

The frontend communicates with the Express backend through secure REST APIs. Authentication is handled using JWT tokens, while MongoDB stores users, restaurants, foods, carts, and order information. Images are uploaded and served through Cloudinary, ensuring efficient media delivery.

---

## 📂 Project Structure

```text
QuickBite/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### 1) Clone the repository

```bash
git clone https://github.com/vikasverma101/QuickBite.git

cd QuickBite
```

### 2) Install backend dependencies

```bash
cd backend

npm install
```

### 3) Install frontend dependencies

```bash
cd ../frontend

npm install
```

### 4) Run the backend

```bash
cd backend

npm run dev
```

### 5) Run the frontend

```bash
cd frontend

npm run dev
```

### 6) Build for production

```bash
cd frontend

npm run build
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory.

| Variable | Description |
| --- | --- |
| PORT | Backend server port |
| MONGODB_URL | MongoDB connection string |
| JWT_SECRET | JWT secret key |
| CLIENT_URL | Frontend URL |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| SMTP_HOST | SMTP host |
| SMTP_PORT | SMTP port |
| SMTP_USER | Email address |
| SMTP_PASS | Gmail App Password |
| SENDER_EMAIL | Sender email |

Frontend `.env`

| Variable | Description |
| --- | --- |
| VITE_API_URL | Backend API URL |
| VITE_FIREBASE_APIKEY |Firebase api
| VITE_GEOAPIKEY | Geoapi key 

---

## ⚡ API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | /api/auth/signup | Register a user |
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | Logout |
| GET | /api/user/profile | Get user profile |
| PUT | /api/user/profile | Update profile |
| GET | /api/restaurants | Get all restaurants |
| GET | /api/restaurants/:id | Restaurant details |
| GET | /api/foods | Get food items |
| GET | /api/foods/:id | Food details |
| POST | /api/cart | Add item to cart |
| PUT | /api/cart | Update cart |
| DELETE | /api/cart/:id | Remove item |
| POST | /api/orders | Place order |
| GET | /api/orders | Order history |

---

## 🔒 Security

QuickBite follows modern backend security practices.

- JWT Authentication
- Password hashing using bcryptjs
- Protected REST APIs
- Secure middleware-based authorization
- Environment variable management
- Cloudinary secure media storage
- Input validation
- CORS protection

---

## 📈 Performance

QuickBite is optimized for a smooth user experience.

- Fast REST API responses
- Optimized MongoDB queries
- Lazy-loaded components
- Responsive UI
- Optimized image delivery via Cloudinary
- Efficient React rendering
- Reusable component architecture
- Production-ready folder structure

---

## 📱 Responsive Design

QuickBite is fully responsive and optimized for:

- Desktop
- Laptop
- Tablet
- Mobile

---

## 🚀 Future Improvements

- AI-powered food recommendations
- Real-time order tracking
- Wishlist functionality
- Dark mode
- Progressive Web App (PWA)
- Push notifications
- Loyalty rewards system
- Multi-language support

---

## 📌 Summary

QuickBite is a production-ready full-stack food ordering application built with the MERN stack. It showcases secure authentication, RESTful APIs, responsive frontend development, cloud-based media management, and scalable backend architecture. The project reflects real-world software engineering practices and serves as a strong portfolio piece for full-stack development roles.
