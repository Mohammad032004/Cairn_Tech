"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Monitor, Smartphone, Settings, TrendingUp, Layers, Cloud, Check, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import Chatbot from "@/components/ui/Chatbot";

const ICON_MAP: Record<string,any> = { monitor:Monitor, smartphone:Smartphone, settings:Settings, "trending-up":TrendingUp, layers:Layers, cloud:Cloud };
const fU = { hidden:{opacity:0,y:22}, show:{opacity:1,y:0,transition:{duration:0.5}} };
const st = { show:{transition:{staggerChildren:0.1}} };

const D_MAIN = [
  { title:"Website Development", description:"From sleek landing pages to full-scale web platforms — we build sites that perform and convert.", icon:"monitor", features:["Custom Design","Responsive Layout","SEO Optimized","CMS Integration","Fast Load Times","SSL Certificate"], category:"main" },
  { title:"App Development",     description:"Native and cross-platform mobile apps that users actually love. iOS, Android, or both.",         icon:"smartphone", features:["iOS & Android","React Native","API Integration","Push Notifications","Offline Support","App Store Deploy"], category:"main" },
  { title:"Maintenance & Support",description:"Sleep soundly while we monitor, update, and optimize your digital products 24/7.",               icon:"settings", features:["24/7 Monitoring","Bug Fixes","Security Updates","Performance Tuning","Monthly Reports","Priority Support"], category:"main" },
];
const D_ADD = [
  { title:"SEO Optimization", description:"Rank higher. Get found faster. Drive organic traffic that converts.", icon:"trending-up", features:["Keyword Research","On-Page SEO","Link Building","Analytics Reports","Local SEO"], category:"additional" },
  { title:"UI/UX Design",     description:"Beautiful, intuitive interfaces that delight users and drive engagement.", icon:"layers", features:["User Research","Wireframing","Prototyping","Design Systems","Usability Testing"], category:"additional" },
  { title:"Cloud Hosting",    description:"Reliable, scalable hosting with 99.9% uptime and automated backups.", icon:"cloud", features:["Free SSL","99.9% Uptime","Daily Backups","CDN Integration","24/7 Support"], category:"additional" },
];

export default function ServicesPage() {
  const [main, setMain] = useState(D_MAIN);
  const [additional, setAdditional] = useState(D_ADD);

  useEffect(() => {
    fetch("/api/public/services").then(r=>r.json()).then(d=>{
      if(d.data?.length){
        setMain(d.data.filter((s:any)=>s.category==="main"));
        setAdditional(d.data.filter((s:any)=>s.category==="additional"));
      }
    }).catch(()=>{});
  }, []);

  const iconBgs = ["var(--accent-light)","var(--sky-light)","var(--lilac-light)"];
  const iconColors = ["var(--accent)","var(--sky-hover)","#8B5A9E"];

  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{paddingTop:120,paddingBottom:60,background:"linear-gradient(145deg,var(--page-bg),rgba(180,211,217,0.15),var(--page-bg))"}}>
        <div className="page-container" style={{textAlign:"center"}}>
          <motion.span initial={{opacity:0}} animate={{opacity:1}} className="badge badge-sky" style={{display:"inline-flex",marginBottom:"1.25rem",padding:"5px 14px"}}>What We Offer</motion.span>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="font-heading" style={{fontSize:"clamp(2.2rem,5vw,3.5rem)",color:"var(--txt-primary)",marginBottom:"1rem"}}>
            Services Built for <span className="gradient-text">Results</span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} style={{fontSize:"1.1rem",color:"var(--txt-muted)",maxWidth:520,margin:"0 auto"}}>
            Everything you need to build, launch, and grow your digital presence.
          </motion.p>
        </div>
      </section>

      {/* Core Services */}
      <section className="section-pad section-white">
        <div className="page-container">
          <motion.div variants={st} initial="hidden" whileInView="show" viewport={{once:true}}>
            <motion.div variants={fU} style={{textAlign:"center",marginBottom:"3rem"}}>
              <h2 className="font-heading" style={{fontSize:"2.25rem",color:"var(--txt-primary)",marginBottom:"0.5rem"}}>Core <span className="gradient-text">Services</span></h2>
            </motion.div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
              {main.map((s:any,i:number)=>{
                const Icon = ICON_MAP[s.icon]||Monitor;
                return (
                  <motion.div key={i} variants={fU} className="card-hover" style={{padding:"2rem"}}>
                    <div style={{width:52,height:52,borderRadius:14,background:iconBgs[i%3],border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.25rem"}}>
                      <Icon size={24} style={{color:iconColors[i%3]}}/>
                    </div>
                    <h3 className="font-heading" style={{fontSize:"1.25rem",color:"var(--txt-primary)",marginBottom:"0.75rem"}}>{s.title}</h3>
                    <p style={{fontSize:"0.9rem",color:"var(--txt-muted)",lineHeight:1.7,marginBottom:"1.5rem"}}>{s.description}</p>
                    <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:8}}>
                      {(s.features||[]).map((f:string)=>(
                        <li key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.85rem",color:"var(--txt-secondary)"}}>
                          <Check size={14} style={{color:"var(--emerald)",flexShrink:0}}/>{f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-pad section-cream">
        <div className="page-container">
          <motion.div variants={st} initial="hidden" whileInView="show" viewport={{once:true}}>
            <motion.div variants={fU} style={{textAlign:"center",marginBottom:"3rem"}}>
              <h2 className="font-heading" style={{fontSize:"2.25rem",color:"var(--txt-primary)",marginBottom:"0.5rem"}}>Additional <span className="gradient-text">Services</span></h2>
              <p style={{color:"var(--txt-muted)"}}>Complementary services to supercharge your digital presence.</p>
            </motion.div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"1.5rem"}}>
              {additional.map((s:any,i:number)=>{
                const Icon = ICON_MAP[s.icon]||TrendingUp;
                return (
                  <motion.div key={i} variants={fU} className="card-hover" style={{padding:"1.75rem"}}>
                    <div style={{width:44,height:44,borderRadius:12,background:iconBgs[(i+1)%3],border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1rem"}}>
                      <Icon size={20} style={{color:iconColors[(i+1)%3]}}/>
                    </div>
                    <h3 className="font-heading" style={{fontSize:"1.1rem",color:"var(--txt-primary)",marginBottom:"0.6rem"}}>{s.title}</h3>
                    <p style={{fontSize:"0.85rem",color:"var(--txt-muted)",lineHeight:1.7,marginBottom:"1.25rem"}}>{s.description}</p>
                    <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:6}}>
                      {(s.features||[]).map((f:string)=>(
                        <li key={f} style={{display:"flex",alignItems:"center",gap:7,fontSize:"0.8rem",color:"var(--txt-muted)"}}>
                          <Check size={12} style={{color:"var(--emerald)",flexShrink:0}}/>{f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{background:"linear-gradient(135deg,var(--accent),var(--sky-hover))"}}>
        <div className="page-container" style={{textAlign:"center",color:"#fff"}}>
          <h2 className="font-heading" style={{fontSize:"2rem",marginBottom:"1rem"}}>Not Sure Which Service You Need?</h2>
          <p style={{fontSize:"1rem",opacity:0.88,marginBottom:"2rem"}}>Let's have a free 30-minute consultation and find the perfect solution.</p>
          <Link href="/contact" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.95)",color:"var(--accent)",fontWeight:700,padding:"13px 28px",borderRadius:12,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
            Book Free Consultation <ArrowRight size={18}/>
          </Link>
        </div>
      </section>
      <Chatbot/>
    </PublicLayout>
  );
}
