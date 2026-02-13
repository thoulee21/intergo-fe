export type SessionType = {
  sessionId: string;
  positionType: string;
  difficulty: string;
  startTime: string;
  status: string;
  questionCount: number;
  answeredCount: number;
  duration?: number | null;
  userId?: number;
  username?: string;
};

export interface PositionType {
  id: number;
  value: string;
  label: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  usageCount?: number;
}

export interface RecruiterInfo {
  id: number;
  username: string;
  email: string;
}

export interface AssignedPreset {
  id: number;
  name: string;
  description: string;
  interview_params: Record<string, any>;
  creator_id: number;
  created_at: string;
  updated_at: string;
}

export type UserType = "candidate" | "recruiter";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  user_type: UserType;
  created_at: string;
  status: string;
  last_login: string;
  resume_text?: string;
  has_resume: boolean;
  invitation_code?: string;
  recruiter_info?: RecruiterInfo;
  assigned_preset?: AssignedPreset;
  invited_candidates_count?: number;
}

export interface InterviewSession {
  session_id: string;
  position_type: string;
  difficulty: string;
  start_time: string;
  end_time?: string;
  status: string;
}

export interface ResumeBackupMetadata {
  user_id: string;
  timestamp: string;
}

export interface ResumeBackup {
  name: string;
  size: number;
  last_modified: string;
  metadata?: ResumeBackupMetadata;
}
