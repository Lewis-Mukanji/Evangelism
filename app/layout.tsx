import type { Metadata } from "next";
import "./tailwind.css";
import "./globals.css";
import "./components.css";

export const metadata: Metadata = {
  title: "FOLLOWHIM | Discipleship",
  description: "Follow Jesus. Grow daily. Make disciples."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
