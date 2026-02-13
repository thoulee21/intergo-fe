"use client";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}

      <style jsx global>{`
        .text-center {
          text-align: center;
        }

        .markdown-content {
          line-height: 1.8;
        }

        .score-item {
          padding: 16px;
        }
      `}</style>
    </>
  );
}
