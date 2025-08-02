# Rukna Mobile App

React Native mobile application for the Rukna platform - connecting tourists with local guides for authentic cultural experiences in the Asir region.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio with emulator (for Android development)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd rukna_app
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your actual Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your preferred platform:**
   - iOS: Press `i` in the terminal or scan the QR code with your iPhone
   - Android: Press `a` in the terminal or scan the QR code with the Expo Go app
   - Web: Press `w` in the terminal

## 📱 Features

- **Authentication**: Email/password signup and signin
- **User Types**: Tourist and Guide profiles
- **Experience Discovery**: Browse and search authentic local experiences
- **Booking System**: Book experiences with guides
- **Profile Management**: Manage user profiles and preferences
- **Real-time Updates**: Live booking status updates

## 🏗️ Architecture

### Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components
│   └── common/        # Common app components
├── screens/           # Screen components
├── navigation/        # Navigation configuration
├── services/          # API and database services
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── constants/         # App constants and configuration
└── utils/             # Utility functions
```

### Technology Stack

- **React Native**: Mobile framework
- **Expo**: Development platform
- **TypeScript**: Type safety
- **React Navigation**: Navigation library
- **Supabase**: Backend as a Service
- **React Hook Form**: Form handling
- **Expo Vector Icons**: Icon library

## 🔗 Integration with Web App

This mobile app is designed to work with the existing Rukna web application:

- **Shared Database**: Uses the same Supabase database as the web app
- **Compatible APIs**: Works with the existing Next.js API routes
- **Consistent Data Models**: Uses the same TypeScript types and interfaces
- **Authentication**: Compatible with the existing authentication system

## 🔧 Development

### Available Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android emulator
- `npm run ios`: Run on iOS simulator  
- `npm run web`: Run in web browser

### Environment Variables

Create a `.env` file with the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Testing

The app includes placeholder screens for rapid development. Key screens implemented:

- ✅ Authentication (Sign In/Sign Up)
- ✅ Home Screen with featured experiences
- ✅ Discover Screen with search functionality
- ✅ Bookings Screen for managing reservations
- ✅ Profile Screen with user management
- 🚧 Experience Details (placeholder)
- 🚧 Booking Flow (placeholder)
- 🚧 Onboarding Screens (placeholder)

## 📦 Building for Production

### iOS Build
```bash
expo build:ios
```

### Android Build
```bash
expo build:android
```

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for all new files
3. Implement error handling for all API calls
4. Test on both iOS and Android platforms
5. Update this README when adding new features

## 📄 License

This project is part of the Rukna platform for authentic Asir tourism experiences.