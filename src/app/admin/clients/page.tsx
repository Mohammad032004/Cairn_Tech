"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const PLAN_BADGE:Record<string,string>={Starter:"badge-gray",Professional:"badge-violet",Enterprise:"badge-green"};
const URG_BADGE:Record<string,string>={normal:"badge-gray",urgent:"badge-orange","very-urgent":"badge-red"};

export default function ClientsPage(){
  const [clients,setClients]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [planFilter,setPlanFilter]=useState("");
  const [urgFilter,setUrgFilter]=useState("");

  const token=()=>typeof window!=="undefined"?localStorage.getItem("cairn_admin_token"):"";
  useEffect(()=>{
    fetch("/api/admin/bookings",{headers:{Authorization:`Bearer ${token()}`}}).then(r=>r.json()).then(d=>{if(d.success)setClients(d.data);}).finally(()=>setLoading(false));
  },[]);

  const filtered=clients.filter(c=>{
    const ms=!search||c.name.toLowerCase().includes(search.toLowerCase())||c.email.toLowerCase().includes(search.toLowerCase());
    const mp=!planFilter||c.plan===planFilter;
    const mu=!urgFilter||c.urgency===urgFilter;
    return ms&&mp&&mu;
  });
  const rev=filtered.reduce((s,c)=>s+(c.planPrice||0),0);
  const card={background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,boxShadow:"var(--shadow-sm)"} as React.CSSProperties;
  const sel={padding:"10px 14px",borderRadius:12,border:"1.5px solid var(--border)",background:"var(--surface)",color:"var(--txt-primary)",fontSize:"0.875rem",outline:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",appearance:"none"} as React.CSSProperties;

  return(
    <AdminLayout>
      <div style={{padding:"1.5rem",maxWidth:1100}}>
        <div style={{marginBottom:"1.5rem"}}>
          <h1 style={{fontFamily:"Syne,sans-serif",fontSize:"1.75rem",fontWeight:800,color:"var(--txt-primary)",display:"flex",alignItems:"center",gap:10}}><Users size={26} color="var(--amber)"/>Clients</h1>
          <p style={{color:"var(--txt-muted)",marginTop:4,fontSize:"0.875rem"}}>{filtered.length} client{filtered.length!==1?"s":""} · Total value: <strong style={{color:"var(--emerald)"}}>₹{rev.toLocaleString("en-IN")}</strong></p>
        </div>

        <div style={{display:"flex",gap:10,marginBottom:"1.25rem",flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <Search size={14} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"var(--txt-faint)"}}/>
            <input className="input-field" style={{paddingLeft:36}} placeholder="Search clients..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select style={sel} value={planFilter} onChange={e=>setPlanFilter(e.target.value)}>
            <option value="">All Plans</option>
            {["Starter","Professional","Enterprise"].map(p=><option key={p} value={p}>{p}</option>)}
          </select>
          <select style={sel} value={urgFilter} onChange={e=>setUrgFilter(e.target.value)}>
            <option value="">All Urgency</option>
            {["normal","urgent","very-urgent"].map(u=><option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {loading?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200}}>
            <div style={{width:28,height:28,border:"2px solid var(--accent)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
          </div>
        ):(
          <div style={{...card,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.875rem"}}>
                <thead>
                  <tr style={{borderBottom:"1px solid var(--border)",background:"var(--surface-2)"}}>
                    {["Client","Plan","Value","Urgency","Status","Date"].map(h=>(
                      <th key={h} style={{textAlign:"left",padding:"12px 20px",fontWeight:700,color:"var(--txt-muted)",fontSize:"0.78rem",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length===0
                    ?<tr><td colSpan={6} style={{padding:"3rem",textAlign:"center",color:"var(--txt-faint)"}}>No clients found.</td></tr>
                    :filtered.map((c,i)=>(
                    <motion.tr key={c._id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
                      style={{borderBottom:"1px solid var(--border-subtle)",transition:"background 0.15s"}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--surface-2)"}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent"}}>
                      <td style={{padding:"12px 20px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:34,height:34,borderRadius:10,background:"rgba(201,124,42,0.12)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--amber)",fontWeight:700,fontSize:"0.8rem",flexShrink:0}}>{c.name?.[0]?.toUpperCase()}</div>
                          <div>
                            <div style={{fontWeight:600,color:"var(--txt-primary)"}}>{c.name}</div>
                            <div style={{fontSize:"0.75rem",color:"var(--txt-faint)"}}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{padding:"12px 20px"}}><span className={PLAN_BADGE[c.plan]||"badge-gray"}>{c.plan}</span></td>
                      <td style={{padding:"12px 20px",fontWeight:700,color:"var(--emerald)"}}>₹{(c.planPrice||0).toLocaleString("en-IN")}</td>
                      <td style={{padding:"12px 20px"}}><span className={URG_BADGE[c.urgency]||"badge-gray"}>{c.urgency}</span></td>
                      <td style={{padding:"12px 20px"}}><span className={c.status==="completed"?"badge-green":c.status==="in-progress"?"badge-sky":"badge-orange"}>{c.status}</span></td>
                      <td style={{padding:"12px 20px",color:"var(--txt-faint)",fontSize:"0.8rem"}}>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
}
