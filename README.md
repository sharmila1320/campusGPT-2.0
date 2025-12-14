
 CampusGPT-2.0
A Role-Based, Self-Learning Campus Intelligence Platform

Demo 
https://github.com/sharmila1320/CampusGPT2.0/blob/main/campusGPT_demo_video.mp4

CampusGPT-2.0 is an AI-powered, closed-domain chat system designed exclusively for campus ecosystems.
It acts as a single source of truth for campus-related information by combining LLM intelligence, role-based access control, and a continuously evolving knowledge base.

Unlike generic chatbots, CampusGPT-2.0 learns from verified institutional responses and improves automatically over time.

 Why CampusGPT-2.0?

Campuses suffer from:

Repeated questions

Scattered information

No verified source of truth

Manual helpdesk overload

CampusGPT-2.0 solves this by:

Answering instantly if knowledge exists

Raising community tickets if it doesn’t

Allowing only verified institute members to contribute authoritative answers

Storing validated responses permanently for future use

 Core Idea

Ask once → Verify once → Store forever → Answer instantly next time

The system evolves into a campus-specific intelligence layer without retraining any AI model.

 User Roles & Permissions
 Public Users

Any non-institutional email

Can:

Ask campus-related questions

View public answers

Cannot:

Answer questions

Control visibility

Moderate content

 Institute Users (Verified Authority)

Emails ending with official institute domain

Can:

Answer raised questions

Decide visibility:

 Public (visible to all)

 Institute-only

Validate and enrich the knowledge base

This ensures accuracy, trust, and controlled information flow.

 System Workflow

User asks a question

System checks the database

If answer exists → respond instantly

If answer does not exist

A community ticket is raised

Institute user responds

Chooses visibility (public / institute-only)

Database updates automatically

Future queries are answered directly from verified data

No repeated tickets. No hallucinated answers.

 Architecture Overview
User Query
   ↓
Authentication & Role Check
   ↓
Knowledge Base Lookup
   ↓
Answer Found? ── Yes → Instant Response
        │
        No
        ↓
Community Ticket Raised
        ↓
Institute User Answer
        ↓
Verified Answer Stored in DB
        ↓
Future Queries Answered Instantly

 Tech Stack

Frontend: React + TypeScript

AI Engine: Google Gemini API

State Management: React Hooks

Authentication: Email-based role detection

Database: Structured Q&A knowledge base

Build Tool: Vite

Language: TypeScript

 Key Features

 Role-based access control

 Automatic ticket creation for unanswered queries

 Verified institutional responses

 Public & institute-only visibility control

 Self-learning knowledge base

 Faster responses over time

 Demo-backed working prototype

 Real-World Applications

Campus helpdesk automation

Student onboarding assistants

Academic & administrative query resolution

Internal institutional knowledge systems

Closed-domain AI assistants

 Why This Project Matters 

CampusGPT-2.0 demonstrates:

System design thinking

Role-aware access control

Applied AI without hallucination risk

Knowledge persistence & reuse

Enterprise-style AI deployment patterns

This mirrors how companies deploy internal AI assistants, not consumer chatbots.

 Example Use Case

Student: “When is course registration deadline?”
System:  Not in DB → Ticket raised
Institute user answers → Stored as verified knowledge
Next student asks →  Instant AI response

 Future Enhancements

Semantic search for similar questions

Admin moderation dashboard

Analytics on query frequency

Multi-campus support

Vector database integration

Notification system for answered tickets

 Getting Started
git clone https://github.com/sharmila1320/campusGPT-2.0.git
cd campusGPT-2.0
npm install
npm run dev


 Author

Sharmila Rapeti
B.Tech ECE | Full-Stack + Applied AI
GitHub: https://github.com/sharmila1320

 Final Note

CampusGPT-2.0 is not just an AI chatbot —
it is a scalable, verified, self-learning campus intelligence system.
