"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Plus, Pencil, Trash2, X, Star, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import toast from "react-hot-toast";

const CATEGORIES = ["Web App","Mobile App","Enterprise","Other"];
const EMPTY = { title:"", description:"", category:"Web App", technologies:"", image:"", liveUrl:"", featured:false, order:0 };

const CAT_COLOR: Record<string,string> = {
  "Web App":    "var(--accent)",
  "Mobile App": "var(--sky-hover)",
  "Enterprise": "var(--lilac-hover)",
  "Other":      "var(--txt-muted)",
};
const CAT_BG: Record<string,string> = {
  "Web App":    "var(--accent-light)",
  "Mobile App": "var(--sky-light)",
  "Enterprise": "var(--lilac-light)",
  "Other":      "var(--surface-2)",
};

const S = {
  page:    { padding:"1.5rem", maxWidth:1100 } as React.CSSProperties,
  overlay: { position:"fixed" as const, inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(15,11,26,0.65)", backdropFilter:"blur(8px)" } as React.CSSProperties,
  modal:   { background:"var(--surface)", borderRadius:20, boxShadow:"0 24px 64px rgba(15,11,26,0.4)", width:"100%", maxWidth:520, padding:"1.75rem", maxHeight:"90vh", overflowY:"auto" as const, border:"1px solid var(--border)" } as React.CSSProperties,
  label:   { display:"block", fontSize:"0.8rem", fontWeight:600, color:"var(--txt-muted)", marginBottom:6 } as React.CSSProperties,
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState<any>(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);

  const token   = () => typeof window !== "undefined" ? localStorage.getItem("cairn_admin_token") : "";
  const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const load = () => {
    fetch("/api/admin/projects", { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) setProjects(d.data); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ ...p, technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : "" }); setModal(true); };

  const save = async () => {
    if (!form.title) return toast.error("Title is required");
    setSaving(true);
    const payload = { ...form, technologies: (form.technologies as string).split(",").map((t: string) => t.trim()).filter(Boolean) };
    const method  = editing ? "PUT" : "POST";
    const body    = editing ? { ...payload, id: editing._id } : payload;
    const res     = await fetch("/api/admin/projects", { method, headers: headers(), body: JSON.stringify(body) }).then(r => r.json());
    if (res.success) { toast.success(editing ? "Updated" : "Created"); load(); setModal(false); }
    else toast.error("Failed");
    setSaving(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch("/api/admin/projects", { method: "DELETE", headers: headers(), body: JSON.stringify({ id }) }).then(r => r.json());
    if (res.success) { setProjects(p => p.filter(x => x._id !== id)); toast.success("Deleted"); }
  };

  return (
    <AdminLayout>
      <div style={S.page}>
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          style={{ marginBottom:"1.75rem", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.75rem", fontWeight:800, color:"var(--txt-primary)", display:"flex", alignItems:"center", gap:10 }}>
              <FolderOpen size={26} color="var(--lilac-hover)" /> Portfolio Projects
            </h1>
            <p style={{ color:"var(--txt-muted)", marginTop:4, fontSize:"0.875rem" }}>Manage your portfolio showcase</p>
          </div>
          <button onClick={openNew} className="btn-primary" style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Plus size={16} /> Add Project
          </button>
        </motion.div>

        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:220 }}>
            <div style={{ width:32, height:32, border:"2.5px solid var(--accent)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          </div>
        ) : projects.length === 0 ? (
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:"3rem", textAlign:"center" }}>
            <FolderOpen size={40} color="var(--txt-faint)" style={{ margin:"0 auto 1rem" }} />
            <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, color:"var(--txt-muted)", marginBottom:8 }}>No projects yet</h3>
            <p style={{ color:"var(--txt-faint)", fontSize:"0.875rem", marginBottom:"1.25rem" }}>Add your first portfolio project to get started</p>
            <button onClick={openNew} className="btn-primary" style={{ margin:"0 auto" }}><Plus size={15} /> Add First Project</button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"1.25rem" }}>
            {projects.map((p, i) => {
              const color = CAT_COLOR[p.category] || "var(--txt-muted)";
              const bg    = CAT_BG[p.category]    || "var(--surface-2)";
              return (
                <motion.div key={p._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i * 0.07 }}
                  style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, boxShadow:"var(--shadow-sm)", overflow:"hidden" }}>

                  {/* Card hero */}
                  <div style={{ height:120, background:`linear-gradient(135deg,${bg},var(--page-bg))`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                    <div style={{ fontFamily:"Syne,sans-serif", fontSize:"5rem", fontWeight:800, opacity:0.15, color, userSelect:"none", lineHeight:1 }}>{p.title[0]}</div>
                    <div style={{ position:"absolute", top:12, left:12 }}>
                      <span style={{ fontSize:"0.72rem", fontWeight:700, padding:"4px 10px", borderRadius:99, background:`${color}20`, color, border:`1px solid ${color}30` }}>{p.category}</span>
                    </div>
                    {p.featured && (
                      <div style={{ position:"absolute", top:12, right:12, width:28, height:28, borderRadius:8, background:"rgba(201,124,42,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Star size={14} fill="var(--amber)" color="var(--amber)" />
                      </div>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ position:"absolute", bottom:12, right:12, width:28, height:28, borderRadius:8, background:"var(--surface)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <ExternalLink size={13} color="var(--accent)" />
                      </a>
                    )}
                  </div>

                  {/* Card body */}
                  <div style={{ padding:"1.25rem" }}>
                    <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1rem", color:"var(--txt-primary)", marginBottom:5 }}>{p.title}</h3>
                    <p style={{ fontSize:"0.85rem", color:"var(--txt-muted)", lineHeight:1.65, marginBottom:"1rem" }}>{p.description}</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:"1rem" }}>
                      {(p.technologies || []).map((t: string, idx: number) => (
                        <span key={idx} style={{ fontSize:"0.72rem", padding:"3px 9px", borderRadius:6, background:"var(--surface-2)", color:"var(--txt-muted)", border:"1px solid var(--border)", fontWeight:500 }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display:"flex", gap:8, paddingTop:"0.875rem", borderTop:"1px solid var(--border-subtle)" }}>
                      <button onClick={() => openEdit(p)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"8px 12px", borderRadius:10, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", fontSize:"0.8rem", fontWeight:600, color:"var(--accent)", fontFamily:"DM Sans,sans-serif" }}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => deleteProject(p._id)} style={{ width:36, height:36, borderRadius:10, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--red)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={S.overlay}>
            <motion.div initial={{ scale:0.95, opacity:0, y:16 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.95, opacity:0 }}
              transition={{ type:"spring", damping:26, stiffness:300 }} style={S.modal}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
                <div>
                  <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.2rem", color:"var(--txt-primary)" }}>{editing ? "Edit Project" : "New Project"}</h2>
                  <p style={{ fontSize:"0.8rem", color:"var(--txt-muted)", marginTop:2 }}>Fill in the project details</p>
                </div>
                <button onClick={() => setModal(false)} style={{ width:32, height:32, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--txt-muted)" }}>
                  <X size={15} />
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div><label style={S.label}>Project Title *</label><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title:e.target.value })} placeholder="e.g. ShopEase E-Commerce" /></div>
                <div><label style={S.label}>Description</label><textarea className="input-field" style={{ minHeight:80, resize:"vertical" }} value={form.description} onChange={e => setForm({ ...form, description:e.target.value })} /></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={S.label}>Category</label>
                    <select className="input-field" style={{ cursor:"pointer", appearance:"none" }} value={form.category} onChange={e => setForm({ ...form, category:e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label style={S.label}>Display Order</label><input className="input-field" type="number" value={form.order} onChange={e => setForm({ ...form, order:Number(e.target.value) })} /></div>
                </div>
                <div><label style={S.label}>Technologies (comma-separated)</label><input className="input-field" value={form.technologies as string} onChange={e => setForm({ ...form, technologies:e.target.value })} placeholder="React, Node.js, MongoDB" /></div>
                <div><label style={S.label}>Image URL (optional)</label><input className="input-field" value={form.image} onChange={e => setForm({ ...form, image:e.target.value })} placeholder="https://..." /></div>
                <div><label style={S.label}>Live URL (optional)</label><input className="input-field" value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl:e.target.value })} placeholder="https://..." /></div>
                <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                  <div onClick={() => setForm({ ...form, featured:!form.featured })}
                    style={{ width:38, height:20, borderRadius:99, background:form.featured ? "var(--amber)" : "var(--surface-3)", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:2, width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"transform 0.2s", transform:`translateX(${form.featured ? 18 : 2}px)` }} />
                  </div>
                  <span style={{ fontSize:"0.875rem", color:"var(--txt-secondary)" }}>⭐ Featured Project</span>
                </label>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:"1.5rem" }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex:1, justifyContent:"center" }}>
                  {saving ? "Saving..." : editing ? "Update Project" : "Add Project"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AdminLayout>
  );
}
