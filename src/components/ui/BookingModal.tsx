"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const URGENCY = [
  { value:"normal",      label:"Normal",     desc:"1–2 weeks",   borderActive:"var(--accent)",      bg:"var(--accent-light)" },
  { value:"urgent",      label:"Urgent",     desc:"3–5 days",    borderActive:"var(--amber)",        bg:"rgba(201,124,42,0.1)" },
  { value:"very-urgent", label:"Very Urgent",desc:"24–48 hrs",   borderActive:"var(--red)",          bg:"rgba(201,64,64,0.1)" },
];

export default function BookingModal({ plan, onClose }: { plan:string; onClose:()=>void }) {
  const [form, setForm]    = useState({ name:"", email:"", requirements:"", urgency:"normal" });
  const [loading,setLoading] = useState(false);
  const [success,setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name||!form.email) return toast.error("Name and email are required");
    setLoading(true);
    try {
      const res  = await fetch("/api/public/booking",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,plan})});
      const data = await res.json();
      if(data.success){ setSuccess(true); toast.success("Booking confirmed!"); }
      else toast.error(data.message||"Something went wrong");
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,11,26,0.7)",backdropFilter:"blur(8px)"}}
        onClick={e=>e.target===e.currentTarget&&onClose()}>
        <motion.div initial={{scale:0.93,opacity:0,y:16}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.93,opacity:0}}
          transition={{type:"spring",damping:26,stiffness:320}}
          style={{background:"var(--surface)",borderRadius:20,boxShadow:"0 24px 64px rgba(15,11,26,0.4)",width:"100%",maxWidth:480,overflow:"hidden",border:"1px solid var(--border)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.25rem 1.5rem",borderBottom:"1px solid var(--border)"}}>
            <div>
              <h2 className="font-heading" style={{fontSize:"1.2rem",fontWeight:700,color:"var(--txt-primary)"}}>Book the {plan} Plan</h2>
              <p style={{fontSize:"0.8rem",color:"var(--txt-muted)",marginTop:3}}>Fill in your details and we'll get started</p>
            </div>
            <button onClick={onClose} style={{width:32,height:32,borderRadius:9,border:"1px solid var(--border)",background:"var(--surface-2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--txt-muted)"}}>
              <X size={16}/>
            </button>
          </div>

          {success ? (
            <div style={{padding:"3rem",textAlign:"center"}}>
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring"}}>
                <CheckCircle size={60} color="var(--emerald)" style={{margin:"0 auto 1rem"}}/>
              </motion.div>
              <h3 className="font-heading" style={{fontSize:"1.25rem",color:"var(--txt-primary)",marginBottom:"0.75rem"}}>Booking Confirmed!</h3>
              <p style={{color:"var(--txt-muted)",fontSize:"0.9rem",marginBottom:"1.5rem"}}>We'll reach out within 24 hours to discuss your project.</p>
              <button onClick={onClose} className="btn-primary">Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{padding:"1.5rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label className="label">Name *</label>
                  <input className="input-field" placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input className="input-field" type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
                </div>
              </div>
              <div>
                <label className="label">Selected Plan</label>
                <div style={{padding:"11px 14px",borderRadius:12,border:"1.5px solid var(--accent)",background:"var(--accent-light)",color:"var(--accent-text)",fontWeight:600,fontSize:"0.9375rem"}}>{plan} Plan</div>
              </div>
              <div>
                <label className="label">Urgency Level</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {URGENCY.map(opt=>(
                    <button key={opt.value} type="button" onClick={()=>setForm({...form,urgency:opt.value})}
                      style={{padding:"10px 8px",borderRadius:12,border:`2px solid ${form.urgency===opt.value?opt.borderActive:"var(--border)"}`,background:form.urgency===opt.value?opt.bg:"var(--surface)",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                      <div style={{fontSize:"0.8rem",fontWeight:700,color:"var(--txt-primary)"}}>{opt.label}</div>
                      <div style={{fontSize:"0.72rem",color:"var(--txt-faint)",marginTop:2}}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Additional Requirements</label>
                <textarea className="input-field" style={{minHeight:80}} placeholder="Tell us about your project..." value={form.requirements} onChange={e=>setForm({...form,requirements:e.target.value})}/>
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"13px"}}>
                {loading?<><Loader2 size={16} style={{animation:"spin 0.8s linear infinite"}}/>Processing...</>:"Confirm Booking"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AnimatePresence>
  );
}
