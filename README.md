# ✨ AdaptAI

A modern web application built with Nuxt.js that integrates with Hevy to provide intelligent workout tracking and analysis. The application features AI-powered coaching, detailed statistics, and personalized workout routines.

## Features

- **Workout Tracking**: Integration with Hevy API for seamless workout data synchronization
- **AI Coach**: Intelligent workout analysis and recommendations
- **Statistics Dashboard**: Visual representation of workout data and progress
- **Personalized Routines**: Custom workout routines based on user preferences
- **User Authentication**: Secure authentication powered by Clerk

## Tech Stack

- **Frontend Framework**: Nuxt.js 3
- **UI Framework**: TailwindCSS
- **State Management**: Pinia
- **Authentication**: Clerk
- **Charts**: Chart.js
- **AI Integration**: Firebase AI
- **Icons**: Line MD Icons

## Prerequisites

- Node.js (Latest LTS version recommended)
- Hevy API Key
- Firebase Configuration

## Environment Variables

The following environment variables are required:

```env
HEVY_API_ENDPOINT=your_hevy_api_endpoint
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
NUXT_CLERK_SECRET_KEY=your_clerk_sercret_key
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static project
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier

## Project Structure

- `assets/` - Static assets like CSS
- `components/` - Vue components
- `composables/` - Reusable Vue composables
- `layouts/` - Page layouts
- `pages/` - Application pages and routes
- `plugins/` - Nuxt plugins
- `public/` - Public static files
- `server/` - Server-side code
- `stores/` - Pinia stores
