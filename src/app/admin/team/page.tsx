"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Pencil, Trash2, X, Image } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import toast from "react-hot-toast";

const EMPTY = { name:"", role:"", position:"", bio:"", image:"", initials:"", order:0, active:true };
const AVATAR_GRADS = [
  "linear-gradient(135deg,var(--accent),var(--lilac-hover))",
  "linear-gradient(135deg,var(--sky-hover),var(--sky))",
  "linear-gradient(135deg,var(--lilac-hover),var(--accent))",
  "linear-gradient(135deg,var(--emerald),var(--sky-hover))",
];

const S = {
  page:    { padding:"1.5rem", maxWidth:1100 } as React.CSSProperties,
  overlay: { position:"fixed" as const, inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(15,11,26,0.65)", backdropFilter:"blur(8px)" } as React.CSSProperties,
  modal:   { background:"var(--surface)", borderRadius:20, boxShadow:"0 24px 64px rgba(15,11,26,0.4)", width:"100%", maxWidth:480, padding:"1.75rem", maxHeight:"90vh", overflowY:"auto" as const, border:"1px solid var(--border)" } as React.CSSProperties,
  label:   { display:"block", fontSize:"0.8rem", fontWeight:600, color:"var(--txt-muted)", marginBottom:6 } as React.CSSProperties,
};

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);

  const token   = () => typeof window !== "undefined" ? localStorage.getItem("cairn_admin_token") : "";
  const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const load = () => {
    fetch("/api/admin/team", { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) setMembers(d.data); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (m: any) => { setEditing(m); setForm(m); setModal(true); };

  const save = async () => {
    if (!form.name || !form.role) return toast.error("Name and role are required");
    const autoInitials = form.initials || form.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0,2);
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body   = editing ? { id:editing._id, ...form, initials:autoInitials } : { ...form, initials:autoInitials };
    const res    = await fetch("/api/admin/team", { method, headers:headers(), body:JSON.stringify(body) }).then(r => r.json());
    if (res.success) { toast.success(editing ? "Member updated" : "Member added"); load(); setModal(false); }
    else toast.error("Failed");
    setSaving(false);
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    const res = await fetch("/api/admin/team", { method:"DELETE", headers:headers(), body:JSON.stringify({ id }) }).then(r => r.json());
    if (res.success) { setMembers(m => m.filter(x => x._id !== id)); toast.success("Removed"); }
  };

  return (
    <AdminLayout>
      <div style={S.page}>
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          style={{ marginBottom:"1.75rem", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.75rem", fontWeight:800, color:"var(--txt-primary)", display:"flex", alignItems:"center", gap:10 }}>
              <Users size={26} color="var(--emerald)" /> Team Management
            </h1>
            <p style={{ color:"var(--txt-muted)", marginTop:4, fontSize:"0.875rem" }}>Manage the team displayed on the About page</p>
          </div>
          <button onClick={openNew} className="btn-primary" style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Plus size={16} /> Add Member
          </button>
        </motion.div>

        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:220 }}>
            <div style={{ width:32, height:32, border:"2.5px solid var(--accent)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          </div>
        ) : members.length === 0 ? (
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:"3rem", textAlign:"center" }}>
            <Users size={40} color="var(--txt-faint)" style={{ margin:"0 auto 1rem" }} />
            <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, color:"var(--txt-muted)", marginBottom:8 }}>No team members yet</h3>
            <p style={{ color:"var(--txt-faint)", fontSize:"0.875rem", marginBottom:"1.25rem" }}>Add your team to display them on the About page</p>
            <button onClick={openNew} className="btn-primary" style={{ margin:"0 auto" }}><Plus size={15} /> Add First Member</button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"1.25rem" }}>
            {members.map((m, i) => (
              <motion.div key={m._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i * 0.07 }}
                style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:"1.5rem", textAlign:"center", boxShadow:"var(--shadow-sm)" }}>

                {/* Avatar */}
                {m.image ? (
                  <img src={m.image} alt={m.name} style={{ width:72, height:72, borderRadius:16, objectFit:"cover", margin:"0 auto 1rem", boxShadow:"var(--shadow-md)" }} />
                ) : (
                  <div style={{ width:72, height:72, borderRadius:16, background:AVATAR_GRADS[i % AVATAR_GRADS.length], display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem", boxShadow:"var(--shadow-accent)", fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:"1.4rem", color:"#fff" }}>
                    {m.initials || m.name?.[0]}
                  </div>
                )}

                <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1rem", color:"var(--txt-primary)", marginBottom:5 }}>{m.name}</h3>
                <div style={{ marginBottom:6 }}>
                  <span style={{ fontSize:"0.72rem", fontWeight:700, padding:"4px 11px", borderRadius:99, background:"var(--accent-light)", color:"var(--accent-text)", border:"1px solid var(--accent)", borderOpacity:0.2 }}>{m.role}</span>
                </div>
                {m.position && <div style={{ fontSize:"0.78rem", color:"var(--txt-faint)", marginBottom:8 }}>{m.position}</div>}
                <p style={{ fontSize:"0.8rem", color:"var(--txt-muted)", lineHeight:1.65, marginBottom:"1.25rem" }}>{m.bio}</p>

                <div style={{ display:"flex", gap:8, borderTop:"1px solid var(--border-subtle)", paddingTop:"1rem" }}>
                  <button onClick={() => openEdit(m)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"8px", borderRadius:10, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", fontSize:"0.8rem", fontWeight:600, color:"var(--accent)", fontFamily:"DM Sans,sans-serif" }}>
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => deleteMember(m._id)} style={{ width:36, height:36, borderRadius:10, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--red)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={S.overlay}>
            <motion.div initial={{ scale:0.95, opacity:0, y:16 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.95, opacity:0 }}
              transition={{ type:"spring", damping:26, stiffness:300 }} style={S.modal}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
                <div>
                  <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.2rem", color:"var(--txt-primary)" }}>{editing ? "Edit Team Member" : "Add Team Member"}</h2>
                  <p style={{ fontSize:"0.8rem", color:"var(--txt-muted)", marginTop:2 }}>Shown on the public About page</p>
                </div>
                <button onClick={() => setModal(false)} style={{ width:32, height:32, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--txt-muted)" }}>
                  <X size={15} />
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div><label style={S.label}>Full Name *</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} placeholder="e.g. Aryan Mehta" /></div>
                <div><label style={S.label}>Role / Title *</label><input className="input-field" value={form.role} onChange={e => setForm({ ...form, role:e.target.value })} placeholder="e.g. Founder & CEO" /></div>
                <div><label style={S.label}>Department</label><input className="input-field" value={form.position} onChange={e => setForm({ ...form, position:e.target.value })} placeholder="e.g. Engineering, Design" /></div>
                <div><label style={S.label}>Bio</label><textarea className="input-field" style={{ minHeight:80, resize:"vertical" }} value={form.bio} onChange={e => setForm({ ...form, bio:e.target.value })} placeholder="Short bio about this person..." /></div>
                <div>
                  <label style={S.label}>Profile Image URL (optional)</label>
                  <div style={{ position:"relative" }}>
                    <Image size={13} style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--txt-faint)" }} />
                    <input className="input-field" style={{ paddingLeft:36 }} value={form.image} onChange={e => setForm({ ...form, image:e.target.value })} placeholder="https://example.com/photo.jpg" />
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div><label style={S.label}>Initials (auto-generated)</label><input className="input-field" value={form.initials} onChange={e => setForm({ ...form, initials:e.target.value })} placeholder="AM" maxLength={3} /></div>
                  <div><label style={S.label}>Display Order</label><input className="input-field" type="number" value={form.order} onChange={e => setForm({ ...form, order:Number(e.target.value) })} /></div>
                </div>
                <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                  <div onClick={() => setForm({ ...form, active:!form.active })}
                    style={{ width:38, height:20, borderRadius:99, background:form.active ? "var(--accent)" : "var(--surface-3)", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:2, width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"transform 0.2s", transform:`translateX(${form.active ? 18 : 2}px)` }} />
                  </div>
                  <span style={{ fontSize:"0.875rem", color:"var(--txt-secondary)" }}>Show on About page</span>
                </label>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:"1.5rem" }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex:1, justifyContent:"center" }}>
                  {saving ? "Saving..." : editing ? "Update Member" : "Add Member"}
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
