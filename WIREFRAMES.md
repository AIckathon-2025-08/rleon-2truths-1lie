# Two Truths & A Lie Game - Wireframes & Architecture

## Game Concept
Town Hall "Two Truths and a Lie" game with real-time voting and results.

**Core Flow:**
1. Admin uploads candidate photo + name, creates 3 statements (2 truths, 1 lie)
2. Employees vote on which statement they think is the lie
3. Live results show voting progress and reveal the correct answer

## Tech Stack
- **Frontend**: React + TailwindCSS
- **Backend**: Node.js/Express
- **Real-time**: WebSockets (Socket.io)
- **Database**: None (in-memory storage)
- **Deployment**: Docker Compose

## Page Wireframes

### Page 1: Admin Setup (`/admin`)
```
┌─────────────────────────────────────────┐
│  🎯 Two Truths & A Lie - Game Setup     │
├─────────────────────────────────────────┤
│                                         │
│  Candidate Photo: [Upload/Drop Zone]    │
│                                         │
│  Name: [________________]               │
│                                         │
│  Statement 1: [____________________]    │
│  Statement 2: [____________________]    │
│  Statement 3: [____________________]    │
│                                         │
│  Which is the LIE? ○ 1  ○ 2  ○ 3       │
│                                         │
│  [Start Game] [Generate Voting Link]    │
│                                         │
│  Voting URL: http://localhost/vote/ABC  │
│  Results URL: http://localhost/results  │
└─────────────────────────────────────────┘
```

### Page 2: Employee Voting (`/vote/:gameId`)
```
┌─────────────────────────────────────────┐
│           🎯 Vote: Which is the LIE?     │
├─────────────────────────────────────────┤
│                                         │
│        [Candidate Photo]                │
│            John Doe                     │
│                                         │
│  ○ A. I once ate 50 hot dogs in a contest │
│  ○ B. I have a pet iguana named Steve     │
│  ○ C. I can speak 5 languages fluently   │
│                                         │
│         [Submit Vote]                   │
│                                         │
│  Status: 23 votes cast so far          │
└─────────────────────────────────────────┘
```

### Page 3: Live Results (`/results/:gameId`)
```
┌─────────────────────────────────────────┐
│        🎯 Live Results - John Doe       │
├─────────────────────────────────────────┤
│                                         │
│  A. I once ate 50 hot dogs... │██████│ 45% │
│  B. I have a pet iguana...    │███   │ 23% │
│  C. I can speak 5 languages  │████   │ 32% │
│                                         │
│  Total Votes: 23                       │
│                                         │
│  [Reveal Answer] [Next Round]          │
│                                         │
│  ✨ The LIE was: Statement B!          │
└─────────────────────────────────────────┘
```

## Simple Architecture
- **No Database**: Store game state in memory (Map/Object)
- **WebSockets**: Real-time vote updates
- **Session IDs**: Prevent duplicate voting via browser sessions
- **Simple Routing**: Express + static files
- **File Upload**: Handle candidate photos locally

## Key Features
- Real-time voting updates
- Anonymous voting (session-based)
- Game timer (optional)
- Multiple rounds support
- Live results with progress bars