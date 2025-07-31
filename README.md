# Giverr - Social Gratitude Platform

A beautiful, community-driven social platform focused on gratitude and acts of kindness. Built with React, Node.js, and PostgreSQL.

## ✨ Features

- **Express Gratitude**: Share stories of kindness and appreciation
- **Community Building**: Connect with others through positive interactions
- **Reputation System**: Earn community scores through confirmed gratitude
- **User Profiles**: Showcase your gratitude journey and impact
- **Real-time Updates**: See gratitude stories as they happen
- **Mobile Responsive**: Beautiful experience on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **TanStack Query** for state management
- **Wouter** for routing
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with Drizzle ORM
- **Replit Authentication** via OpenID Connect
- **Session-based authentication**

### Deployment
- **Railway** for hosting
- **Cloudflare** for DNS and SSL
- **GoDaddy** domain integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/giverr.git
   cd giverr
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:5000` to see the application.

## 📦 Build and Deploy

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Railway
Follow the detailed guide in [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment instructions.

## 🎨 Design System

- **Colors**: Indigo-pink gradient theme
- **Typography**: Poppins and Nunito Sans
- **Components**: Accessible, responsive design
- **Branding**: Official Giverr logo integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🌟 About Giverr

Giverr is more than a social platform - it's a movement to spread gratitude and kindness. Every story shared builds stronger communities and makes the world a little brighter.

---

Built with ❤️ for spreading gratitude