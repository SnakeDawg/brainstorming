# Sample Apps (Vibe-Coded Prototypes)

These are the original rapid-prototype samples that serve as inspiration for the POC. Both are fully client-side React apps with mock data — no backend required.

---

## Sample 1: AI System Manager (`sampleapp/`)

A Windows-style system management dashboard with an AI personal assistant.

**Key Features:**
- System health dashboard with PC health score, issues, and optimization
- AI personal assistant chat with conversation management and canvas panel
- App marketplace for browsing and installing applications
- System optimization, security, and device updates pages
- Settings page with MCP server configuration and AI memory management
- Dark/light theme toggle

**Tech:** React, Vite, Tailwind CSS, React Router, Lucide React, React Markdown

### Setup

```bash
cd Andy/sampleapp
npm install
npm run dev
```

Opens at **http://localhost:3000**

---

## Sample 2: Onboarding Assistant (`Oboarding/`)

A guided 14-phase setup wizard that interviews users, detects their persona, and recommends apps.

**Key Features:**
- Conversational interview with simulated AI chat
- Persona detection (Gamer, Student, Professional, Creator, Casual) via keyword analysis
- Hybrid persona support when multiple personas match
- App recommendations filtered by detected persona (50+ app database)
- Device detection, display arrangement, Bluetooth pairing, peripheral setup
- Simulated app installation with progress tracking
- Background task activity panel
- Session persistence (survives page refresh)

**The 14 Phases:**
Welcome → Name Input → Chat Interview → Analyzing → Persona Detection → Persona Confirmation → App Recommendations → Device Detection → Display Arrangement → Display Calibration → Bluetooth Pairing → Peripheral Setup → Installation → Complete

**Tech:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React

### Setup

```bash
cd Andy/Oboarding
npm install
npm run dev
```

Opens at **http://localhost:5173**

---

## Prerequisites

- **Node.js** v16 or later
- **npm** (comes with Node.js)

## Notes

- These are **prototypes with mock data** — no backend, no real AI, no actual system integration
- The AI chat responses are scripted templates, not connected to any LLM
- Device detection, installation progress, and hardware scanning are all simulated
- See [`.analysis/`](../.analysis/) for detailed codebase analysis
