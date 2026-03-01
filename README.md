# cf_ai_chat_agent

Streaming AI chat agent built on Cloudflare Workers AI with Durable Objects, persistent memory, server/client tools and human-in-the-loop approval.

---

## Overview

This project implements a full-stack AI-powered chat agent running entirely on Cloudflare’s edge platform.

The agent demonstrates:

- Streaming LLM responses using Workers AI  
- Workflow orchestration using Durable Objects  
- Persistent conversation memory (SQLite-backed)  
- Server-side tool execution  
- Client-side browser tool execution  
- Human-in-the-loop approval for sensitive operations  
- WebSocket-based real-time streaming  

---

## Architecture

### Backend
- Cloudflare Worker  
- Durable Object (`ChatAgent`)  
- SQLite storage (enabled via `new_sqlite_classes`)  
- Workers AI (Llama 3.x model)  

### Frontend
- React + Vite  
- `useAgent` + `useAgentChat`  
- Real-time streaming over WebSocket  

### Tool Types
- **Server tool** → executes automatically (`getWeather`)  
- **Client tool** → runs in browser (`getUserTimezone`)  
- **Approval-gated tool** → requires user confirmation (`calculate`)  

---

## Prerequisites

- Node.js 18+  
- Cloudflare account (free tier works)  
- Wrangler CLI (installed via npm)  

---

## Local Development Setup

### 1. Install dependencies

- npm install
### 2. Generate Cloudflare types
- npx wrangler types



### 3. Build the frontend
- npm run build


### 4. Run locally
- npx wrangler dev
Wrangler will output a local development URL.
Open it in your browser.


## Technologies Used
-Cloudflare Workers
-Cloudflare Workers AI
-Durable Objects
-SQLite (via Durable Objects)
-React
-Zod

## Authored by:
Dakshit Singhal