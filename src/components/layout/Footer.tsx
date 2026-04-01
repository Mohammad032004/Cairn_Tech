import Link from "next/link";
import { Code2, Mail, Phone, AtSign, Link as LI, Share2, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{background:"var(--surface)", borderTop:"1px solid var(--border)"}}>
      <div className="page-container" style={{paddingTop:"4rem", paddingBottom:"2rem"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"2.5rem", marginBottom:"3rem"}}>
          {/* Brand */}
          <div style={{gridColumn:"span 2"}}>
            <Link href="/" style={{display:"inline-flex", alignItems:"center", gap:10, marginBottom:"1.25rem", textDecoration:"none"}}>
              <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,var(--accent),var(--sky))",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Code2 size={18} color="#fff"/>
              </div>
              <span className="font-heading" style={{fontWeight:800,fontSize:"1.2rem",color:"var(--txt-primary)"}}>
                Cairn<span style={{color:"var(--accent)"}}>Tech</span>
              </span>
            </Link>
            <p style={{fontSize:"0.9rem",color:"var(--txt-muted)",lineHeight:1.7,maxWidth:280,marginBottom:"1.25rem"}}>
              We craft digital experiences that drive real growth. Websites, apps, maintenance — we build what matters.
            </p>
            <a href="mailto:info@cairntech.com" style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:"0.875rem",color:"var(--accent)",textDecoration:"none",marginBottom:"1rem"}}>
              <Mail size={14}/> info@cairntech.com
            </a>
            <br/>
            <a href="tel:+919876543210" style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:"0.875rem",color:"var(--txt-muted)",textDecoration:"none"}}>
              <Phone size={14}/> +91 98765 43210
            </a>
            <div style={{display:"flex",gap:8,marginTop:"1rem"}}>
              {[{I:AtSign,href:"#"},{I:LI,href:"#"},{I:Share2,href:"#"}].map(({I,href},i)=>(
                <a key={i} href={href} style={{width:34,height:34,borderRadius:8,background:"var(--surface-2)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--txt-muted)",transition:"all 0.15s",textDecoration:"none"}}>
                  <I size={15}/>
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading" style={{fontSize:"0.875rem",fontWeight:700,color:"var(--txt-primary)",marginBottom:"1rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>Company</h4>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[["About Us","/about"],["Services","/services"],["Portfolio","/portfolio"],["Contact","/contact"]].map(([l,h])=>(
                <Link key={h} href={h} style={{fontSize:"0.875rem",color:"var(--txt-muted)",textDecoration:"none",transition:"color 0.15s",display:"flex",alignItems:"center",gap:4}}>
                  <ArrowRight size={12} style={{opacity:0.4}}/>{l}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading" style={{fontSize:"0.875rem",fontWeight:700,color:"var(--txt-primary)",marginBottom:"1rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>Services</h4>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {["Website Development","App Development","Maintenance & Support","SEO Optimization","UI/UX Design"].map(s=>(
                <Link key={s} href="/services" style={{fontSize:"0.875rem",color:"var(--txt-muted)",textDecoration:"none",transition:"color 0.15s",display:"flex",alignItems:"center",gap:4}}>
                  <ArrowRight size={12} style={{opacity:0.4}}/>{s}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.5rem",display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:12}}>
          <p style={{fontSize:"0.8rem",color:"var(--txt-faint)"}}>&#169; {new Date().getFullYear()} Cairn Tech. All rights reserved.</p>
          <p style={{fontSize:"0.8rem",color:"var(--txt-faint)",fontStyle:"italic"}}>Code. Create. Maintain.</p>
        </div>
      </div>
    </footer>
  );
}
