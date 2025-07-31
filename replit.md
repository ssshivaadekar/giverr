# GIVERR Social Network

## Overview

GIVERR is a full-stack social network application focused on gratitude and giving back. The platform allows users to express gratitude to each other through stories, building a community-driven reputation system based on kindness and mutual appreciation. The application features a React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and implementing Replit's authentication system.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 31, 2025)

✓ Updated brand colors from indigo-pink to warm teal theme
✓ Replaced "trustLevel" with "kindnessLevel" for warmer user experience  
✓ Updated all UI components to use teal as signature brand color
✓ Maintained warm, community-focused aesthetic over corporate feel

## System Architecture

### Frontend Architecture

The client-side application is built with **React** and **TypeScript**, utilizing a modern component-based architecture:

- **React Router (Wouter)**: Lightweight routing solution for navigation between landing and authenticated views
- **TanStack Query**: Handles server state management, caching, and data fetching with automatic retry logic
- **Shadcn/UI Components**: Comprehensive UI component library built on Radix UI primitives for consistent design
- **Tailwind CSS**: Utility-first CSS framework with custom brand colors and design system
- **Vite**: Build tool and development server for fast development experience

The application follows a clear separation between authenticated and unauthenticated states, with conditional rendering based on user authentication status.

### Backend Architecture

The server-side implements a **RESTful API** using Node.js and Express:

- **Express.js**: Web framework handling HTTP requests, middleware, and routing
- **TypeScript**: Type-safe development across the entire backend
- **Session-based Authentication**: Integrated with Replit's OAuth system for secure user management
- **Modular Route Organization**: Clean separation of concerns with dedicated route handlers
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Data Architecture

**Database Design** using PostgreSQL with Drizzle ORM:

- **Users Table**: Stores user profiles, reputation scores (reps/stars), and trust levels
- **Gratitude Stories**: Central entity linking givers and receivers with story content
- **Sessions Table**: Manages user authentication sessions
- **Confirmation System**: Built-in workflow for recipients to confirm gratitude stories

The schema supports a reputation-based system where users earn "reps" and "stars" through confirmed gratitude interactions.

### Authentication System

**Replit Auth Integration**:
- OAuth-based authentication using OpenID Connect
- Automatic user provisioning and profile management
- Session persistence with PostgreSQL storage
- Secure cookie-based session handling

### State Management

**Client-Side State**:
- React Query for server state and caching
- React hooks for local component state
- Context providers for global UI state (toasts, tooltips)
- Custom hooks for authentication status

### API Design

**RESTful Endpoints**:
- `/api/auth/*`: Authentication and user management
- `/api/gratitude-stories`: CRUD operations for gratitude content
- `/api/users/search`: User discovery functionality
- Consistent JSON responses with proper error handling

### Build and Deployment

**Development Setup**:
- Vite for fast development builds and hot module replacement
- ESBuild for production bundling
- TypeScript compilation with path aliases
- Environment-based configuration

The architecture prioritizes developer experience with hot reloading, type safety, and clear separation of concerns while maintaining production readiness with proper error handling and security measures.

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management
- **Database Migrations**: Automated schema updates through Drizzle Kit

### Authentication
- **Replit Authentication**: OAuth provider integration for user management
- **OpenID Connect**: Industry-standard authentication protocol
- **Passport.js**: Authentication middleware for Express applications

### UI Framework
- **Radix UI**: Headless component primitives for accessibility
- **Shadcn/UI**: Pre-built component library with consistent styling
- **Tailwind CSS**: Utility-first CSS framework
- **Google Fonts**: Poppins and Nunito Sans for typography

### Development Tools
- **Vite**: Modern build tool with development server
- **TypeScript**: Type checking and enhanced developer experience
- **ESLint/Prettier**: Code formatting and linting (implied by structure)

### Runtime Dependencies
- **React 18**: Frontend framework with modern features
- **TanStack Query**: Server state management and caching
- **Express.js**: Web application framework
- **Node.js**: JavaScript runtime environment

### Deployment Platform
- **Replit**: Cloud development and deployment platform
- **Environment Variables**: Secure configuration management
- **Session Storage**: PostgreSQL-backed session persistence