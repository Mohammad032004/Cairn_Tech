"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, AtSign, Link as LI, Share2, Send, CheckCircle, Loader2, AlertCircle, AlertTriangle, Zap } from "lucide-react";
import toast from "react-hot-toast";
import PublicLayout from "@/components/layout/PublicLayout";
import Chatbot from "@/components/ui/Chatbot";

const SERVICE_TYPES = ["Web Development","App Development","Maintenance & Support","SEO Optimization","UI/UX Design","Cloud Hosting","Other"];
const URGENCY = [
  { value:"normal",      label:"Normal",     desc:"1–2 weeks",   Icon:CheckCircle,  ba:"var(--accent)",  bg:"var(--accent-light)" },
  { value:"urgent",      label:"Urgent",     desc:"3–5 days",    Icon:AlertCircle,  ba:"var(--amber)",   bg:"rgba(201,124,42,0.1)" },
  { value:"very-urgent", label:"Very Urgent",desc:"24–48 hrs",   Icon:AlertTriangle,ba:"var(--red)",     bg:"rgba(201,64,64,0.08)" },
];

export default function ContactPage() {
  const [form,setForm]=useState({name:"",email:"",phone:"",serviceType:"",message:"",urgency:"normal"});
  const [loading,setLoading]=useState(false);
  const [sent,setSent]=useState(false);

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!form.name||!form.email||!form.message)return toast.error("Name, email and message are required");
    setLoading(true);
    try{
      const res=await fetch("/api/public/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data=await res.json();
      if(data.success){setSent(true);toast.success("Message sent!");}
      else toast.error(data.message||"Something went wrong");
    }catch{toast.error("Network error");}
    finally{setLoading(false);}
  };

  const card={background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,boxShadow:"var(--shadow-sm)"} as React.CSSProperties;

  return(
    <PublicLayout>
      <section style={{paddingTop:120,paddingBottom:60,background:"linear-gradient(145deg,var(--page-bg),rgba(180,211,217,0.12),var(--page-bg))"}}>
        <div className="page-container" style={{textAlign:"center"}}>
          <motion.span initial={{opacity:0}} animate={{opacity:1}} className="badge badge-sky" style={{display:"inline-flex",marginBottom:"1.25rem",padding:"5px 14px"}}><Zap size={12}/>Get In Touch</motion.span>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="font-heading" style={{fontSize:"clamp(2.2rem,5vw,3.5rem)",color:"var(--txt-primary)",marginBottom:"1rem"}}>
            Let's Start a <span className="gradient-text">Conversation</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{fontSize:"1.1rem",color:"var(--txt-muted)",maxWidth:500,margin:"0 auto",lineHeight:1.75}}>
            Have a project in mind? Tell us about it and we'll reply within 24 hours.
          </motion.p>
        </div>
      </section>

      <section className="section-pad section-white">
        <div className="page-container">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"2rem",alignItems:"start"}}>
            <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              {sent?(
                <div style={{...card,padding:"3rem",textAlign:"center"}}>
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring"}}>
                    <CheckCircle size={64} color="var(--emerald)" style={{margin:"0 auto 1.25rem"}}/>
                  </motion.div>
                  <h2 className="font-heading" style={{fontSize:"1.5rem",color:"var(--txt-primary)",marginBottom:"0.75rem"}}>Message Received!</h2>
                  <p style={{color:"var(--txt-muted)",fontSize:"0.9rem",marginBottom:"1.5rem"}}>We'll get back to you within 24 hours.</p>
                  <button onClick={()=>setSent(false)} className="btn-outline">Send Another</button>
                </div>
              ):(
                <div style={{...card,padding:"2rem"}}>
                  <h2 className="font-heading" style={{fontSize:"1.35rem",fontWeight:700,color:"var(--txt-primary)",marginBottom:"1.5rem"}}>Send a Message</h2>
                  <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div>
                        <label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Your Name *</label>
                        <input className="input-field" placeholder="John Doe" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
                      </div>
                      <div>
                        <label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Email *</label>
                        <input className="input-field" type="email" placeholder="john@company.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div>
                        <label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Phone Number</label>
                        <div style={{position:"relative"}}>
                          <Phone size={13} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"var(--txt-faint)"}}/>
                          <input className="input-field" style={{paddingLeft:36}} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
                        </div>
                      </div>
                      <div>
                        <label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Service Needed</label>
                        <select className="input-field" style={{cursor:"pointer",appearance:"none"}} value={form.serviceType} onChange={e=>setForm({...form,serviceType:e.target.value})}>
                          <option value="">Select a service...</option>
                          {SERVICE_TYPES.map(s=><option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:6}}>Message *</label>
                      <textarea className="input-field" style={{minHeight:110}} placeholder="Tell us about your project, goals, and requirements..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required/>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"var(--txt-muted)",marginBottom:8}}>Urgency Level</label>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                        {URGENCY.map(opt=>(
                          <button key={opt.value} type="button" onClick={()=>setForm({...form,urgency:opt.value})}
                            style={{padding:"10px 8px",borderRadius:12,border:`2px solid ${form.urgency===opt.value?opt.ba:"var(--border)"}`,background:form.urgency===opt.value?opt.bg:"var(--surface-2)",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                            <opt.Icon size={14} color={form.urgency===opt.value?opt.ba:"var(--txt-faint)"} style={{marginBottom:5}}/>
                            <div style={{fontSize:"0.8rem",fontWeight:700,color:"var(--txt-primary)"}}>{opt.label}</div>
                            <div style={{fontSize:"0.72rem",color:"var(--txt-faint)",marginTop:2}}>{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary" style={{width:"100%",justifyContent:"center",padding:"13px",marginTop:4}}>
                      {loading?<><Loader2 size={16} style={{animation:"spin 0.8s linear infinite"}}/>Sending...</>:<><Send size={16}/>Send Message</>}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>

            <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
              <div style={{...card,padding:"1.75rem"}}>
                <h3 className="font-heading" style={{fontSize:"1.1rem",fontWeight:700,color:"var(--txt-primary)",marginBottom:"1.25rem"}}>Contact Info</h3>
                {[{href:"mailto:info@cairntech.com",Icon:Mail,label:"Email",value:"info@cairntech.com",color:"var(--accent)"},{href:"tel:+919876543210",Icon:Phone,label:"Phone (click to call)",value:"+91 98765 43210",color:"var(--emerald)"}].map(item=>(
                  <a key={item.href} href={item.href} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:12,textDecoration:"none",marginBottom:4,transition:"background 0.15s"}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--surface-2)"}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent"}}>
                    <div style={{width:38,height:38,borderRadius:11,background:`${item.color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <item.Icon size={17} color={item.color}/>
                    </div>
                    <div>
                      <div style={{fontSize:"0.72rem",color:"var(--txt-faint)",marginBottom:2}}>{item.label}</div>
                      <div style={{fontSize:"0.875rem",fontWeight:600,color:"var(--txt-primary)"}}>{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{...card,padding:"1.75rem"}}>
                <h3 className="font-heading" style={{fontSize:"1.1rem",fontWeight:700,color:"var(--txt-primary)",marginBottom:"1.25rem"}}>Follow Us</h3>
                {[{Icon:AtSign,label:"Instagram",handle:"@cairntech",href:"https://www.instagram.com/carin_tech/"},{Icon:LI,label:"LinkedIn",handle:"Cairn Tech",href:"#"},{Icon:Share2,label:"Facebook",handle:"CairnTech",href:"#"}].map(({Icon,label,handle,href})=>(
                  <a key={label} href={href} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:12,textDecoration:"none",marginBottom:4,transition:"background 0.15s"}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="var(--surface-2)"}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent"}}>
                    <div style={{width:34,height:34,borderRadius:9,background:"var(--surface-2)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={14} color="var(--txt-muted)"/></div>
                    <div>
                      <div style={{fontSize:"0.72rem",color:"var(--txt-faint)"}}>{label}</div>
                      <div style={{fontSize:"0.875rem",fontWeight:600,color:"var(--txt-primary)"}}>{handle}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{background:"linear-gradient(135deg,var(--accent),var(--lilac-hover))",borderRadius:20,padding:"1.75rem",color:"#fff",boxShadow:"var(--shadow-accent)"}}>
                <h3 className="font-heading" style={{fontSize:"1.1rem",fontWeight:700,marginBottom:"0.75rem"}}>Quick Response</h3>
                <p style={{opacity:0.85,fontSize:"0.875rem",lineHeight:1.7,marginBottom:"0.75rem"}}>All inquiries answered within 24 hours. Mark urgency for priority handling.</p>
                <div style={{fontSize:"0.8rem",fontWeight:600,opacity:0.75}}>Mon–Sat · 9AM – 7PM IST</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Chatbot/>
    </PublicLayout>
  );
}
