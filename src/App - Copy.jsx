

import React, { useMemo, useState } from "react";
import { Plus, Search, School, Users, MessageSquare, Clock, Pencil, X } from "lucide-react";


const SCHOOLS = ["Bifröst", "UNAK", "LHÍ", "LBHÍ", "HÍ"];
const GROUPS = ["Nám og kennsla", "Mannauðshópur", "Grunnkerfishópur", "Vöruhús"];
const SCHOOL_COLOURS = { Bifröst: "#7b93a8", UNAK: "#c1121f", LHÍ: "#374151", LBHÍ: "#15803d", HÍ: "#2563eb" };
const SCHOOL_SHORT = { Bifröst: "B", UNAK: "U", LHÍ: "L", LBHÍ: "LB", HÍ: "HÍ" };
const initialItems = [
  { id: 1, title: "Samræming námskeiðsgagna", description: "Fara yfir hvernig námskeiðsgögn berast milli kerfa og taka saman næstu skref.", school: "HÍ", group: "Nám og kennsla", comments: [
    { id: 11, text: "Taka stöðuna á næsta fundi og staðfesta ábyrgðaraðila.", createdAt: "2026-09-04T08:45:00Z" },
    { id: 12, text: "Fyrstu upplýsingar hafa borist.", createdAt: "2026-09-02T13:10:00Z" },
  ]},
  { id: 2, title: "Aðgangar fyrir nýtt starfsfólk", description: "Skilgreina sameiginlegt ferli fyrir stofnun og lokun aðganga.", school: "UNAK", group: "Mannauðshópur", comments: [
    { id: 21, text: "Drög að ferli verða rædd á næsta hópfundi.", createdAt: "2026-09-03T11:20:00Z" },
  ]},
  { id: 3, title: "Uppfærsla á gagnavöruhúsi", description: "Safna kröfum skólans fyrir næstu uppfærslu.", school: "LBHÍ", group: "Vöruhús", comments: [] },
];

const emptyItem = { title: "", description: "", school: "HÍ", group: "Nám og kennsla", comments: [] };

function formatDate(value) {
  return new Intl.DateTimeFormat("is-IS", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function SchoolLogo({ school, large = false }) {
  return (
    <div style={{ backgroundColor: SCHOOL_COLOURS[school] }} className={`${large ? "h-12 w-12" : "h-10 w-10"} flex shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm`}>
      {SCHOOL_SHORT[school]}
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState(emptyItem);
  const [selectedId, setSelectedId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [comment, setComment] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("is");
    return items.filter((item) => {
      const text = `${item.title} ${item.description} ${item.comments.map((entry) => entry.text).join(" ")}`.toLocaleLowerCase("is");
      return (schoolFilter === "all" || item.school === schoolFilter) && (groupFilter === "all" || item.group === groupFilter) && (!query || text.includes(query));
    });
  }, [items, schoolFilter, groupFilter, search]);

  const dialogOpen = creating || selectedId !== null;

  function openItem(item) {
    setDraft(JSON.parse(JSON.stringify(item)));
    setSelectedId(item.id);
    setCreating(false);
    setComment("");
  }

  function newItem() {
    setDraft({ ...emptyItem, comments: [] });
    setSelectedId(null);
    setCreating(true);
    setComment("");
  }

  function closeDialog() {
    setSelectedId(null);
    setCreating(false);
    setComment("");
  }

  function saveItem() {
    if (!draft.title.trim() || !draft.description.trim()) return;
    const clean = { ...draft, title: draft.title.trim(), description: draft.description.trim() };
    if (creating) setItems((current) => [{ ...clean, id: Date.now() }, ...current]);
    else setItems((current) => current.map((item) => item.id === selectedId ? clean : item));
    closeDialog();
  }

  function addComment() {
    if (!comment.trim()) return;
    setDraft((current) => ({ ...current, comments: [{ id: Date.now(), text: comment.trim(), createdAt: new Date().toISOString() }, ...current.comments] }));
    setComment("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 py-6">
          <div>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-white">Mál og verkefni skólanna</h1>
            <p className="mt-2 text-sm text-slate-400">Síaðu mál fyrir fundi og skráðu nýjustu stöðu á einum stað.</p>
          </div>
          <button onClick={newItem} className="inline-flex h-10 shrink-0 items-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" /> Nýtt mál
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Leita í málum" className="h-10 w-full rounded-lg border border-slate-800 bg-slate-900 pl-9 pr-3 text-sm outline-none focus:border-indigo-500" />
          </div>
          <select value={schoolFilter} onChange={(event) => setSchoolFilter(event.target.value)} className="h-10 w-44 rounded-lg border border-slate-800 bg-slate-900 px-3 text-sm">
            <option value="all">Allir skólar</option>{SCHOOLS.map((school) => <option key={school}>{school}</option>)}
          </select>
          <select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)} className="h-10 w-52 rounded-lg border border-slate-800 bg-slate-900 px-3 text-sm">
            <option value="all">Allir hópar</option>{GROUPS.map((group) => <option key={group}>{group}</option>)}
          </select>
          <button onClick={() => { setSearch(""); setSchoolFilter("all"); setGroupFilter("all"); }} className="inline-flex h-10 items-center rounded-lg border border-slate-600 bg-slate-700 px-4 text-sm font-semibold text-slate-100 hover:bg-slate-600">
            <X className="mr-2 h-4 w-4" /> Hreinsa
          </button>
        </div>

        <p className="mt-5 text-sm font-semibold text-slate-600">{filtered.length} mál</p>

        <div className="mt-3 flex w-full flex-col gap-4 lg:flex-row lg:items-stretch">
          {filtered.map((item) => {
            const latest = [...item.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            return (
              <button key={item.id} type="button" onClick={() => openItem(item)} className="group block min-w-0 flex-1 text-left">
                <article className="relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-sm">
                <div className="absolute left-0 top-0 h-2 w-full" style={{ backgroundColor: SCHOOL_COLOURS[item.school] }}/>
                <div className="mt-2 flex items-start justify-between"><SchoolLogo school={item.school} /><Pencil className="h-4 w-4 text-slate-100 group-hover:text-indigo-600" /></div>
                  <h2 className="mt-4 text-lg font-extrabold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-5 text-slate-300">{item.description}</p>
                  <div className="mt-3 mb-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"><School className="mr-1 h-3 w-3" />{item.school}</span>
                    <span className="inline-flex items-center rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-100"><Users className="mr-1 h-3 w-3" />{item.group}</span>
                  </div>
                  <div className="mt-auto border-t border-slate-100 pt-6">
                    <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-300"><MessageSquare className="h-3 w-3" /> Nýjasta athugasemd</p>
                    {latest ? <><p className="line-clamp-1 text-sm font-medium text-slate-300">{latest.text}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3 w-3" />{formatDate(latest.createdAt)}</p></> : <p className="text-sm italic text-slate-400">Engin athugasemd skráð.</p>}
                  </div>
                </article>
              </button>
            );
          })}
        </div>
      </section>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" onMouseDown={closeDialog}>
          <div className="relative max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-slate-900 p-5 shadow-2xl border border-slate-700" onMouseDown={(event) => event.stopPropagation()}>
          <div
  className="absolute left-0 top-0 h-2 w-full"
  style={{ backgroundColor: SCHOOL_COLOURS[draft.school] }}
/>
<div className="mt-2 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3"><SchoolLogo school={draft.school} large /><div><p className="text-sm font-semibold text-indigo-400">{creating ? "Nýtt mál" : "Breyta máli"}</p><h2 className="text-xl font-black text-white">{draft.title || "Ónefnt mál"}</h2></div></div>
              <button onClick={closeDialog} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 grid gap-3">              <label className="grid gap-1 text-sm font-semibold">Titill<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="h-10 rounded-lg border border-slate-300 px-3 font-normal" /></label>
              <label className="grid gap-1 text-sm font-semibold">Lýsing<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="min-h-20 rounded-lg border border-slate-300 p-3 font-normal" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm font-semibold">Skóli<select value={draft.school} onChange={(event) => setDraft({ ...draft, school: event.target.value })} className="h-10 rounded-lg border border-slate-300 bg-slate-900 px-3 font-normal">{SCHOOLS.map((school) => <option key={school}>{school}</option>)}</select></label>
                <label className="grid gap-1 text-sm font-semibold">Hópur<select value={draft.group} onChange={(event) => setDraft({ ...draft, group: event.target.value })} className="h-10 rounded-lg border border-slate-300 bg-slate-900 px-3 font-normal">{GROUPS.map((group) => <option key={group}>{group}</option>)}</select></label>
              </div>
              {!creating && (                <section className="rounded-xl bg-slate-900 border border-slate-700 p-3">
                  <h3 className="font-bold">Athugasemdir</h3>
                  <div className="mt-2 flex gap-2"><textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Ný athugasemd" className="min-h-16 flex-1 rounded-lg border border-slate-700 bg-slate-800 p-2 text-sm text-slate-100" /><button onClick={addComment} className="self-end rounded-lg bg-indigo-700 px-3 py-2 text-sm font-semibold text-white">Bæta við</button></div>
                  <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">{[...draft.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((entry) => <div key={entry.id} className="rounded-lg border border-slate-700 bg-slate-800 p-3"><p className="text-sm text-slate-200">{entry.text}</p><p className="mt-1 text-xs text-slate-500">{formatDate(entry.createdAt)}</p></div>)}</div>
                </section>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3"><button onClick={closeDialog} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-100">Hætta við</button><button onClick={saveItem} disabled={!draft.title.trim() || !draft.description.trim()} className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Vista mál</button></div>          </div>
        </div>
      )}
    </main>
  );
}
