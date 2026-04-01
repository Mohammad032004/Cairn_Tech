"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import Chatbot from "@/components/ui/Chatbot";

const CATEGORIES = ["All","Web App","Mobile App","Enterprise","Other"];
const D_PROJECTS = [
  { title:"ShopEase E-Commerce", description:"Full-stack e-commerce with real-time inventory, Stripe payments, and admin dashboard.", category:"Web App", technologies:["React","Node.js","MongoDB","Stripe"] },
  { title:"HealthTrack Mobile App", description:"Cross-platform fitness app with workout tracking, nutrition logs, and AI-driven health insights.", category:"Mobile App", technologies:["React Native","Firebase","ML Kit"] },
  { title:"EduLearn LMS", description:"Learning management system with live classes, quizzes, certification generation, and progress tracking.", category:"Enterprise", technologies:["Next.js","PostgreSQL","WebRTC"] },
  { title:"BookNow Appointments", description:"Smart booking system with calendar sync, automated reminders, and multi-provider support.", category:"Web App", technologies:["Vue.js","Express","MySQL"] },
];

const CAT_BADGE: Record<string,string> = { "Web App":"badge-violet","Mobile App":"badge-sky","Enterprise":"badge-lilac","Other":"badge-gray" };
const CAT_COLORS: Record<string,string[]> = {
  "Web App":   ["rgba(155,142,199,0.12)","rgba(155,142,199,0.06)"],
  "Mobile App":["rgba(180,211,217,0.18)","rgba(180,211,217,0.06)"],
  "Enterprise":["rgba(189,166,206,0.15)","rgba(189,166,206,0.06)"],
  "Other":     ["rgba(155,142,199,0.08)","rgba(180,211,217,0.04)"],
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState(D_PROJECTS);
  const [filter,   setFilter]   = useState("All");

  useEffect(() => {
    fetch("/api/public/projects").then(r=>r.json()).then(d=>{ if(d.data?.length) setProjects(d.data); }).catch(()=>{});
  }, []);

  const filtered = filter==="All" ? projects : projects.filter((p:any)=>p.category===filter);

  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{paddingTop:120,paddingBottom:60,background:"linear-gradient(145deg,var(--page-bg),rgba(180,211,217,0.15),var(--page-bg))"}}>
        <div className="page-container" style={{textAlign:"center"}}>
          <motion.span initial={{opacity:0}} animate={{opacity:1}} className="badge badge-lilac" style={{display:"inline-flex",marginBottom:"1.25rem",padding:"5px 14px"}}>Our Portfolio</motion.span>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="font-heading" style={{fontSize:"clamp(2.2rem,5vw,3.5rem)",color:"var(--txt-primary)",marginBottom:"1rem"}}>
            Work We're <span className="gradient-text">Proud Of</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{fontSize:"1.1rem",color:"var(--txt-muted)",maxWidth:500,margin:"0 auto"}}>
            From MVPs to enterprise platforms — every project tells a story.
          </motion.p>
        </div>
      </section>

      <section className="section-pad section-white">
        <div className="page-container">
          {/* Filter tabs */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:"3rem"}}>
            {CATEGORIES.map(cat=>(
              <button key={cat} onClick={()=>setFilter(cat)} style={{
                padding:"8px 20px",borderRadius:99,fontSize:"0.875rem",fontWeight:600,cursor:"pointer",border:"none",
                background: filter===cat ? "var(--accent)" : "var(--surface-2)",
                color: filter===cat ? "#fff" : "var(--txt-muted)",
                boxShadow: filter===cat ? "0 4px 12px rgba(155,142,199,0.35)" : "none",
                transition:"all 0.2s",
              }}>{cat}</button>
            ))}
          </motion.div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.5rem"}}>
            {filtered.map((p:any,i:number)=>{
              const colors = CAT_COLORS[p.category]||CAT_COLORS["Other"];
              return (
                <motion.div key={p.title} layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} className="card-hover" style={{overflow:"hidden"}}>
                  <div style={{height:180,background:`linear-gradient(135deg,${colors[0]},${colors[1]})`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                    <div className="font-heading" style={{fontSize:"6rem",fontWeight:800,userSelect:"none",opacity:0.3,color:"var(--accent)"}}>{p.title[0]}</div>
                    <span className={`badge ${CAT_BADGE[p.category]||"badge-gray"}`} style={{position:"absolute",top:12,left:12}}>{p.category}</span>
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{position:"absolute",top:12,right:12,width:32,height:32,borderRadius:8,background:"var(--surface)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--shadow-sm)"}}>
                        <ExternalLink size={14} style={{color:"var(--accent)"}}/>
                      </a>
                    )}
                  </div>
                  <div style={{padding:"1.5rem"}}>
                    <h3 className="font-heading" style={{fontSize:"1.1rem",color:"var(--txt-primary)",marginBottom:"0.6rem"}}>{p.title}</h3>
                    <p style={{fontSize:"0.875rem",color:"var(--txt-muted)",lineHeight:1.65,marginBottom:"1.25rem"}}>{p.description}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {(p.technologies||[]).map((t:string)=>(
                        <span key={t} style={{fontSize:"0.72rem",padding:"3px 9px",borderRadius:6,background:"var(--surface-2)",color:"var(--txt-muted)",fontWeight:600,border:"1px solid var(--border)"}}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <Chatbot/>
    </PublicLayout>
  );
}
