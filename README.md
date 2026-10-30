# 15M Procurement Maturity Cockpit & Dashboard

A modern, high-performance web dashboard and strategic maturity assessment application built with **Next.js (React 18)**, **Tailwind CSS**, **Lucide Icons**, and **Recharts**.

Developed to recover and modernize the 15M Scan instrument (Sourcing Champions / BAM methodology), eliminating previous inconsistencies and providing executive-grade analytics.

---

## 🚀 Key Improvements & Architectural Highlights

### 1. Authoritative Scoring Calculation Engine
Implemented strictly according to the recovered Excel instrument formulas:
* **Dimension Level**:
  $$\text{Dimension Score} = \frac{\sum (\text{prio} \times \text{rel} \times \text{answer})}{\sum (\text{prio} \times \text{rel})}$$
* **Assessment Function (AF) Level**:
  $$\text{AF Score} = \frac{5 \cdot \text{Concept} + 5 \cdot \text{Process} + 2 \cdot \text{Implementation}}{12}$$
  *(Replaces the inaccurate $33.3\%$ flat third default: Concept and Process carry $41.7\%$ each; Implementation carries $16.7\%$.)*
* **Strategic Partition (SP) Weights**:
  $$\text{Overall Maturity Score} = 0.25 \cdot \text{SP1} + 0.25 \cdot \text{SP2} + 0.25 \cdot \text{SP3} + 0.15 \cdot \text{SP4} + 0.10 \cdot \text{SP5}$$
* **Dynamic Denominator & Relevance Layer**: Every question has configurable Priority ($0\text{–}5$) and Relevance ($0/1$). Excluding an item automatically redistributes weighting across remaining items.

---

### 2. Dual Assessment Modes
* **Comprehensive 3-Dimension Deep Audit**: Rigorous step-by-step scoring of Concept, Process, and Implementation with full rubric definitions.
* **15-Minute Quick-Check Diagnostic**: One holistic Integrated Assessment rubric per function for rapid C-level scans.

---

### 3. Dynamic Question-Level Plan Targets
* Replaces the rigid $80\%$ flat target in older dashboards with **granular per-question target planning** ($0\text{–}100\%$).
* Automatically visualizes the **Strategic Value Gap** ($\text{Plan} - \text{As-Is}$) at function, partition, and enterprise levels.

---

### 4. Executive Visualizations & Reporting
* **Final Maturity 5-Stage Visual Progression**: Interactive stage curve mapping current positioning across:
  * Stage 1: Operational ($0\text{–}20\%$)
  * Stage 2: Classical Sourcing ($21\text{–}40\%$)
  * Stage 3: Sourcing Expert ($41\text{–}60\%$)
  * Stage 4: Top Class Sourcing ($61\text{–}80\%$)
  * Stage 5: World Sourcing Champion ($81\text{–}100\%$)
* **Strategic Partition Bar Chart**: Grouped As-Is score vs. Plan target lines with partition weights ($25\%, 25\%, 25\%, 15\%, 10\%$).
* **Multi-View Radar Profiles**:
  * 15 Modules ($M_1$ through $M_{15}$)
  * Strategic Partitions ($SP_1$ through $SP_5$)
  * 4 Strategic Cycle dimensions: **Target ($Z_i$)**, **Analysis ($A_n$)**, **Alignment ($A_u$)**, and **Control ($S_t$)** ($25\%$ each).
  * Assessment Functions.
* **Executive PDF / Print Export**: Clean presentation-ready report modal with CPO sign-off lines and prioritized action plan.
* **Detailed Matrix Table**: Interactive, sortable, filterable table with one-click CSV export.

---

## 🛠️ Project Structure

```
15m-maturity-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css              # Custom styling, scrollbars & print layout
│   │   ├── layout.tsx               # Root layout with AssessmentProvider
│   │   └── page.tsx                 # Main entry page rendering AppShell
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx         # Responsive container layout
│   │   │   ├── Header.tsx           # Company & assessment header with quick stats
│   │   │   └── Sidebar.tsx          # Branded BAM / Sourcing Champions navigation
│   │   ├── dashboard/
│   │   │   ├── ExecutiveDashboard.tsx        # Central dashboard overview
│   │   │   ├── ExecutiveSummaryCards.tsx     # KPI metric cards
│   │   │   ├── MaturityStageCurve.tsx        # 5-stage infographic progression
│   │   │   ├── MultiViewRadars.tsx           # Tabbed radar/spider visualizations
│   │   │   └── StrategicPartitionBarChart.tsx # SP1–SP5 target bullet bars
│   │   ├── assessment/
│   │   │   └── AssessmentWorkspace.tsx       # 3-step question flow, probe guide & actions
│   │   ├── tables/
│   │   │   └── MaturityMatrixTable.tsx       # Complete sortable matrix with CSV export
│   │   ├── analytics/
│   │   │   └── StrategicCycleView.tsx        # Zi / An / Au / St 25% breakdown
│   │   ├── reports/
│   │   │   └── ExecutiveReportModal.tsx      # Printable CPO executive summary report
│   │   ├── settings/
│   │   │   └── SettingsView.tsx              # Assessment settings, import/export
│   │   └── about/
│   │       └── AboutView.tsx                 # 15M methodology documentation
│   ├── context/
│   │   └── AssessmentContext.tsx             # State management with localStorage sync
│   ├── data/
│   │   └── configuration.ts                  # Rubrics, questions, BAM baseline profile
│   ├── lib/
│   │   └── scoring-engine.ts                 # Authoritative mathematical calculation logic
│   └── types/
│       └── index.ts                          # TypeScript interfaces and definitions
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 💻 Running the Application

### 1. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build & Start
```bash
npm run build
npm run start
```
