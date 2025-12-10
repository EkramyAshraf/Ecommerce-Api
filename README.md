# 📘 Ecommerce API

RESTful API for managing **products**, **users**, **orders**, and **authentication**.

A backend project built with **Node.js**, **Express**, **MongoDB**, and **Stripe**, following best practices for API design, security, and performance.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=json-web-tokens\&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-CC0000?style=for-the-badge)
![Sharp](https://img.shields.io/badge/Sharp-00ADEF?style=for-the-badge)
![Dotenv](https://img.shields.io/badge/Dotenv-000000?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge\&logo=stripe\&logoColor=white)
![Railway](https://img.shields.io/badge/Deployed-Railway-FF55AA?style=for-the-badge)

---

## 🌐 Live Deployment

The API is deployed and running on **Railway**:
[🔗 Visit Live API](https://ecommerce-api-production-3a27.up.railway.app)

---

## 📖 Documentation

Full API documentation is available via **Postman Documenter**:
[🔗 View Documentation](https://documenter.getpostman.com/view/47866835/2sB3dQwATh)
[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/47866835/2sB3dQwATh)

---

## 🚀 Features

* User registration & login
* JWT authentication
* Role-based access (admin, user)
* CRUD operations for products, users, orders
* Stripe payment integration
* Image upload & processing
* Data filtering, sorting, pagination
* Global error handling
* Security best practices (Rate limiting, Helmet, Sanitization)

---

## 📂 Project Structure

```
Ecommerce-Api
│── controllers/
│── models/
│── routes/
│── middlewares/
│── utils/
│── uploads/
│── server.js
│── package.json
│── README.md
```

---

## 📦 Installation

```bash
git clone https://github.com/EkramyAshraf/Ecommerce-Api
cd Ecommerce-Api
npm install
```

---

## 🔧 Environment Variables

Create a `.env` file in the root:

```
NODE_ENV="development"   # Use 'production' when deploying to Railway
PORT=3000
DATABASE_PASSWORD=
DATABASE=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=<your_email>
EMAIL_PASSWORD=<your_password>
EMAIL_PORT=587
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_FROM=<from_email>
STRIPE_SECRET=<stripe_secret>
STRIPE_WEBHOOK_SECRET=<stripe_webhook_secret>
```

> Make sure to switch `NODE_ENV` to `production` when deploying.

---

## ▶️ Running the Project

### Development:

```bash
npm run dev
```

### Production:

```bash
npm start
```

---

## 🔐 Authentication & Payments Flow

1. **Signup / Login** → returns JWT
2. **Protected routes** → require `Authorization: Bearer <token>`
3. **Restricted routes** → only admins can access certain endpoints
4. **Stripe Payments** → for order processing
5. **Password reset** (if implemented)

---

## 📡 API Endpoints

### **Auth**

| Method | Endpoint                         | Description                 | Request Body Example                                                    |
| ------ | -------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| POST   | `/api/v1/users/signup`           | Create new user             | `{ "name": "John", "email": "john@example.com", "password": "123456" }` |
| POST   | `/api/v1/users/login`            | Login user                  | `{ "email": "john@example.com", "password": "123456" }`                 |
| PATCH  | `/api/v1/users/updateMyPassword` | Update logged user password | `{ "passwordCurrent": "123456", "password": "newpass123" }`             |

### **Users**

| Method | Endpoint            | Description           | Request Body Example |
| ------ | ------------------- | --------------------- | -------------------- |
| GET    | `/api/v1/users`     | Get all users (admin) | -                    |
| GET    | `/api/v1/users/:id` | Get user by ID        | -                    |
| PATCH  | `/api/v1/users/:id` | Update user (admin)   | `{ "role": "user" }` |
| DELETE | `/api/v1/users/:id` | Delete user (admin)   | -                    |

### **Products**

| Method | Endpoint               | Description            | Request Body Example                  |
| ------ | ---------------------- | ---------------------- | ------------------------------------- |
| GET    | `/api/v1/products`     | Get all products       | -                                     |
| POST   | `/api/v1/products`     | Create product (admin) | `{ "name": "Laptop", "price": 1200 }` |
| GET    | `/api/v1/products/:id` | Get product by ID      | -                                     |
| PATCH  | `/api/v1/products/:id` | Update product         | `{ "price": 1300 }`                   |
| DELETE | `/api/v1/products/:id` | Delete product         | -                                     |

### **Orders**

| Method | Endpoint             | Description            | Request Body Example                                          |
| ------ | -------------------- | ---------------------- | ------------------------------------------------------------- |
| GET    | `/api/v1/orders`     | Get all orders (admin) | -                                                             |
| POST   | `/api/v1/orders`     | Create order           | `{ "product": "productId", "user": "userId", "price": 1200 }` |
| GET    | `/api/v1/orders/:id` | Get order by ID        | -                                                             |
| PATCH  | `/api/v1/orders/:id` | Update order           | `{ "status": "confirmed" }`                                   |
| DELETE | `/api/v1/orders/:id` | Delete order           | -                                                             |

---

## 🧪 Testing

Use the Postman collection linked above to test all endpoints with sample requests and responses.

---

## 📈 Roadmap

* Add product categories & search filters
* Add email notifications for orders
* Improve role management and permissions
* Deploy to additional cloud platforms

---

## 🤝 Contributing

Pull Requests are welcome. For major changes, please open an issue first.

---

## 📜 License

MIT License © 2025
