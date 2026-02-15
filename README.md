# Brainstorming — AI System Manager POC

Repository for prototyping and iterating on AI-powered system management concepts. Started from vibe-coded samples, evolving toward a functional proof of concept.

## Repository Structure

```
brainstorming/
├── Andy/                          # Original sample apps (prototypes)
│   ├── sampleapp/                 # AI System Manager — dashboard + AI assistant
│   └── Oboarding/                 # Onboarding Assistant — 14-phase setup wizard
├── .analysis/                     # Codebase analysis & documentation
│   ├── README.md                  # Mentor-style architecture overview
│   ├── sampleapp.md               # Deep dive: AI System Manager
│   └── oboarding.md               # Deep dive: Onboarding Assistant
└── README.md                      # This file
```

## Quick Start

**AI System Manager** (dashboard with AI chat, marketplace, system tools):
```bash
cd Andy/sampleapp
npm install
npm run dev
```

**Onboarding Assistant** (guided setup wizard with persona detection):
```bash
cd Andy/Oboarding
npm install
npm run dev
```

System Manager opens at **http://localhost:3000**, Onboarding at **http://localhost:5173**.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React | UI framework |
| TypeScript | Type safety (Onboarding app) |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations (Onboarding app) |
| Lucide React | Icon library |
| React Router | Client-side routing |
| React Markdown | Markdown rendering (System Manager) |

## What's Next

This repository is an iterative exploration space. The sample apps demonstrate UI concepts and interaction patterns for AI-powered system management. Direction for the POC is TBD — the prototypes serve as a starting point for discussion and iteration.

For a detailed understanding of the codebase, start with the [analysis docs](.analysis/README.md).

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request for review
