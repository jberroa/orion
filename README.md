# Orion - Service Management Dashboard

Orion is a modern desktop application built with Electron, React, and TypeScript that provides a streamlined interface for managing and controlling multiple services across different Tomcat instances.

## Features

- 🚀 Service Management Dashboard
- 🔄 Real-time Service Status Monitoring
- 🐳 Container-based Service Deployment
- 📊 Build Progress Tracking
- 🔍 QA Environment Selection
- ⚡ Fast Service Building and Deployment
- 📝 Live Container Logs Viewing
- ⭐ Service Favoriting System

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v16 or higher)
- Podman (Required for container management)
- Git

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd orion
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the application in development mode:

```bash
npm run dev
```

This will start both the Electron process and the Vite dev server.

## Building

To build the application:

```bash
npm run build
```

## Usage

1. **QA Box Selection**: Select your QA environment from the dropdown menu.

2. **Service Management**:
   - Browse available services in the grid view
   - Toggle services on/off
   - Mark services as favorites
   - View service details and configurations

3. **Build & Deploy**:
   - Choose between building and running or just running services
   - Monitor build progress in real-time
   - View detailed build logs
   - Configure build options (skip tests, force update)

4. **Container Management**:
   - Monitor Tomcat container statuses
   - View live container logs
   - Start/stop containers as needed

## Architecture

The application uses a modern stack:

- **Frontend**: React + TypeScript + Vite
- **Desktop Runtime**: Electron
- **Container Technology**: Podman
- **UI Components**: Shadcn UI
- **State Management**: React Context
- **Routing**: React Router

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

