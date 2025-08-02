# 🏔️ Rukna (رُكْنَة) - Authentic Asir Experiences

> *Connecting travelers with local guides for authentic cultural experiences in Saudi Arabia's Asir region*

![Rukna Platform](https://img.shields.io/badge/Platform-Web%20%26%20Mobile-blue) ![Tech Stack](https://img.shields.io/badge/Tech-Next.js%20%7C%20React%20Native%20%7C%20Supabase-green)

## 🌟 The Vision

**Rukna** transforms tourism in the Asir region by creating meaningful connections between curious travelers and passionate local guides. Our AI-powered platform goes beyond traditional booking - it matches personalities, interests, and cultural preferences to create truly authentic experiences.

### 🎯 Core Problem We Solve

- **For Tourists**: Finding authentic, personalized experiences beyond generic tours
- **For Local Guides**: Connecting with travelers who truly appreciate their knowledge and culture
- **For Asir Region**: Sustainable tourism that preserves and celebrates local heritage

## 🏗️ Platform Architecture

### 🌐 **Web Application** (`rukna_website/`)
*Next.js 15 with modern TypeScript architecture*

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Radix UI components
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Google's Gemini for smart matching
- **Deployment**: Vercel-ready

### 📱 **Mobile Application** (`rukna_app/`)
*React Native with Expo for cross-platform experience*

- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6
- **Authentication**: Supabase Auth with AsyncStorage
- **State Management**: React Context + Hooks
- **UI Components**: Custom components with Expo Vector Icons
- **Platform**: iOS, Android, and Web

## ✨ Key Features

### 🧠 **AI-Powered Matching**
- Semantic similarity matching between tourist interests and guide specialties
- Personality-based recommendations
- Dynamic pricing optimization
- Cultural preference alignment

### 👥 **Dual User Experience**

#### **For Tourists**
- 🔍 **Smart Discovery**: AI-curated experiences based on preferences
- 📅 **Easy Booking**: Streamlined booking with real-time availability
- 💬 **Direct Communication**: Connect with guides before and during experiences
- ⭐ **Review System**: Rate and review authentic experiences

#### **For Local Guides**
- 📝 **Profile Creation**: Showcase expertise, languages, and specialties
- 🎨 **Experience Management**: Create and manage unique offerings
- 💰 **Flexible Pricing**: Set competitive rates for different experience types
- 📊 **Analytics Dashboard**: Track bookings, earnings, and guest feedback

### 🔐 **Enterprise-Grade Security**
- Row-level security policies in Supabase
- JWT-based authentication across platforms
- Data encryption and privacy compliance
- Secure payment processing integration

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Supabase** account and project
- **Google OAuth** credentials
- **Expo CLI** (for mobile development)

### 🌐 Web Application Setup

```bash
# Navigate to web app
cd rukna_website

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your Supabase and Google OAuth credentials

# Setup database
npx supabase db reset  # If using Supabase CLI
# Or run the SQL files manually

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the web application.

### 📱 Mobile Application Setup

```bash
# Navigate to mobile app
cd rukna_app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add your Supabase credentials

# Start Expo development server
npm start

# Run on your device
# iOS: Press 'i' or scan QR with iPhone
# Android: Press 'a' or scan QR with Expo Go
# Web: Press 'w' for browser testing
```

## 🗄️ Database Design

Our database is optimized for AI-powered matching and scalable tourism operations:

### Core Tables
- **`profiles`**: User accounts (tourists & guides)
- **`tourist_profiles`**: Tourist preferences and travel history
- **`guide_profiles`**: Guide expertise, verification, and availability
- **`experiences`**: Curated activities and tours
- **`bookings`**: Reservation management and status tracking
- **`reviews`**: Feedback and rating system

### AI Features
- **Array fields** for interests/specialties matching
- **Embedding vectors** for semantic search
- **GIN indexes** for fast array operations
- **Real-time subscriptions** for live updates

## 🛠️ Technology Stack

### **Frontend Technologies**
- **Next.js 15**: React framework with App Router
- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives

### **Backend & Database**
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Relational database with advanced features
- **Row Level Security**: Database-level authorization
- **Real-time subscriptions**: Live data updates

### **AI & Integration**
- **Google Gemini**: AI-powered experience matching
- **NextAuth.js**: Authentication framework
- **React Hook Form**: Form management
- **Zod**: Schema validation

### **Development & Deployment**
- **Expo**: React Native development platform
- **Vercel**: Web application deployment
- **Git**: Version control with proper `.gitignore`
- **ESLint**: Code linting and quality

## 📁 Project Structure

```
rukna/
├── rukna_website/          # Next.js Web Application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/          # Utilities and configurations
│   │   └── types/        # TypeScript type definitions
│   ├── public/           # Static assets
│   └── docs/            # Project documentation
│
├── rukna_app/             # React Native Mobile App
│   ├── src/
│   │   ├── screens/      # Mobile app screens
│   │   ├── components/   # Mobile UI components
│   │   ├── navigation/   # Navigation configuration
│   │   ├── services/     # API and database services
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # Shared TypeScript types
│   └── assets/           # Mobile app assets
│
└── README.md             # This file
```

## 🌊 User Journey

### **Tourist Flow**
1. **Discover**: Browse AI-recommended experiences
2. **Connect**: Review guide profiles and specialties
3. **Book**: Select dates and customize experience
4. **Experience**: Enjoy authentic local activities
5. **Review**: Share feedback and rate the experience

### **Guide Flow**
1. **Register**: Create detailed guide profile
2. **Verify**: Complete identity and expertise verification
3. **Create**: Design unique experience offerings
4. **Manage**: Handle bookings and communicate with tourists
5. **Earn**: Receive payments and build reputation

## 🔄 Development Workflow

### **Shared Database Strategy**
Both web and mobile applications use the same Supabase database, ensuring:
- **Data Consistency**: Single source of truth
- **Real-time Sync**: Live updates across platforms
- **Unified APIs**: Consistent data access patterns

### **Type Safety**
Shared TypeScript interfaces ensure consistency:
```typescript
// Shared across web and mobile
interface Experience {
  id: string;
  title: string;
  description: string;
  guide_id: string;
  price_per_person: number;
  // ... other fields
}
```

### **Environment Configuration**
```bash
# Web (.env.local)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Mobile (.env)
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## 🚀 Deployment

### **Web Application**
- **Platform**: Vercel (recommended)
- **Build Command**: `npm run build`
- **Environment**: Add all environment variables in Vercel dashboard

### **Mobile Application**
- **Development**: Expo Go app for testing
- **Production**: 
  - iOS: `expo build:ios` → App Store
  - Android: `expo build:android` → Google Play

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Write meaningful commit messages
- Test on both web and mobile platforms
- Update documentation for new features
- Ensure responsive design principles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Asir Region Tourism Board** for cultural insights
- **Local Guides Community** for authentic experiences
- **Open Source Community** for amazing tools and libraries

---

<div align="center">

### 🏔️ *Experience Asir Authentically with Rukna*

**[Web App](http://localhost:3000)** • **[Mobile App](rukna_app/)** • **[Documentation](rukna_website/docs/)**

Made with ❤️ for authentic tourism experiences

</div>