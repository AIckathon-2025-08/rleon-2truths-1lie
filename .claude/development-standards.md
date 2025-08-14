# Development Rules & Standards

This document provides comprehensive development standards for the **Two Truths & A Lie Game** project, including code structure, testing, documentation, and integration guidelines for our React/Node.js real-time voting system.

## Code Structure & Modularity

### Critical File Size Limits
- **CRITICAL: Never exceed file size limits - 500 lines for React components, 300 lines for Node.js modules, 1000 lines for test files.** If a file approaches these limits:
  - Split into logical modules immediately
  - Use the refactor agent for systematic decomposition
  - Extract custom hooks, utilities, and constants
  - Create sub-components for complex React components

### React Component Organization
For complex React components this looks like:
- `Component.jsx` - Main component definition and JSX rendering (max 200 lines)
- `useComponent.js` - Custom hooks for state and Socket.io logic (max 200 lines)
- `utils.js` - Helper functions and data processing (max 150 lines)
- `types.js` - TypeScript type definitions (max 100 lines)

### Node.js Module Organization
For backend modules:
- `routes.js` - Express route definitions (max 200 lines)
- `sockets.js` - Socket.io event handlers (max 250 lines)
- `utils.js` - Helper functions and game logic (max 200 lines)
- `models.js` - Data validation and schemas (max 150 lines)

### Module Organization
- **Organize code into clearly separated modules**, grouped by feature or responsibility
- **Use clear, consistent imports** (ES6 imports, relative imports within packages)
- **Follow React/Node.js patterns**: Functional components with hooks, Express middleware patterns
- **Environment Configuration**: Use .env files with NODE_ENV, PORT, and SOCKET_PORT variables

## Testing & Reliability

### Test Coverage Requirements
- **Always create unit tests for new features** (React components, Express routes, Socket.io handlers)
- **After updating any logic**, check whether existing unit tests need to be updated. If so, do it
- **Frontend Tests**: Use Jest + React Testing Library in `/frontend/src/__tests__/`
- **Backend Tests**: Use Jest for API and Socket.io testing in `/backend/src/__tests__/`
  - Include at least:
    - 1 test for expected use
    - 1 edge case (Socket.io disconnection, invalid vote data)
    - 1 failure case

### Test IO Brand Validation
- **UI tests should validate Test IO branding** (color palette #1E40AF, #0891B2)
- **Use React Testing Library** for component testing
- **Socket.io Testing**: Mock WebSocket connections for reliable testing
- **Screenshot Tests**: Visual regression testing for brand compliance
- **Real-time Testing**: Test vote counting and live result updates

### Code Quality Enforcement
- **Frontend**: Run `npm run lint` (ESLint) and fix all blocking errors
- **Backend**: Run `npm run lint` (ESLint for Node.js) and fix all blocking errors  
- **Complexity warnings are non-blocking**: Note complexity issues but don't treat as blockers. **FIX ALL OTHER ERRORS**.
- **TypeScript**: Run `npm run type-check` and resolve all type annotations and errors
- **Prettier**: Use consistent code formatting across React and Node.js files
- **MANDATORY**: All agents that write code MUST validate lint and type compliance before checkpoints

## Agent Transparency & Escalation Standards

### Structured Status Reporting Requirements
**All agents must return structured status objects after each significant phase:**

```json
{
  "status": "SUCCESS|BLOCKED|NEEDS_INPUT|ARCHITECTURE_ISSUE|ERROR",
  "completed_tasks": ["specific tasks completed"],
  "blocked_on": "exact issue preventing progress",
  "files_modified": ["absolute file paths"],
  "research_used": ["context sources referenced"],
  "escalation_reason": "why user intervention needed",
  "next_steps": ["recommended actions"],
  "checkpoint_reached": "phase completion status"
}
```

### Universal Escalation Triggers
**Agents must STOP and escalate (never work around) when encountering:**

#### Critical Issues (Immediate Escalation)
- **Architecture Flaws**: Design issues requiring user decisions or major changes
- **Security Concerns**: Any security-related issues requiring user approval
- **Data Loss Risk**: Operations that could compromise data integrity
- **File Size Violations**: Code exceeding limits (500 lines code, 1000 lines tests) before refactoring
- **Integration Failures**: Components that fundamentally don't work together

#### Quality Issues (Escalate After Initial Investigation)
- **Test Failures**: Fundamental logic errors indicating deeper problems (not simple bugs)
- **Dependency Conflicts**: Missing dependencies that agents cannot resolve
- **Performance Issues**: Code changes causing significant performance degradation
- **Breaking Changes**: Changes that break existing APIs or functionality

#### Research & Context Issues (Escalate When Research Insufficient)
- **Insufficient Context**: Critical information missing that affects implementation decisions
- **Contradictory Requirements**: Conflicting specifications that need user clarification
- **Technology Gaps**: Technologies or patterns not covered in established tech guides

### Agent Coordination Patterns

#### Single Agent Tasks (Direct Execution)
- **Simple features** affecting 1-3 files
- **Bug fixes** with clear scope
- **Documentation updates**
- **Refactoring** within single components

#### Multi-Agent Coordination (task-coordinator)
- **Complex features** affecting 4+ files
- **Cross-component integration**
- **Architecture modifications**
- **Features requiring multiple specializations (dev + test + docs)**

## Integration & Architecture Standards

### Component Integration Requirements
- All features must integrate with existing architecture patterns
- Maintain consistency with established data handling approaches
- Support multi-component coordination when applicable
- Use UTC timestamps for all time-based functionality

### Service Integration Pattern
- Use established service integration patterns
- Implement provider fallback and error handling
- Ensure service context is preserved appropriately
- Include comprehensive integration testing

### Quality Integration Pattern
- Use existing quality infrastructure
- Follow established testing patterns
- Maintain code style and structure consistency
- Preserve context for future development

## Documentation Standards

### User-Facing Documentation Requirements
- **API Documentation**: Always include working examples
- **User Guides**: Step-by-step workflows for new features
- **Error Documentation**: Common issues and solutions
- **Integration Examples**: How features work with existing system

### Technical Documentation Requirements
- **Architecture Decisions**: Document significant architectural choices
- **Integration Patterns**: How components work together
- **Testing Approaches**: Explain testing strategies and patterns
- **Development Setup**: Keep setup instructions current

## Technology Stack Guidelines

### React/Node.js Framework Patterns
- **React**: Use functional components with hooks, Context API for state management
- **Express**: Use middleware patterns, proper route organization, error handling
- **Socket.io**: Clear event naming (kebab-case), proper room management
- **TailwindCSS**: Utility-first styling with Test IO color variables
- **Vite**: Fast development builds with proper asset optimization

### Real-time Communication Integration
- **Socket.io Patterns**: Use rooms for game sessions, emit to specific clients
- **Error Handling**: Graceful WebSocket reconnection and fallback strategies
- **Session Management**: Browser-based session IDs to prevent duplicate voting
- **State Synchronization**: Ensure all connected clients receive live updates

### Performance Standards
- **React Rendering**: Use React.memo and useMemo for expensive computations
- **Socket.io Events**: Debounce frequent events, avoid excessive re-renders
- **File Upload**: Efficient handling of candidate photos with size limits
- **Real-time Updates**: Minimize unnecessary Socket.io emissions
- **Memory Usage**: Clean up Socket.io listeners and prevent memory leaks

## Success Criteria

### Code Quality Success
- All ESLint and TypeScript checks pass without warnings
- File size limits are respected (500 lines React, 300 lines Node.js)
- Tests cover React components, Socket.io events, and vote counting logic
- Code follows React hooks patterns and Express middleware conventions

### Integration Success
- Real-time voting works seamlessly across all connected clients
- No regressions in Socket.io communication or game state management
- Test IO branding is consistent across all UI components
- Mobile-responsive design works on various screen sizes

### Documentation Success
- Game setup and voting flow documented for administrators
- Socket.io API events documented with examples
- Docker Compose setup instructions are clear and current
- Test IO brand guidelines are followed consistently

Remember: **Quality over speed, simplicity over complexity, working solutions over elegant plans**. When in doubt, escalate for user guidance rather than making assumptions about requirements or architecture.