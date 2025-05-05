import { ReactNode } from 'react';

export default function AuthLayout({
  children,
  signinmodal
}: {
  children: ReactNode;
  signinmodal: ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      {children}
      {/* This ensures modals render outside normal flow */}
      <div className="pointer-events-none fixed inset-0">{signinmodal}</div>
    </div>
  );
}
