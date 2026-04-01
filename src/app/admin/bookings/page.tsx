"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Trash2, Search, Filter, X, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import toast from "react-hot-toast";

const URGENCY_BADGE:Record<string,string>={normal:"badge-gray",urgent:"badge-orange","very-urgent":"badge-red"};
const STATUS_BADGE:Record<string,string>={pending:"badge-orange","in-progress":"badge-sky",completed:"badge-green"};
const STATUS_OPTIONS=["pending","in-progress","completed"];

export default function BookingsPage(){
  const [bookings,setBookings]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("");
  const [search,setSearch]=useState("");
  const [expanded,setExpanded]=useState<string|null>(null);
  const [editing,setEditing]=useState<any>(null);
  const [payForm,setPayForm]=useState({finalAmount:0,pendingAmount:0,paidAmount:0,projectDesc:"",status:"pending"});
  const [saving,setSaving]=useState(false);

  const token=()=>typeof window!=="undefined"?localStorage.getItem("cairn_admin_token"):"";
  const headers=()=>({"Content-Type":"application/json",Authorization:`Bearer ${token()}`});

  const load=async(status="")=>{
    setLoading(true);
    const url=status?`/api/admin/bookings?status=${status}`:"/api/admin/bookings";
    const res=await fetch(url,{headers:headers()}).then(r=>r.json());
    if(res.success)setBookings(res.data);
    setLoading(false);
  };
  useEffect(()=>{load();},[]);

  const updateStatus=async(id:string,status:string)=>{
    const res=await fetch("/api/admin/bookings",{method:"PATCH",headers:headers(),body:JSON.stringify({id,status})}).then(r=>r.json());
    if(res.success){setBookings(b=>b.map(x=>x._id===id?{...x,status}:x));toast.success("Status updated");}
  };
  const openPayment=(b:any)=>{setEditing(b);setPayForm({finalAmount:b.finalAmount||b.planPrice||0,pendingAmount:b.pendingAmount||0,paidAmount:b.paidAmount||0,projectDesc:b.projectDesc||b.requirements||"",status:b.status});};
  const savePayment=async()=>{
    setSaving(true);
    const res=await fetch("/api/admin/bookings",{method:"PATCH",headers:headers(),body:JSON.stringify({id:editing._id,...payForm})}).then(r=>r.json());
    if(res.success){setBookings(b=>b.map(x=>x._id===editing._id?{...x,...payForm}:x));toast.success("Saved");setEditing(null);}else toast.error("Failed");
    setSaving(false);
  };
  const deleteBooking=async(id:string)=>{
    if(!confirm("Delete this booking?"))return;
    const res=await fetch("/api/admin/bookings",{method:"DELETE",headers:headers(),body:JSON.stringify({id})}).then(r=>r.json());
    if(res.success){setBookings(b=>b.filter(x=>x._id!==id));toast.success("Deleted");}
  };

  const filtered=bookings.filter(b=>(!filter||b.status===filter)&&(!search||b.name.toLowerCase().includes(search.toLowerCase())||b.email.toLowerCase().includes(search.toLowerCase())));
  const completedRev=bookings.filter(b=>b.status==="completed").reduce((s,b)=>s+(b.finalAmount||b.planPrice||0),0);
  const pendingRev=bookings.filter(b=>b.status!=="completed").reduce((s,b)=>s+(b.pendingAmount||0),0);
  const card={background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,boxShadow:"var(--shadow-sm)"} as React.CSSProperties;

  return(
    <AdminLayout>
      <div style={{padding:"1.5rem",maxWidth:1100}}>
        <div style={{marginBottom:"1.5rem",display:"flex",flexWrap:"wrap",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div>
            <h1 style={{fontFamily:"Syne,sans-serif",fontSize:"1.75rem",fontWeight:800,color:"var(--txt-primary)",display:"flex",alignItems:"center",gap:10}}>
              <BookOpen size={26} color="var(--accent)"/>Bookings
            </h1>
            <p style={{color:"var(--txt-muted)",marginTop:4,fontSize:"0.875rem"}}>{filtered.length} booking{filtered.length!==1?"s":""} found</p>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1.25rem"}}>
          {[{label:"Completed Revenue",val:`₹${completedRev.toLocaleString("en-IN")}`,color:"var(--emerald)"},{label:"Pending Payments",val:`₹${pendingRev.toLocaleString("en-IN")}`,color:"var(--amber)"}].map(item=>(
            <div key={item.label} style={{...card,padding:"1rem",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:11,background:`${item.color}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <DollarSign size={20} color={item.color}/>
              </div>
              <div>
                <div style={{fontSize:"0.75rem",color:"var(--txt-muted)"}}>{item.label}</div>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1.15rem",color:"var(--txt-primary)"}}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:10,marginBottom:"1.25rem",flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <Search size={14} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"var(--txt-faint)"}}/>
            <input className="input-field" style={{paddingLeft:36}} placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div style={{position:"relative"}}>
            <Filter size={14} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"var(--txt-faint)"}}/>
            <select className="input-field" style={{paddingLeft:36,paddingRight:32,cursor:"pointer",minWidth:160,appearance:"none"}} value={filter} onChange={e=>{setFilter(e.target.value);load(e.target.value);}}>
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {loading?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200}}>
            <div style={{width:28,height:28,border:"2px solid var(--accent)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtered.length===0
              ?<div style={{...card,padding:"3rem",textAlign:"center",color:"var(--txt-faint)"}}>No bookings found.</div>
              :filtered.map(b=>(
              <motion.div key={b._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{...card,overflow:"hidden"}}>
                <div style={{padding:"1rem 1.25rem",display:"flex",flexWrap:"wrap",alignItems:"center",gap:12}}>
                  <div style={{width:38,height:38,borderRadius:11,background:"var(--accent-light)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent)",fontWeight:700,fontSize:"0.85rem",flexShrink:0}}>
                    {b.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontWeight:600,color:"var(--txt-primary)",fontSize:"0.9375rem"}}>{b.name}</span>
                      <span className="badge badge-violet">{b.plan} Plan</span>
                      <span className={URGENCY_BADGE[b.urgency]||"badge-gray"}>{b.urgency}</span>
                    </div>
                    <div style={{fontSize:"0.8rem",color:"var(--txt-muted)"}}>{b.email}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:4,fontSize:"0.78rem"}}>
                      <span style={{color:"var(--txt-faint)"}}>Plan: <strong style={{color:"var(--txt-muted)"}}>₹{(b.planPrice||0).toLocaleString("en-IN")}</strong></span>
                      {b.finalAmount>0&&<span style={{color:"var(--emerald)"}}>Deal: <strong>₹{b.finalAmount.toLocaleString("en-IN")}</strong></span>}
                      {b.pendingAmount>0&&<span style={{color:"var(--amber)"}}>Pending: <strong>₹{b.pendingAmount.toLocaleString("en-IN")}</strong></span>}
                      {b.paidAmount>0&&<span style={{color:"var(--accent)"}}>Paid: <strong>₹{b.paidAmount.toLocaleString("en-IN")}</strong></span>}
                    </div>
                    <div style={{fontSize:"0.72rem",color:"var(--txt-faint)",marginTop:3}}>{new Date(b.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
                    <span className={STATUS_BADGE[b.status]||"badge-gray"}>{b.status}</span>
                    <select value={b.status} onChange={e=>updateStatus(b._id,e.target.value)}
                      style={{fontSize:"0.78rem",padding:"5px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--surface-2)",color:"var(--txt-muted)",cursor:"pointer",outline:"none",fontFamily:"DM Sans,sans-serif"}}>
                      {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={()=>setExpanded(expanded===b._id?null:b._id)} style={{width:30,height:30,borderRadius:8,border:"1px solid var(--border)",background:"var(--surface-2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent)"}}>
                      {expanded===b._id?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
                    </button>
                    <button onClick={()=>deleteBooking(b._id)} style={{width:30,height:30,borderRadius:8,border:"1px solid var(--border)",background:"var(--surface-2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--red)"}}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {expanded===b._id&&(
                    <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} style={{overflow:"hidden",borderTop:"1px solid var(--border-subtle)"}}>
                      <div style={{padding:"1rem 1.25rem",background:"var(--surface-2)"}}>
                        {b.requirements&&<p style={{fontSize:"0.875rem",color:"var(--txt-muted)",marginBottom:"0.75rem"}}><strong style={{color:"var(--txt-primary)"}}>Requirements:</strong> {b.requirements}</p>}
                        <button onClick={()=>openPayment(b)} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:"0.875rem",fontWeight:600,color:"var(--accent)",background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"DM Sans,sans-serif"}}>
                          <DollarSign size={15}/>Update Payment Details
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,11,26,0.6)",backdropFilter:"blur(8px)"}}>
            <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}}
              style={{background:"var(--surface)",borderRadius:20,boxShadow:"0 24px 64px rgba(15,11,26,0.4)",width:"100%",maxWidth:460,padding:"1.5rem",border:"1px solid var(--border)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
                <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"1.2rem",color:"var(--txt-primary)"}}>Payment — {editing.name}</h2>
                <button onClick={()=>setEditing(null)} style={{width:30,height:30,borderRadius:8,border:"1px solid var(--border)",background:"var(--surface-2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--txt-muted)"}}>
                  <X size={15}/>
                </button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                <div><label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Finalized Deal Amount (₹)</label>
                  <input className="input-field" type="number" value={payForm.finalAmount} onChange={e=>setPayForm({...payForm,finalAmount:Number(e.target.value)})}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Paid Amount (₹)</label>
                    <input className="input-field" type="number" value={payForm.paidAmount} onChange={e=>setPayForm({...payForm,paidAmount:Number(e.target.value)})}/></div>
                  <div><label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Pending Amount (₹)</label>
                    <input className="input-field" type="number" value={payForm.pendingAmount} onChange={e=>setPayForm({...payForm,pendingAmount:Number(e.target.value)})}/></div>
                </div>
                <div><label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Project Description</label>
                  <textarea className="input-field" style={{minHeight:80}} value={payForm.projectDesc} onChange={e=>setPayForm({...payForm,projectDesc:e.target.value})} placeholder="Notes on the project..."/></div>
                <div><label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Status</label>
                  <select className="input-field" style={{cursor:"pointer",appearance:"none"}} value={payForm.status} onChange={e=>setPayForm({...payForm,status:e.target.value})}>
                    {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select></div>
              </div>
              <div style={{display:"flex",gap:10,marginTop:"1.25rem"}}>
                <button onClick={()=>setEditing(null)} className="btn-outline" style={{flex:1,justifyContent:"center"}}>Cancel</button>
                <button onClick={savePayment} disabled={saving} className="btn-primary" style={{flex:1,justifyContent:"center"}}>{saving?"Saving...":"Save Details"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
}
