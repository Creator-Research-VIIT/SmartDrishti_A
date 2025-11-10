# SmartDrishti

A full-featured React application for managing projects with admin and student dashboards, interactive level pages, PDF export, and comprehensive project management tools.

## Features

- **Role-based Authentication**: Admin and Student roles with separate dashboards
- **Project Management**: Create, edit, and organize interactive project levels
- **Interactive Blocks**: API configuration, graphs, history, entry fields, and custom components
- **Drag & Drop**: Reorder levels and blocks with intuitive drag-and-drop
- **PDF Export**: Generate comprehensive project reports with screenshots
- **Real-time Data Visualization**: Chart.js integration for line, bar, and pie charts
- **Admin Dashboard**: Full CRUD operations for levels, users, and settings
- **Student Dashboard**: Browse projects, track progress, and complete assignments

## Tech Stack

- **React 18** (JSX)
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Context API** - State management
- **Chart.js + react-chartjs-2** - Data visualization
- **html2canvas + jsPDF** - PDF generation
- **@dnd-kit** - Drag and drop functionality
- **Axios** - HTTP requests

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Default Credentials

### Admin
- Username: `admin`
- Password: `Admin@123`

### Student
- Username: `student1`
- Password: `Student@123`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── blocks/         # Block components (TankGauge, charts, etc.)
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProfileMenu.jsx
│   └── ProjectCard.jsx
├── context/
│   └── AppContext.jsx  # Global state management
├── data/
│   ├── levels.json     # Seed data for levels
│   └── users.json      # Seed data for users
├── pages/
│   ├── Landing.jsx
│   ├── About.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── MyProjects.jsx
│   ├── LevelPage.jsx
│   └── Admin/          # Admin pages
│       ├── AdminDashboard.jsx
│       ├── ManageLevels.jsx
│       ├── LevelEditor.jsx
│       ├── ManageUsers.jsx
│       └── AdminProfile.jsx
├── App.jsx             # Main app component with routing
└── main.jsx            # Entry point
```

## Adding New Block Components

To add a new custom block component:

1. Create a new component file in `src/components/blocks/`:
   ```jsx
   // src/components/blocks/MyNewBlock.jsx
   const MyNewBlock = ({ config }) => {
     return <div>My Custom Block</div>
   }
   export default MyNewBlock
   ```

2. Update `AVAILABLE_BLOCKS` array in `src/pages/Admin/LevelEditor.jsx`:
   ```jsx
   const AVAILABLE_BLOCKS = ['TankGauge', 'MyNewBlock']
   ```

3. Import and use it in `src/pages/LevelPage.jsx`:
   ```jsx
   import MyNewBlock from '../components/blocks/MyNewBlock'
   // ... in render logic:
   if (block.component === 'MyNewBlock') {
     return <MyNewBlock config={block.config} />
   }
   ```

## Data Persistence

### LocalStorage

The app uses localStorage for:
- User authentication state
- Levels data (synced with seed data on first load)
- User accounts
- Completed projects

### Export/Import JSON

Admins can export levels to JSON and import them:

1. **Export**: Go to Admin Dashboard → Manage Levels → Click "Export JSON"
2. **Import**: Click "Import JSON" and select the JSON file

### Updating Seed Data

To update the initial seed data:

1. Export levels from the admin panel
2. Replace `src/data/levels.json` with the exported file
3. Clear browser localStorage to reset to seed data

## Routes

### Public Routes
- `/` - Landing page
- `/about` - About page
- `/login` - Login page
- `/signup` - Student signup

### Student Routes (Protected)
- `/dashboard` - Student dashboard with project grid
- `/my-projects` - Completed projects list
- `/level/:id` - Individual level/project page

### Admin Routes (Protected, Admin Only)
- `/admin` - Admin dashboard
- `/admin/levels` - Manage levels list
- `/admin/levels/new` - Create new level
- `/admin/levels/:id` - Edit existing level
- `/admin/users` - Manage users and admins
- `/admin/profile` - Admin profile and password change

## Block Types

### API Block
Configurable API key and template ID fields. Includes "Test HTTP Data" button for API testing.

### Graph Block
Supports line, bar, and pie charts with configurable variables, titles, and axes.

### History Block
Displays historical data entries with configurable variable name and max entries.

### Entry Block
Input field for students to set variable values.

### Custom Block
Uses predefined components from `src/components/blocks/`. Currently includes `TankGauge`.

## PDF Export

The PDF export feature:
- Captures the entire level page as a screenshot
- Includes student name, level name, and completion date
- Adds conclusion text (custom or default)
- Generates a downloadable PDF using jsPDF

## Development Notes

- **File Uploads**: In development, file uploads are simulated (stored as paths in localStorage). For production, implement actual file upload handling.
- **API Testing**: The "Test HTTP Data" button uses a dummy endpoint. Replace with your actual API endpoint in production.
- **Charts**: Charts use mock/sample data. Connect to real data sources in production.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is created for educational purposes.