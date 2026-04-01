"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Shield, Clock, Users, Target, Eye, Code2, Zap } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import Chatbot from "@/components/ui/Chatbot";

const fU = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.5}} };
const st = { show:{transition:{staggerChildren:0.1}} };

const VALUES = [
  { icon:Lightbulb, title:"Innovation",     desc:"We push boundaries and embrace new technologies to deliver cutting-edge solutions.", bg:"rgba(201,124,42,0.1)",  color:"var(--amber)" },
  { icon:Shield,    title:"Integrity",      desc:"Transparency and honesty are at the core of every client relationship we build.",   bg:"var(--accent-light)",   color:"var(--accent)" },
  { icon:Clock,     title:"Reliability",    desc:"Deadlines are sacred. We deliver on time, every time — no exceptions.",            bg:"rgba(76,175,125,0.1)",  color:"var(--emerald)" },
  { icon:Users,     title:"Client Success", desc:"Your success is our success. We measure ourselves by the results we deliver.",     bg:"var(--lilac-light)",    color:"var(--lilac-hover)" },
];
const D_TEAM = [
  { name:"Aryan Mehta",  role:"Founder & CEO", bio:"Full-stack engineer with 8+ years building scalable web and mobile products.", initials:"AM" },
  { name:"Priya Kapoor", role:"Lead Designer",  bio:"UX strategist passionate about intuitive, beautiful interfaces.", initials:"PK" },
  { name:"Rohan Das",    role:"Tech Lead",       bio:"Backend architect specializing in cloud-native systems and API design.", initials:"RD" },
];

export default function AboutPage() {
  const [team, setTeam] = useState(D_TEAM);
  useEffect(()=>{ fetch("/api/admin/team").then(r=>r.json()).then(d=>{ if(d.data?.length) setTeam(d.data); }).catch(()=>{}); },[]);
  return (
    <PublicLayout>
      <section style={{paddingTop:120,paddingBottom:60,background:"linear-gradient(145deg,var(--page-bg),rgba(180,211,217,0.12),var(--page-bg))"}}>
        <div className="page-container" style={{textAlign:"center"}}>
          <motion.span initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="badge badge-violet" style={{display:"inline-flex",marginBottom:"1.25rem",padding:"5px 14px"}}><Zap size={12}/>About Us</motion.span>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="font-heading" style={{fontSize:"clamp(2.2rem,5vw,3.5rem)",color:"var(--txt-primary)",marginBottom:"1rem"}}>
            We Build Digital <span className="gradient-text">Futures</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{fontSize:"1.1rem",color:"var(--txt-muted)",maxWidth:520,margin:"0 auto",lineHeight:1.75}}>
            Cairn Tech is a passionate team of developers, designers, and strategists who believe great software changes lives.
          </motion.p>
        </div>
      </section>

      <section className="section-pad section-white">
        <div className="page-container">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"2rem",alignItems:"center"}}>
            <motion.div initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
              <div className="card" style={{padding:"2rem",borderLeft:"4px solid var(--accent)"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1rem"}}>
                  <div style={{width:40,height:40,borderRadius:12,background:"var(--accent-light)",display:"flex",alignItems:"center",justifyContent:"center"}}><Target size={20} color="var(--accent)"/></div>
                  <h2 className="font-heading" style={{fontSize:"1.35rem",color:"var(--txt-primary)"}}>Our Mission</h2>
                </div>
                <p style={{color:"var(--txt-muted)",lineHeight:1.75,fontSize:"0.9rem"}}>To empower businesses of all sizes with beautiful, functional, and scalable digital products — making world-class software accessible to everyone.</p>
              </div>
              <div className="card" style={{padding:"2rem",borderLeft:"4px solid var(--emerald)"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1rem"}}>
                  <div style={{width:40,height:40,borderRadius:12,background:"rgba(76,175,125,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}><Eye size={20} color="var(--emerald)"/></div>
                  <h2 className="font-heading" style={{fontSize:"1.35rem",color:"var(--txt-primary)"}}>Our Vision</h2>
                </div>
                <p style={{color:"var(--txt-muted)",lineHeight:1.75,fontSize:"0.9rem"}}>To become the most trusted digital partner for startups and enterprises across South Asia — known for quality, speed, and unwavering client focus.</p>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <div style={{background:"linear-gradient(145deg,var(--accent),var(--lilac-hover))",borderRadius:24,padding:"2.5rem",color:"#fff",boxShadow:"var(--shadow-accent)"}}>
                <Code2 size={44} style={{opacity:0.7,marginBottom:"1.25rem"}}/>
                <h3 className="font-heading" style={{fontSize:"2rem",fontWeight:800,marginBottom:"0.75rem"}}>3+ Years of Craft</h3>
                <p style={{opacity:0.85,lineHeight:1.7,marginBottom:"2rem",fontSize:"0.9rem"}}>Since founding Cairn Tech, we've delivered over 50 projects across 10+ industries — from early-stage startups to established enterprises.</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
                  {[["50+","Projects Shipped"],["30+","Happy Clients"],["10+","Industries Served"],["4.9★","Average Rating"]].map(([n,l])=>(
                    <div key={l}><div className="font-heading" style={{fontSize:"1.6rem",fontWeight:800}}>{n}</div><div style={{opacity:0.75,fontSize:"0.8rem",marginTop:3}}>{l}</div></div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-pad section-cream">
        <div className="page-container">
          <motion.div variants={st} initial="hidden" whileInView="show" viewport={{once:true}}>
            <motion.div variants={fU} style={{textAlign:"center",marginBottom:"3rem"}}>
              <span className="badge badge-sky" style={{display:"inline-flex",marginBottom:"1rem"}}>Our DNA</span>
              <h2 className="font-heading" style={{fontSize:"clamp(2rem,4vw,2.6rem)",color:"var(--txt-primary)",marginBottom:"0.5rem"}}>Core <span className="gradient-text">Values</span></h2>
              <p style={{color:"var(--txt-muted)",maxWidth:440,margin:"0 auto"}}>The principles that guide every line of code and every client conversation.</p>
            </motion.div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1.25rem"}}>
              {VALUES.map(v=>(
                <motion.div key={v.title} variants={fU} className="card-hover" style={{padding:"2rem",textAlign:"center"}}>
                  <div style={{width:56,height:56,borderRadius:16,background:v.bg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.25rem",transition:"transform 0.25s"}}><v.icon size={26} color={v.color}/></div>
                  <h3 className="font-heading" style={{fontSize:"1.1rem",color:"var(--txt-primary)",marginBottom:"0.75rem"}}>{v.title}</h3>
                  <p style={{fontSize:"0.875rem",color:"var(--txt-muted)",lineHeight:1.7}}>{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-pad section-white">
        <div className="page-container">
          <motion.div variants={st} initial="hidden" whileInView="show" viewport={{once:true}}>
            <motion.div variants={fU} style={{textAlign:"center",marginBottom:"3rem"}}>
              <span className="badge badge-lilac" style={{display:"inline-flex",marginBottom:"1rem"}}><Users size={11}/> The Team</span>
              <h2 className="font-heading" style={{fontSize:"clamp(2rem,4vw,2.6rem)",color:"var(--txt-primary)",marginBottom:"0.5rem"}}>Meet the <span className="gradient-text">Builders</span></h2>
              <p style={{color:"var(--txt-muted)",maxWidth:420,margin:"0 auto"}}>The people behind every pixel and every line of code.</p>
            </motion.div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1.5rem",maxWidth:800,margin:"0 auto"}}>
              {team.map((m:any)=>(
                <motion.div key={m.name} variants={fU} className="card-hover" style={{padding:"2rem",textAlign:"center"}}>
                  {m.image
                    ? <img src={m.image} alt={m.name} style={{width:80,height:80,borderRadius:16,objectFit:"cover",margin:"0 auto 1.25rem",boxShadow:"var(--shadow-md)"}}/>
                    : <div style={{width:80,height:80,borderRadius:16,background:"linear-gradient(135deg,var(--accent),var(--lilac))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:"1.25rem",margin:"0 auto 1.25rem",boxShadow:"var(--shadow-accent)",fontFamily:"Syne,sans-serif"}}>{m.initials||m.name?.[0]}</div>
                  }
                  <h3 className="font-heading" style={{fontSize:"1.1rem",color:"var(--txt-primary)",marginBottom:6}}>{m.name}</h3>
                  <span className="badge badge-violet" style={{marginBottom:"0.875rem",display:"inline-flex",fontSize:"0.72rem"}}>{m.role}</span>
                  <p style={{fontSize:"0.85rem",color:"var(--txt-muted)",lineHeight:1.7}}>{m.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <Chatbot/>
    </PublicLayout>
  );
}
