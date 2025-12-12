# StayLats Client

## Description

The StayLats Client is a modern, responsive web application built with React that serves as the primary user-facing interface for the StayLats platform. It provides an intuitive experience for users to interact with the platform's services, featuring real-time updates, dynamic routing, and a component-based architecture.

## Technical Architecture

### Frontend Stack

- **React 18** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **TanStack Query (React Query)** - Server state management and data fetching
- **Socket.io Client** - Real-time bidirectional communication
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-ui** - Accessible component library built on Radix UI
- **React Hook Form** - Form state management with validation
- **Zod** - Schema validation

### Infrastructure

#### Development Environment

- **Container**: Node.js 20 Alpine-based Docker container
- **Dev Server**: Vite development server running on port 8080
- **Hot Module Replacement**: Enabled for instant development feedback
- **Network**: Connected to `staylats-network` Docker network
- **Volume Mounting**: Source code mounted for live reloading

#### Production Environment

- **Multi-Stage Docker Build**:
  1. **Dependencies Stage**: Installs npm packages
  2. **Builder Stage**: Compiles TypeScript and builds static assets
  3. **Runner Stage**: Nginx Alpine container serving static files

- **Web Server**: Nginx serving pre-built static assets
- **Port**: 80 (internal container port)
- **Health Checks**: Configured with wget-based health endpoint
- **Scaling**: Supports horizontal scaling with multiple replicas (load balancing via Nginx upstream)

#### Reverse Proxy Configuration

- **Nginx Reverse Proxy**: Routes traffic to client service
- **Development**: Proxies to Vite dev server on port 8080
- **Production**: Proxies to Nginx container on port 80
- **Load Balancing**: Least-connection algorithm for multiple instances
- **WebSocket Support**: Configured for Socket.io real-time connections
- **Gzip Compression**: Enabled for optimized asset delivery
- **Static Asset Caching**: Long-term caching for immutable assets (1 year)
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

#### Network Architecture

- **Service Discovery**: Docker Compose service networking
- **API Communication**: RESTful API calls to `/api` endpoint
- **Real-time Communication**: WebSocket connections via `/socket.io` endpoint
- **Service Dependencies**: Depends on API service for backend functionality

#### Build & Deployment

- **Build Process**: Production builds generate optimized static assets in `/dist`
- **Asset Optimization**: Vite handles code splitting, tree shaking, and minification
- **Container Registry**: Ready for deployment to container orchestration platforms
- **Resource Limits**: Configured CPU and memory limits for production containers
