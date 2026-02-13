export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "63.5vh",
        width: "100%",
        marginBottom: "24px",
      }}
    >
      {children}
    </div>
  );
}
