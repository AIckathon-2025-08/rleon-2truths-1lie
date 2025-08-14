# Docker Containerization - Professional Development & Production Setup

**Planning Document**: Docker Multi-Container Architecture  
**Date**: 2025-08-14  
**Status**: Planning Phase  
**Priority**: High - Competition Enhancement

## 🎯 Overview

Transform the Two Truths & A Lie game into a professional, containerized application with robust development and production environments. This setup will demonstrate enterprise-level deployment knowledge while maintaining simplicity for competition demo purposes.

## 🏗️ Architecture Strategy

### Multi-Container Architecture
- **Frontend Container**: React + Vite (dev) → nginx (prod)
- **Backend Container**: Node.js + Express + Socket.io
- **Philosophy**: Simple for demo, easily configurable for deployment
- **Compatibility**: Support both `docker-compose` and `docker compose` commands

### Container Communication
- Internal Docker network for service-to-service communication
- nginx reverse proxy for API routing and static file serving
- WebSocket support for Socket.io real-time features
- Persistent volumes for candidate photo uploads

## 📦 Environment Configurations

### Development Environment (`docker-compose.dev.yml`)

**Frontend Development Container:**
- Vite development server with hot module replacement
- Port 5173 exposed for direct access
- Volume mount: `./frontend:/app` for live code changes
- Node.js with development dependencies

**Backend Development Container:**
- Node.js with nodemon for automatic restarts
- Port 3000 exposed for API access
- Volume mount: `./backend:/app` for live code changes
- Bind mount: `./backend/uploads:/app/uploads` for file persistence

**Development Features:**
- Hot reload for both frontend and backend
- Debug port exposure for debugging tools
- Development-optimized images with full toolchain
- Live log streaming for debugging

### Production Environment (`docker-compose.prod.yml`)

**Frontend Production Container:**
- Multi-stage Dockerfile: Node.js build stage → nginx runtime
- Static file optimization and compression
- nginx configuration for API proxy and WebSocket support
- Security headers and performance optimizations

**Backend Production Container:**
- Production Node.js with minimal dependencies only
- Health checks for container monitoring
- Non-root user for security
- Alpine Linux base for minimal attack surface

**Production Features:**
- Multi-stage builds for minimal image sizes
- Health checks and automatic restart policies
- Named volumes for persistent data
- Security hardening (non-root users, minimal images)

### Demo Environment (`docker-compose.demo.yml`)

**Competition-Optimized Setup:**
- Fast startup time for judge evaluation
- Clear, readable logging output
- Easy reset capability between demos
- Pre-built images for instant deployment

## 📁 Implementation Plan

### Phase 1: Core Docker Files (2-3 hours)

**Frontend Dockerfile (`frontend/Dockerfile`)**
```dockerfile
# Multi-stage build approach
# Stage 1: Build React application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile (`backend/Dockerfile`)**
```dockerfile
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js
CMD ["node", "server.js"]
```

**nginx Configuration (`nginx.conf`)**
```nginx
server {
    listen 80;
    server_name localhost;
    
    # Serve React static files
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket support for Socket.io
    location /socket.io/ {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Serve uploaded files
    location /uploads/ {
        proxy_pass http://backend:3000/uploads/;
    }
}
```

### Phase 2: Docker Compose Configurations (1 hour)

**Development Compose (`docker-compose.dev.yml`)**
- Volume mounts for hot reload
- Environment variables for development
- Port mappings for direct access
- Network configuration for service communication

**Production Compose (`docker-compose.prod.yml`)**
- Immutable containers (no volume mounts)
- Health checks and restart policies
- Named volumes for data persistence
- Security and performance optimizations

**Demo Compose (`docker-compose.demo.yml`)**
- Optimized for competition demonstration
- Fast startup and clear logging
- Easy cleanup and reset capabilities

### Phase 3: Just Command Integration (1 hour)

**Cross-Compatible Just Commands:**
```bash
# Docker detection and compatibility
docker-command := if `command -v docker-compose >/dev/null 2>&1` == "0" { "docker-compose" } else { "docker compose" }

# Development commands
docker-dev:
    {{ docker-command }} -f docker-compose.dev.yml up --build

docker-prod:
    {{ docker-command }} -f docker-compose.prod.yml up --build

docker-demo:
    {{ docker-command }} -f docker-compose.demo.yml up --build

# Utility commands
docker-build:
    {{ docker-command }} -f docker-compose.prod.yml build

docker-logs service="":
    if [ -z "{{ service }}" ]; then {{ docker-command }} -f docker-compose.dev.yml logs -f; else {{ docker-command }} -f docker-compose.dev.yml logs -f {{ service }}; fi

docker-clean:
    {{ docker-command }} down --volumes --remove-orphans --rmi local
    docker system prune -f

docker-restart:
    {{ docker-command }} restart
```

## 🛠️ Technical Specifications

### Port Configuration
- **Development**: Frontend (5173), Backend (3000)
- **Production**: nginx (80), Backend (internal only)
- **Demo**: nginx (8080) for conflict avoidance

### Volume Management
- **Development**: Source code bind mounts for live editing
- **Production**: Named volumes for data persistence
- **Uploads**: Persistent volume for candidate photos across restarts

### Security Considerations
- Non-root users in all production containers
- Minimal Alpine Linux base images
- No secrets in Docker files (environment variables)
- Network isolation between containers

### Performance Optimizations
- Multi-stage builds to minimize image sizes
- nginx for efficient static file serving
- Docker layer caching for faster builds
- Health checks for container monitoring

## 🎯 Competition Advantages

### Professional Demonstration
- **Enterprise Architecture**: Microservices with reverse proxy
- **Modern Tooling**: Docker Compose + Just integration
- **Cross-Platform**: Works on any machine with Docker
- **Production Ready**: Real deployment patterns demonstrated

### Judge-Friendly Features
- **One-Command Demo**: `just docker-demo` starts everything
- **Fast Reset**: `just docker-clean && just docker-demo` for fresh runs
- **Clear Documentation**: Self-explaining commands and configurations
- **Robust Operation**: Health checks and automatic restarts

### Technical Sophistication
- Multi-stage Docker builds showing optimization knowledge
- nginx reverse proxy configuration expertise
- Volume management and data persistence
- Security best practices implementation

## 📋 Integration with Existing Architecture

### Current System Compatibility
- Maintains all existing React + Node.js functionality
- Preserves Socket.io real-time voting features
- Compatible with TestIO branding and styling
- Works with file upload system for candidate photos

### Development Workflow Integration
- Extends existing Just commands seamlessly
- Maintains hot reload development experience
- Compatible with current testing and linting setup
- Works alongside Theme System (Track A) and Celebration System (Track B)

### Environment Variable Management
```bash
# Development environment
REACT_APP_API_URL=http://localhost:3000
NODE_ENV=development
PORT=3000

# Production environment  
REACT_APP_API_URL=/api
NODE_ENV=production
PORT=3000
```

## 📈 Success Criteria

### Development Environment Success
- [ ] Hot reload working for both frontend and backend
- [ ] File uploads persist correctly with volume mounts
- [ ] Socket.io real-time features work across containers
- [ ] Debug capabilities available and functional

### Production Environment Success
- [ ] Multi-stage builds create optimized images
- [ ] nginx serves static files and proxies API correctly
- [ ] WebSocket connections work through proxy
- [ ] Health checks monitor container status correctly

### Competition Demo Success
- [ ] `just docker-demo` starts complete application in under 30 seconds
- [ ] All game functionality works identically to local development
- [ ] Easy cleanup and restart between demo runs
- [ ] Clear logs and error messages for debugging

### Cross-Platform Compatibility
- [ ] Works with both `docker-compose` and `docker compose`
- [ ] Functions identically on macOS, Linux, and Windows
- [ ] No platform-specific dependencies or configurations
- [ ] Consistent behavior across different Docker versions

## 🚀 Next Steps

1. **Implementation Phase**: Create all Docker files and configurations
2. **Testing Phase**: Validate development and production environments
3. **Integration Phase**: Integrate with existing Just command workflow
4. **Documentation Phase**: Update README with Docker setup instructions
5. **Competition Prep**: Optimize demo configuration for judge evaluation

This Docker setup will transform the Two Truths & A Lie game into a professional, enterprise-ready application that demonstrates advanced deployment knowledge while maintaining the simplicity and functionality required for effective competition demonstration.