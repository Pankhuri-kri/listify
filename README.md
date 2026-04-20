# 🛒 Listify – MERN Marketplace Application

A full-stack marketplace web application built using the MERN stack that enables users to buy and sell second-hand products with real-time communication and bidding features.

---

## 🚀 Overview

**Listify** is a modern peer-to-peer marketplace platform inspired by OLX.
It allows users to list products, browse listings, place bids, and communicate with sellers in real time.

This project demonstrates a complete full-stack implementation with authentication, real-time features, and admin-level controls.

---

## ✨ Features

* 🔐 Secure Authentication (JWT + bcrypt)
* 🛍️ Product Listing with Image Upload
* 🔎 Advanced Search & Filtering (category, price, usage)
* 💬 Real-Time Chat System (Socket.IO)
* 💸 Bidding System for products
* 🔔 Notification System
* 🧑‍💼 Admin Dashboard (manage users, products, broadcasts)
* 📱 Responsive UI (Tailwind CSS + Ant Design)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux
* Tailwind CSS
* Ant Design

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* Socket.IO

### Other Tools

* Axios
* JWT Authentication
* bcrypt
* dotenv

---

## 📂 Project Structure

```
listify/
│
├── client/        # React frontend
├── server/        # Node.js backend
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Pankhuri-kri/listify.git
cd listify
```

### 2. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the **server** folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the application

```bash
# Start backend
cd server
npm start

# Start frontend
cd client
npm start
```

---

## 📸 Screenshots

> Add screenshots here (home page, chat, admin dashboard, etc.)

---

## 🔮 Future Improvements

* Image compression before storage
* Seller rating & review system
* Email notifications
* Payment integration

---

## 👩‍💻 Author

**Pankhuri Kumari**
Full Stack Developer (MERN)

This project was independently designed and developed as a complete full-stack application to demonstrate real-world marketplace functionality.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
