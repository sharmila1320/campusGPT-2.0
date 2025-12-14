
---

# CampusGPT-2.0

## Role-Based, Self-Learning Campus Intelligence Platform

A closed-domain AI assistant designed exclusively for campus ecosystems, combining verified institutional knowledge, role-based access control, and continuous learning.

---

Demo 
https://github.com/sharmila1320/CampusGPT2.0/blob/main/campusGPT_demo_video.mp4

## Table of Contents

1. Overview
2. Problem Statement
3. Solution
4. Key Features
5. User Roles & Permissions
6. System Workflow
7. Architecture Overview
8. Tech Stack
9. Example Use Case
10. Real-World Impact
11. Getting Started
12. Future Enhancements
13. Demo
14. Author

---

## Overview

CampusGPT-2.0 is an AI-powered campus assistant that answers campus-specific queries using a verified and evolving knowledge base.

Unlike generic chatbots, CampusGPT-2.0:

* Restricts knowledge to campus context
* Uses institution-verified responses
* Learns permanently from answered queries
* Prevents repeated questions and misinformation

---

## Problem Statement

Campuses commonly face:

* Repetitive student queries
* Scattered information sources
* Lack of verified authority responses
* Manual helpdesk overload
* No long-term knowledge retention

---

## Solution

CampusGPT-2.0 introduces:

* Role-based answering
* Automatic ticket creation for unknown queries
* Verified institutional responses
* Persistent knowledge storage
* Faster responses over time

Ask once. Verify once. Store forever.

---

## Key Features

* Role-based access control
* Automatic ticket creation for unanswered queries
* Only institute users can answer and validate responses
* Public and institute-only visibility control
* Self-learning knowledge base
* Instant responses for previously answered questions

---

## User Roles & Permissions

### Public Users

* Any non-institutional email
* Can ask questions and view public answers
* Cannot answer questions or control visibility

### Institute Users (Verified)

* Emails ending with official institute domain
* Can answer raised tickets
* Can choose answer visibility (public or institute-only)
* Can validate and enrich the knowledge base

---

## System Workflow

1. User asks a question
2. System checks the knowledge base
3. If an answer exists, it is returned instantly
4. If not, a community ticket is raised
5. An institute user provides an answer
6. The verified answer is stored in the database
7. Future queries are answered automatically

---

## Architecture Overview

```
User Query
   -> Authentication and Role Check
   -> Knowledge Base Lookup
   -> Answer Exists?
        -> Yes: Respond Instantly
        -> No: Raise Ticket
              -> Institute User Answers
              -> Verified Answer Stored
```

---

## Tech Stack

* Frontend: React, TypeScript
* Build Tool: Vite
* AI Engine: Google Gemini API
* Authentication: Email domain-based role detection
* Database: Structured question–answer storage

---

## Example Use Case

Student asks:
“When is the semester registration deadline?”

If the answer is not available, a ticket is raised.
An institute user answers and marks it as public.
The response is stored permanently.

Next time the same question is asked, the system responds instantly without raising a ticket.

---

## Real-World Impact

CampusGPT-2.0:

* Reduces repetitive helpdesk workload
* Builds a trusted campus knowledge repository
* Prevents AI hallucinations in closed domains
* Mirrors enterprise-grade internal AI systems
* Scales naturally with usage

---

## Getting Started

```bash
git clone https://github.com/sharmila1320/campusGPT-2.0.git
cd campusGPT-2.0
npm install
npm run dev
```

Create a `.env` file:

---

## Future Enhancements

* Semantic search for similar questions
* Admin moderation dashboard
* Query analytics and insights
* Vector database integration
* Multi-campus support
* Notification system for ticket updates

---

## Demo

A demo video is included in the repository demonstrating the complete workflow.

---

## Author

Sharmila Rapeti
B.Tech ECE | Full-Stack and Applied AI
GitHub: [https://github.com/sharmila1320](https://github.com/sharmila1320)

---

## Final Note

CampusGPT-2.0 is not a generic chatbot.
It is a verified, role-aware, self-learning campus intelligence system designed for real-world deployment.

---
