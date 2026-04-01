"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Code2, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { label:"Home",      href:"/" },
  { label:"Services",  href:"/services" },
  { label:"Portfolio", href:"/portfolio" },
  { label:"About",     href:"/about" },
  { label:"Contact",   href:"/contact" },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark,     setDark]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("cairn_theme");
    const sys   = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : sys;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const toggleDark = useCallback(() => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("cairn_theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  const navBg = scrolled
    ? "rgba(242,234,224,0.92)"
    : "transparent";
  const navBgDark = scrolled
    ? "rgba(15,11,26,0.92)"
    : "transparent";

  return (
    <header style={{
      position:"fixed", top:0, left:0, right:0, zIndex:50,
      transition:"all 0.3s ease",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      boxShadow: scrolled ? "0 2px 20px rgba(26,10,46,0.06)" : "none",
    }}>
      {/* bg layer responds to dark mode */}
      <div style={{
        position:"absolute", inset:0, zIndex:-1,
        backgroundColor:"var(--page-bg)",
        opacity: scrolled ? 0.92 : 0,
        transition:"opacity 0.3s",
      }}/>

      <div className="page-container">
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", height:"68px"}}>
          {/* Logo */}
          <Link href="/" style={{display:"flex", alignItems:"center", gap:"10px", textDecoration:"none"}}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:"linear-gradient(135deg, var(--accent), var(--sky))",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 12px rgba(155,142,199,0.35)",
            }}>
              <Code2 size={18} color="#fff"/>
            </div>
            <span className="font-heading" style={{fontWeight:800, fontSize:"1.2rem", color:"var(--txt-primary)"}}>
              Cairn<span style={{color:"var(--accent)"}}>Tech</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{display:"flex", alignItems:"center", gap:4}} className="hidden-mobile">
            {NAV_LINKS.map(l => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href} style={{
                  padding:"8px 16px", borderRadius:10, fontSize:"0.875rem", fontWeight:500,
                  color: active ? "var(--accent-text)" : "var(--txt-secondary)",
                  background: active ? "var(--accent-light)" : "transparent",
                  transition:"all 0.15s", textDecoration:"none",
                }}>
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div style={{display:"flex", alignItems:"center", gap:8}}>
            <button onClick={toggleDark} aria-label="Toggle dark mode" style={{
              width:36, height:36, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center",
              background:"var(--surface-2)", border:"1px solid var(--border)", cursor:"pointer",
              color:"var(--txt-muted)", transition:"all 0.15s",
            }}>
              {dark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
            <Link href="/contact" className="btn-primary desktop-only" style={{padding:"9px 18px", fontSize:"0.875rem"}}>
              Get a Quote <ChevronRight size={15}/>
            </Link>
            <button onClick={() => setOpen(!open)} className="mobile-only" style={{
              width:36, height:36, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center",
              background:"var(--surface-2)", border:"1px solid var(--border)", cursor:"pointer",
              color:"var(--txt-secondary)",
            }}>
              {open ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:0.2}}
            style={{background:"var(--surface)", borderTop:"1px solid var(--border)", overflow:"hidden"}}>
            <div style={{padding:"12px 16px", display:"flex", flexDirection:"column", gap:4}}>
              {NAV_LINKS.map(l => {
                const active = pathname === l.href;
                return (
                  <Link key={l.href} href={l.href} style={{
                    padding:"11px 16px", borderRadius:10, fontSize:"0.9rem", fontWeight:500,
                    color: active ? "var(--accent-text)" : "var(--txt-secondary)",
                    background: active ? "var(--accent-light)" : "transparent",
                    textDecoration:"none",
                  }}>{l.label}</Link>
                );
              })}
              <Link href="/contact" className="btn-primary" style={{justifyContent:"center", marginTop:6}}>
                Get a Free Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(max-width:768px){ .hidden-mobile{display:none!important} .desktop-only{display:none!important} }
        @media(min-width:769px){ .mobile-only{display:none!important} }
      `}</style>
    </header>
  );
}
