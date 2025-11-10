# IoT Portal Frontend

A modern web portal for managing IoT devices, templates, and real-time data visualization. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication**: JWT-based login and signup
- 📱 **Dashboard**: Centralized view for managing IoT templates
- 📋 **Templates**: Create and manage IoT device templates with different connection types (HTTP, MQTT, WebSocket)
- 🤖 **Devices**: Add devices to templates with automatic API key generation
- 📊 **Real-time Data**: Live data visualization using Socket.io
- 📈 **Charts**: Interactive line charts for data analysis
- 🎨 **Modern UI**: Clean and intuitive interface with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Recharts** - Chart visualization
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API server running (see backend setup)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your backend API URLs:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

The production build will be in the `dist` directory.

## Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Chart.tsx
│   │   ├── DeviceCard.tsx
│   │   ├── FormInput.tsx
│   │   ├── Layout.tsx
│   │   ├── Modal.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Table.tsx
│   │   └── TemplateCard.tsx
│   ├── context/          # React Context providers
│   │   └── AuthContext.tsx
│   ├── pages/            # Page components
│   │   ├── AddDevice.tsx
│   │   ├── CreatedTemplates.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DeviceView.tsx
│   │   ├── EditTemplate.tsx
│   │   ├── Login.tsx
│   │   ├── NewTemplate.tsx
│   │   └── Signup.tsx
│   ├── services/        # API and external services
│   │   ├── api.ts
│   │   └── socket.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   └── index.ts
│   ├── __tests__/       # Unit tests
│   ├── App.tsx          # Main app component with routes
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## API Integration

The frontend expects a backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register new user
- `GET /api/auth/me` - Get current user

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Devices
- `GET /api/devices` - Get devices (supports `?templateId=` query)
- `GET /api/devices/:id` - Get device by ID
- `POST /api/devices` - Create new device
- `DELETE /api/devices/:id` - Delete device
- `GET /api/devices/:id/data` - Get device data history

### Socket.io Events
- The backend should emit `data` events to the client with device data
- Client connects to socket.io server with deviceId as query parameter

## Usage Flow

1. **Sign Up / Login**: Create an account or sign in
2. **Create Template**: Define a new IoT template with connection type and hardware
3. **Add Device**: Add devices to your templates with automatic API key generation
4. **View Data**: Monitor real-time data from devices with charts and tables
5. **Manage**: Edit or delete templates and devices as needed

## Example API Key Usage

After creating a device, you'll receive an API key. Use this in your Arduino/ESP code:

```cpp
// Example with HTTP POST
String apiKey = "iot_your_api_key_here";
String data = "{\"temperature\":25.5,\"humidity\":60}";

httpClient.begin("http://localhost:3000/api/devices/data");
httpClient.addHeader("Authorization", "Bearer " + apiKey);
httpClient.addHeader("Content-Type", "application/json");
httpClient.POST(data);
```

## Troubleshooting

### CORS Issues
Make sure your backend server has CORS configured to allow requests from `http://localhost:5173`

### Socket Connection Issues
- Verify the `VITE_SOCKET_URL` in your `.env` file
- Ensure the backend Socket.io server is running
- Check browser console for connection errors

### API Errors
- Verify `VITE_API_BASE_URL` points to your backend
- Check that the backend API is running
- Ensure JWT token is properly stored in localStorage

## License

MIT
