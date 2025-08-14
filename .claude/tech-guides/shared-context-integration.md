# Shared-Context-Server Integration Guide

**For:** Claude Multi-Agent Framework  
**Version:** 0.1.0  
**Last Updated:** 2025-08-14  
**Status:** Production Ready  

## Overview

The shared-context-server provides centralized memory storage and message coordination for multi-agent systems. This guide documents integration patterns for Claude Framework's 5-agent system based on comprehensive testing of the server's capabilities.

## Core Capabilities Summary

### Authentication & Identity System
- **JWT Tokens**: `sct_*` format with 1-hour expiry
- **Agent Identity**: Unique per `agent_id + agent_type` combination
- **Permissions**: `read`, `write` permissions (admin requires special setup)
- **Token Refresh**: Atomic refresh pattern prevents race conditions
- **Identity Persistence**: Agent memory persists across authentication cycles

### Message System
- **Visibility Levels**: 
  - `public`: All agents can see
  - `private`: Only sender can see
  - `agent_only`: All agents can see (cross-agent coordination)
  - `admin_only`: Requires special admin permissions
- **Search**: RapidFuzz fuzzy search (5-10x faster), supports typos, metadata search
- **Threading**: Parent-child message relationships (validation issues found in testing)
- **Performance**: Sub-second search, efficient message retrieval

### Memory System
- **Scoping**: Session-scoped vs Global memory isolation
- **TTL Support**: Precise timing, automatic cleanup
- **Organization**: Hierarchical key naming (`tasks.current.planning`)
- **Data Types**: Full JSON support (objects, arrays, primitives)
- **Isolation**: Complete memory isolation between agents
- **Prefix Search**: Efficient memory organization and retrieval

## Framework Integration Patterns

### Agent Identity Organization

```
Agent ID Pattern: claude_framework_{role}
Examples:
- claude_framework_developer
- claude_framework_tester  
- claude_framework_refactor
- claude_framework_docs
- claude_framework_coordinator
```

**Benefits:**
- Consistent naming across framework operations
- Clear role identification in logs and debugging
- Supports framework's 5-agent specialization model

### Memory Organization Patterns

#### 1. Global Agent Capabilities
```json
Key: "agent.capabilities"
Value: {
  "role": "developer",
  "max_file_size": 500,
  "languages": ["python", "typescript"],
  "skills": ["implementation", "debugging"]
}
```

#### 2. Session Workflow State
```json
Key: "workflow.state"
Session-scoped value: {
  "current_phase": "implementation", 
  "responsible_agent": "developer",
  "phase_history": ["planning", "implementation"],
  "estimated_completion": "2025-08-14T08:00:00Z"
}
```

#### 3. Task Organization
```json
Keys: "tasks.{category}.{item}"
Examples:
- "tasks.current.planning": {"phase": "requirements", "progress": 0.3}
- "tasks.current.implementation": {"files_modified": 3, "tests_passed": true}
- "tasks.history.last_completed": {"task_id": "feat_123", "completed_at": "..."}
```

#### 4. Agent Coordination
```json
Key: "coordination.handoff_state"
Value: {
  "from_agent": "developer",
  "to_agent": "tester", 
  "context": "implementation_complete",
  "handoff_time": "2025-08-14T07:00:00Z",
  "shared_artifacts": ["implementation_summary", "test_requirements"]
}
```

### Message Coordination Patterns

#### 1. Workflow Announcements (Public)
```
Visibility: public
Usage: Major workflow state changes, completion announcements
Example: "Phase Complete: Implementation finished, ready for testing"
```

#### 2. Agent Coordination (Agent-Only)  
```
Visibility: agent_only
Usage: Cross-agent communication, handoff coordination
Example: "Handoff: Developer passing control to tester with 3 files modified"
```

#### 3. Internal Notes (Private)
```
Visibility: private
Usage: Agent internal state, debugging, decision rationale
Example: "Internal: Considering refactor approach for performance optimization"
```

### Session Management for Framework Workflows

#### Multi-Phase Workflow Pattern
```
Session Structure:
1. Create session per major workflow (feature, bugfix, refactor)
2. Use session-scoped memory for workflow state
3. Public messages for milestone announcements  
4. Agent-only messages for coordination
5. Session cleanup after workflow completion
```

#### Concurrent Task Management
```
Pattern: One session per concurrent task
Benefits: 
- Complete isolation between parallel workflows
- Clear context boundaries
- Independent progress tracking
- Simplified error recovery
```

## Integration with Framework Commands

### framework-init Enhancement
```
Shared-Context Setup:
1. Initialize agent identities for 5-agent system
2. Set global agent capabilities in memory
3. Create shared MCP permissions configuration
4. Validate connectivity and permissions
```

### feature-planning Integration  
```
Session Management:
1. Create planning session with descriptive purpose
2. Store planning state in session memory
3. Use public messages for user-visible milestones
4. Agent-only messages for coordination between planning agents
```

### execute-prp Coordination
```
Multi-Agent Workflow:
1. Create execution session
2. Set workflow state in session memory
3. Each agent updates progress in memory
4. Handoff coordination via agent-only messages
5. Error recovery through message system
```

## Best Practices

### Memory Organization
- **Hierarchical Keys**: Use dot notation (`tasks.current.planning`)
- **Scoping Strategy**: Session for workflow state, Global for agent capabilities  
- **TTL Usage**: Short TTL for temporary state, permanent for persistent data
- **Prefix Organization**: Group related memories for efficient retrieval

### Message Strategy
- **Public**: User-facing milestones, workflow status
- **Agent-Only**: Cross-agent coordination, handoffs
- **Private**: Internal decision-making, debugging notes
- **Threading**: Use for related conversation flows (when validation issues resolved)

### Session Strategy
- **One Session Per Workflow**: Clear boundaries, independent progress
- **Descriptive Purposes**: Enable easy session identification
- **Session Memory**: Store workflow state, progress tracking
- **Cleanup**: Archive or cleanup completed workflow sessions

### Error Handling
- **Permission Errors**: Graceful fallback, clear error messages
- **Memory Not Found**: Check TTL expiration, validate keys
- **Session Isolation**: Verify correct session_id usage
- **Token Refresh**: Implement automatic refresh before expiry

## Security Considerations

### Memory Isolation
- **Agent Privacy**: Memory completely isolated between agents
- **Session Boundaries**: Session memory isolated from other sessions
- **Global vs Session**: Use session scope for sensitive workflow data

### Message Visibility
- **Private Messages**: Only sender can access, perfect for internal notes
- **Agent-Only**: Cross-agent but not user-visible coordination
- **Public Messages**: User-visible, appropriate for status updates

### Token Management
- **Refresh Strategy**: Proactive refresh before expiry
- **Secure Storage**: Handle tokens securely in framework
- **Permission Boundaries**: Respect read/write permission limitations

## Performance Characteristics

### Search Performance
- **RapidFuzz**: 5-10x faster than standard fuzzy search
- **Response Time**: Sub-second for typical message volumes
- **Fuzzy Tolerance**: 87.5% match for single character typos
- **Metadata Search**: Included in content search by default

### Memory Operations
- **TTL Precision**: Accurate to ~10 second precision
- **List Performance**: Efficient prefix-based filtering
- **Concurrent Access**: Handles concurrent operations gracefully
- **Race Conditions**: Built-in protections for memory operations

### Concurrency
- **Message Ordering**: Preserved under concurrent access
- **Memory Safety**: Overwrite protections prevent accidental data loss
- **Session Isolation**: Maintained under concurrent multi-agent load

## Limitations & Workarounds

### Current Limitations
1. **Threading Validation**: Parent message ID validation issues found
2. **Admin Permissions**: Limited admin-only message access
3. **Agent-Only Scope**: Same agent_type limitation (Claude agents can't see Gemini agent-only messages)

### Workarounds
1. **Threading**: Use metadata references instead of parent_message_id
2. **Admin Features**: Use private messages for privileged communications  
3. **Cross-Type Coordination**: Use public messages for cross-agent-type coordination

## Framework-Specific Helper Tools

### Recommended Tools to Build
1. **Setup Validator**: Verify shared-context connectivity and permissions
2. **Session Manager**: Create, list, cleanup framework workflow sessions
3. **Memory Inspector**: Debug memory organization and TTL issues
4. **Coordination Helper**: Streamline agent handoff patterns
5. **Search Debugger**: Test and debug fuzzy search queries

## Example Integration Code

### Agent Authentication
```python
async def authenticate_framework_agent(role: str) -> str:
    """Authenticate a framework agent and return token"""
    response = await shared_context.authenticate_agent(
        agent_id=f"claude_framework_{role}",
        agent_type="claude", 
        requested_permissions=["read", "write"]
    )
    return response["token"]
```

### Session Workflow Management
```python
async def create_workflow_session(purpose: str, initial_state: dict) -> str:
    """Create session and initialize workflow state"""
    session = await shared_context.create_session(purpose=purpose)
    await shared_context.set_memory(
        key="workflow.state",
        value=initial_state,
        session_id=session["session_id"],
        auth_token=agent_token
    )
    return session["session_id"]
```

### Agent Handoff Pattern
```python
async def handoff_to_agent(session_id: str, from_agent: str, to_agent: str, context: str):
    """Coordinate agent handoff with proper messaging"""
    # Update workflow state
    await shared_context.set_memory(
        key="coordination.handoff_state",
        value={
            "from_agent": from_agent,
            "to_agent": to_agent, 
            "context": context,
            "handoff_time": datetime.utcnow().isoformat()
        },
        session_id=session_id,
        overwrite=True,
        auth_token=agent_token
    )
    
    # Add coordination message
    await shared_context.add_message(
        session_id=session_id,
        content=f"Handoff: {from_agent} passing control to {to_agent}",
        visibility="agent_only",
        metadata={"handoff_context": context},
        auth_token=agent_token
    )
```

## Integration Checklist

### Framework Setup
- [ ] Configure MCP permissions for shared-context-server tools
- [ ] Implement agent authentication for 5-agent system
- [ ] Set up memory organization patterns
- [ ] Design session management strategy

### Command Integration
- [ ] Update framework-init to setup shared-context
- [ ] Integrate session creation in feature-planning
- [ ] Add coordination patterns to execute-prp
- [ ] Implement cleanup procedures for completed workflows

### Error Handling
- [ ] Implement token refresh logic
- [ ] Add graceful fallbacks for permission errors
- [ ] Handle memory TTL expiration
- [ ] Validate session isolation

### Testing & Validation
- [ ] Test agent identity persistence
- [ ] Validate memory isolation between agents
- [ ] Verify message visibility rules
- [ ] Test concurrent operation handling

---

## Next Steps

1. **Implement Core Patterns**: Start with agent authentication and memory organization
2. **Build Helper Tools**: Create setup validation and session management utilities  
3. **Framework Integration**: Update existing commands to leverage shared-context
4. **Testing**: Comprehensive testing of multi-agent coordination patterns
5. **Documentation**: User-facing guides for framework developers

This integration will significantly enhance Claude Framework's multi-agent coordination capabilities while maintaining the framework's simplicity and reliability principles.