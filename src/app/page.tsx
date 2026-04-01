"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star, Monitor, Smartphone, Settings, TrendingUp, Layers, Cloud, ChevronRight, Zap, Sparkles } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import BookingModal from "@/components/ui/BookingModal";
import Chatbot from "@/components/ui/Chatbot";

const ICON_MAP: Record<string,any> = { monitor:Monitor, smartphone:Smartphone, settings:Settings, "trending-up":TrendingUp, layers:Layers, cloud:Cloud };
const fU = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0,transition:{duration:0.5}} };
const st = { show:{transition:{staggerChildren:0.1}} };
const ICON_STYLES = [
  { bg:"var(--accent-light)",   color:"var(--accent)" },
  { bg:"var(--sky-light)",      color:"var(--sky-hover)" },
  { bg:"var(--lilac-light)",    color:"var(--lilac-hover)" },
];

const D_SERVICES = [
  { title:"Website Development",   description:"Stunning, high-performance websites crafted with the latest tech.", icon:"monitor" },
  { title:"App Development",       description:"Native and cross-platform mobile apps that users love.",            icon:"smartphone" },
  { title:"Maintenance & Support", description:"24/7 monitoring and expert support to keep things running.",       icon:"settings" },
];
const D_PROJECTS = [
  { title:"ShopEase E-Commerce",  description:"Full-stack platform with Stripe payments and admin dashboard.", category:"Web App",    technologies:["React","Node.js","MongoDB"] },
  { title:"HealthTrack App",      description:"Cross-platform fitness tracker with AI-driven health insights.", category:"Mobile App", technologies:["React Native","Firebase"] },
  { title:"EduLearn LMS",         description:"Learning platform with live classes and certification engine.",  category:"Enterprise", technologies:["Next.js","PostgreSQL"] },
];
const D_TESTIMONIALS = [
  { quote:"Cairn Tech delivered our site 2 weeks early. Conversions jumped 40% in the first month.", author:"Priya Sharma", role:"CEO",     company:"StyleHub India", rating:5 },
  { quote:"4.8 stars on the App Store. Clean code and excellent communication throughout.",           author:"Rahul Mehta",  role:"Founder", company:"FitLife App",    rating:5 },
  { quote:"Modernized our legacy system in 3 months. Fast, secure, and a joy to use.",               author:"Anita Verma",  role:"CTO",     company:"EduSpark",       rating:5 },
];
const D_PRICING = [
  { name:"Starter",      price:"₹4,999",   description:"For small businesses",   highlighted:false, features:["5-page Website","Mobile Responsive","Basic SEO","1 Month Support","SSL Certificate"] },
  { name:"Professional", price:"₹9,999",   description:"For growing businesses", highlighted:true,  features:["15-page Website","CMS Integration","Advanced SEO","3 Months Support","E-commerce Ready","Analytics Dashboard"] },
  { name:"Enterprise",   price:"₹19,999+", description:"For large organizations",highlighted:false, features:["Unlimited Pages","Custom Web App","Full SEO Strategy","12 Months Support","API Integrations","Dedicated Manager"] },
];

const CAT_BADGE: Record<string,string> = { "Web App":"badge-violet","Mobile App":"badge-sky","Enterprise":"badge-lilac","Other":"badge-gray" };
const CAT_GRAD:  Record<string,string> = {
  "Web App":"linear-gradient(135deg,rgba(155,142,199,0.1),rgba(155,142,199,0.04))",
  "Mobile App":"linear-gradient(135deg,rgba(180,211,217,0.12),rgba(180,211,217,0.04))",
  "Enterprise":"linear-gradient(135deg,rgba(189,166,206,0.12),rgba(189,166,206,0.04))",
  "Other":"linear-gradient(135deg,rgba(155,142,199,0.07),rgba(180,211,217,0.04))",
};

export default function HomePage() {
  const [services,     setServices]     = useState(D_SERVICES);
  const [projects,     setProjects]     = useState(D_PROJECTS);
  const [testimonials, setTestimonials] = useState(D_TESTIMONIALS);
  const [pricing,      setPricing]      = useState(D_PRICING);
  const [selectedPlan, setSelectedPlan] = useState<string|null>(null);

  useEffect(()=>{
    fetch("/api/public/services").then(r=>r.json()).then(d=>{ if(d.data?.length) setServices(d.data.slice(0,3)); }).catch(()=>{});
    fetch("/api/public/projects").then(r=>r.json()).then(d=>{ if(d.data?.length) setProjects(d.data.slice(0,3)); }).catch(()=>{});
    fetch("/api/public/testimonials").then(r=>r.json()).then(d=>{ if(d.data?.length) setTestimonials(d.data); }).catch(()=>{});
    fetch("/api/public/pricing").then(r=>r.json()).then(d=>{ if(d.data?.length) setPricing(d.data); }).catch(()=>{});
  },[]);

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",paddingTop:80,paddingBottom:60,background:"linear-gradient(145deg,var(--page-bg) 0%,rgba(180,211,217,0.12) 50%,var(--page-bg) 100%)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"15%",right:"5%",width:420,height:420,borderRadius:"50%",background:"radial-gradient(circle,rgba(155,142,199,0.1),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"5%",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(180,211,217,0.12),transparent 70%)",pointerEvents:"none"}}/>
        <div className="page-container" style={{textAlign:"center",position:"relative",zIndex:1}}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{marginBottom:"1.5rem"}}>
            <span className="badge badge-violet" style={{padding:"6px 16px",fontSize:"0.8rem"}}>
              <Sparkles size={13}/> Modern Software Agency
            </span>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
            className="font-heading" style={{fontSize:"clamp(2.8rem,6vw,4.5rem)",fontWeight:800,color:"var(--txt-primary)",marginBottom:"1.25rem",lineHeight:1.1}}>
            Code.{" "}<span className="gradient-text">Create.</span>{" "}Maintain.
          </motion.h1>
          <motion.p initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            style={{fontSize:"1.15rem",color:"var(--txt-muted)",maxWidth:560,margin:"0 auto 2.5rem",lineHeight:1.75}}>
            We transform ideas into powerful digital experiences — websites, apps, and everything in between. Built to scale. Designed to impress.
          </motion.p>
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
            <Link href="/contact" className="btn-primary" style={{fontSize:"1rem",padding:"13px 28px"}}>Get a Free Quote <ArrowRight size={18}/></Link>
            <Link href="/portfolio" className="btn-outline" style={{fontSize:"1rem",padding:"13px 28px"}}>View Our Work</Link>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}}
            style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"2rem",maxWidth:480,margin:"4rem auto 0"}}>
            {[["50+","Projects Done"],["30+","Happy Clients"],["3+","Years Exp."],["24/7","Support"]].map(([n,l])=>(
              <div key={l}>
                <div className="font-heading" style={{fontSize:"2rem",fontWeight:800,color:"var(--accent)"}}>{n}</div>
                <div style={{fontSize:"0.8rem",color:"var(--txt-muted)",marginTop:4}}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section-pad section-white">
        <div className="page-container">
          <motion.div variants={st} initial="hidden" whileInView="show" viewport={{once:true}}>
            <motion.div variants={fU} style={{textAlign:"center",marginBottom:"3.5rem"}}>
              <span className="badge badge-sky" style={{marginBottom:"1rem",display:"inline-flex"}}>What We Do</span>
              <h2 className="font-heading" style={{fontSize:"clamp(2rem,4vw,2.75rem)",color:"var(--txt-primary)",marginBottom:"0.75rem"}}>
                Our Core <span className="gradient-text">Services</span>
              </h2>
              <p style={{color:"var(--txt-muted)",maxWidth:480,margin:"0 auto",lineHeight:1.7}}>End-to-end digital solutions crafted to grow your business faster.</p>
            </motion.div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
              {services.map((s:any,i:number)=>{
                const Icon=ICON_MAP[s.icon]||Monitor; const st2=ICON_STYLES[i%3];
                return (
                  <motion.div key={i} variants={fU} className="card-hover" style={{padding:"2rem"}}>
                    <div style={{width:52,height:52,borderRadius:14,background:st2.bg,border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.25rem",transition:"all 0.25s"}}>
                      <Icon size={24} color={st2.color}/>
                    </div>
                    <h3 className="font-heading" style={{fontSize:"1.2rem",color:"var(--txt-primary)",marginBottom:"0.75rem"}}>{s.title}</h3>
                    <p style={{fontSize:"0.9rem",color:"var(--txt-muted)",lineHeight:1.75,marginBottom:"1.5rem"}}>{s.description}</p>
                    <Link href="/services" style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:"0.875rem",fontWeight:600,color:"var(--accent)",transition:"gap 0.2s"}}>
                      Learn more <ArrowRight size={15}/>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <motion.div variants={fU} style={{textAlign:"center",marginTop:"2.5rem"}}>
              <Link href="/services" className="btn-outline">View All Services</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section className="section-pad section-cream">
        <div className="page-container">
          <motion.div variants={st} initial="hidden" whileInView="show" viewport={{once:true}}>
            <motion.div variants={fU} style={{textAlign:"center",marginBottom:"3.5rem"}}>
              <span className="badge badge-lilac" style={{marginBottom:"1rem",display:"inline-flex"}}>Our Work</span>
              <h2 className="font-heading" style={{fontSize:"clamp(2rem,4vw,2.75rem)",color:"var(--txt-primary)",marginBottom:"0.75rem"}}>
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p style={{color:"var(--txt-muted)",maxWidth:460,margin:"0 auto"}}>A glimpse of the digital products we've brought to life.</p>
            </motion.div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.5rem"}}>
              {projects.map((p:any,i:number)=>(
                <motion.div key={i} variants={fU} className="card-hover" style={{overflow:"hidden"}}>
                  <div style={{height:180,background:CAT_GRAD[p.category]||CAT_GRAD["Other"],display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                    <div className="font-heading" style={{fontSize:"7rem",fontWeight:800,opacity:0.15,color:"var(--accent)",userSelect:"none"}}>{p.title[0]}</div>
                    <span className={`badge ${CAT_BADGE[p.category]||"badge-gray"}`} style={{position:"absolute",top:12,left:12}}>{p.category}</span>
                  </div>
                  <div style={{padding:"1.5rem"}}>
                    <h3 className="font-heading" style={{fontSize:"1.1rem",color:"var(--txt-primary)",marginBottom:"0.6rem"}}>{p.title}</h3>
                    <p style={{fontSize:"0.875rem",color:"var(--txt-muted)",lineHeight:1.65,marginBottom:"1.25rem"}}>{p.description}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {(p.technologies||[]).slice(0,3).map((t:string)=>(
                        <span key={t} style={{fontSize:"0.72rem",padding:"3px 9px",borderRadius:6,background:"var(--surface-2)",color:"var(--txt-muted)",fontWeight:600,border:"1px solid var(--border)"}}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div variants={fU} style={{textAlign:"center",marginTop:"2.5rem"}}>
              <Link href="/portfolio" className="btn-outline">View All Projects</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-pad section-white">
        <div className="page-container">
          <motion.div variants={st} initial="hidden" whileInView="show" viewport={{once:true}}>
            <motion.div variants={fU} style={{textAlign:"center",marginBottom:"3.5rem"}}>
              <span className="badge badge-violet" style={{marginBottom:"1rem",display:"inline-flex"}}><Star size={11}/> Client Love</span>
              <h2 className="font-heading" style={{fontSize:"clamp(2rem,4vw,2.75rem)",color:"var(--txt-primary)",marginBottom:"0.75rem"}}>
                What Our <span className="gradient-text">Clients Say</span>
              </h2>
            </motion.div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem"}}>
              {testimonials.map((t:any,i:number)=>(
                <motion.div key={i} variants={fU} className="card" style={{padding:"2rem",display:"flex",flexDirection:"column"}}>
                  <div style={{display:"flex",gap:3,marginBottom:"1.25rem"}}>
                    {Array.from({length:t.rating||5}).map((_,j)=><Star key={j} size={15} fill="#C97C2A" color="#C97C2A"/>)}
                  </div>
                  <p style={{fontSize:"0.9rem",color:"var(--txt-secondary)",lineHeight:1.75,fontStyle:"italic",flex:1,marginBottom:"1.5rem"}}>"{t.quote}"</p>
                  <div style={{display:"flex",alignItems:"center",gap:12,paddingTop:"1.25rem",borderTop:"1px solid var(--border)"}}>
                    <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,var(--accent),var(--lilac))",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:"0.9rem",flexShrink:0}}>
                      {t.author[0]}
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:"0.875rem",color:"var(--txt-primary)"}}>{t.author}</div>
                      <div style={{fontSize:"0.78rem",color:"var(--txt-faint)"}}>{t.role}{t.company?`, ${t.company}`:""}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section-pad section-cream">
        <div className="page-container">
          <motion.div variants={st} initial="hidden" whileInView="show" viewport={{once:true}}>
            <motion.div variants={fU} style={{textAlign:"center",marginBottom:"3.5rem"}}>
              <span className="badge badge-sky" style={{marginBottom:"1rem",display:"inline-flex"}}><Zap size={11}/> Transparent Pricing</span>
              <h2 className="font-heading" style={{fontSize:"clamp(2rem,4vw,2.75rem)",color:"var(--txt-primary)",marginBottom:"0.75rem"}}>
                Plans That Fit <span className="gradient-text">Your Budget</span>
              </h2>
              <p style={{color:"var(--txt-muted)",maxWidth:440,margin:"0 auto"}}>No hidden fees. No surprises. Just great work.</p>
            </motion.div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.5rem",maxWidth:960,margin:"0 auto",alignItems:"center"}}>
              {pricing.map((plan:any,i:number)=>(
                <motion.div key={i} variants={fU} className={plan.highlighted?"pricing-card-featured":"pricing-card"}>
                  {plan.highlighted&&(
                    <div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,var(--amber),#E8943A)",color:"#fff",fontSize:"0.72rem",fontWeight:800,padding:"5px 16px",borderRadius:99,boxShadow:"0 4px 14px rgba(201,124,42,0.4)",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
                      <Sparkles size={11}/> RECOMMENDED
                    </div>
                  )}
                  <div style={{fontSize:"0.72rem",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.75rem",color:plan.highlighted?"rgba(255,255,255,0.75)":"var(--accent)"}}>
                    {plan.name}
                  </div>
                  <div className="font-heading" style={{fontSize:"2.75rem",fontWeight:800,marginBottom:"0.35rem",color:plan.highlighted?"#fff":"var(--txt-primary)"}}>{plan.price}</div>
                  <div style={{fontSize:"0.875rem",marginBottom:"1.75rem",color:plan.highlighted?"rgba(255,255,255,0.75)":"var(--txt-muted)"}}>{plan.description}</div>
                  <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:10,marginBottom:"2rem"}}>
                    {(plan.features||[]).map((f:string)=>(
                      <li key={f} style={{display:"flex",alignItems:"flex-start",gap:9,fontSize:"0.875rem",color:plan.highlighted?"rgba(255,255,255,0.88)":"var(--txt-secondary)"}}>
                        <CheckCircle size={15} color={plan.highlighted?"rgba(255,255,255,0.7)":"var(--emerald)"} style={{flexShrink:0,marginTop:2}}/>{f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={()=>setSelectedPlan(plan.name)} style={{
                    width:"100%",padding:"12px",borderRadius:12,fontWeight:700,fontSize:"0.9375rem",cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s",
                    background:plan.highlighted?"rgba(255,255,255,0.95)":"var(--accent)",
                    color:plan.highlighted?"var(--accent)":"#fff",
                    border:"none",
                    boxShadow:plan.highlighted?"0 4px 16px rgba(0,0,0,0.15)":"var(--shadow-accent)",
                  }}>
                    Choose Plan <ChevronRight size={16}/>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad" style={{background:"linear-gradient(135deg,var(--accent),var(--lilac))",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 30% 60%,rgba(255,255,255,0.07),transparent 60%)",pointerEvents:"none"}}/>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="page-container" style={{textAlign:"center",color:"#fff",position:"relative"}}>
          <h2 className="font-heading" style={{fontSize:"clamp(1.8rem,4vw,2.75rem)",marginBottom:"1rem"}}>Ready to Build Something Great?</h2>
          <p style={{opacity:0.85,fontSize:"1rem",marginBottom:"2.5rem",maxWidth:480,margin:"0 auto 2.5rem"}}>Let's turn your vision into reality. Get a free consultation today.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center"}}>
            <Link href="/contact" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.95)",color:"var(--accent)",fontWeight:700,padding:"13px 28px",borderRadius:12,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.15)",transition:"all 0.2s"}}>
              Start Your Project <ArrowRight size={18}/>
            </Link>
            <Link href="/portfolio" style={{display:"inline-flex",alignItems:"center",gap:8,border:"2px solid rgba(255,255,255,0.6)",color:"#fff",fontWeight:700,padding:"11px 28px",borderRadius:12,textDecoration:"none",transition:"all 0.2s"}}>
              View Portfolio
            </Link>
          </div>
        </motion.div>
      </section>

      {selectedPlan&&<BookingModal plan={selectedPlan} onClose={()=>setSelectedPlan(null)}/>}
      <Chatbot/>
    </PublicLayout>
  );
}
