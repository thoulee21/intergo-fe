import AuthGuard from "@/components/AuthGuard";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div
        style={{
          padding: "86px 24px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Breadcrumb
          style={{ marginBottom: 20 }}
          items={[
            {
              title: (
                <Link href="/">
                  <HomeOutlined style={{ marginRight: 8 }} />
                  首页
                </Link>
              ),
            },
            {
              title: (
                <span>
                  <SettingOutlined style={{ marginRight: 8 }} />
                  设置
                </span>
              ),
            },
          ]}
        />

        {children}
      </div>
    </AuthGuard>
  );
}
