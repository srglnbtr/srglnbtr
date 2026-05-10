import { AuthGuard } from "@/admin/components/AuthGuard";
import { AdminShell } from "@/admin/components/AdminShell";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
