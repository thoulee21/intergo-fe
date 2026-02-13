import type { InterviewSession } from "..";

export interface CandidateBasicInfo {
  id: number;
  username: string;
  email: string | null;
}

export interface InterviewSessionWithDuration extends InterviewSession {
  duration?: number; 
}
