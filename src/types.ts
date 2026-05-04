export interface CareerMatch {
  id: string;
  title: string;
  zScore: number;
  description: string;
  alignment: {
    traits: string[];
    gaps: string[];
  };
  marketDemand: 'High' | 'Medium' | 'Low';
}

export interface PersonaDimension {
  id: number;
  name: string;
  domain: string;
  score: number; // 0 to 1
  certainty: number; // 0 to 1 (Bayesian sigma)
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
  timestamp?: any;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: any;
  updatedAt: any;
  revelation?: UserProfile['revelation'];
  cvName?: string;
}

export interface UserProfile {
  name?: string;
  email?: string;
  cvData?: string;
  persona?: PersonaDimension[];
  careerMatches?: CareerMatch[];
  revelation?: {
    narrative: string; // Verbose explanation
    archetypeTitle: string;
    pdfDeepInferences: string[]; // Specific callouts to PDF evidence
    dimensionalBreakdown: { 
      name: string; 
      value: number; 
      justification: string; // Why this score?
    }[];
    comparison: {
      otherArchetype: string;
      diffNarrative: string;
    };
    matches: {
      title: string;
      zScore: number;
      description: string;
      justification: string; // Why this specific match based on the echo?
      alignment: { traits: string[] };
      gaps: string[];
      glidePath: string[];
    }[];
    archetype: string;
  };
}
