<<<<<<< HEAD
# 🚀 AI-Powered Resume Analyzer & ATS Score Checker

An enterprise-grade, full-stack web application designed to evaluate candidate resumes against target job descriptions, simulate enterprise Applicant Tracking Systems (e.g., Workday, Greenhouse, Taleo), and provide actionable, metric-driven improvement recommendations using the **Google XYZ formula**.

---

## 🌟 Key Features

1. **High-Fidelity PDF Structure Parsing**:
   - Built with **PyMuPDF** (`fitz`).
   - Handles multi-column layouts, preserves structural reading order, detects clickable links (GitHub, LinkedIn, Portfolio), and extracts contact metadata.
   - Flags unreadable or scanned documents to ensure ATS parseability.

2. **Hybrid ATS Scoring Engine**:
   - Blends deterministic rule-based heuristic audits with deep semantic matching:
     - **40% Keyword & Hard Skill Match**: Direct and synonymous technical alignment with the Job Description.
     - **25% Quantifiable Impact**: Action verb density and measurable metrics (%, $, scale, users, latency).
     - **20% Formatting & Readability**: ATS standard sections, bullet length, contact completeness.
     - **15% Education & Certifications**: Role-relevant degrees and accredited credentials.

3. **Google XYZ Bullet Point Optimizer**:
   - Automatically detects weak or passive bullet points in the resume.
   - Rewrites them following: *"Accomplished [X] as measured by [Y] by doing [Z]"*.
   - Includes an interactive **Live Bullet Rewriter** to test custom sentences on the fly.

4. **Deep Skills Gap Analysis**:
   - Categorized competency chips with real-time filtering: *All*, *Matched* (green), *Missing Critical* (rose), and *Nice-to-Have* (amber).
   - Instant search and 1-click clipboard copy.

5. **Visual Analytics & Executive Recruiter Verdict**:
   - **Recharts Radar Chart**: 5-dimensional competency balance vs. elite candidate benchmarks.
   - **Animated Circular Score Gauge**: Color-coded percentage meter with celebratory confetti for high scores.
   - **Executive Recruiter Verdict**: High-level synthesis from a Fortune 500 hiring manager perspective.
   - **Priority Action Plan Checklist**: Impact-ranked steps to elevate your ATS score.
   - **Print & PDF Export**: Instant exportable report modal.

6. **Dual Mode Operation (Zero-Configuration Fallback)**:
   - When a `GEMINI_API_KEY` is provided, live analysis is executed via Google Gemini (`gemini-2.5-flash`).
   - If no key is set, the application automatically runs in **Smart Simulation Mode**, generating realistic heuristic and NLP evaluations so you can test immediately!

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Fast modern reactive UI |
| **Styling** | Tailwind CSS | Sleek dark-mode aesthetic & responsive layouts |
| **Animations** | Framer Motion | Smooth state transitions & animated score gauges |
| **Data Visualization** | Recharts | Multi-axis Radar and progress charts |
| **Icons** | Lucide React | Modern iconography |
| **Backend Framework** | Python FastAPI | Asynchronous high-performance REST API |
| **PDF Extraction** | PyMuPDF (`fitz`) | Multi-column PDF layout & text extraction |
| **Data Validation** | Pydantic v2 | Strict data contracts & JSON schema generation |
| **AI Engine** | Google Gemini API | Semantic matching, recruiter insights & XYZ rewrites |

---

## 📁 Project Structure

```
AI-Resume-Analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app factory, CORS, exception handlers
│   │   ├── core/
│   │   │   └── config.py            # Settings (GEMINI_API_KEY, CORS origins)
│   │   ├── schemas/
│   │   │   └── resume.py            # Pydantic models (data contract)
│   │   ├── services/
│   │   │   ├── pdf_service.py       # PyMuPDF text & layout extractor
│   │   │   ├── gemini_service.py    # Gemini API client & prompt engineer
│   │   │   └── ats_scorer.py        # Composite heuristic & semantic scoring
│   │   └── api/
│   │       ├── router.py            # Aggregates endpoints
│   │       └── endpoints/
│   │           ├── health.py        # /health check
│   │           └── analyzer.py      # /extract-pdf, /analyze, /optimize-bullet
│   ├── tests/
│   │   ├── test_backend.py
│   │   └── test_endpoints_direct.py
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Navbar, Footer
│   │   │   ├── upload/              # Dropzone, JobDescriptionInput, Stepper
│   │   │   └── dashboard/           # ScoreGauge, RadarChart, SkillsGap, BulletOptimizer, Verdict
│   │   ├── services/api.js          # Axios client
│   │   ├── utils/formatters.js      # Color maps, sample jobs & resumes
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── sample_data/                     # Pre-packaged sample resumes & job descriptions
│   ├── sample_software_engineer.pdf
│   └── sample_job_description.txt
├── start-dev.bat                    # 1-Click Windows Batch launcher
├── start-dev.ps1                    # 1-Click PowerShell launcher
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Python 3.10+** (tested on Python 3.13)
- **Node.js 18+** & npm

### 2. Configure Google Gemini API Key (Optional)
Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
Open `backend/.env` and paste your key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(If left blank, the app will run in Smart Simulation Mode automatically).*

### 3. Launch Development Servers (1-Click)

On Windows, double click `start-dev.bat` or run:
```powershell
.\start-dev.ps1
```

Or start the servers manually:

#### In Terminal 1 (Backend):
```bash
cd backend
# Activate venv
.\venv\Scripts\activate
# Start FastAPI
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs: `http://127.0.0.1:8000/docs`

#### In Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Testing the Application

1. Open `http://localhost:5173` in your browser.
2. Click **"Load Sample Resume"** in the resume box (loads *Alex Chen - Senior Full-Stack Engineer*), or drag and drop `sample_data/sample_software_engineer.pdf`.
3. Select any **Preset** button in the Job Description box (e.g. *FullStack*).
4. Click **"Analyze Resume & Calculate ATS Score"**.
5. Explore the interactive results:
   - **Overview**: Animated Score Gauge + Recharts Radar Chart.
   - **Skills Gap**: Filter by matched vs missing critical competencies.
   - **AI Bullet Optimizer**: Compare Before & After bullet points and test custom sentences.
   - **Verdict & Checklist**: Review strengths, weaknesses, and mark action items done!
=======

# 🤖 AI Resume Analyzer

An AI-powered web application that analyzes resumes against specific job descriptions to evaluate ATS compatibility, identify missing keywords and skill gaps, and provide actionable suggestions to improve resume quality and job relevance.

## 🚀 Features

- 📄 **Resume Parsing:** Extracts relevant information from uploaded resumes.
- 🎯 **Job Description Matching:** Compares resume content with job requirements.
- 📊 **ATS Score:** Generates an ATS compatibility score based on resume relevance.
- 🔍 **Keyword Analysis:** Identifies missing keywords and important skills.
- 💡 **AI Recommendations:** Provides suggestions to improve resume quality.
- ⚡ **Quick Analysis:** Get resume insights within seconds.

## 🛠️ Tech Stack

- **Frontend:** [Add your frontend technologies]
- **Backend:** [Add your backend technologies]
- **AI/ML:** [Add your AI/LLM technologies]
- **Other Tools:** Git, GitHub

## 📸 Screenshots

<!-- Add your project screenshots here -->

## ⚙️ Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repository
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   Follow the instructions in your terminal to access the application.

## 📖 How It Works

1. Upload your resume.
2. Paste the target job description.
3. Let the AI analyze your resume.
4. Get your ATS score and matching insights.
5. Review missing keywords and improvement suggestions.

## 🔮 Future Enhancements

- Support for multiple resume formats.
- Resume improvement and rewriting suggestions.
- Integration with multiple AI models.
- Personalized resume optimization for different job roles.

## 👨‍💻 Author

**Ansh Kumar Yadav**

- GitHub: [@anshyadav669](https://github.com/anshyadav669)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/anshkumaryadav/)

---

⭐ If you find this project useful, consider giving it a star!
>>>>>>> 83217dba976f83a34ca6b510d97c3f264cb32a2b
