import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: { default: "Cairn Tech — Code. Create. Maintain.", template: "%s | Cairn Tech" },
  description: "Cairn Tech is a modern software agency specializing in website development, app development, and maintenance services.",
  keywords: ["web development", "app development", "software agency", "Cairn Tech", "SEO", "maintenance"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:`
          (function(){
            var t=localStorage.getItem('cairn_theme');
            var sys=window.matchMedia('(prefers-color-scheme: dark)').matches;
            if(t==='dark'||(t===null&&sys)){document.documentElement.classList.add('dark');}
          })();
        `}} />
      </head>
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: "DM Sans, sans-serif", borderRadius: "12px", fontSize: "14px", fontWeight: "500" } }} />
      </body>
    </html>
  );
}
