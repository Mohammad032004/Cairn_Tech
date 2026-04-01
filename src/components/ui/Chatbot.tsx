"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message { role:"bot"|"user"; text:string; }

const FAQS: Record<string,string> = {
  pricing:"Our plans start at ₹4,999 (Starter), ₹9,999 (Professional), and ₹19,999+ (Enterprise). Want to book a plan?",
  services:"We offer Website Development, App Development, Maintenance & Support, SEO Optimization, UI/UX Design, and Cloud Hosting.",
  contact:"You can reach us at info@cairntech.com or call +91 98765 43210. We respond within 24 hours.",
  timeline:"Landing pages: 1–2 weeks. Full websites: 2–4 weeks. Complex apps: 4–12 weeks. Urgent delivery is available.",
  technology:"We work with React, Next.js, Node.js, React Native, MongoDB, PostgreSQL, and more.",
  portfolio:"We've built e-commerce platforms, fitness apps, LMS systems, and booking tools. Check our Portfolio page!",
  maintenance:"Yes! Our Maintenance plans cover 24/7 monitoring, bug fixes, security updates, and performance tuning.",
  default:"Great question! Email us at info@cairntech.com and our team will get back to you shortly.",
};

function getResponse(input:string):string {
  const l = input.toLowerCase();
  if(l.match(/price|cost|plan|₹|how much/)) return FAQS.pricing;
  if(l.match(/service|offer|do you/))       return FAQS.services;
  if(l.match(/contact|email|reach|call/))   return FAQS.contact;
  if(l.match(/time|long|duration|when/))    return FAQS.timeline;
  if(l.match(/tech|stack|language|built/))  return FAQS.technology;
  if(l.match(/portfolio|project|work/))     return FAQS.portfolio;
  if(l.match(/maintain|support|update/))    return FAQS.maintenance;
  if(l.match(/hi|hello|hey|namaste/))       return "Hi there! 👋 I'm CairnBot. Ask me anything about our services, pricing, or timelines!";
  return FAQS.default;
}
const QUICK = ["Pricing plans","Our services","Project timeline","Tech stack"];

export default function Chatbot() {
  const [open,  setOpen]  = useState(false);
  const [msgs,  setMsgs]  = useState<Message[]>([{ role:"bot", text:"Hi! I'm CairnBot 🤖 Ask me anything about our services, pricing, or timelines!" }]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const send = (text?:string) => {
    const msg = text||input.trim(); if(!msg) return;
    setMsgs(p=>[...p,{role:"user",text:msg}]); setInput("");
    setTimeout(()=>{ setMsgs(p=>[...p,{role:"bot",text:getResponse(msg)}]); },600);
  };

  return (
    <>
      <motion.button onClick={()=>setOpen(!open)} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
        style={{position:"fixed",bottom:24,right:24,zIndex:50,width:54,height:54,borderRadius:16,background:"linear-gradient(135deg,var(--accent),var(--lilac-hover))",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"var(--shadow-accent)",color:"#fff"}}>
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x"   initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}><X size={22}/></motion.div>
            : <motion.div key="msg" initial={{rotate:90,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}}><MessageCircle size={22}/></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:20}}
            transition={{type:"spring",damping:25,stiffness:300}}
            style={{position:"fixed",bottom:90,right:24,zIndex:50,width:340,background:"var(--surface)",borderRadius:20,boxShadow:"0 16px 48px rgba(15,11,26,0.2)",border:"1px solid var(--border)",overflow:"hidden",display:"flex",flexDirection:"column",maxHeight:480}}>
            <div style={{background:"linear-gradient(135deg,var(--accent),var(--lilac-hover))",padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:12,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={18} color="#fff"/></div>
              <div>
                <div style={{fontWeight:700,fontSize:"0.9rem",color:"#fff",fontFamily:"Syne,sans-serif"}}>CairnBot</div>
                <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.75)",display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:6,height:6,background:"#6EE7A0",borderRadius:"50%",display:"inline-block"}}/>Online
                </div>
              </div>
            </div>

            <div style={{flex:1,overflowY:"auto",padding:"12px",display:"flex",flexDirection:"column",gap:10,background:"var(--page-bg)"}}>
              {msgs.map((m,i)=>(
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                  style={{display:"flex",gap:8,justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  {m.role==="bot"&&<div style={{width:28,height:28,borderRadius:9,background:"var(--accent-light)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><Bot size={14} color="var(--accent)"/></div>}
                  <div style={{padding:"10px 14px",borderRadius:14,fontSize:"0.85rem",maxWidth:"75%",lineHeight:1.6,
                    background:m.role==="user"?"linear-gradient(135deg,var(--accent),var(--lilac-hover))":"var(--surface)",
                    color:m.role==="user"?"#fff":"var(--txt-secondary)",
                    boxShadow:m.role==="bot"?"var(--shadow-sm)":"none",
                    borderTopLeftRadius:m.role==="bot"?4:14, borderTopRightRadius:m.role==="user"?4:14,
                    border:m.role==="bot"?"1px solid var(--border)":"none",
                  }}>{m.text}</div>
                  {m.role==="user"&&<div style={{width:28,height:28,borderRadius:9,background:"var(--surface-2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,border:"1px solid var(--border)"}}><User size={13} color="var(--txt-muted)"/></div>}
                </motion.div>
              ))}
              <div ref={endRef}/>
            </div>

            <div style={{padding:"10px 12px",borderTop:"1px solid var(--border)",background:"var(--surface)",display:"flex",flexWrap:"wrap",gap:6}}>
              {QUICK.map(r=>(
                <button key={r} onClick={()=>send(r)} style={{fontSize:"0.72rem",padding:"5px 12px",borderRadius:99,border:"1.5px solid var(--border)",background:"var(--surface-2)",color:"var(--txt-muted)",cursor:"pointer",fontWeight:600,transition:"all 0.15s",fontFamily:"DM Sans,sans-serif"}}>{r}</button>
              ))}
            </div>

            <div style={{padding:"10px 12px",background:"var(--surface)",display:"flex",gap:8}}>
              <input className="input-field" style={{fontSize:"0.875rem",padding:"9px 12px",flex:1}} placeholder="Type a message..." value={input}
                onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
              <button onClick={()=>send()} style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,var(--accent),var(--lilac-hover))",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0,boxShadow:"var(--shadow-accent)"}}>
                <Send size={15}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
