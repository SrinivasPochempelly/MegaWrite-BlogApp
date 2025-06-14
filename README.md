
# 📚 MegaWrite-BlogApp

MegaWrite-BlogApp is a **full-stack blog platform** where users can read and comment on articles, and authors can create, edit, and manage content. Built with **React, Node.js, Express, and MongoDB**, the application features:

* Role-based authentication
* Modern responsive UI
* Bootstrap styling and smooth animations
* Robust error handling

---

## 📂 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
* [Testing](#testing)
* [Project Structure](#project-structure)
* [API Endpoints](#api-endpoints)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## 📖 Overview

MegaWrite-BlogApp provides a blogging platform with distinct **user and author roles**:

* Users: Can read articles and post comments.
* Authors: Can manage articles, including soft deletion and image uploads.

Additional features:

* Dynamic navbar based on user roles
* Responsive design with a modern UI
* Themed error pages and consistent footer across all pages

---

## ✨ Features

### ✅ Role-Based Access

* **Users:** Register, login, read articles, comment.
* **Authors:** Register, login, create, edit, soft-delete, restore articles.

### ✅ Dynamic Navbar

* **Pre-login:** Home, User Login, Author Login, About Us
* **User Logged-in:** Home, Welcome \[username], About Us, Logout
* **Author Logged-in:** Home, Create Article, Welcome \[username], About Us, Logout

### ✅ Article Management

* Create articles with titles, categories, content, and multiple images.
* Soft-delete and restore articles.
* View active and deleted articles.

### ✅ Responsive UI

* Bootstrap, Animate.css, custom Poppins font.
* Smooth image carousels and card animations.

### ✅ Error Handling

* Custom "Page Not Found" page with navigation button.
* Flash messages for login redirects and empty states.

### ✅ Footer

* Persistent across all pages.
* Displays contact information and copyright.

### ✅ Security

* Token-based authentication stored in localStorage.
* Strict role-based permissions (authors can't comment).

---

## 🛠️ Tech Stack

* **Frontend:** React (v18+), React Router (v6), Bootstrap (v5), Axios, Animate.css
* **Backend:** Node.js (v16+), Express, MongoDB
* **Styling:** Bootstrap, custom CSS (Poppins font)
* **Tools:** npm, Git, MongoDB Atlas or local MongoDB

---

## ✅ Prerequisites

* Node.js (v16 or higher)
* MongoDB (local or Atlas)
* Git
* Code Editor (VS Code recommended)

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/megawrite-blogapp.git
cd megawrite-blogapp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/megawriteblogapp
JWT_SECRET=your_jwt_secret
```

> 🔐 Replace `your_jwt_secret` with a random string:
> `openssl rand -hex 32`

Start MongoDB:

```bash
mongod
```

*(For MongoDB Atlas, update the connection string in `.env`)*

Install nodemon (if not installed):

```bash
npm install --save-dev nodemon
```

Start the backend:

```bash
nodemon index.js
```

Backend runs at: **[http://localhost:9898](http://localhost:9898)**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend runs at: **[http://localhost:3000](http://localhost:3000)**

---

## 🚀 Usage

### Home Page (`/`)

* View active articles, image carousels, and recent comments.
* Click "Read More" to see full article (requires login).

### User Actions

* Register/Login at `/user/auth`
* View articles: `/articles`
* View article details: `/article/:id`
* Add comments

### Author Actions

* Register/Login at `/author/auth`
* Create article: `/author/create`
* Manage articles: `/author/articles`
* Edit article: `/author/update/:articleId`
* Restore deleted articles

### Invalid URLs

* Displays custom "Page Not Found" page with a return button.

### About Us

* Accessible at `/about-us`

---

## 🧪 Testing

### Start Servers

```bash
# Terminal 1
cd backend && nodemon index.js

# Terminal 2
cd ../frontend && npm start
```

### Key Test Scenarios

* Validate navbar options based on login status.
* Check article creation, editing, and soft deletion.
* Verify role-based access: authors can't comment, users can't create articles.
* Ensure invalid URLs render the custom error page.
* Verify MongoDB records:

```javascript
db.articlesCollection.find({ status: true }).toArray()
```

* API test example:

```bash
curl http://localhost:9898/user-api/articles
```

---

## 📂 Project Structure

```
megawrite-blogapp/
├── backend/
│   ├── index.js
│   ├── db.js
│   ├── routes/
│   │   ├── userApi.js
│   │   ├── authorApi.js
│   ├── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── NotFound.js
│   │   │   ├── AboutUs.js
│   │   │   ├── user/
│   │   │   │   ├── UserAuth.js
│   │   │   │   ├── UserArticleList.js
│   │   │   │   ├── UserArticleDetail.js
│   │   │   ├── author/
│   │   │   │   ├── AuthorAuth.js
│   │   │   │   ├── AuthorCreateArticle.js
│   │   │   │   ├── AuthorUpdateArticle.js
│   │   │   │   ├── ArticleList.js
│   │   │   │   ├── ArticleDetail.js
│   ├── package.json
├── README.md
├── .gitignore
```

---

## 🔗 API Endpoints

### User API (`/user-api`)

* `GET /articles` - Fetch all active articles
* `POST /login` - User login
* `POST /user` - User registration
* `PUT /comment/:id` - Add comment to article

### Author API (`/author-api`)

* `POST /login` - Author login
* `POST /author` - Author registration
* `GET /articles/:username` - Fetch articles by author
* `POST /article` - Create article
* `PUT /article` - Update article
* `PUT /article/soft-delete/:id` - Soft-delete article
* `PUT /article/restore/:id` - Restore article

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes:

```bash
git commit -m "Add: your feature description"
```

4. Push to your branch:

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request on GitHub.

> Please ensure clear commit messages and consistent coding style.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📞 Contact

For support or inquiries:

* **Email:** [support@megawriteblogapp.com](mailto:srinivaspochempelly@gmail.com)
* **Phone:** +91 6302596234
