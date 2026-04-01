"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, CheckCircle, Search, ChevronDown, ChevronUp, Mail } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import toast from "react-hot-toast";

const UB:Record<string,string>={normal:"badge-gray",urgent:"badge-orange","very-urgent":"badge-red"};
const SB:Record<string,string>={new:"badge-violet",read:"badge-gray",resolved:"badge-green"};

export default function ContactsPage(){
  const [contacts,setContacts]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [expanded,setExpanded]=useState<string|null>(null);

  const token=()=>typeof window!=="undefined"?localStorage.getItem("cairn_admin_token"):"";
  const headers=()=>({"Content-Type":"application/json",Authorization:`Bearer ${token()}`});

  useEffect(()=>{
    fetch("/api/admin/contacts",{headers:headers()}).then(r=>r.json()).then(d=>{if(d.success)setContacts(d.data);}).finally(()=>setLoading(false));
  },[]);

  const markResolved=async(id:string)=>{
    const res=await fetch("/api/admin/contacts",{method:"PATCH",headers:headers(),body:JSON.stringify({id,status:"resolved"})}).then(r=>r.json());
    if(res.success){setContacts(c=>c.map(x=>x._id===id?{...x,status:"resolved"}:x));toast.success("Marked as resolved");}
  };
  const deleteContact=async(id:string)=>{
    if(!confirm("Delete this message?"))return;
    const res=await fetch("/api/admin/contacts",{method:"DELETE",headers:headers(),body:JSON.stringify({id})}).then(r=>r.json());
    if(res.success){setContacts(c=>c.filter(x=>x._id!==id));toast.success("Deleted");}
  };

  const filtered=contacts.filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase())||c.email.toLowerCase().includes(search.toLowerCase()));
  const urgentCount=filtered.filter(c=>c.urgency!=="normal"&&c.status!=="resolved").length;
  const card={background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,boxShadow:"var(--shadow-sm)"} as React.CSSProperties;

  return(
    <AdminLayout>
      <div style={{padding:"1.5rem",maxWidth:1100}}>
        <div style={{marginBottom:"1.5rem"}}>
          <h1 style={{fontFamily:"Syne,sans-serif",fontSize:"1.75rem",fontWeight:800,color:"var(--txt-primary)",display:"flex",alignItems:"center",gap:10}}>
            <MessageSquare size={26} color="var(--sky-hover)"/>Messages
          </h1>
          <p style={{color:"var(--txt-muted)",marginTop:4,fontSize:"0.875rem"}}>
            {filtered.length} message{filtered.length!==1?"s":""}
            {urgentCount>0&&<span className="badge badge-red" style={{marginLeft:8}}>{urgentCount} urgent</span>}
          </p>
        </div>

        <div style={{position:"relative",marginBottom:"1.25rem"}}>
          <Search size={14} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"var(--txt-faint)"}}/>
          <input className="input-field" style={{paddingLeft:36}} placeholder="Search contacts..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>

        {loading?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200}}>
            <div style={{width:28,height:28,border:"2px solid var(--accent)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtered.length===0
              ?<div style={{...card,padding:"3rem",textAlign:"center",color:"var(--txt-faint)"}}>No messages found.</div>
              :filtered.map(c=>(
              <motion.div key={c._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                style={{...card,overflow:"hidden",borderLeft:`4px solid ${c.urgency==="very-urgent"?"var(--red)":c.urgency==="urgent"?"var(--amber)":"transparent"}`}}>
                <div style={{padding:"1rem 1.25rem",display:"flex",flexWrap:"wrap",alignItems:"center",gap:12,cursor:"pointer"}}
                  onClick={()=>setExpanded(expanded===c._id?null:c._id)}>
                  <div style={{width:38,height:38,borderRadius:11,background:"var(--sky-light)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--sky-hover)",fontWeight:700,fontSize:"0.85rem",flexShrink:0}}>
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontWeight:600,color:"var(--txt-primary)",fontSize:"0.9375rem"}}>{c.name}</span>
                      <span className={UB[c.urgency]||"badge-gray"}>{c.urgency}</span>
                      <span className={SB[c.status]||"badge-gray"}>{c.status}</span>
                    </div>
                    <div style={{fontSize:"0.8rem",color:"var(--txt-muted)"}}>{c.email}</div>
                    <div style={{fontSize:"0.78rem",color:"var(--txt-faint)",marginTop:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.message?.slice(0,60)}...</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                    <span style={{fontSize:"0.72rem",color:"var(--txt-faint)"}}>{new Date(c.createdAt).toLocaleDateString("en-IN")}</span>
                    {c.status!=="resolved"&&(
                      <button onClick={e=>{e.stopPropagation();markResolved(c._id);}} title="Mark resolved"
                        style={{width:30,height:30,borderRadius:8,border:"1px solid var(--border)",background:"var(--surface-2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--emerald)"}}>
                        <CheckCircle size={14}/>
                      </button>
                    )}
                    <button onClick={e=>{e.stopPropagation();deleteContact(c._id);}}
                      style={{width:30,height:30,borderRadius:8,border:"1px solid var(--border)",background:"var(--surface-2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--red)"}}>
                      <Trash2 size={14}/>
                    </button>
                    {expanded===c._id?<ChevronUp size={14} color="var(--txt-faint)"/>:<ChevronDown size={14} color="var(--txt-faint)"/>}
                  </div>
                </div>
                <AnimatePresence>
                  {expanded===c._id&&(
                    <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} style={{overflow:"hidden",borderTop:"1px solid var(--border-subtle)"}}>
                      <div style={{padding:"1rem 1.25rem",background:"var(--surface-2)"}}>
                        <p style={{fontSize:"0.875rem",color:"var(--txt-secondary)",lineHeight:1.75,marginBottom:"1rem"}}>{c.message}</p>
                        {c.serviceType&&<p style={{fontSize:"0.8rem",color:"var(--txt-muted)",marginBottom:"1rem"}}><strong>Service:</strong> {c.serviceType}</p>}
                        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                          <a href={`mailto:${c.email}`} className="btn-outline" style={{padding:"8px 16px",fontSize:"0.85rem",display:"inline-flex",alignItems:"center",gap:6}}><Mail size={14}/>Reply by Email</a>
                          {c.status!=="resolved"&&<button onClick={()=>markResolved(c._id)} className="btn-primary" style={{padding:"8px 16px",fontSize:"0.85rem"}}>Mark Resolved</button>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
}
