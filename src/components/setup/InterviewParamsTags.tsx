import { Tag } from "antd";

export default function InterviewParamsTags({
  interviewParams,
}: {
  interviewParams: Record<string, any>;
}) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexWrap: "wrap",
        marginBottom: "16px",
      }}
    >
      {Object.entries(interviewParams)
        .filter(([, value]) => typeof value === "string")
        .filter(([, value]) => value.trim() !== "")
        .map(([key, value]) => (
          <Tag key={key} color="blue" style={{ margin: "2px" }}>
            {value as string}
          </Tag>
        ))}
    </div>
  );
}
