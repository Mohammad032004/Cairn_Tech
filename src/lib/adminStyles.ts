// Shared style tokens for admin pages - all use CSS variables from globals.css
export const A = {
  // Page wrapper
  page: { padding: "1.5rem", maxWidth: 1100 } as React.CSSProperties,

  // Typography
  h1: { fontFamily:"Syne,sans-serif", fontSize:"1.75rem", fontWeight:800, color:"var(--txt-primary)", display:"flex", alignItems:"center", gap:10 } as React.CSSProperties,
  h2: { fontFamily:"Syne,sans-serif", fontSize:"1.1rem", fontWeight:700, color:"var(--txt-primary)" } as React.CSSProperties,
  sub: { fontSize:"0.875rem", color:"var(--txt-muted)", marginTop:4 } as React.CSSProperties,
  label: { display:"block", fontSize:"0.8rem", fontWeight:600, color:"var(--txt-muted)", marginBottom:6 } as React.CSSProperties,
  muted: { color:"var(--txt-muted)", fontSize:"0.875rem" } as React.CSSProperties,
  faint: { color:"var(--txt-faint)", fontSize:"0.78rem" } as React.CSSProperties,

  // Cards
  card: { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, boxShadow:"var(--shadow-sm)" } as React.CSSProperties,
  cardP: { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, boxShadow:"var(--shadow-sm)", padding:"1.25rem 1.5rem" } as React.CSSProperties,

  // Row hover - use via onMouseEnter/Leave
  rowBase: { display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"12px 20px", borderBottom:"1px solid var(--border-subtle)", transition:"background 0.15s", cursor:"default" } as React.CSSProperties,

  // Avatar
  avatar: (color="var(--accent-light)", text="var(--accent)") => ({
    width:38, height:38, borderRadius:11,
    background: color, display:"flex", alignItems:"center", justifyContent:"center",
    color: text, fontWeight:700, fontSize:"0.85rem", flexShrink:0,
  } as React.CSSProperties),

  // Input field (inline override of .input-field for selects needing bg)
  select: { width:"100%", padding:"10px 14px", borderRadius:12, border:"1.5px solid var(--border)", background:"var(--surface)", color:"var(--txt-primary)", fontSize:"0.875rem", outline:"none", cursor:"pointer", fontFamily:"DM Sans,sans-serif" } as React.CSSProperties,

  // Buttons
  iconBtn: (color="var(--txt-muted)") => ({
    width:32, height:32, borderRadius:9, border:"1px solid var(--border)",
    background:"var(--surface-2)", cursor:"pointer", display:"flex",
    alignItems:"center", justifyContent:"center", color, transition:"all 0.15s",
  } as React.CSSProperties),

  // Modal overlay
  overlay: { position:"fixed" as const, inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(15,11,26,0.6)", backdropFilter:"blur(8px)" },
  modal: { background:"var(--surface)", borderRadius:20, boxShadow:"0 24px 64px rgba(15,11,26,0.4)", width:"100%", maxWidth:520, padding:"1.5rem", maxHeight:"90vh", overflowY:"auto" as const, border:"1px solid var(--border)" },

  // Section header row
  header: { marginBottom:"1.5rem", display:"flex", flexWrap:"wrap" as const, alignItems:"flex-start", justifyContent:"space-between", gap:12 },

  // Spinner
  spinner: { width:28, height:28, border:"2px solid var(--accent)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" } as React.CSSProperties,
  center: { display:"flex", alignItems:"center", justifyContent:"center", height:200 } as React.CSSProperties,

  // Empty state
  empty: { padding:"3rem", textAlign:"center" as const, color:"var(--txt-faint)", fontSize:"0.9rem" } as React.CSSProperties,
};
