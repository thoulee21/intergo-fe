export interface Skill {
  name: string;
  priority: string;
  reason: string;
}

export interface CareerGoal {
  timeline: string;
  goal: string;
  steps: string[];
}

export interface LearningPath {
  id: number;
  userId: number;
  username: string;
  title: string;
  description: string;
  recommendations: string[];
  skillsToImprove: Skill[];
  careerGoals: CareerGoal[];
  interestedPositionTypes: number[];
  createdAt: string;
}
