# PRP-002: Docker Containerization - Professional Multi-Environment Setup

**Feature**: Docker Multi-Container Architecture with Real-Time Voting Support  
**Generated**: 2025-08-14  
**Planning Source**: `PRPs/1-planning/2-DOCKER-CONTAINERIZATION-SETUP.md`  
**Estimated Effort**: 4-5 hours  
**Complexity**: **Moderate-to-Complex** (8-12 files affected)  

## Research Context & Real-Time Voting Analysis

### Research Integration from Planning Phase
Comprehensive analysis of Docker containerization strategy for the Two Truths & A Lie real-time voting game:

**Planning Document Analysis** (`PRPs/1-planning/2-DOCKER-CONTAINERIZATION-SETUP.md`)
- **Multi-container architecture**: Frontend (nginx) + Backend (Node.js) + cross-compatibility strategy
- **Three environment approach**: Development (hot reload), Production (optimized), Demo (competition)
- **Competition focus**: Judge-friendly demos with `just docker-demo` command
- **Technical sophistication**: Enterprise-level deployment patterns demonstration

**Docker Best Practices Research** (GitHub analysis)
- **Multi-stage builds**: `lumenwrites/django-react-blog` demonstrates effective React → nginx pattern
- **nginx Proxy Configuration**: Proven WebSocket upgrade header handling for real-time features
- **Volume Management**: Separation between development bind mounts and production named volumes
- **Security Patterns**: Non-root users, Alpine base images, minimal attack surface

**Socket.io WebSocket Integration Research**
- **nginx WebSocket Proxy**: Required headers for proper Socket.io handshake and upgrade
- **Container Networking**: Internal service communication with external port exposure
- **Real-time Communication**: Preserved WebSocket connections through reverse proxy
- **Development Parity**: Container networking must not break existing Socket.io events

### Current System Architecture Analysis
**Existing Two Truths & A Lie Foundation**
- React 18 frontend with TailwindCSS v4 and TestIO brand integration
- Node.js backend with Express + Socket.io real-time voting system
- File upload system for candidate photos (`backend/uploads/` directory)
- Just command runner with modern development workflow
- Professional quality tools (formatting, linting, security audits)

**Real-Time Voting Integration Points**
- **Socket.io Events**: `join-game`, `cast-vote`, `reveal-answer`, `vote-update`, `answer-reveal`
- **Game State Management**: In-memory voting session data with session-based duplicate prevention
- **WebSocket Communication**: Real-time vote broadcasts and answer reveal coordination
- **File Upload Handling**: Candidate photo persistence across container restarts

### Architectural Scope Assessment
**Moderate-to-Complex Feature Classification** - 8-12 files affected:
- 3 Docker files (frontend, backend, nginx configuration)
- 3 Docker Compose files (development, production, demo environments)
- 2 build optimization files (.dockerignore files)
- 2-3 integration files (Just commands, health checks)
- 1 environment configuration strategy

## Voting Game Implementation Specification

### Core Requirements: Professional Container Architecture
Transform the functional Two Truths & A Lie game into a professionally containerized application while preserving all real-time voting capabilities:

1. **Multi-Container Architecture**: Frontend nginx + Backend Node.js + internal networking
2. **Real-Time WebSocket Support**: nginx proxy configuration for Socket.io voting features
3. **Cross-Platform Compatibility**: Support both `docker-compose` and `docker compose` via Just
4. **Competition Demonstration**: Fast startup and reliable demo capabilities for judges

### Technical Implementation Phases

#### Phase 1: Core Docker Files Foundation (1-2 hours)
**Priority**: HIGH - Foundation for all container functionality

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
# Multi-stage build: React build → nginx serve
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --silent
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --silent && npm cache clean --force
COPY . .
RUN mkdir -p uploads && chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"
CMD ["node", "server.js"]
```

**nginx Configuration** (`nginx.conf`):
```nginx
server {
    listen 80;
    server_name localhost;
    
    # Serve React static files
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Enable gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://backend:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket support for Socket.io (CRITICAL for real-time voting)
    location /socket.io/ {
        proxy_pass http://backend:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Serve uploaded candidate photos
    location /uploads/ {
        proxy_pass http://backend:3000/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Success Criteria**: Container images build successfully and nginx configuration validates

#### Phase 2: Multi-Environment Docker Compose (1-2 hours)
**Priority**: HIGH - Environment-specific orchestration

**Development Compose** (`docker-compose.dev.yml`):
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      target: builder
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      - REACT_APP_API_URL=http://localhost:3000
    command: npm run dev
    depends_on:
      - backend

  backend:
    build: ./backend
    volumes:
      - ./backend:/app
      - /app/node_modules
      - ./backend/uploads:/app/uploads
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
    command: npm run dev

networks:
  default:
    name: twotruths-dev
```

**Production Compose** (`docker-compose.prod.yml`):
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    restart: unless-stopped
    depends_on:
      backend:
        condition: service_healthy

  backend:
    build: ./backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - uploads-data:/app/uploads
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  uploads-data:

networks:
  default:
    name: twotruths-prod
```

**Competition Demo Compose** (`docker-compose.demo.yml`):
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    restart: "no"

  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - demo-uploads:/app/uploads
    restart: "no"

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - frontend
      - backend
    restart: "no"

volumes:
  demo-uploads:
    driver: local

networks:
  default:
    name: twotruths-demo
```

**Success Criteria**: All three environments start correctly and preserve Socket.io functionality

#### Phase 3: Just Command Integration (30-60 minutes)
**Priority**: MEDIUM - Developer experience and cross-compatibility

**Just Command Extensions** (add to existing `justfile`):
```bash
# Docker compatibility detection
docker-command := if `command -v docker-compose >/dev/null 2>&1` == "0" { "docker-compose" } else { "docker compose" }

# Development Environment
docker-dev:
    @echo "🐳 Starting development containers with hot reload..."
    {{ docker-command }} -f docker-compose.dev.yml up --build

docker-dev-logs service="":
    @if [ -z "{{ service }}" ]; then \
        {{ docker-command }} -f docker-compose.dev.yml logs -f; \
    else \
        {{ docker-command }} -f docker-compose.dev.yml logs -f {{ service }}; \
    fi

# Production Environment  
docker-prod:
    @echo "🚀 Starting production containers..."
    {{ docker-command }} -f docker-compose.prod.yml up --build -d

docker-prod-logs:
    {{ docker-command }} -f docker-compose.prod.yml logs -f

# Competition Demo
docker-demo:
    @echo "🏆 Starting competition demo..."
    @echo "Demo will be available at http://localhost:8080"
    {{ docker-command }} -f docker-compose.demo.yml up --build

# Utility Commands
docker-build env="prod":
    @if [ "{{ env }}" = "dev" ]; then \
        {{ docker-command }} -f docker-compose.dev.yml build; \
    elif [ "{{ env }}" = "demo" ]; then \
        {{ docker-command }} -f docker-compose.demo.yml build; \
    else \
        {{ docker-command }} -f docker-compose.prod.yml build; \
    fi

docker-clean:
    @echo "🧹 Cleaning up Docker containers, volumes, and images..."
    {{ docker-command }} -f docker-compose.dev.yml down --volumes --remove-orphans 2>/dev/null || true
    {{ docker-command }} -f docker-compose.prod.yml down --volumes --remove-orphans 2>/dev/null || true
    {{ docker-command }} -f docker-compose.demo.yml down --volumes --remove-orphans 2>/dev/null || true
    docker system prune -f

docker-restart env="dev":
    @if [ "{{ env }}" = "prod" ]; then \
        {{ docker-command }} -f docker-compose.prod.yml restart; \
    elif [ "{{ env }}" = "demo" ]; then \
        {{ docker-command }} -f docker-compose.demo.yml restart; \
    else \
        {{ docker-command }} -f docker-compose.dev.yml restart; \
    fi

docker-stop env="all":
    @if [ "{{ env }}" = "all" ]; then \
        {{ docker-command }} -f docker-compose.dev.yml down 2>/dev/null || true; \
        {{ docker-command }} -f docker-compose.prod.yml down 2>/dev/null || true; \
        {{ docker-command }} -f docker-compose.demo.yml down 2>/dev/null || true; \
    else \
        {{ docker-command }} -f docker-compose.{{ env }}.yml down; \
    fi
```

**Success Criteria**: Cross-platform compatibility verified and commands integrate seamlessly

#### Phase 4: Testing & Validation (60-90 minutes)
**Priority**: CRITICAL - Real-time functionality and competition readiness

**Integration Testing Requirements**:
- Socket.io real-time voting works through nginx proxy
- File upload persistence across container restarts  
- Hot reload functionality in development environment
- Competition demo startup time under 30 seconds
- Cross-platform compatibility (docker-compose vs docker compose)

**Testing Protocol**:
1. **Development Environment**: Verify hot reload and real-time voting
2. **Production Environment**: Validate nginx proxy and WebSocket handling
3. **Demo Environment**: Test competition startup and cleanup procedures
4. **Cross-Platform**: Validate on systems with different Docker Compose versions

## Integration Requirements

### Socket.io Real-Time Communication
**WebSocket Proxy Configuration**:
- nginx must properly handle WebSocket upgrade headers for Socket.io
- Container networking must preserve real-time event broadcasting
- Client-server WebSocket handshake must work through reverse proxy
- Existing voting events (`cast-vote`, `vote-update`, `reveal-answer`) must function identically

**Environment Variable Strategy**:
```bash
# Development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3000

# Production  
REACT_APP_API_URL=/api
REACT_APP_SOCKET_URL=/
```

### File Upload System Integration
**Volume Management**:
- Development: Bind mount `./backend/uploads:/app/uploads` for immediate access
- Production: Named volume `uploads-data:/app/uploads` for persistence
- Demo: Temporary volume `demo-uploads:/app/uploads` for clean resets

**Security Considerations**:
- Container runs as non-root user `nodejs:nodejs`
- Upload directory permissions set correctly during build
- File upload size limits preserved from existing implementation

### TestIO Brand Asset Handling
**Static Asset Strategy**:
- nginx serves optimized React build with TailwindCSS v4 assets
- Gzip compression for CSS and JavaScript bundles
- Proper cache headers for TestIO brand assets
- Font and image assets served efficiently

### Just Command Workflow Integration
**Preserved Development Experience**:
- Existing `just dev` continues to work for local development
- New `just docker-dev` provides containerized development option
- All quality commands (`just check`, `just format`, `just lint`) work with containers
- Competition commands (`just docker-demo`) provide judge-friendly experience

## Coordination Strategy

### **STRONG RECOMMENDATION: task-coordinator Required**

**Justification for Complex Coordination**:
- **8-12 files affected** across frontend, backend, and infrastructure
- **Multi-phase dependencies**: Docker files → Compose configs → Just integration → Testing
- **Integration risk**: nginx WebSocket proxy configuration is critical for real-time voting
- **Cross-platform complexity**: Both `docker-compose` and `docker compose` support required
- **Competition critical**: Reliability essential for judge demonstrations

### Multi-Phase Coordination Approach

**Phase Dependencies**:
1. **Phase 1 Docker Files** → **Phase 2 Compose Configs** → **Phase 3 Just Integration** → **Phase 4 Testing**
2. Each phase has **mandatory integration testing** before proceeding
3. **WebSocket functionality validation** required at Phases 1, 2, and 4
4. **Cross-platform compatibility** testing at Phases 3 and 4

**Risk Mitigation Strategy**:
- **WebSocket Proxy Validation**: Test Socket.io connections through nginx at each phase
- **File Upload Persistence**: Validate candidate photo handling across container restarts
- **Development Workflow Preservation**: Ensure hot reload works correctly in containerized environment
- **Competition Demo Reliability**: Multiple demo run-throughs with cleanup testing

**Quality Gates**:
- **Real-Time Functionality**: All Socket.io voting events must work through nginx proxy
- **Environment Parity**: Development, production, and demo environments must behave consistently
- **Cross-Platform Testing**: Verify compatibility with both Docker Compose versions
- **Competition Readiness**: Demo startup under 30 seconds with reliable operation

## Quality Requirements

### Real-Time Voting System Testing
**Socket.io Integration Testing**: Verify all WebSocket events work correctly through nginx proxy
**Multi-Browser Testing**: Validate real-time voting across multiple connected browsers
**Container Network Testing**: Ensure internal service communication preserves real-time features
**Load Testing**: Validate WebSocket connection handling under multiple concurrent votes

### TestIO Brand & Professional Standards
**Brand Compliance**: TestIO color palette and styling preserved through containerized serving
**Performance Testing**: nginx static asset serving performance meets professional standards
**Security Validation**: Container security best practices (non-root users, minimal images)
**Professional Demonstration**: Judge-friendly commands and reliable demo capabilities

### Competition Demo Requirements
**Startup Performance**: Complete demo environment ready in under 30 seconds
**Reliability Testing**: Multiple demo cycles without failure or degradation
**Reset Capability**: Clean environment reset between demo runs
**Error Handling**: Clear error messages and graceful failure modes

## Success Criteria

### Functional Success
**Real-Time Voting Preservation**:
- [ ] All Socket.io events work correctly through nginx proxy
- [ ] WebSocket connections establish and maintain properly in containers
- [ ] Vote casting and result broadcasting function identically to local development
- [ ] Answer reveal functionality works across all connected clients

**Multi-Environment Success**:
- [ ] Development environment preserves hot reload for both frontend and backend
- [ ] Production environment serves optimized builds with proper nginx configuration
- [ ] Demo environment starts quickly and operates reliably for judge evaluation
- [ ] File upload persistence works correctly across all environments

### Integration Success
**Container Architecture**:
- [ ] Frontend nginx serves React static assets efficiently
- [ ] Backend Node.js handles API requests and Socket.io connections correctly
- [ ] Container networking preserves all existing application functionality
- [ ] Volume management maintains file upload data across restarts

**Development Workflow Integration**:
- [ ] Just commands integrate seamlessly with existing development workflow
- [ ] Cross-platform compatibility works with both `docker-compose` and `docker compose`
- [ ] Quality tools (`just check`, `just format`, `just lint`) work with containerized code
- [ ] Docker commands provide professional alternative to local development

### Competition Demonstration Success
**Judge-Friendly Operation**:
- [ ] `just docker-demo` starts complete application in under 30 seconds
- [ ] All Two Truths & A Lie game functionality works identically in containers
- [ ] Demo environment resets cleanly between presentations
- [ ] Error messages are clear and helpful for troubleshooting

**Professional Architecture Demonstration**:
- [ ] Multi-container architecture showcases enterprise deployment patterns
- [ ] nginx reverse proxy configuration demonstrates advanced technical knowledge
- [ ] Docker security best practices (non-root users, minimal images) are evident
- [ ] Cross-platform compatibility shows professional development consideration

---

## Dependencies & Prerequisites

**Required Software**:
- Docker Engine (any recent version)
- Docker Compose (standalone) OR Docker with compose plugin
- Just command runner (already installed)
- Existing Two Truths & A Lie application (fully functional)

**System Requirements**:
- Sufficient memory for multi-container architecture (2GB+ available)
- Network ports 80, 3000, 5173, 8080 available for container exposure
- File system support for Docker volumes and bind mounts

**Implementation Prerequisites**:
- Current application must be fully functional with real-time voting
- TestIO branding and styling must be working correctly
- Just command integration must be established
- Socket.io WebSocket communication must be reliable

---

## Implementation Timeline

**Total Effort**: 4-5 hours with task-coordinator orchestration  
**Recommended Timeline**: 1-2 days with proper testing and validation  
**Critical Path**: Docker files → Compose configs → Just integration → Competition testing

**Phase Checkpoints**:
1. **Hour 1-2**: Phase 1 complete with functional Docker containers
2. **Hour 2-3**: Phase 2 complete with all three environments operational  
3. **Hour 3-4**: Phase 3 complete with Just command integration
4. **Hour 4-5**: Phase 4 complete with comprehensive testing and competition readiness

This Docker containerization transforms the Two Truths & A Lie game into a **professionally deployable application** that demonstrates enterprise-level technical knowledge while preserving all real-time voting functionality and maintaining judge-friendly demo capabilities for competition success.