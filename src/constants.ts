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
    description: "Deep analytical thinkers who build robust, scalable systems.",
    dominantDomains: ["Domain A: Cognitive & Execution Style", "Domain F: Values & Identity"],
    qualities: ["High Processing Depth", "Systematicity", "High Security Value"],
    typicalCareers: ["CTO", "Systems Architect", "Lead Infrastructure Engineer"]
  },
  {
    name: "Agile Disruptor",
    description: "Innovators who thrive in ambiguity and drive rapid change.",
    dominantDomains: ["Domain B: Work Style & Motivation", "Domain E: Learning & Development"],
    qualities: ["High Innovation Drive", "Adaptability", "Risk Appetite"],
    typicalCareers: ["Product Founder", "Innovation Lead", "Growth Hacker"]
  },
  {
    name: "Empathetic Orchestrator",
    description: "Leaders who harmonize group dynamics and read emotional undercurrents.",
    dominantDomains: ["Domain C: Interpersonal & Social Dynamics", "Domain D: Emotional Regulation"],
    qualities: ["High Empathic Accuracy", "Leadership Inclination", "Emotional Stability"],
    typicalCareers: ["People Lead", "Product Manager", "Organizational Consultant"]
  },
  {
    name: "Pragmatic Executor",
    description: "Reliable professionals who bridge the gap between theory and reality.",
    dominantDomains: ["Domain A: Cognitive", "Domain B: Work Style"],
    qualities: ["Quantitative Intuition", "Goal Internalization", "Work Ethic"],
    typicalCareers: ["Operations Director", "Project Lead", "Senior Implementation Specialist"]
  },
  {
    name: "Growth Catalyst",
    description: "Lifelong learners who accelerate team knowledge and capability.",
    dominantDomains: ["Domain E: Learning & Development"],
    qualities: ["Curiosity Breadth", "Knowledge Sharing", "Metacognition"],
    typicalCareers: ["Head of Learning", "Technical Mentor", "Research Scientist"]
  }
];
