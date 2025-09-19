# 🛡️ Suraksha

**Digital Disaster Preparedness Platform for Educational Institutions**

Suraksha is a comprehensive web application designed to enhance disaster preparedness in educational instituFoFor support and questions:
- 📧 Email: support@suraksha.edu
- � Community discussions and local supportupport and questions:
- 📧 Email: support@suraksha.edu
- � Community discussions and local supportns through interactive training modules, real-time drill simulations, and emergency response systems.

![Suraksha Platform](https://img.shields.io/badge/Platform-Suraksha-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### 🎯 Core Functionality
- **Multi-Role Access**: Separate interfaces for students and administrators
- **Interactive Learning Modules**: Comprehensive disaster preparedness training
- **Real-time Drill Simulations**: Practice emergency scenarios safely
- **SOS Emergency System**: Quick emergency alert and response system
- **Campus Mapping**: Interactive campus navigation with evacuation routes
- **Progress Tracking**: Detailed analytics and performance monitoring

### 📚 Learning Modules
- 🔥 Fire Safety and Evacuation
- 🌪️ Earthquake Response and Safety
- 💨 Tornado and Severe Weather
- 🌊 Flood Emergency Procedures
- ⚡ Electrical Safety and Hazards
- 🧪 Chemical Spill Response

### 👨‍🎓 Student Features
- Personal dashboard with progress tracking
- Interactive quizzes and assessments
- Drill simulation practice
- Emergency evacuation practice
- Campus map with safe zones
- SOS emergency alerts
- Performance analytics

### 👨‍💼 Admin Features
- Student progress monitoring
- System-wide analytics and reporting
- Drill scheduling and management
- Emergency alert broadcasting
- Performance insights and trends

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sania0607/suraksha.git
   cd suraksha
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Or using bun (recommended)
   bun install
   ```

3. **Start development server**
   ```bash
   # Using npm
   npm run dev
   
   # Or using bun
   bun run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── LandingPage.tsx # Main landing page
│   ├── LoginScreen.tsx # Authentication screen
│   └── Layout.tsx      # App layout wrapper
├── pages/              # Page components
│   ├── student/        # Student-specific pages
│   │   ├── StudentHome.tsx
│   │   ├── StudentModules.tsx
│   │   ├── DrillSimulator.tsx
│   │   ├── SOSScreen.tsx
│   │   └── CampusMap.tsx
│   └── admin/          # Admin-specific pages
│       ├── AdminDashboard.tsx
│       └── AdminAnalytics.tsx
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── App.tsx            # Main application component
```

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.8.3** - Type safety and enhanced developer experience
- **Vite 5.4.19** - Fast build tool and development server

### UI/UX
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide React** - Beautiful, customizable icons
- **Radix UI** - Unstyled, accessible UI primitives

### State Management & Routing
- **React Router DOM 6.30.1** - Client-side routing
- **TanStack Query 5.83.0** - Server state management
- **React Context** - Global state management

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🎨 Design System

The application uses a carefully crafted design system with:
- **Custom color palette** optimized for accessibility
- **Consistent spacing** and typography scales
- **Responsive design** principles
- **Dark/light mode support**
- **Accessibility-first** component design

## 🔐 Authentication & Roles

The platform supports role-based access:

### Student Role
- Access to learning modules and drills
- Personal progress tracking
- Emergency features (SOS, Campus Map)
- Quiz and assessment participation

### Admin Role
- Student progress monitoring
- Analytics dashboard
- System administration
- Emergency alert management

*Note: Authentication is currently mock-based for demonstration purposes.*

## 📱 Responsive Design

Suraksha is fully responsive and optimized for:
- 📱 Mobile devices (phones, tablets)
- 💻 Desktop computers
- 🖥️ Large displays

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Make your changes to the codebase
2. Test your changes thoroughly
3. Document any new features or changes
4. Submit your contributions

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity
- Write descriptive commit messages
- Ensure responsive design compatibility
- Test across different browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@suraksha.edu
- � Community discussions and local support

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Design inspiration from modern educational platforms

---

**Suraksha** - Preparing tomorrow's leaders for today's challenges 🌟
