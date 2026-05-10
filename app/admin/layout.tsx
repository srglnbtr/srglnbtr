export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text antialiased">
      {children}
    </div>
  );
}
