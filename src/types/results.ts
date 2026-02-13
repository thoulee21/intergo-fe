import type { AudioAnalysisType, VideoAnalysisType } from "@/types/session";
import type { Evaluation } from "./answer-evaluation";

export interface QuestionScore {
  question: string;
  answer: string;
  score: number;
  evaluation: Evaluation;
  questionAnalysis: string;
  standardAnswer: string;
}

export interface CoreCompetencyIndicator {
  professionalKnowledgeLevel: number;
  skillMatchingDegree: number;
  languageExpressionAbility: number;
  logicalThinkingAbility: number;
  innovationAbility: number;
  adaptabilityAndStressResistance: number;
}

export interface ResumeAnalysis {
  score?: number;
  analysis?: string;
}

export interface InterviewResults {
  overallScore: number;
  contentScore: number;
  deliveryScore: number;
  nonVerbalScore: number;
  coreCompetencyIndicators: CoreCompetencyIndicator;
  resumeAnalysis: ResumeAnalysis;
  strengths: string[];
  improvements: string[];
  questionScores: QuestionScore[];
  videoAnalysis: VideoAnalysisType;
  audioAnalysis: AudioAnalysisType;
  recommendations: string;
}
