import AudioAnalysis from "@/components/analysis/audio";
import VideoAnalysis from "@/components/analysis/video";
import type { AudioAnalysisType, VideoAnalysisType } from "@/types/session";

export default function MultimodalAnalysis({
  record,
}: {
  record: {
    videoAnalysis?: VideoAnalysisType;
    audioAnalysis?: AudioAnalysisType;
  };
}) {
  return (
    <>
      <VideoAnalysis record={record} />
      <AudioAnalysis record={record} />
    </>
  );
}
