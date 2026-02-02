# Community Forum – Full Stack Application

A full-stack community forum application built with a modern frontend and a REST-compliant backend.  
The project demonstrates authentication, protected routes, relational data, pagination, and a scalable API-first architecture.

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- React Query (Server State Management)
- Redux Toolkit (Global UI State)
- CSS (Custom, performance-focused styling)

### Backend
- json-server-auth
- JWT-based authentication
- REST API with filtering, sorting, pagination
- File-based database (`db.json`)

### Deployment
- Frontend: Netlify
- Backend: Render

---

## Features

### Authentication
- ✅ User registration with email validation
- ✅ Login/Logout functionality
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Persistent authentication state

### Forum Features
- ✅ Create, read, update, delete posts
- ✅ Comment on posts
- ✅ User profiles
- ✅ Post categorization
- ✅ Search and filter posts
- ✅ Pagination
- ✅ Responsive design

### User Features
- ✅ Profile management
- ✅ View user posts
- ✅ Edit own posts and comments
- ✅ Delete own content

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Clone the Repository
```bash
git clone <repository-url>
cd Comunity-Forum-App
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:3000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

### Backend
No environment variables required for development. Uses `db.json` for data storage.

---

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /users/:id` - Get user profile

### Posts
- `GET /posts` - Get all posts (supports pagination, sorting, filtering)
- `GET /posts/:id` - Get single post
- `POST /posts` - Create new post (protected)
- `PUT /posts/:id` - Update post (protected)
- `DELETE /posts/:id` - Delete post (protected)

### Comments
- `GET /comments` - Get all comments
- `GET /comments?postId=:id` - Get comments for a post
- `POST /comments` - Create comment (protected)
- `PUT /comments/:id` - Update comment (protected)
- `DELETE /comments/:id` - Delete comment (protected)

### Query Parameters
- `_page` - Page number for pagination
- `_limit` - Items per page
- `_sort` - Sort field
- `_order` - Sort order (asc/desc)
- `q` - Search query

---

## Project Structure

```
Comunity-Forum-App/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Redux slices
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── db.json             # Database file
│   ├── server.js           # Server configuration
│   └── package.json
│
└── README.md
```

---

## Usage

### Creating a Post
1. Register/Login to your account
2. Navigate to "Create Post" page
3. Fill in title, content, and category
4. Submit the form

### Commenting
1. Open any post
2. Scroll to comments section
3. Write your comment
4. Submit

### Managing Content
- Edit/Delete buttons appear only on your own posts and comments
- Use the profile page to view all your posts

---

## Development Scripts

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend
```bash
npm run dev        # Start json-server with auth
npm start          # Start production server
```

---

## Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variable `VITE_API_URL` to your backend URL

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `npm start`

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please open an issue in the repository.

