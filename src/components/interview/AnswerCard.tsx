import { AudioOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space } from "antd";

const { TextArea } = Input;

export default function AnswerCard({
  answer,
  setAnswer,
  handleSubmitAnswer,
  loading,
  recognizing,
  handleVoiceInput,
  isRecognitionAvailable,
}: {
  answer: string;
  setAnswer: (value: string) => void;
  handleSubmitAnswer: () => void;
  loading: boolean;
  recognizing: boolean;
  handleVoiceInput: () => void;
  isRecognitionAvailable: boolean;
}) {
  return (
    <Card title="你的回答" className="answer-card">
      <TextArea
        rows={6}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="在此输入你的回答..."
        style={{ marginBottom: "20px" }}
        disabled={loading}
      />

      <Space
        size="small"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSubmitAnswer}
          loading={loading}
          block
          disabled={!answer.trim() || loading}
        >
          {loading ? "分析中..." : "提交回答"}
        </Button>
        {isRecognitionAvailable && (
          <Button
            type="default"
            icon={
              <AudioOutlined
                style={{ color: recognizing ? "#1677ff" : undefined }}
              />
            }
            onClick={handleVoiceInput}
            loading={recognizing}
            block
            disabled={loading || !isRecognitionAvailable || recognizing}
            style={{
              background: recognizing ? "rgba(24, 144, 255, 0.1)" : undefined,
              borderColor: recognizing ? "#1677ff" : undefined,
            }}
          >
            {recognizing ? "正在录音..." : "使用语音回答"}
          </Button>
        )}
      </Space>
    </Card>
  );
}
