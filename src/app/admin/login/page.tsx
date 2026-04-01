"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Code2, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [form, setForm]       = useState({ username:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]  = useState(false);
  const router = useRouter();

  useEffect(()=>{ if(localStorage.getItem("cairn_admin_token")) router.replace("/admin/dashboard"); },[router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const res  = await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data = await res.json();
      if(data.success){ localStorage.setItem("cairn_admin_token",data.token); toast.success("Welcome back!"); router.push("/admin/dashboard"); }
      else toast.error(data.message||"Invalid credentials");
    } catch { toast.error("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"linear-gradient(145deg,#1A1426,#100D18,#221A30)"}}>
      <Toaster position="top-right"/>
      <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} transition={{type:"spring",damping:24}} style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#9B8EC7,#BDA6CE)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1rem",boxShadow:"0 8px 24px rgba(155,142,199,0.4)"}}>
            <Code2 size={26} color="#fff"/>
          </div>
          <h1 className="font-heading" style={{color:"#F0EBF8",fontSize:"1.75rem",fontWeight:800}}>Cairn<span style={{color:"#A898D0"}}>Tech</span></h1>
          <p style={{color:"#6A5888",fontSize:"0.875rem",marginTop:4}}>Admin Dashboard</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(155,142,199,0.15)",borderRadius:20,padding:"2rem",backdropFilter:"blur(10px)"}}>
          <h2 className="font-heading" style={{fontSize:"1.25rem",color:"#F0EBF8",marginBottom:"1.5rem"}}>Sign In</h2>
          <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div>
              <label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"#9080A8",marginBottom:6}}>Username</label>
              <div style={{position:"relative"}}>
                <User size={15} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#5A4870"}}/>
                <input style={{width:"100%",padding:"11px 14px 11px 38px",borderRadius:12,border:"1.5px solid rgba(155,142,199,0.2)",background:"rgba(255,255,255,0.05)",color:"#F0EBF8",fontSize:"0.9375rem",outline:"none",fontFamily:"DM Sans,sans-serif",transition:"border-color 0.2s"}}
                  placeholder="admin" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required
                  onFocus={e=>{e.target.style.borderColor="rgba(155,142,199,0.6)"}} onBlur={e=>{e.target.style.borderColor="rgba(155,142,199,0.2)"}}/>
              </div>
            </div>
            <div>
              <label style={{display:"block",fontSize:"0.8rem",fontWeight:600,color:"#9080A8",marginBottom:6}}>Password</label>
              <div style={{position:"relative"}}>
                <Lock size={15} style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#5A4870"}}/>
                <input type={showPass?"text":"password"}
                  style={{width:"100%",padding:"11px 40px 11px 38px",borderRadius:12,border:"1.5px solid rgba(155,142,199,0.2)",background:"rgba(255,255,255,0.05)",color:"#F0EBF8",fontSize:"0.9375rem",outline:"none",fontFamily:"DM Sans,sans-serif",transition:"border-color 0.2s"}}
                  placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required
                  onFocus={e=>{e.target.style.borderColor="rgba(155,142,199,0.6)"}} onBlur={e=>{e.target.style.borderColor="rgba(155,142,199,0.2)"}}/>
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#5A4870",padding:0}}>
                  {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{width:"100%",padding:"13px",marginTop:4,justifyContent:"center",fontSize:"0.9375rem"}}>
              {loading?<><Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>Signing in...</>:"Sign In to Dashboard"}
            </button>
          </form>
          <p style={{textAlign:"center",fontSize:"0.75rem",color:"#3A2850",marginTop:"1.25rem"}}></p>
        </div>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
