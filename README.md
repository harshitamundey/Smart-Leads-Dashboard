# Smart Leads Dashboard 🚀

A modern full-stack Lead Management Dashboard with a premium SaaS-style UI and scalable architecture.

## 🌟 Features

- **Premium UI/UX**: Dark futuristic design with blue glowing accents and smooth animations.
- **Authentication**: Secure JWT-based auth with Role-Based Access Control (Admin & Sales).
- **Leads Management**: Full CRUD operations for leads with advanced filtering and search.
- **Analytics**: Dashboard cards for quick overview of lead statuses.
- **Advanced Filtering**: Combine status, source, and search filters seamlessly.
- **Pagination**: Backend-driven pagination for scalability.
- **CSV Export**: Export filtered lead data to CSV.
- **Responsive Design**: Fully functional on Desktop, Tablet, and Mobile.
- **Docker Support**: Containerized for easy deployment.

## 🛠 Tech Stack

### Frontend
- React.js & TypeScript
- TailwindCSS (Premium Dark Theme)
- Framer Motion (Animations)
- Zustand (State Management)
- React Hook Form & Zod (Validation)
- Lucide React (Icons)
- Axios

### Backend
- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs
- Zod (API Validation)

## 📁 Project Structure

```
Smart Leads Dashboard/
├── backend/                # Express API
│   ├── src/
│   │   ├── controllers/    # Route logic
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & Error handling
│   │   ├── config/         # DB connection
│   │   └── validators/     # Zod schemas
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI
│   │   ├── pages/          # View components
│   │   ├── layouts/        # Page structures
│   │   ├── context/        # Zustand stores
│   │   └── services/       # API calls
└── docker-compose.yml      # Orchestration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Docker (Optional)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "Smart Leads Dashboard"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # PORT=5000
   # MONGODB_URI=mongodb://localhost:27017/smart-leads
   # JWT_SECRET=your_secret_key
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Running with Docker

```bash
docker-compose up --build
```
The app will be available at `http://localhost:80`.

## 🔐 Roles & Permissions

- **Admin**: Full access to view, create, update, and delete leads.
- **Sales User**: Can view, create, and update leads, but cannot delete them.

## 📄 API Documentation

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user profile

### Leads
- `GET /api/leads` - Get all leads (with query params: page, limit, search, status, source)
- `GET /api/leads/stats` - Get dashboard analytics
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead (Admin only)
