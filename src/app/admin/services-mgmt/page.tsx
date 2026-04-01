"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Plus, Pencil, Trash2, X, Monitor, Smartphone, Settings, TrendingUp, Layers, Cloud } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import toast from "react-hot-toast";

const ICON_MAP: Record<string,any> = { monitor:Monitor, smartphone:Smartphone, settings:Settings, "trending-up":TrendingUp, layers:Layers, cloud:Cloud };
const ICON_OPTIONS = ["monitor","smartphone","settings","trending-up","layers","cloud","code"];
const EMPTY = { title:"", description:"", icon:"monitor", features:"", category:"main", order:0, active:true };

const S = {
  page:    { padding:"1.5rem", maxWidth:1100 } as React.CSSProperties,
  card:    { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, boxShadow:"var(--shadow-sm)" } as React.CSSProperties,
  overlay: { position:"fixed" as const, inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(15,11,26,0.65)", backdropFilter:"blur(8px)" } as React.CSSProperties,
  modal:   { background:"var(--surface)", borderRadius:20, boxShadow:"0 24px 64px rgba(15,11,26,0.4)", width:"100%", maxWidth:520, padding:"1.75rem", maxHeight:"90vh", overflowY:"auto" as const, border:"1px solid var(--border)" } as React.CSSProperties,
  label:   { display:"block", fontSize:"0.8rem", fontWeight:600, color:"var(--txt-muted)", marginBottom:6 } as React.CSSProperties,
};

const ICON_COLORS = ["var(--accent)","var(--sky-hover)","var(--lilac-hover)","var(--emerald)","var(--amber)","var(--red)"];

export default function ServicesAdminPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState<any>(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);

  const token   = () => typeof window !== "undefined" ? localStorage.getItem("cairn_admin_token") : "";
  const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const load = () => {
    fetch("/api/admin/services", { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) setServices(d.data); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s: any) => { setEditing(s); setForm({ ...s, features: Array.isArray(s.features) ? s.features.join("\n") : "" }); setModal(true); };

  const save = async () => {
    if (!form.title) return toast.error("Title is required");
    setSaving(true);
    const payload = { ...form, features: (form.features as string).split("\n").map((f: string) => f.trim()).filter(Boolean) };
    const method  = editing ? "PUT" : "POST";
    const body    = editing ? { ...payload, id: editing._id } : payload;
    const res     = await fetch("/api/admin/services", { method, headers: headers(), body: JSON.stringify(body) }).then(r => r.json());
    if (res.success) { toast.success(editing ? "Updated" : "Created"); load(); setModal(false); }
    else toast.error("Failed");
    setSaving(false);
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const res = await fetch("/api/admin/services", { method: "DELETE", headers: headers(), body: JSON.stringify({ id }) }).then(r => r.json());
    if (res.success) { setServices(s => s.filter(x => x._id !== id)); toast.success("Deleted"); }
  };

  const main       = services.filter(s => s.category === "main");
  const additional = services.filter(s => s.category === "additional");

  const ServiceGroup = ({ label, items, colorIdx }: { label:string; items:any[]; colorIdx:number }) => (
    <div style={{ marginBottom:"2rem" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}>
        <div style={{ height:2, width:24, borderRadius:99, background:"var(--accent)" }} />
        <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.95rem", color:"var(--txt-muted)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</h2>
        <span className="badge-violet">{items.length}</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {items.map((s, i) => {
          const Icon  = ICON_MAP[s.icon] || Wrench;
          const color = ICON_COLORS[(i + colorIdx) % ICON_COLORS.length];
          return (
            <motion.div key={s._id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i * 0.05 }}
              style={{ ...S.card, padding:"1.25rem", display:"flex", alignItems:"flex-start", gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:13, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:8, marginBottom:5 }}>
                  <span style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1rem", color:"var(--txt-primary)" }}>{s.title}</span>
                  <span className={s.active ? "badge-green" : "badge-gray"}>{s.active ? "Active" : "Inactive"}</span>
                </div>
                <p style={{ fontSize:"0.85rem", color:"var(--txt-muted)", lineHeight:1.6, marginBottom:8 }}>{s.description}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {(s.features || []).map((f: string, idx: number) => (
                    <span key={idx} style={{ fontSize:"0.72rem", padding:"3px 9px", borderRadius:6, background:"var(--surface-2)", color:"var(--txt-muted)", border:"1px solid var(--border)", fontWeight:500 }}>{f}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <button onClick={() => openEdit(s)} style={{ width:30, height:30, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)" }}>
                  <Pencil size={13} />
                </button>
                <button onClick={() => deleteService(s._id)} style={{ width:30, height:30, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--red)" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div style={S.page}>
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          style={{ marginBottom:"1.75rem", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.75rem", fontWeight:800, color:"var(--txt-primary)", display:"flex", alignItems:"center", gap:10 }}>
              <Wrench size={26} color="var(--accent)" /> Services
            </h1>
            <p style={{ color:"var(--txt-muted)", marginTop:4, fontSize:"0.875rem" }}>Manage your service offerings</p>
          </div>
          <button onClick={openNew} className="btn-primary" style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Plus size={16} /> Add Service
          </button>
        </motion.div>

        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:220 }}>
            <div style={{ width:32, height:32, border:"2.5px solid var(--accent)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          </div>
        ) : (
          <>
            {main.length > 0 && <ServiceGroup label="Core Services" items={main} colorIdx={0} />}
            {additional.length > 0 && <ServiceGroup label="Additional Services" items={additional} colorIdx={3} />}
            {services.length === 0 && (
              <div style={{ ...S.card, padding:"3rem", textAlign:"center", color:"var(--txt-faint)" }}>
                No services yet. Add your first service!
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={S.overlay}>
            <motion.div initial={{ scale:0.95, opacity:0, y:16 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.95, opacity:0 }}
              transition={{ type:"spring", damping:26, stiffness:300 }} style={S.modal}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
                <div>
                  <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.2rem", color:"var(--txt-primary)" }}>{editing ? "Edit Service" : "New Service"}</h2>
                  <p style={{ fontSize:"0.8rem", color:"var(--txt-muted)", marginTop:2 }}>Fill in the service details</p>
                </div>
                <button onClick={() => setModal(false)} style={{ width:32, height:32, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--txt-muted)" }}>
                  <X size={15} />
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div>
                  <label style={S.label}>Title *</label>
                  <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title:e.target.value })} placeholder="e.g. Website Development" />
                </div>
                <div>
                  <label style={S.label}>Description</label>
                  <textarea className="input-field" style={{ minHeight:80, resize:"vertical" }} value={form.description} onChange={e => setForm({ ...form, description:e.target.value })} placeholder="Short description..." />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={S.label}>Icon</label>
                    <select className="input-field" style={{ cursor:"pointer", appearance:"none" }} value={form.icon} onChange={e => setForm({ ...form, icon:e.target.value })}>
                      {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Category</label>
                    <select className="input-field" style={{ cursor:"pointer", appearance:"none" }} value={form.category} onChange={e => setForm({ ...form, category:e.target.value })}>
                      <option value="main">Core Service</option>
                      <option value="additional">Additional Service</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Features (one per line)</label>
                  <textarea className="input-field" style={{ minHeight:100, resize:"vertical" }} value={form.features as string} onChange={e => setForm({ ...form, features:e.target.value })} placeholder={"Custom Design\nResponsive Layout\nSEO Optimized"} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={S.label}>Display Order</label>
                    <input className="input-field" type="number" value={form.order} onChange={e => setForm({ ...form, order:Number(e.target.value) })} />
                  </div>
                  <div style={{ paddingTop:24 }}>
                    <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                      <div onClick={() => setForm({ ...form, active:!form.active })}
                        style={{ width:38, height:20, borderRadius:99, background:form.active ? "var(--accent)" : "var(--surface-3)", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                        <div style={{ position:"absolute", top:2, width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"transform 0.2s", transform:`translateX(${form.active ? 18 : 2}px)` }} />
                      </div>
                      <span style={{ fontSize:"0.85rem", color:"var(--txt-secondary)" }}>Active</span>
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:"1.5rem" }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex:1, justifyContent:"center" }}>
                  {saving ? "Saving..." : editing ? "Update" : "Create Service"}
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
