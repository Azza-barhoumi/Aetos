# Aetos: Calibration Protocol

> "The Aetos Calibration Protocol. An advanced intelligence that deciphers your professional DNA to reveal the unseen trajectories you were built for."

Aetos is a high-fidelity career pathing application that goes beyond keyword matching. It uses the Gemini API to analyze CVs and live chat interactions, mapping professional identities across 46 distinct cognitive and behavioral dimensions.

## 🌌 Core Modules

### 1. Aetos Inference Engine (Chat)
A multi-turn interrogation sequence that calibrates your professional baseline. It supports CV upload (PDF) for vector extraction and deepens the inference through strategic dialogue.

### 2. The Revelation (Analytics)
A 46-dimensional breakdown of your professional persona. 
- **Evidence-Backed Insights**: Every score is justified by specific CV facts or chat interactions.
- **Archetype Mapping**: Visualizes your fit against core professional archetypes (Strategy, Execution, Leadership).
- **Trajectory Forecasting**: Predicts your next high-impact career move.

### 3. CV Loom (Strategy)
A visual loom that weaves together your raw experience into a coherent career strategy, allowing you to see the "hidden threads" of your professional journey.

### 4. Career Passport (Identity)
A verifiable digital fingerprint of your professional traits, designed to be shared as a high-trust alternative to a standard resume.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **intelligence**: [Gemini Pro](https://ai.google.dev/) via `@google/genai`
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Backend**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Data Viz**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏗 Infrastructure & Setup

### Firebase Configuration
The project uses Firebase for session persistence and user profiling.
- **Firestore**: Stores `User` profiles and sub-collections of `ChatSession`.
- **Auth**: Google Authentication is integrated for seamless secure access.
- **Rules**: Strict security rules ensure that users can only read/write their own identity data.

### Environment Variables
Required variables (see `.env.example`):
- `GEMINI_API_KEY`: Powering the Aetos Inference Engine.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Launch Development Server**:
   ```bash
   npm run dev
   ```

3. **Inference Sequence**:
   - Log in via Google.
   - Start a "New Calibration".
   - Upload your CV or engage in dialogue with Aetos.
   - View your professional "Revelation".

---
*Developed as a high-fidelity strategic instrument for professional evolution.*
