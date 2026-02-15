# Deployment Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

## Deployment Steps

### 1. Copy Project Files
Transfer the entire `Onboarding` folder to the target machine.

### 2. Install Dependencies
Open a terminal in the project directory and run:
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
```

The build output will be in the `dist` folder.

### 5. Preview Production Build
To test the production build locally:
```bash
npm run preview
```

### 6. Deploy to Web Server
After building, deploy the contents of the `dist` folder to any static web hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps
- Any traditional web server (Apache, Nginx)

## Quick Start (One Command)
```bash
# Install and run in one go
npm install && npm run dev
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port.

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed.

### Build Errors
Clear the node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```
