"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Plus, Pencil, Trash2, X, CheckCircle, Star } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import toast from "react-hot-toast";

const EMPTY = { name:"", price:"", priceValue:0, description:"", features:"", highlighted:false, order:0, active:true };

const S = {
  page:    { padding:"1.5rem", maxWidth:1100 } as React.CSSProperties,
  card:    { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, boxShadow:"var(--shadow-sm)" } as React.CSSProperties,
  modal:   { background:"var(--surface)", borderRadius:20, boxShadow:"0 24px 64px rgba(15,11,26,0.4)", width:"100%", maxWidth:520, padding:"1.75rem", maxHeight:"90vh", overflowY:"auto" as const, border:"1px solid var(--border)" } as React.CSSProperties,
  overlay: { position:"fixed" as const, inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(15,11,26,0.65)", backdropFilter:"blur(8px)" } as React.CSSProperties,
  h1:      { fontFamily:"Syne,sans-serif", fontSize:"1.75rem", fontWeight:800, color:"var(--txt-primary)", display:"flex", alignItems:"center", gap:10 } as React.CSSProperties,
  label:   { display:"block", fontSize:"0.8rem", fontWeight:600, color:"var(--txt-muted)", marginBottom:6 } as React.CSSProperties,
};

export default function PricingAdminPage() {
  const [plans,   setPlans]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);

  const token   = () => typeof window !== "undefined" ? localStorage.getItem("cairn_admin_token") : "";
  const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const load = () => {
    fetch("/api/admin/pricing", { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) setPlans(d.data); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ ...p, features: Array.isArray(p.features) ? p.features.join("\n") : p.features }); setModal(true); };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, features: (form.features as string).split("\n").map((f: string) => f.trim()).filter(Boolean), priceValue: Number(form.priceValue) };
    const method  = editing ? "PUT" : "POST";
    const body    = editing ? { ...payload, id: editing._id } : payload;
    const res     = await fetch("/api/admin/pricing", { method, headers: headers(), body: JSON.stringify(body) }).then(r => r.json());
    if (res.success) { toast.success(editing ? "Plan updated" : "Plan created"); load(); setModal(false); }
    else toast.error("Failed to save");
    setSaving(false);
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    const res = await fetch("/api/admin/pricing", { method: "DELETE", headers: headers(), body: JSON.stringify({ id }) }).then(r => r.json());
    if (res.success) { setPlans(p => p.filter(x => x._id !== id)); toast.success("Deleted"); }
  };

  const Spinner = () => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:220 }}>
      <div style={{ width:32, height:32, border:"2.5px solid var(--accent)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <AdminLayout>
      <div style={S.page}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          style={{ marginBottom:"1.75rem", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={S.h1}><DollarSign size={26} color="var(--emerald)" /> Pricing Plans</h1>
            <p style={{ color:"var(--txt-muted)", marginTop:4, fontSize:"0.875rem" }}>Manage your service packages</p>
          </div>
          <button onClick={openNew} className="btn-primary" style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Plus size={16} /> Add Plan
          </button>
        </motion.div>

        {loading ? <Spinner /> : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.25rem" }}>
            {plans.length === 0 ? (
              <div style={{ ...S.card, padding:"3rem", textAlign:"center", color:"var(--txt-faint)", gridColumn:"1/-1" }}>
                No pricing plans yet. Add your first one!
              </div>
            ) : plans.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.07 }}
                style={{ ...S.card, padding:"1.5rem", position:"relative", outline: p.highlighted ? "2px solid var(--accent)" : "none", outlineOffset:0 }}>

                {p.highlighted && (
                  <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,var(--accent),var(--lilac-hover))", color:"#fff", fontSize:"0.7rem", fontWeight:800, padding:"4px 14px", borderRadius:99, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5 }}>
                    <Star size={10} fill="#fff" /> MOST POPULAR
                  </div>
                )}

                {/* Plan header */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"1.25rem" }}>
                  <div>
                    <div style={{ fontSize:"0.72rem", fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:"var(--accent)", marginBottom:6 }}>{p.name}</div>
                    <div style={{ fontFamily:"Syne,sans-serif", fontSize:"2rem", fontWeight:800, color:"var(--txt-primary)", lineHeight:1 }}>{p.price}</div>
                    <div style={{ fontSize:"0.8rem", color:"var(--txt-muted)", marginTop:5 }}>{p.description}</div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={() => openEdit(p)} title="Edit"
                      style={{ width:30, height:30, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)", transition:"all 0.15s" }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deletePlan(p._id)} title="Delete"
                      style={{ width:30, height:30, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--red)", transition:"all 0.15s" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Features */}
                <ul style={{ listStyle:"none", padding:0, display:"flex", flexDirection:"column", gap:7, marginBottom:"1.25rem" }}>
                  {(p.features || []).map((f: string, idx: number) => (
                    <li key={idx} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:"0.85rem", color:"var(--txt-secondary)" }}>
                      <CheckCircle size={13} color="var(--emerald)" style={{ flexShrink:0, marginTop:2 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div style={{ paddingTop:"1rem", borderTop:"1px solid var(--border-subtle)", display:"flex", alignItems:"center", gap:8 }}>
                  <span className={p.active ? "badge-green" : "badge-gray"}>{p.active ? "Active" : "Inactive"}</span>
                  <span style={{ fontSize:"0.75rem", color:"var(--txt-faint)" }}>Order: {p.order}</span>
                </div>
              </motion.div>
            ))}
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
                  <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.2rem", color:"var(--txt-primary)" }}>{editing ? "Edit Plan" : "New Pricing Plan"}</h2>
                  <p style={{ fontSize:"0.8rem", color:"var(--txt-muted)", marginTop:2 }}>Fill in the plan details below</p>
                </div>
                <button onClick={() => setModal(false)}
                  style={{ width:32, height:32, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--txt-muted)" }}>
                  <X size={15} />
                </button>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div>
                  <label style={S.label}>Plan Name</label>
                  <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} placeholder="e.g. Starter" />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={S.label}>Price Label</label>
                    <input className="input-field" value={form.price} onChange={e => setForm({ ...form, price:e.target.value })} placeholder="₹4,999" />
                  </div>
                  <div>
                    <label style={S.label}>Price Value (₹)</label>
                    <input className="input-field" type="number" value={form.priceValue} onChange={e => setForm({ ...form, priceValue:Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label style={S.label}>Description</label>
                  <input className="input-field" value={form.description} onChange={e => setForm({ ...form, description:e.target.value })} placeholder="For small businesses..." />
                </div>
                <div>
                  <label style={S.label}>Features (one per line)</label>
                  <textarea className="input-field" style={{ minHeight:120, resize:"vertical" }} value={form.features as string} onChange={e => setForm({ ...form, features:e.target.value })} placeholder={"5-page Website\nMobile Responsive\nSSL Certificate"} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <label style={S.label}>Display Order</label>
                    <input className="input-field" type="number" value={form.order} onChange={e => setForm({ ...form, order:Number(e.target.value) })} />
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:24 }}>
                    {[{ key:"highlighted", label:"Mark as Popular" }, { key:"active", label:"Active" }].map(c => (
                      <label key={c.key} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                        <div onClick={() => setForm({ ...form, [c.key]: !(form as any)[c.key] })}
                          style={{ width:38, height:20, borderRadius:99, background:(form as any)[c.key] ? "var(--accent)" : "var(--surface-3)", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                          <div style={{ position:"absolute", top:2, width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"transform 0.2s", transform:`translateX(${(form as any)[c.key] ? 18 : 2}px)` }} />
                        </div>
                        <span style={{ fontSize:"0.85rem", color:"var(--txt-secondary)" }}>{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display:"flex", gap:10, marginTop:"1.5rem" }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex:1, justifyContent:"center" }}>
                  {saving ? "Saving..." : editing ? "Update Plan" : "Create Plan"}
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
