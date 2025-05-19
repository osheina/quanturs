<!-- Badges -->
![CI](https://github.com/<your-org>/quanturs/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/<your-org>/quanturs.svg)

# Quanturs 🌱✈️  
AI-powered travel recommendations with **built-in CO₂ scoring**

> “Quanturs shows how AI can nudge travellers toward low-carbon choices…” — *AI Time Journal* (2025)

<p align="center">
  <img src="docs/quanturs-guide-demo.gif" width="720" alt="Quanturs guide demo" />
</p>

---

## ✨ Features
- **700 + curated POIs** (LA, San Diego, SF)
- **Smart search & filter** by name, category, diet tags, neighborhood.  
- **AI-generated day-by-day guides** customized to user preferences.  
- GPT-4 day-by-day guides tailored to user lifestyle
- **Real-time CO₂ micro-service** (badge 1-6 on each item)
- Roadmap: hybrid recommender • VR previews • new cities

## 🔥 Live Demo
https://quantum-eco-pathway.lovable.app  — no login required

---

## 🛠️ Tech Stack
| Layer        | Tech                                                               |
| ------------ | ------------------------------------------------------------------ |
| Front-end    | Vite + React 18 + TypeScript + Tailwind + shadcn-ui                |
| API / Auth   | Supabase (PostgreSQL + RLS)                                        |
| AI Engine    | OpenAI GPT-4 (itinerary & copy correction)                         |
| **CO₂ svc**  | FastAPI micro-service (≤50 ms calc)                                |
| Maps         | React-Leaflet + OpenStreetMap                                      |
| DevOps       | Docker Compose • GitHub Actions • Prettier / ESLint                |

---

## 🖼️ Architecture

```mermaid
graph TD
  %% Subgraphs for clarity
  subgraph Client
    A[React UI]
  end

  subgraph Backend
    B[Supabase<br/>(GraphQL)]
    C[CO₂ svc<br/>FastAPI (Docker)]
    D[(Postgres)]
  end

  %% Relations
  A -- "GraphQL" --> B
  B -- "DB" --> D
  A -- "REST / WebSocket" --> C
