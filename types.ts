export interface Section {
  id: string;
  title: string;
  description: string;
  content: string; // The raw text from the notes
  iconName: 'microscope' | 'flask' | 'bone' | 'activity';
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface QuizConfig {
  difficulty: Difficulty;
  questionCount: number;
}

export interface GeneratedContent {
  explanation: string;
  imagePrompt: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  details?: string;
  children?: MindMapNode[];
}
