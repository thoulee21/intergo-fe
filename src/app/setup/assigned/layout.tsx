import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "专属面试场景预设",
};

export default function AssignedPresetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ height: "84vh" }}>{children}</div>;
}
