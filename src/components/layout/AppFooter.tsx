import pkg from "@/../package.json";
import { Layout, theme } from "antd";
import Link from "next/link";
import { useMemo } from "react";

const { Footer } = Layout;

export default function AppFooter() {
  const { token } = theme.useToken();
  const year = useMemo(() => new Date().getFullYear(), []);

  const [version, author, displayName] = useMemo(() => {
    return [pkg.version, pkg.author, pkg.displayName];
  }, []);

  return (
    <Footer
      style={{
        textAlign: "center",
        maxHeight: "60px",
      }}
    >
      {displayName} v{version} ©{year}{" "}
      <Link
        href={author.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontWeight: 500, color: token.colorText }}
      >
        {author.name}
      </Link>
    </Footer>
  );
}
