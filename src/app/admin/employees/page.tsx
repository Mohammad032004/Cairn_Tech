"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCog, Plus, Pencil, Trash2, X, Shield, Eye, EyeOff } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import toast from "react-hot-toast";

const PERMISSIONS = [
  { key:"viewBookings",   label:"View Bookings",   group:"view" },
  { key:"viewContacts",   label:"View Contacts",   group:"view" },
  { key:"viewClients",    label:"View Clients",    group:"view" },
  { key:"editBookings",   label:"Edit Bookings",   group:"edit" },
  { key:"editContacts",   label:"Edit Contacts",   group:"edit" },
  { key:"manageServices", label:"Manage Services", group:"manage" },
  { key:"managePricing",  label:"Manage Pricing",  group:"manage" },
  { key:"manageProjects", label:"Manage Projects", group:"manage" },
  { key:"manageTeam",     label:"Manage Team",     group:"manage" },
];
const DEFAULT_PERMS = { viewBookings:true, viewContacts:true, viewClients:true, editBookings:false, editContacts:false, manageServices:false, managePricing:false, manageProjects:false, manageTeam:false };
const EMPTY = { username:"", password:"", email:"", permissions:DEFAULT_PERMS };
const GROUP_LABELS: Record<string,string> = { view:"👁 View Only", edit:"✏️ Edit Access", manage:"⚙️ Manage" };
const GROUP_COLORS: Record<string,string> = { view:"var(--sky-hover)", edit:"var(--amber)", manage:"var(--accent)" };

const S = {
  page:    { padding:"1.5rem", maxWidth:1100 } as React.CSSProperties,
  overlay: { position:"fixed" as const, inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(15,11,26,0.65)", backdropFilter:"blur(8px)" } as React.CSSProperties,
  modal:   { background:"var(--surface)", borderRadius:20, boxShadow:"0 24px 64px rgba(15,11,26,0.4)", width:"100%", maxWidth:520, padding:"1.75rem", maxHeight:"90vh", overflowY:"auto" as const, border:"1px solid var(--border)" } as React.CSSProperties,
  label:   { display:"block", fontSize:"0.8rem", fontWeight:600, color:"var(--txt-muted)", marginBottom:6 } as React.CSSProperties,
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [form,      setForm]      = useState(EMPTY);
  const [showPass,  setShowPass]  = useState(false);
  const [saving,    setSaving]    = useState(false);

  const token   = () => typeof window !== "undefined" ? localStorage.getItem("cairn_admin_token") : "";
  const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

  const load = () => {
    fetch("/api/admin/employees", { headers: headers() })
      .then(r => r.json()).then(d => { if (d.success) setEmployees(d.data); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setEditing(null); setForm(EMPTY); setShowPass(false); setModal(true); };
  const openEdit = (e: any) => { setEditing(e); setForm({ ...e, password:"", permissions:{ ...DEFAULT_PERMS, ...e.permissions } }); setModal(true); };

  const togglePerm = (key: string) => setForm(f => ({ ...f, permissions:{ ...f.permissions, [key]:!(f.permissions as any)[key] } }));

  const save = async () => {
    if (!form.username) return toast.error("Username is required");
    if (!editing && !form.password) return toast.error("Password is required for new employees");
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body   = editing ? { id:editing._id, permissions:form.permissions, email:form.email, ...(form.password ? { password:form.password } : {}) } : form;
    const res    = await fetch("/api/admin/employees", { method, headers: headers(), body:JSON.stringify(body) }).then(r => r.json());
    if (res.success) { toast.success(editing ? "Employee updated" : "Employee created"); load(); setModal(false); }
    else toast.error(res.message || "Failed");
    setSaving(false);
  };

  const deleteEmp = async (id: string) => {
    if (!confirm("Remove this employee account?")) return;
    const res = await fetch("/api/admin/employees", { method:"DELETE", headers:headers(), body:JSON.stringify({ id }) }).then(r => r.json());
    if (res.success) { setEmployees(e => e.filter(x => x._id !== id)); toast.success("Removed"); }
  };

  const groups = ["view","edit","manage"];

  return (
    <AdminLayout>
      <div style={S.page}>
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          style={{ marginBottom:"1.75rem", display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.75rem", fontWeight:800, color:"var(--txt-primary)", display:"flex", alignItems:"center", gap:10 }}>
              <UserCog size={26} color="var(--lilac-hover)" /> Employees
            </h1>
            <p style={{ color:"var(--txt-muted)", marginTop:4, fontSize:"0.875rem" }}>Manage staff with limited dashboard access</p>
          </div>
          <button onClick={openNew} className="btn-primary" style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Plus size={16} /> Add Employee
          </button>
        </motion.div>

        {/* Info banner */}
        <div style={{ background:"var(--accent-light)", border:"1px solid var(--accent)", borderRadius:14, padding:"12px 16px", marginBottom:"1.5rem", display:"flex", alignItems:"flex-start", gap:10 }}>
          <Shield size={17} color="var(--accent)" style={{ flexShrink:0, marginTop:1 }} />
          <p style={{ fontSize:"0.85rem", color:"var(--accent-text)", lineHeight:1.6 }}>
            <strong>Employees</strong> have read-only or limited access based on granted permissions. They cannot delete data or access system settings.
          </p>
        </div>

        {loading ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:220 }}>
            <div style={{ width:32, height:32, border:"2.5px solid var(--accent)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          </div>
        ) : employees.length === 0 ? (
          <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:"3rem", textAlign:"center" }}>
            <UserCog size={40} color="var(--txt-faint)" style={{ margin:"0 auto 1rem" }} />
            <h3 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, color:"var(--txt-muted)", marginBottom:8 }}>No employees yet</h3>
            <p style={{ color:"var(--txt-faint)", fontSize:"0.875rem", marginBottom:"1.25rem" }}>Add staff members to give them limited dashboard access</p>
            <button onClick={openNew} className="btn-primary" style={{ margin:"0 auto" }}><Plus size={15} /> Add First Employee</button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
            {employees.map((emp, i) => (
              <motion.div key={emp._id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i * 0.06 }}
                style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:"1.25rem", display:"flex", flexWrap:"wrap", alignItems:"flex-start", gap:14, boxShadow:"var(--shadow-sm)" }}>
                <div style={{ width:44, height:44, borderRadius:13, background:"var(--lilac-light)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--lilac-hover)", fontWeight:800, fontSize:"1rem", flexShrink:0, fontFamily:"Syne,sans-serif" }}>
                  {emp.username?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1rem", color:"var(--txt-primary)" }}>{emp.username}</span>
                    <span className="badge-gray">Employee</span>
                  </div>
                  {emp.email && <div style={{ fontSize:"0.8rem", color:"var(--txt-muted)", marginBottom:8 }}>{emp.email}</div>}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {Object.entries(emp.permissions || {}).filter(([,v]) => v).map(([k]) => {
                      const p = PERMISSIONS.find(x => x.key === k);
                      return p ? (
                        <span key={k} style={{ fontSize:"0.72rem", padding:"3px 9px", borderRadius:6, background:`${GROUP_COLORS[p.group]}18`, color:GROUP_COLORS[p.group], border:`1px solid ${GROUP_COLORS[p.group]}30`, fontWeight:600 }}>{p.label}</span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={() => openEdit(emp)} style={{ width:30, height:30, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)" }}>
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => deleteEmp(emp._id)} style={{ width:30, height:30, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--red)" }}>
                    <Trash2 size={13} />
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
                  <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1.2rem", color:"var(--txt-primary)" }}>{editing ? "Edit Employee" : "New Employee"}</h2>
                  <p style={{ fontSize:"0.8rem", color:"var(--txt-muted)", marginTop:2 }}>Set credentials and access permissions</p>
                </div>
                <button onClick={() => setModal(false)} style={{ width:32, height:32, borderRadius:9, border:"1px solid var(--border)", background:"var(--surface-2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--txt-muted)" }}>
                  <X size={15} />
                </button>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div>
                  <label style={S.label}>Username *</label>
                  <input className="input-field" value={form.username} onChange={e => setForm({ ...form, username:e.target.value })} disabled={!!editing} placeholder="e.g. john_doe" />
                </div>
                <div>
                  <label style={S.label}>{editing ? "New Password (leave blank to keep)" : "Password *"}</label>
                  <div style={{ position:"relative" }}>
                    <input type={showPass ? "text" : "password"} className="input-field" style={{ paddingRight:40 }} value={form.password} onChange={e => setForm({ ...form, password:e.target.value })} placeholder={editing ? "Leave blank to keep current" : "Min 6 characters"} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--txt-faint)", padding:0 }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={S.label}>Email (optional)</label>
                  <input className="input-field" type="email" value={form.email} onChange={e => setForm({ ...form, email:e.target.value })} placeholder="employee@company.com" />
                </div>

                {/* Permissions */}
                <div style={{ background:"var(--surface-2)", border:"1px solid var(--border)", borderRadius:14, padding:"1.25rem" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1rem" }}>
                    <Shield size={16} color="var(--accent)" />
                    <span style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.9rem", color:"var(--txt-primary)" }}>Access Permissions</span>
                  </div>
                  {groups.map(group => (
                    <div key={group} style={{ marginBottom:"1rem" }}>
                      <div style={{ fontSize:"0.72rem", fontWeight:800, color:GROUP_COLORS[group], textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>{GROUP_LABELS[group]}</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {PERMISSIONS.filter(p => p.group === group).map(p => (
                          <label key={p.key} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                            <div onClick={() => togglePerm(p.key)}
                              style={{ width:38, height:20, borderRadius:99, background:(form.permissions as any)[p.key] ? GROUP_COLORS[group] : "var(--surface-3)", position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                              <div style={{ position:"absolute", top:2, width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"transform 0.2s", transform:`translateX(${(form.permissions as any)[p.key] ? 18 : 2}px)` }} />
                            </div>
                            <span style={{ fontSize:"0.875rem", color:"var(--txt-secondary)" }}>{p.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", gap:10, marginTop:"1.5rem" }}>
                <button onClick={() => setModal(false)} className="btn-outline" style={{ flex:1, justifyContent:"center" }}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{ flex:1, justifyContent:"center" }}>
                  {saving ? "Saving..." : editing ? "Update Employee" : "Create Employee"}
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
