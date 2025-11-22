# Kartly 🛒

A full-stack MERN E-Commerce application with authentication, product & category management, and an admin dashboard.  
This project is structured and written with production-readiness in mind: clean architecture, reusable components, and a focus on real-world workflows.

---

## 🚀 Live Deployment

### 👉 **Try the Live App**  
🔗 **https://e-commerce-store-4vem.onrender.com/**

---

## 🚀 Features

### 👤 User Features

- Browse products with images, price, and details
- Filter products by category
- Add products to cart
- Update cart quantities
- Checkout flow (order creation logic)
- User registration & login
- Persistent authentication (via HTTP-only cookies / tokens)
- Responsive UI for desktop and mobile

### 🛠 Admin Features

Accessible via a protected route (e.g. `/secret-dashboard`) for admin users:

- Admin dashboard layout with tabs
- Create and manage products
- Basic analytics / overview section (e.g. products, orders, users)
- Access control based on user role (`admin` vs `user`)

### 🧰 Technical Highlights

- **MERN Stack**  
  - MongoDB + Mongoose for database
  - Express.js REST API
  - React-based frontend
  - Node.js backend
- Centralized Axios instance with `withCredentials` enabled
- Protected routes on both backend (middleware) and frontend (role-based rendering)
- Organized folder structure for scalability
- Modern UI with animations and reusable components

---

## 🏗 Tech Stack

**Frontend**

- React
- React Router
- Axios
- Tailwind CSS / utility-based styling (check `src` for exact styling approach)
- Framer Motion (for animations, where used)

**Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Cookie-based auth (`httpOnly` cookies)
- Middleware-based route protection

---

## 📁 Project Structure (High-Level)

```bash
E-Commerce_Store/
├── backend/
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── product.route.js
│   │   └── category.route.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
