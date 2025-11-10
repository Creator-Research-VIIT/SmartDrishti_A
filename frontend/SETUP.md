# IoT Portal Frontend - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your backend URLs
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:5173
   ```

## Environment Variables

Create a `.env` file in the `frontend` directory with:

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# Socket.io Server URL
VITE_SOCKET_URL=http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/        # React Context (Auth)
│   ├── pages/          # Page components
│   ├── services/        # API and Socket.io
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── __tests__/      # Unit tests
│   ├── App.tsx         # Main app with routes
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── .env                # Environment variables (create this)
├── .env.example        # Environment variables template
└── README.md           # Documentation
```

## Features Overview

### 1. Authentication
- JWT-based login and signup
- Protected routes
- Auto-logout functionality

### 2. Dashboard
- Overview of all templates
- Quick navigation to create/view templates

### 3. Templates Management
- Create templates with:
  - Connection Type (HTTP, MQTT, WebSocket)
  - Hardware selection (Arduino, ESP32, etc.)
  - Description
- Edit existing templates
- Delete templates
- View template details with devices

### 4. Device Management
- Add devices to templates
- Auto-generate API keys
- View device status (online/offline)
- Delete devices

### 5. Real-time Data Visualization
- Live data updates via Socket.io
- Interactive charts using Recharts
- Recent data table
- Real-time sensor readings

## Usage Flow

1. **Sign Up**: Create a new account
2. **Login**: Access your dashboard
3. **Create Template**: Define your IoT device template
4. **Add Device**: Add physical devices to your template
5. **Get API Key**: Save the generated API key
6. **Configure Hardware**: Use the API key in your Arduino/ESP code
7. **Monitor Data**: View real-time data on the device view page

## API Integration

This frontend expects a backend with the following endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/me`

### Templates
- `GET /api/templates`
- `GET /api/templates/:id`
- `POST /api/templates`
- `PUT /api/templates/:id`
- `DELETE /api/templates/:id`

### Devices
- `GET /api/devices?templateId=:id`
- `GET /api/devices/:id`
- `POST /api/devices`
- `DELETE /api/devices/:id`
- `GET /api/devices/:id/data`

### Socket.io
- Connect to socket with `deviceId` as query parameter
- Listen for `data` events

## Arduino Integration Example

After creating a device and getting your API key:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

// Your WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Your API details
const char* apiKey = "iot_your_api_key_here";
const char* serverUrl = "http://localhost:3000/api/devices/data";

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void loop() {
  float temperature = 25.5;  // Your sensor reading
  float humidity = 60.0;     // Your sensor reading
  
  // Create JSON payload
  String payload = "{\"temperature\":" + String(temperature) + 
                   ",\"humidity\":" + String(humidity) + "}";
  
  // Send data
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Authorization", "Bearer " + String(apiKey));
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    Serial.println("Data sent successfully");
  } else {
    Serial.println("Error sending data");
  }
  
  http.end();
  delay(5000);  // Send data every 5 seconds
}
```

## Troubleshooting

### CORS Errors
- Ensure backend has CORS enabled for `http://localhost:5173`
- Check `.env` file has correct API URL

### Socket Connection Issues
- Verify `VITE_SOCKET_URL` is correct
- Check backend Socket.io server is running
- Open browser console for connection errors

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Import Errors
- Ensure all imports use `@/` alias prefix
- Check `tsconfig.json` has correct path aliases

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

MIT License

