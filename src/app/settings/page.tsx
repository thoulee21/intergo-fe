"use client";

import { useSettings } from "@/hooks/useSettings";
import {
  BgColorsOutlined,
  CompressOutlined,
  FontSizeOutlined,
  MoonOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Card,
  ColorPicker,
  Divider,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";

const { Title, Text } = Typography;

export default function SettingsPanel() {
  const {
    compactMode,
    darkMode,
    fontSize,
    primaryColor,
    updateCompactMode,
    updateDarkMode,
    updateFontSize,
    updatePrimaryColor,
  } = useSettings();

  return (
    <Card
      title={
        <Space>
          <SettingOutlined />
          <span>界面设置</span>
        </Space>
      }
    >
      {}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <Title level={5} style={{ margin: 0 }}>
            <Space>
              <CompressOutlined />
              紧凑模式
            </Space>
          </Title>
          <Text type="secondary">
            选择界面紧凑程度，以适应不同的屏幕尺寸和用户偏好
          </Text>
        </div>
        <Select
          value={compactMode}
          onChange={updateCompactMode}
          style={{ width: 100 }}
          options={[
            { label: "否", value: "no" },
            { label: "是", value: "yes" },
            { label: "自动", value: "auto" },
          ]}
        />
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={5} style={{ margin: 0 }}>
            <Space>
              <FontSizeOutlined />
              字体大小
            </Space>
          </Title>
          <Text type="secondary">
            调整界面中文字的显示大小，以适应不同的阅读习惯和屏幕分辨率
          </Text>
        </div>
        <Select
          value={fontSize}
          onChange={updateFontSize}
          style={{ width: 100 }}
          options={[
            { label: "小号", value: "small" },
            { label: "中号", value: "medium" },
            { label: "大号", value: "large" },
            { label: "自动", value: "auto" },
          ]}
        />
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <Title level={5} style={{ margin: 0, marginRight: "8px" }}>
              <Space>
                <BgColorsOutlined />
                主题色
              </Space>
            </Title>
            <Tooltip title="主题色目前处于测试阶段，可能存在一些界面问题">
              <Tag
                color="orange"
                style={{
                  fontSize: "10px",
                  height: "18px",
                  lineHeight: "16px",
                  cursor: "pointer",
                }}
              >
                BETA
              </Tag>
            </Tooltip>
          </div>
          <Text type="secondary">
            选择界面的主题颜色，目前仅部分组件支持主题色切换
          </Text>
        </div>
        <ColorPicker
          value={primaryColor}
          onChange={(color) => updatePrimaryColor(color.toHexString())}
          showText
          defaultValue={"#1890ff"} // 默认蓝色
          presets={[
            {
              label: "推荐色彩",
              colors: [
                "#1890ff", 
                "#52c41a", 
                "#fa8c16", 
                "#eb2f96", 
                "#722ed1", 
                "#13c2c2", 
                "#fa541c", 
                "#2f54eb", 
              ],
            },
          ]}
        />
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
            }}
          >
            <Title level={5} style={{ margin: 0, marginRight: "8px" }}>
              <Space>
                <MoonOutlined />
                深色模式
              </Space>
            </Title>
          </div>
          <Text type="secondary">
            选择界面主题，深色模式可以减少眼睛疲劳，特别是在低光环境下使用时
          </Text>
        </div>
        <Select
          value={darkMode}
          onChange={updateDarkMode}
          style={{ width: 100 }}
          options={[
            { label: "否", value: "no" },
            { label: "是", value: "yes" },
            {
              label: "自动",
              value: "auto",
              // 如果不支持 matchMedia，则禁用自动选项
              disabled: typeof window !== "object" || !window.matchMedia,
            },
          ]}
        />
      </div>
    </Card>
  );
}
