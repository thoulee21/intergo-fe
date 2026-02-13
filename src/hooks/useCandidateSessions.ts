import { recruiterAPI } from "@/services/api";
import type {
  CandidateBasicInfo,
  InterviewSessionWithDuration,
} from "@/types/recruiter/candidates";
import { useCallback, useEffect, useState } from "react";

export function useFetchCandidateSessions(candidateId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  const [sessions, setSessions] = useState<InterviewSessionWithDuration[]>([]);
  const [candidate, setCandidate] = useState<CandidateBasicInfo | null>(null);

  const fetchCandidateSessions = useCallback(async () => {
    if (!candidateId) return;

    try {
      setLoading(true);

      const [candidateResponse, sessionsResponse] = await Promise.all([
        recruiterAPI.getCandidateDetail(parseInt(candidateId)),
        recruiterAPI.getCandidateSessions(parseInt(candidateId)),
      ]);

      if (candidateResponse.data && candidateResponse.data.candidate) {
        const candidateData = candidateResponse.data.candidate;
        setCandidate({
          id: candidateData.id,
          username: candidateData.username,
          email: candidateData.email,
        });
      }

      if (sessionsResponse.data && sessionsResponse.data.sessions) {
        const processedSessions = sessionsResponse.data.sessions.map(
          (session: any) => {
            let duration = undefined;
            if (session.start_time && session.end_time) {
              const startTime = new Date(session.start_time);
              const endTime = new Date(session.end_time);
              duration = Math.round(
                (endTime.getTime() - startTime.getTime()) / 60000,
              ); 
            }

            return {
              session_id: session.session_id,
              position_type: session.position_type,
              difficulty: session.difficulty,
              start_time: session.start_time,
              end_time: session.end_time,
              status: session.status,
              duration,
            };
          },
        );

        setSessions(processedSessions);
      } else {
        setSessions([]);
      }
    } catch (error) {
      setCandidate(null);
      setSessions([]);

      console.error("获取求职者面试会话失败:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    fetchCandidateSessions();
  }, [candidateId, fetchCandidateSessions]);

  return { sessions, candidate, loading, error, fetchCandidateSessions };
}
