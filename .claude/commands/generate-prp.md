# Generate Product Requirement Prompt (PRP) - Two Truths & A Lie Game

Transform planning output into comprehensive, implementation-ready PRPs for the Two Truths & A Lie voting game system that preserve research context and provide intelligent coordination for real-time voting architecture.

## Planning File: $ARGUMENTS

Input: Planning documents from `PRPs/1-planning/`  
Output: Implementation-ready PRPs in `PRPs/2-prps/{{ PRP.NUMBER }}_feature-name.md`

## 🎯 Comprehensive PRP Generation Philosophy

**Core Principle**: Create rich, context-aware PRPs that provide enough information for intelligent coordination without requiring user routing decisions. Every PRP should contain sufficient context for agents to make intelligent decisions about scope, complexity, and architectural integration requirements.

### Research-First Approach

All PRPs are generated with comprehensive research and context analysis:

1. **Planning Context Integration**: Extract all research, decisions, and constraints from planning documents
2. **Architectural Context**: Analyze integration requirements with existing components and systems
3. **MCP Research Integration**: Incorporate relevant research findings from Crawl4AI, Octocode, and SequentialThinking
4. **Codebase Analysis**: Understand existing patterns, integration points, and architectural dependencies
5. **Quality Context**: Include testing approaches, documentation requirements, and validation needs

### Real-Time Voting Architecture Integration

All PRPs are generated with the Two Truths & A Lie game's real-time voting architecture in mind:
- **Socket.io Integration**: Real-time WebSocket communication for live voting updates
- **Game State Management**: In-memory voting state with session-based duplicate prevention
- **React Component Coordination**: Frontend voting interface with live results updates
- **Test IO Brand Compliance**: Professional blue/teal color palette and clean layouts

## 📋 PRP Generation Process

### Phase 1: Planning Analysis & Context Extraction (10-15 min)

#### 1. Deep Planning Analysis
```markdown
- **Read planning document completely**
- **Extract research context** (what investigations were already done)
- **Identify architectural scope** (component integration requirements)
- **Understand user requirements** and success criteria
- **Note constraints and dependencies** identified during planning
```

#### 2. MCP Research Integration  
```markdown
- **Crawl4AI**: Integrate relevant framework documentation research
- **Octocode**: Include proven implementation patterns from similar features
- **SequentialThinking**: Incorporate architectural decision analysis
- **Tech Guide References**: Connect with established project patterns
```

#### 3. Voting Game Architectural Analysis
```markdown
- **Socket.io Integration**: WebSocket event handling and real-time communication
- **Game State Flow**: Voting session management and result aggregation
- **React Component Dependencies**: Admin setup, voting interface, and results pages
- **Test IO Brand Requirements**: Color palette compliance and professional styling
```

### Phase 2: Complexity Assessment & Agent Coordination Strategy (5-10 min)

#### Intelligent Complexity Detection
```markdown
**File Count Impact**: Number of files likely to be modified
**Integration Complexity**: Cross-component coordination requirements  
**Research Depth**: Amount of additional investigation needed
**Risk Assessment**: Potential for architectural changes or breaking changes
**Time Estimation**: Realistic implementation timeline
```

#### Smart Agent Coordination Recommendations
```markdown
- **Simple Features** (1-3 files, <2 hours): Direct agent assignment
- **Moderate Features** (4-8 files, 2-8 hours): task-coordinator for workflow management
- **Complex Features** (9+ files, >8 hours): Multi-phase coordination with checkpoints
- **Architectural Changes**: Always recommend task-coordinator for complex coordination
```

### Phase 3: Comprehensive PRP Document Creation (15-20 min)

#### Core PRP Structure
Use template structure adapted for project context:

```markdown
# PRP: {{FEATURE_NAME}}

## Research Context & Real-Time Voting Analysis
**Research Integration**: [Findings from planning and MCP research on voting systems]
**Socket.io Architecture**: [Real-time WebSocket communication requirements]
**Existing Game Patterns**: [Current voting flow and state management patterns]

## Voting Game Implementation Specification
**Core Requirements**: [Game feature functionality to be built]
**Socket.io Integration**: [WebSocket events and real-time communication needs]  
**Game State Changes**: [Voting session data structure modifications needed]
**React Interface Requirements**: [Admin, voting, or results page interaction patterns]

## Test IO Brand & Quality Requirements
**Testing Strategy**: [Playwright UI testing and real-time functionality coverage]
**Brand Compliance**: [Test IO color palette and professional styling requirements]
**Performance Considerations**: [Real-time voting scalability and WebSocket performance]

## Real-Time Development Coordination Strategy
**Recommended Approach**: [Direct agent vs task-coordinator for real-time features]
**Implementation Phases**: [Frontend React → Backend Socket.io → Integration testing]
**WebSocket Risk Mitigation**: [Connection handling and error recovery strategies]
**Dependencies**: [React components, Socket.io events, game state management]

## Voting Game Success Criteria
**Functional Success**: [Real-time voting behaviors that must work correctly]
**Integration Success**: [Frontend-backend Socket.io communication verification]
**Brand Quality Gates**: [Test IO styling, Playwright testing, professional UX validation]
```

#### Context Preservation
- **Research Provenance**: Include sources and timestamps for research findings
- **Decision Rationale**: Explain architectural and design decisions
- **Assumption Documentation**: Clearly state assumptions for future validation
- **Integration Requirements**: Detailed component integration specifications

### Phase 4: Final Validation & PRP Output (5 min)

#### Quality Validation
```markdown
- **Completeness Check**: All sections contain actionable information
- **Context Richness**: Sufficient detail for intelligent agent coordination
- **Integration Clarity**: Clear architectural integration requirements
- **Success Criteria**: Measurable outcomes and validation approaches
```

#### File Generation
- **Naming Convention**: `{{NUMBER}}_feature-name.md` (increment from existing PRPs)
- **Location**: Save to `PRPs/2-prps/`
- **Metadata**: Include creation date, planning source, and research context

## 🔧 Advanced PRP Features

### Context-Aware Agent Routing
Each PRP includes intelligent coordination recommendations:
- **Scope Analysis**: File count, integration complexity, research needs
- **Agent Recommendations**: Which agents are optimal for different phases
- **Coordination Requirements**: When task-coordinator should orchestrate work
- **Quality Gates**: Testing and validation checkpoints

### Research Context Integration
PRPs preserve and enhance planning research:
- **MCP Research Findings**: Integrated framework documentation and proven patterns
- **Architectural Analysis**: Deep integration requirements analysis  
- **Pattern Recognition**: Connection to established project patterns
- **Risk Analysis**: Potential challenges and mitigation strategies

### Voting Game Implementation Intelligence
PRPs provide rich real-time voting implementation context:
- **Socket.io Event Patterns**: References to existing WebSocket event handling
- **React Component Templates**: Voting interface patterns and Test IO styling
- **Playwright Testing Approaches**: UI automation and real-time functionality testing
- **Game State Documentation**: Voting session management and result aggregation patterns

## 📊 Success Metrics

- **Research Integration**: All planning research is preserved and enhanced in PRPs
- **Context Richness**: PRPs contain sufficient detail for intelligent agent coordination
- **Architectural Awareness**: Integration requirements are clearly specified
- **Quality Focus**: Testing and validation approaches are well-defined
- **Coordination Intelligence**: Agent routing recommendations optimize workflow efficiency

## 🎯 Completion Criteria

A PRP is complete when:
1. All planning context has been analyzed and integrated
2. Comprehensive research context is included
3. Architectural integration requirements are clearly specified  
4. Agent coordination strategy is recommended based on complexity analysis
5. Success criteria are measurable and validation approaches are defined
6. The PRP is saved to `PRPs/2-prps/` with proper naming and metadata

**Next Step**: Use `execute-prp` command to implement the generated PRP with intelligent coordination for the Two Truths & A Lie voting game system.