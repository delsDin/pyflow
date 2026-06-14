export type PhaseType = 'Débutant' | 'Intermédiaire' | 'Expert';

export interface CourseDay {
  id: number;
  phase: PhaseType;
  title: string;
  description: string;
  topics: string[];
  contentMarkdown: string;
  codeExample: string;
  expectedOutput: string;
}

export interface QuizQuestion {
  id: string;
  dayId: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface CodingChallenge {
  id: string;
  dayId: number;
  title: string;
  description: string;
  instructions: string[];
  initialCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
  validationKeywords: string[]; // Keywords that MUST be present (e.g. "for", "while", "def")
  forbiddenKeywords?: string[]; // Keywords that must NOT be present (optional)
}

export interface ProjectStep {
  id: number;
  title: string;
  instruction: string;
  hint: string;
  initialCode?: string;
}

export interface LearnProject {
  id: string;
  title: string;
  level: PhaseType;
  description: string;
  estimatedTime: string;
  technologies: string[];
  steps: ProjectStep[];
  solutionCode: string;
}

export interface UserProgress {
  completedDays: number[]; // Array of course day IDs completed
  completedQuizzes: Record<string, boolean>; // Quiz ID -> passed
  completedChallenges: Record<string, string>; // Challenge ID -> user submitted code
  completedProjects: string[]; // Project IDs completed
  streak: number;
  lastActiveDate: string | null; // ISO Date string
}
