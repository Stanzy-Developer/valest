import { ReactNode } from "react";

export default function QRCodeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      {children}
    </div>
  );
}
