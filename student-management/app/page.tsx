"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, GraduationCap, Mail, Phone, Building2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Student = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
};

const emptyForm = { name: "", email: "", phone: "", department: "" };

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    setStudents(await res.json());
  };
  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/students/${editingId}` : "/api/students";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) return toast.error("কিছু ভুল হয়েছে!");
    toast.success(editingId ? "Student updated ✓" : "Student added ✓");
    setForm(emptyForm);
    setEditingId(null);
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student?")) return;
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    toast.success("Student deleted");
    fetchStudents();
  };

  const handleEdit = (s: Student) => {
    setForm({ name: s.name, email: s.email, phone: s.phone, department: s.department });
    setEditingId(s._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <header className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Student Management</h1>
            <p className="text-slate-500 text-sm">Add, edit, and manage students easily</p>
          </div>
        </header>

        {/* Form Card */}
        <section className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-10 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {editingId ? <Pencil size={18} className="text-amber-500" /> : <Plus size={18} className="text-indigo-600" />}
              {editingId ? "Edit Student" : "Add New Student"}
            </h2>
            {editingId && (
              <button
                onClick={() => { setEditingId(null); setForm(emptyForm); }}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500"
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Full Name", icon: GraduationCap, type: "text" },
              { key: "email", label: "Email", icon: Mail, type: "email" },
              { key: "phone", label: "Phone", icon: Phone, type: "tel" },
              { key: "department", label: "Department", icon: Building2, type: "text" },
            ].map(({ key, label, icon: Icon, type }) => (
              <div key={key} className="relative">
                <Icon size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type={type}
                  placeholder={label}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "md:col-span-2 py-3 rounded-xl font-medium text-white transition shadow-lg",
                "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {loading ? "Saving..." : editingId ? "Update Student" : "Add Student"}
            </button>
          </form>
        </section>

        {/* Students Table */}
        <section className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold">All Students</h2>
            <span className="text-sm bg-indigo-50 text-indigo-600 font-medium px-3 py-1 rounded-full">
              {students.length} total
            </span>
          </div>

          {students.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <GraduationCap size={40} className="mx-auto mb-3 opacity-40" />
              <p>No students yet. Add your first student above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-left px-6 py-3 font-medium">Email</th>
                    <th className="text-left px-6 py-3 font-medium">Phone</th>
                    <th className="text-left px-6 py-3 font-medium">Department</th>
                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-indigo-50/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold text-sm">
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{s.email}</td>
                      <td className="px-6 py-4 text-slate-600">{s.phone}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                          {s.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}