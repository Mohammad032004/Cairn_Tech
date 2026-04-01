"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"var(--page-bg)"}}>
      <Navbar/>
      <main style={{flex:1}}>{children}</main>
      <Footer/>
    </div>
  );
}
