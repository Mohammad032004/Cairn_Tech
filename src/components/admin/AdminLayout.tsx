"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Code2,LayoutDashboard,BookOpen,MessageSquare,Users,DollarSign,Wrench,FolderOpen,LogOut,Menu,X,ChevronRight,Settings,UserCog,Sun,Moon,TrendingUp,Bell } from "lucide-react";

const ADMIN_LINKS = [
  { href:"/admin/dashboard",     icon:LayoutDashboard, label:"Dashboard" },
  { href:"/admin/bookings",      icon:BookOpen,         label:"Bookings" },
  { href:"/admin/contacts",      icon:MessageSquare,    label:"Messages" },
  { href:"/admin/clients",       icon:Users,            label:"Clients" },
  { href:"/admin/pricing",       icon:DollarSign,       label:"Pricing" },
  { href:"/admin/services-mgmt", icon:Wrench,           label:"Services" },
  { href:"/admin/projects",      icon:FolderOpen,       label:"Projects" },
  { href:"/admin/team",          icon:TrendingUp,       label:"Team" },
  { href:"/admin/employees",     icon:UserCog,          label:"Employees" },
  { href:"/admin/settings",      icon:Settings,         label:"Settings" },
];
const EMP_LINKS = [
  { href:"/admin/dashboard", icon:LayoutDashboard, label:"Dashboard",  perm:"" },
  { href:"/admin/bookings",  icon:BookOpen,         label:"Bookings",   perm:"viewBookings" },
  { href:"/admin/contacts",  icon:MessageSquare,    label:"Messages",   perm:"viewContacts" },
  { href:"/admin/clients",   icon:Users,            label:"Clients",    perm:"viewClients" },
];

const S = {
  sidebar:    { bg:"#1A1426", border:"rgba(155,142,199,0.12)" },
  sidebarDark:{ bg:"#1A1426", border:"rgba(155,142,199,0.12)" },
};

export default function AdminLayout({ children }: { children:React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open,     setOpen]     = useState(false);
  const [admin,    setAdmin]    = useState<any>(null);
  const [dark,     setDark]     = useState(false);
  const [newCount, setNewCount] = useState(0);

  useEffect(()=>{
    const saved = localStorage.getItem("cairn_theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  },[]);

  const toggleDark = () => {
    setDark(d=>{ const next=!d; document.documentElement.classList.toggle("dark",next); localStorage.setItem("cairn_theme",next?"dark":"light"); return next; });
  };

  useEffect(()=>{
    const token = localStorage.getItem("cairn_admin_token");
    if(!token){ router.replace("/admin/login"); return; }
    fetch("/api/auth",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()).then(d=>{
      if(d.success){ setAdmin(d.admin);
        fetch("/api/admin/dashboard",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()).then(d2=>{
          if(d2.success) setNewCount((d2.data.newContacts||0)+(d2.data.pendingBookings||0));
        });
      } else { localStorage.removeItem("cairn_admin_token"); router.replace("/admin/login"); }
    }).catch(()=>{ localStorage.removeItem("cairn_admin_token"); router.replace("/admin/login"); });
  },[router]);

  const logout = async () => { localStorage.removeItem("cairn_admin_token"); await fetch("/api/auth",{method:"DELETE"}); router.push("/admin/login"); };

  if(!admin) return (
    <div style={{minHeight:"100vh",background:"#100D18",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:36,height:36,border:"2px solid #9B8EC7",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px"}}/>
        <p style={{color:"#6A5888",fontSize:"0.875rem"}}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const isAdmin = admin.role==="admin";
  const perms   = admin.permissions||{};
  const links   = isAdmin ? ADMIN_LINKS : EMP_LINKS.filter(l=>!l.perm||perms[l.perm]);

  const SidebarInner = ()=>(
    <aside style={{width:240,background:"#1A1426",borderRight:"1px solid rgba(155,142,199,0.1)",display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Logo */}
      <div style={{padding:"1.25rem 1.25rem 1rem",borderBottom:"1px solid rgba(155,142,199,0.1)"}}>
        <Link href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none",marginBottom:4}}>
          <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#9B8EC7,#BDA6CE)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(155,142,199,0.3)"}}>
            <Code2 size={17} color="#fff"/>
          </div>
          <span className="font-heading" style={{fontWeight:800,fontSize:"1.1rem",color:"#F0EBF8"}}>
            Cairn<span style={{color:"#A898D0"}}>Tech</span>
          </span>
        </Link>
        <div style={{fontSize:"0.72rem",color:"#5A4870",fontWeight:600,paddingLeft:44}}>{isAdmin?"Admin Panel":"Employee Panel"}</div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"0.75rem",overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
        {links.map(({href,icon:Icon,label})=>{
          const active = pathname===href;
          return (
            <Link key={href} href={href} onClick={()=>setOpen(false)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,fontSize:"0.875rem",fontWeight:active?600:500,textDecoration:"none",transition:"all 0.15s",
                background:active?"rgba(155,142,199,0.15)":"transparent",
                color:active?"#C8B8E8":"#7A6880",
              }}>
              <Icon size={16} style={{flexShrink:0}}/>
              <span style={{flex:1}}>{label}</span>
              {label==="Messages"&&newCount>0&&(
                <span style={{width:18,height:18,borderRadius:"50%",background:"#C94040",color:"#fff",fontSize:"0.65rem",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{newCount>9?"9+":newCount}</span>
              )}
              {active&&<ChevronRight size={13} style={{opacity:0.4}}/>}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{padding:"0.75rem 0.75rem 1rem",borderTop:"1px solid rgba(155,142,199,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:"rgba(155,142,199,0.07)",marginBottom:6}}>
          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#9B8EC7,#BDA6CE)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:"0.85rem",flexShrink:0}}>
            {admin.username?.[0]?.toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"0.875rem",fontWeight:600,color:"#F0EBF8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{admin.username}</div>
            <div style={{fontSize:"0.72rem",color:"#5A4870"}}>{isAdmin?"Administrator":"Employee"}</div>
          </div>
          <button onClick={toggleDark} style={{width:28,height:28,borderRadius:7,background:"rgba(155,142,199,0.1)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#7A6880",flexShrink:0}}>
            {dark?<Sun size={13}/>:<Moon size={13}/>}
          </button>
        </div>
        <button onClick={logout} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,fontSize:"0.875rem",fontWeight:500,width:"100%",border:"none",cursor:"pointer",background:"transparent",color:"#C94040",transition:"all 0.15s",fontFamily:"DM Sans,sans-serif"}}>
          <LogOut size={15}/> Sign Out
        </button>
      </div>
    </aside>
  );

  const mainBg = dark ? "#100D18" : "#F5F0EA";

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:mainBg}}>
      {/* Desktop sidebar */}
      <div style={{display:"none"}} className="lg-sidebar"><SidebarInner/></div>
      <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column"}} className="hide-on-mobile">
        <SidebarInner/>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,zIndex:50,display:"flex"}}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"}}/>
            <motion.div initial={{x:-244}} animate={{x:0}} exit={{x:-244}} transition={{type:"spring",damping:30,stiffness:300}} style={{position:"relative",width:240,flexShrink:0,zIndex:1}}>
              <SidebarInner/>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>
        {/* Mobile topbar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"#1A1426",borderBottom:"1px solid rgba(155,142,199,0.1)"}} className="show-on-mobile-flex">
          <button onClick={()=>setOpen(true)} style={{width:36,height:36,borderRadius:9,background:"rgba(155,142,199,0.1)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#C8B8E8"}}>
            <Menu size={18}/>
          </button>
          <span className="font-heading" style={{fontWeight:800,color:"#F0EBF8",fontSize:"1.1rem"}}>Cairn<span style={{color:"#A898D0"}}>Tech</span></span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {newCount>0&&(
              <Link href="/admin/contacts" style={{position:"relative",width:36,height:36,borderRadius:9,background:"rgba(155,142,199,0.1)",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                <Bell size={16} color="#C8B8E8"/>
                <span style={{position:"absolute",top:6,right:6,width:8,height:8,background:"#C94040",borderRadius:"50%"}}/>
              </Link>
            )}
            <button onClick={toggleDark} style={{width:36,height:36,borderRadius:9,background:"rgba(155,142,199,0.1)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#C8B8E8"}}>
              {dark?<Sun size={16}/>:<Moon size={16}/>}
            </button>
          </div>
        </div>
        <main style={{flex:1,overflowY:"auto",background:mainBg}}>{children}</main>
      </div>

      <style>{`
        @media(max-width:768px){ .hide-on-mobile{display:none!important} .show-on-mobile-flex{display:flex!important} }
        @media(min-width:769px){ .show-on-mobile-flex{display:none!important} }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
