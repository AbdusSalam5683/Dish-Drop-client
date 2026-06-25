markdown
# 🍽️ DishDrop - Recipe Sharing Platform

A community-driven platform for food lovers to create, share, and discover recipes from every corner of the world.

## 🌐 Live Demo
**[https://dishdropbd.vercel.app/](https://dishdropbd.vercel.app/)**

## ✨ Features

### 👤 User Features
- **Authentication**: Email/Password + Google Login
- **Browse Recipes**: Search, filter by category, pagination
- **Recipe Details**: Like, Favorite, Report, Purchase
- **Dashboard**: Overview, My Recipes, Add Recipe, Favorites, Purchased, Profile
- **Premium Membership**: Unlimited recipes with premium badge

### 👨‍💼 Admin Features
- **Dashboard Overview**: Total Users, Recipes, Premium Members, Reports
- **Manage Users**: View, Block, Unblock
- **Manage Recipes**: View, Delete, Feature
- **Manage Reports**: View, Dismiss, Remove Recipe

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2.9
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Payment**: Stripe
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment**: Stripe Webhooks

## 📂 Project Structure
dish-drop-client/
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── (auth)/ # Login & Register
│ │ ├── (dashboard)/ # User & Admin Dashboard
│ │ ├── (public)/ # Home & Browse Recipes
│ │ └── recipe/[id]/ # Recipe Details
│ ├── components/ # Reusable Components
│ │ ├── common/ # Navbar, Footer, Logo
│ │ ├── home/ # Banner, Featured, Popular
│ │ └── recipes/ # RecipeCard, Filters
│ ├── context/ # AuthContext
│ ├── hooks/ # Custom Hooks
│ └── lib/ # API & Utilities
├── public/ # Static Assets
└── ...

text

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)
- Stripe Account

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdusSalam5683/Dish-Drop-client.git
cd Dish-Drop-client

# Install dependencies
npm install

# Environment Variables
cp .env.example .env.local

# Run development server
npm run dev
Environment Variables
env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
📊 Features Checklist
✅ Authentication (Email + Google)

✅ Home Page with Animations

✅ Browse Recipes with Filters

✅ Recipe Details with Like/Favorite/Report

✅ User Dashboard (Overview, My Recipes, Add Recipe, Favorites, Purchased, Profile)

✅ Admin Dashboard (Overview, Manage Users, Manage Recipes, Reports)

✅ Premium Membership with Stripe

✅ Dark/Light Theme

✅ Responsive Design

✅ 31+ Meaningful Commits

👨‍💻 Contributors
Abdus Salam - @AbdusSalam5683

📄 License
MIT

🔗 Links
Live Site: https://dishdropbd.vercel.app/

Server Repository: https://github.com/AbdusSalam5683/Dish-Drop-server

Client Repository: https://github.com/AbdusSalam5683/Dish-Drop-client