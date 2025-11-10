# IoT Portal Frontend - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment
The `.env` file has been pre-configured. Update it if your backend runs on different ports:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### Step 3: Run Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 📋 What's Included

### ✅ Complete Features
- [x] Login & Signup with JWT authentication
- [x] Dashboard with template overview
- [x] Create/Edit/Delete Templates
- [x] Add devices with automatic API key generation
- [x] Real-time data visualization with Socket.io
- [x] Interactive charts (Recharts)
- [x] Recent data tables
- [x] Device status tracking
- [x] Responsive design
- [x] Clean modern UI

### ✅ All Components Created
- FormInput - Reusable form input
- Modal - Dialog modals
- Table - Data tables
- Chart - Line charts
- TemplateCard - Template display
- DeviceCard - Device display
- Layout - Main layout with nav
- ProtectedRoute - Route protection

### ✅ All Pages Created
- Login - Authentication
- Signup - User registration
- Dashboard - Main overview
- Created Templates - Template list
- New Template - Create template
- Edit Template - Edit existing
- Template Detail - Template with devices
- Add Device - Create device with API key
- Device View - Real-time data display

## 📚 Documentation

- **README.md** - Complete documentation
- **SETUP.md** - Detailed setup guide
- **PROJECT_SUMMARY.md** - Full project overview
- **QUICK_START.md** - This file

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🔗 Backend Integration

Make sure your backend is running on `http://localhost:3000` with these endpoints:

### Required Endpoints
- POST /api/auth/login
- POST /api/auth/signup
- GET /api/templates
- GET /api/templates/:id
- POST /api/templates
- PUT /api/templates/:id
- DELETE /api/templates/:id
- GET /api/devices?templateId=:id
- GET /api/devices/:id
- POST /api/devices
- DELETE /api/devices/:id

### Socket.io
- Server on / path
- Accept deviceId as query param
- Emit 'data' events to clients

## 🎨 UI Features

- Modern, clean design
- Similar to Blynk/Thingspeak
- Color-coded connection types:
  - Green for HTTP
  - Blue for MQTT
  - Purple for WebSocket
- Online/Offline status indicators
- Responsive grid layouts
- Smooth transitions

## 💡 Usage Flow

1. **Sign Up** → Create account
2. **Login** → Access dashboard**
3. **New Template** → Define IoT template
4. **Created Templates** → View all templates
5. **Template Detail** → View template & devices
6. **Add Device** → Create device with API key
7. **Device View** → Monitor real-time data

## 📝 Notes

- API keys are shown only once when creating a device
- Copy and save API keys immediately
- Use API keys in your Arduino/ESP code to send data
- Real-time data updates via Socket.io
- Charts automatically update with new data

## 🛠️ Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Lint code

## ✨ Ready to Use!

Everything is set up and ready. Just run `npm install` and `npm run dev`!

---

**Created with ❤️ using React, TypeScript, and Tailwind CSS**
