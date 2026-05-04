export interface ArchetypeDefinition {
  name: string;
  description: string;
  dominantDomains: string[];
  qualities: string[];
  typicalCareers: string[];
}

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    name: "Strategic Architect",
    description: "Deep analytical thinkers who build robust, scalable systems and long-term frameworks.",
    dominantDomains: ["Domain A: Cognitive & Execution Style", "Domain F: Values & Identity"],
    qualities: ["High Processing Depth", "Systematicity", "High Security Value", "Scalability Focus"],
    typicalCareers: ["CTO", "Systems Architect", "Lead Infrastructure Engineer", "Chief Risk Officer", "Urban Planner", "AI Governance Lead"]
  },
  {
    name: "Agile Disruptor",
    description: "Innovators who thrive in high-stakes ambiguity and drive rapid, non-linear change.",
    dominantDomains: ["Domain B: Work Style & Motivation", "Domain E: Learning & Development"],
    qualities: ["High Innovation Drive", "Adaptability", "Risk Appetite", "Rapid Iteration"],
    typicalCareers: ["Product Founder", "Innovation Lead", "Growth Hacker", "Venture Studio Director", "Change Management Consultant", "Stealth Startup Lead"]
  },
  {
    name: "Empathetic Orchestrator",
    description: "Leaders who harmonize complex group dynamics and read emotional undercurrents with high precision.",
    dominantDomains: ["Domain C: Interpersonal & Social Dynamics", "Domain D: Emotional Regulation"],
    qualities: ["High Empathic Accuracy", "Leadership Inclination", "Emotional Stability", "Conflict Resolution"],
    typicalCareers: ["People Lead", "Product Manager", "Organizational Consultant", "Customer Success Director", "Diplomat", "Chief Culture Officer"]
  },
  {
    name: "Pragmatic Executor",
    description: "Reliable professionals who bridge the gap between high-level theory and operational reality.",
    dominantDomains: ["Domain A: Cognitive", "Domain B: Work Style"],
    qualities: ["Quantitative Intuition", "Goal Internalization", "Work Ethic", "Operational Excellence"],
    typicalCareers: ["Operations Director", "Project Lead", "Senior Implementation Specialist", "Supply Chain Manager", "COO", "Manufacturing Tech Lead"]
  },
  {
    name: "Growth Catalyst",
    description: "Lifelong learners who accelerate team knowledge and capability through mentorship and synthesis.",
    dominantDomains: ["Domain E: Learning & Development"],
    qualities: ["Curiosity Breadth", "Knowledge Sharing", "Metacognition", "Skill Mapping"],
    typicalCareers: ["Head of Learning", "Technical Mentor", "Research Scientist", "Academic Director", "Content Strategist", "Talent Development Lead"]
  },
  {
    name: "Data Alchemist",
    description: "Specialists who transform raw information into strategic gold through advanced pattern recognition.",
    dominantDomains: ["Domain A: Cognitive", "Domain E: Learning"],
    qualities: ["Information Foraging", "Statistical Rigor", "Clarity in Complexity", "Insight Generation"],
    typicalCareers: ["Head of Insights", "Data Scientist", "Quantitative Analyst", "AI Product Owner", "Market Intelligence Lead", "Forecasting Specialist"]
  },
  {
    name: "Advocacy Architect",
    description: "High-influence communicators who build bridges between internal capability and external market needs.",
    dominantDomains: ["Domain C: Interpersonal", "Domain F: Values"],
    qualities: ["Persuasion Precision", "Strategic Partnerships", "Network Density", "Value Articulation"],
    typicalCareers: ["VP of Partnerships", "Sales Director", "Developer Evangelist", "Public Relations Lead", "Strategic Account Manager", "Brand Ambassador Lead"]
  },
  {
    name: "Creative Synthesizer",
    description: "Aesthetically-driven thinkers who merge functional design with emotional storytelling.",
    dominantDomains: ["Domain B: Work Style", "Domain C: Interpersonal"],
    qualities: ["Visual Intuition", "Narrative Cohesion", "User Advocacy", "Holistic Product Design"],
    typicalCareers: ["Creative Director", "UX Strategy Lead", "Brand Architect", "Art Director", "Digital Product Designer", "Cinematic Storyteller"]
  },
  {
    name: "Technical Artisan",
    description: "Deep-domain experts who value craftsmanship and technical purity over organizational climbing.",
    dominantDomains: ["Domain A: Cognitive", "Domain B: Work Style"],
    qualities: ["Craftsmanship Pride", "Technical Depth", "Code Quality", "Problem Solving Rigor"],
    typicalCareers: ["Principal Engineer", "Distinguished Specialist", "Cybersecurity Researcher", "Embedded Systems Dev", "Software Architect (Individual Contributor)", "Tooling Specialist"]
  },
  {
    name: "Resilient Voyager",
    description: "Crisis-ready operatives who excel at stabilizing environments and navigating extreme headwinds.",
    dominantDomains: ["Domain D: Emotional Regulation", "Domain B: Work Style"],
    qualities: ["Composure Under Pressure", "Resourcefulness", "Tactical Pivot", "Decisiveness"],
    typicalCareers: ["Turnaround CEO", "Crisis Manager", "Logistics Director", "Disruption Response Lead", "Interim Management Specialist", "Global Security Analyst"]
  }
];
