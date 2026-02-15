# AI System Manager - Interactive Prototype

A modern, interactive prototype for a Windows AI System Manager application built with React, Vite, and Tailwind CSS. This prototype demonstrates a comprehensive system management interface with AI-powered assistance features.

## Features

### 🏠 System Dashboard
- **PC Health Monitoring**: Visual health score with circular progress indicator
- **Smart Recommendations**: Actionable cards for system optimization, security updates, and performance improvements
- **Quick AI Queries**: Pre-configured questions to ask your PC AI
- **Performance Modes**: Switch between Quiet, Balanced, and Performance modes
- **Device Essentials**: Real-time monitoring of battery, storage, and memory
- **Activity Timeline**: Recent system changes and optimizations

### 💬 Personal Assistant (In Development)
- Multi-conversation management with workspace organization
- Canvas mode for long-form content editing
- Document upload and chat
- AI memory management (view/delete saved context)
- Tool selection for different capabilities
- Pre-built and custom assistant templates

### 🏪 App Marketplace (In Development)
- Searchable app catalog
- Category filtering (Productivity, Multimedia, Utilities, Security, Development, Communication)
- Install/uninstall functionality
- App ratings and reviews

### ⚡ System Optimization (In Development)
- Storage cleanup tools
- Startup program manager
- Performance tuning options

### 🛡️ Security (In Development)
- Security dashboard with threat protection
- Firewall controls
- Privacy settings management

### 📥 Device Updates (In Development)
- Available updates list (security, drivers, firmware, features)
- Update history
- Priority-based update recommendations

### 💁 Support (In Development)
- Troubleshooting wizards
- Contact support
- Help documentation

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom Dell-inspired theme
- **React Router**: Client-side routing
- **Lucide React**: Beautiful, consistent icon set

## Design System

### Colors
- **Primary Blue**: #0076CE (Dell brand color)
- **Accent Blue**: #00A9E0
- **Success Green**: #6CC04A
- **Warning Orange**: #F5A623
- **Error Red**: #E31C3D
- **Neutral Grays**: #F8F9FA to #212529

### Typography
- Font: Roboto, Segoe UI
- Responsive sizing with clear hierarchy

### Components
- Reusable Button, Card, Badge, Modal components
- Circular and linear progress bars
- Accessible focus states and ARIA labels

## Prerequisites

Before running this project, ensure you have:
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Install Node.js** (if not already installed):
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
Start the development server with hot-reload:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
Create an optimized production build:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
ai-system-manager/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── layout/       # Layout components (Sidebar, Header, Layout)
│   │   ├── home/         # Home page components
│   │   ├── assistant/    # Personal Assistant components
│   │   ├── marketplace/  # App Marketplace components
│   │   └── common/       # Reusable UI components
│   ├── context/          # React Context providers
│   ├── data/             # Mock data files (JSON)
│   ├── pages/            # Page components
│   ├── styles/           # Global styles and CSS
│   ├── App.jsx           # Root component with routing
│   └── main.jsx          # Application entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # This file
```

## Key Features & Interactions

### Navigation
- **Collapsible Sidebar**: Click the chevron icon to collapse/expand
- **Route Highlighting**: Active route is highlighted in blue
- **Tooltips**: Hover over collapsed sidebar icons to see labels

### Home Dashboard
- **Optimize My PC**: Click to open optimization modal
- **Action Cards**: Click action buttons to navigate or perform tasks
- **Performance Modes**: Click to switch between modes
- **AI Examples**: Click to navigate to assistant with pre-filled query

### Mock Data
All data is stored in `src/data/*.json` files and can be easily modified:
- `mockSystemData.json` - PC health, recommendations, device stats
- `mockApps.json` - Marketplace applications
- `mockConversations.json` - Chat conversations
- `mockMemory.json` - AI memory items
- `mockAssistants.json` - Pre-built assistant templates
- `mockUpdates.json` - System updates

## Development Status

✅ **Completed**:
- Project setup and configuration
- Base layout and navigation
- Common reusable components
- Home/Dashboard page with full interactivity
- Mock data infrastructure

🚧 **In Progress**:
- Personal Assistant page
- App Marketplace
- System Optimization
- Security
- Device Updates
- Support

## Customization

### Changing Colors
Edit `tailwind.config.js` to modify the color palette.

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/layout/Sidebar.jsx`

### Modifying Mock Data
Edit JSON files in `src/data/` to change displayed content.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements

- Complete all remaining pages
- Add state persistence (localStorage)
- Implement real backend API integration
- Add unit and integration tests
- Accessibility improvements
- Responsive mobile layouts
- Dark mode support

## License

This is a prototype/mockup for demonstration purposes.

## Support

For questions or issues, please refer to the documentation or contact the development team.
