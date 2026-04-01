"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, BookOpen, DollarSign, MessageSquare, Bell, TrendingUp, ArrowRight, AlertTriangle, Zap, Sparkles } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const fU = { hidden:{opacity:0,y:14}, show:{opacity:1,y:0} };
const st = { show:{transition:{staggerChildren:0.07}} };

function StatCard({ icon:Icon, label, value, sub, accentColor, href }: any) {
  return (
    <motion.div variants={fU}>
      <Link href={href||"#"} style={{textDecoration:"none",display:"block"}}>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:"1.25rem",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,boxShadow:"var(--shadow-sm)",transition:"all 0.2s",cursor:"pointer"}}
          onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow="var(--shadow-md)";(e.currentTarget as HTMLDivElement).style.transform="translateY(-2px)";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow="var(--shadow-sm)";(e.currentTarget as HTMLDivElement).style.transform="none";}}>
          <div>
            <div style={{fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:8}}>{label}</div>
            <div className="font-heading" style={{fontSize:"2rem",fontWeight:800,color:"var(--txt-primary)"}}>{value}</div>
            {sub&&<div style={{fontSize:"0.75rem",color:"var(--txt-faint)",marginTop:4}}>{sub}</div>}
          </div>
          <div style={{width:44,height:44,borderRadius:12,background:`${accentColor}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon size={22} color={accentColor}/>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [admin,   setAdmin]   = useState<any>(null);

  useEffect(()=>{
    const token = localStorage.getItem("cairn_admin_token");
    fetch("/api/auth",{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.json()).then(d=>{ if(d.success) setAdmin(d.admin); });
    fetch("/api/admin/dashboard",{headers:{Authorization:`Bearer ${token}`}})
      .then(r=>r.json()).then(d=>{ if(d.success) setStats(d.data); }).finally(()=>setLoading(false));
  },[]);

  const now = new Date();
  const h   = now.getHours();
  const greeting = h<12?"Good morning":h<17?"Good afternoon":"Good evening";

  if(loading) return (
    <AdminLayout>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:240}}>
        <div style={{width:32,height:32,border:"2px solid var(--accent)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </AdminLayout>
  );

  const urgent = (stats?.recentContacts||[]).filter((c:any)=>c.urgency!=="normal"&&c.status!=="resolved");

  return (
    <AdminLayout>
      <div style={{padding:"1.5rem",maxWidth:1100}}>
        {/* Header */}
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} style={{marginBottom:"1.75rem",display:"flex",flexWrap:"wrap",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div>
            <h1 className="font-heading" style={{fontSize:"1.75rem",fontWeight:800,color:"var(--txt-primary)"}}>
              {greeting}, <span style={{color:"var(--accent)"}}>{admin?.username||"Admin"}</span> 👋
            </h1>
            <p style={{color:"var(--txt-muted)",marginTop:4,fontSize:"0.875rem"}}>
              {now.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
            </p>
          </div>
          {(stats?.newContacts>0||stats?.pendingBookings>0)&&(
            <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(201,124,42,0.1)",color:"var(--amber)",padding:"10px 16px",borderRadius:12,border:"1px solid rgba(201,124,42,0.2)",fontSize:"0.875rem",fontWeight:600}}>
              <Bell size={15}/> {stats.newContacts>0&&`${stats.newContacts} new msg`}{stats.newContacts>0&&stats.pendingBookings>0&&" · "}{stats.pendingBookings>0&&`${stats.pendingBookings} pending`}
            </div>
          )}
        </motion.div>

        {/* Urgent alert */}
        {urgent.length>0&&(
          <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
            style={{background:"rgba(201,64,64,0.07)",border:"1px solid rgba(201,64,64,0.2)",borderRadius:12,padding:"12px 16px",marginBottom:"1.25rem",display:"flex",alignItems:"flex-start",gap:10}}>
            <AlertTriangle size={17} color="var(--red)" style={{flexShrink:0,marginTop:1}}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,color:"var(--red)",fontSize:"0.875rem"}}>{urgent.length} urgent message{urgent.length!==1?"s":""} need attention</div>
              <div style={{fontSize:"0.78rem",color:"var(--txt-muted)",marginTop:2}}>{urgent.map((c:any)=>c.name).join(", ")}</div>
            </div>
            <Link href="/admin/contacts" style={{fontSize:"0.78rem",fontWeight:700,color:"var(--red)",textDecoration:"none"}}>View →</Link>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div variants={st} initial="hidden" animate="show" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem",marginBottom:"1.75rem"}}>
          <StatCard icon={BookOpen}      label="Total Bookings" value={stats?.totalBookings??0}   sub={`${stats?.pendingBookings??0} pending`}      accentColor="var(--accent)"  href="/admin/bookings"/>
          <StatCard icon={MessageSquare} label="Messages"        value={stats?.totalContacts??0}    sub={`${stats?.newContacts??0} unread`}            accentColor="var(--sky-hover)" href="/admin/contacts"/>
          <StatCard icon={DollarSign}    label="Total Revenue"   value={`₹${((stats?.totalRevenue??0)/1000).toFixed(1)}K`} sub="from completed"         accentColor="var(--emerald)" href="/admin/clients"/>
          <StatCard icon={Users}         label="Clients"         value={stats?.totalBookings??0}    sub="from bookings"                                accentColor="var(--lilac-hover)" href="/admin/clients"/>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={fU} initial="hidden" animate="show" style={{marginBottom:"1.75rem"}}>
          <h2 className="font-heading" style={{fontSize:"1rem",fontWeight:700,color:"var(--txt-primary)",marginBottom:"0.875rem",display:"flex",alignItems:"center",gap:7}}>
            <Zap size={16} color="var(--accent)"/> Quick Actions
          </h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"0.875rem"}}>
            {[{label:"New Message",sub:"View inbox",href:"/admin/contacts",emoji:"✉️"},{label:"Bookings",sub:"Manage orders",href:"/admin/bookings",emoji:"📋"},{label:"Add Service",sub:"Update offerings",href:"/admin/services-mgmt",emoji:"⚙️"},{label:"Manage Team",sub:"About page",href:"/admin/team",emoji:"👥"}].map(q=>(
              <Link key={q.href} href={q.href} style={{textDecoration:"none"}}>
                <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:"1rem",transition:"all 0.2s",cursor:"pointer",boxShadow:"var(--shadow-sm)"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor="var(--accent)";(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor="var(--border)";(e.currentTarget as HTMLDivElement).style.transform="none";}}>
                  <div style={{fontSize:"1.5rem",marginBottom:8}}>{q.emoji}</div>
                  <div style={{fontWeight:600,fontSize:"0.875rem",color:"var(--txt-primary)"}}>{q.label}</div>
                  <div style={{fontSize:"0.75rem",color:"var(--txt-faint)",marginTop:3}}>{q.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"1.25rem"}}>
          {/* Bookings */}
          <motion.div variants={fU} initial="hidden" animate="show" style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",boxShadow:"var(--shadow-sm)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 1.25rem",borderBottom:"1px solid var(--border)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <BookOpen size={16} color="var(--accent)"/>
                <span className="font-heading" style={{fontWeight:700,fontSize:"0.9375rem",color:"var(--txt-primary)"}}>Recent Bookings</span>
              </div>
              <Link href="/admin/bookings" style={{fontSize:"0.78rem",fontWeight:700,color:"var(--accent)",textDecoration:"none",display:"flex",alignItems:"center",gap:3}}>All <ArrowRight size={12}/></Link>
            </div>
            {(stats?.recentBookings||[]).length===0
              ? <div style={{padding:"2rem",textAlign:"center",color:"var(--txt-faint)",fontSize:"0.875rem"}}>No bookings yet</div>
              : (stats.recentBookings||[]).map((b:any)=>(
                <div key={b._id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,padding:"12px 20px",borderBottom:"1px solid var(--border-subtle)",transition:"background 0.15s"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background="var(--surface-2)"}} onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background="transparent"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
                    <div style={{width:32,height:32,borderRadius:9,background:"var(--accent-light)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent)",fontWeight:700,fontSize:"0.78rem",flexShrink:0}}>{b.name?.[0]?.toUpperCase()}</div>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:"0.875rem",fontWeight:600,color:"var(--txt-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div>
                      <div style={{fontSize:"0.75rem",color:"var(--txt-faint)"}}>{b.plan} · ₹{(b.finalAmount||b.planPrice||0).toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                  <span className={`badge ${b.status==="completed"?"badge-green":b.status==="in-progress"?"badge-sky":"badge-orange"}`}>{b.status}</span>
                </div>
              ))
            }
          </motion.div>

          {/* Messages */}
          <motion.div variants={fU} initial="hidden" animate="show" transition={{delay:0.06}} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",boxShadow:"var(--shadow-sm)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 1.25rem",borderBottom:"1px solid var(--border)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <MessageSquare size={16} color="var(--sky-hover)"/>
                <span className="font-heading" style={{fontWeight:700,fontSize:"0.9375rem",color:"var(--txt-primary)"}}>Recent Messages</span>
                {stats?.newContacts>0&&<span className="badge badge-red">{stats.newContacts} new</span>}
              </div>
              <Link href="/admin/contacts" style={{fontSize:"0.78rem",fontWeight:700,color:"var(--accent)",textDecoration:"none",display:"flex",alignItems:"center",gap:3}}>All <ArrowRight size={12}/></Link>
            </div>
            {(stats?.recentContacts||[]).length===0
              ? <div style={{padding:"2rem",textAlign:"center",color:"var(--txt-faint)",fontSize:"0.875rem"}}>No messages yet</div>
              : (stats.recentContacts||[]).map((c:any)=>(
                <div key={c._id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,padding:"12px 20px",borderBottom:"1px solid var(--border-subtle)",transition:"background 0.15s"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background="var(--surface-2)"}} onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background="transparent"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:c.status==="new"?"var(--sky)":"var(--border)",flexShrink:0}}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:"0.875rem",fontWeight:600,color:"var(--txt-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                      <div style={{fontSize:"0.75rem",color:"var(--txt-faint)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.message?.slice(0,44)}…</div>
                    </div>
                  </div>
                  <span className={`badge ${c.urgency==="very-urgent"?"badge-red":c.urgency==="urgent"?"badge-orange":"badge-gray"}`}>{c.urgency}</span>
                </div>
              ))
            }
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
}
