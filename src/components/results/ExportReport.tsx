import { recruiterAPI } from "@/services/api";
import {
  DownloadOutlined,
  FilePdfFilled,
  FileWordFilled,
} from "@ant-design/icons";
import { App, Button, Select, Space } from "antd";
import { useState } from "react";

export default function ExportReport({ sessionId }: { sessionId: string }) {
  const { message: messageApi } = App.useApp();
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "docx">("pdf");

  const handleExportReport = async (
    sessionId: string,
    format: "pdf" | "docx",
  ) => {
    try {
      messageApi.loading("正在生成报告，请稍候...", 0);

      const response = await recruiterAPI.exportInterviewReport(
        sessionId,
        format,
      );

      const blob = new Blob([response.data], {
        type:
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let filename = `面试报告_${sessionId.slice(0, 8)}.${format}`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
        if (match) {
          filename = decodeURIComponent(match[1]);
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      messageApi.destroy();
      messageApi.success(`${format.toUpperCase()}报告下载成功`);
    } catch (error) {
      messageApi.destroy();
      console.error("导出面试报告失败:", error);
      messageApi.error("导出报告失败，请稍后重试");
    }
  };

  const handleDownload = () => {
    handleExportReport(sessionId, selectedFormat);
  };

  return (
    <Space>
      <Select
        value={selectedFormat}
        onChange={setSelectedFormat}
        style={{ width: 120 }}
        options={[
          {
            value: "pdf",
            label: (
              <Space>
                <FilePdfFilled style={{ color: "red" }} />
                PDF
              </Space>
            ),
          },
          {
            value: "docx",
            label: (
              <Space>
                <FileWordFilled style={{ color: "#1890ff" }} />
                Word
              </Space>
            ),
          },
        ]}
      />
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={handleDownload}
      >
        导出
      </Button>
    </Space>
  );
}
