import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, ChevronDown, Download, Gauge, Pause, Play, RotateCcw, Settings2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BeamLab Control — Magnetic Digital Twin" },
      { name: "description", content: "Interactive magnetic field simulation and beamline analysis workspace." },
      { property: "og:title", content: "BeamLab Control — Magnetic Digital Twin" },
      { property: "og:description", content: "Interactive magnetic field simulation and beamline analysis workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const probes = [
  ["P-01", "0.31", "4.82", "12.6"], ["P-02", "0.58", "3.91", "9.4"],
  ["P-03", "0.77", "2.74", "6.1"], ["P-04", "0.94", "1.62", "3.3"],
];

function RangeControl({ label, value, display }: { label: string; value: number; display: string }) {
  return <label className="block">
    <span className="mb-2 flex items-center justify-between text-xs font-semibold"><span>{label}</span><span className="font-mono text-brand-deep">{display}</span></span>
    <input aria-label={label} className="range-control" type="range" defaultValue={value} />
  </label>;
}

function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="glass-panel p-4">
    <div className="mb-4 flex items-center justify-between gap-3"><h2 className="panel-label">{title}</h2>{action}</div>{children}
  </section>;
}

function Index() {
  const [running, setRunning] = useState(true);
  const [solver, setSolver] = useState("Navier–Stokes · Implicit");
  const [tab, setTab] = useState("Field overview");
  return <div className="lab-shell min-h-screen bg-background text-foreground">
    <div className="mx-auto max-w-[1560px] px-4 py-4 sm:px-5">
      <header className="glass-panel mb-4 flex min-h-16 items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="brand-mark">B</div>
          <div><p className="font-display text-sm font-bold">BeamLab Control</p><p className="panel-label mt-1">Magnetic digital twin</p></div>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <span className="status-chip">Gradient 18.4 T/m</span><span className="status-chip">Lattice 256³</span>
          <span className="status-chip status-live"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />Converging</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download /> Export</Button>
          <Button size="sm" onClick={() => setRunning(!running)}>{running ? <Pause /> : <Play />}{running ? "Pause" : "Run"}</Button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-12">
        <aside className="space-y-4 xl:col-span-3">
          <Panel title="Beam conditions" action={<Settings2 className="h-4 w-4 text-muted-foreground" />}>
            <div className="space-y-5"><RangeControl label="Beam energy" value={72} display="7.0 GeV" /><RangeControl label="Current" value={48} display="250 mA" /><RangeControl label="Emittance" value={38} display="3.2 nm·rad" /></div>
          </Panel>
          <Panel title="Solver presets">
            <div className="space-y-1.5">{["Navier–Stokes · Implicit", "Lattice Boltzmann", "SPH Particle", "Vortex Particle"].map((item) => <Button key={item} variant={solver === item ? "selected" : "soft"} className="w-full justify-start" onClick={() => setSolver(item)}>{item}</Button>)}</div>
          </Panel>
          <Panel title="Field layers">
            <div className="space-y-3 text-xs">{["Quadrupole field", "Beam envelope", "Reference orbit"].map((x, i) => <label key={x} className="flex items-center justify-between"><span>{x}</span><input type="checkbox" defaultChecked={i !== 2} className="accent-brand" /></label>)}</div>
          </Panel>
        </aside>

        <main className="xl:col-span-6">
          <div className="simulation-frame">
            <div className="simulation-stage" aria-label="Live magnetic beamline simulation">
              <div className="sim-grid" /><div className="beamline horizontal" /><div className="beamline vertical" />
              <div className="magnet magnet-a"><span>Q1</span></div><div className="magnet magnet-b"><span>Q2</span></div>
              <div className="field-arc arc-a" /><div className="field-arc arc-b" /><div className="field-arc arc-c" />
              <div className="sim-label label-a">18.4 T/m</div><div className="sim-label label-b">βx 12.7 m</div><div className="sim-label label-c">250 mA</div>
              <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase text-simulation-text"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Magnetic field · live</div>
              <div className="absolute bottom-4 left-4 font-mono text-[9px] text-simulation-muted">X–Z PROJECTION · SCALE 1:40</div>
              <div className="absolute bottom-4 right-4 font-mono text-[9px] text-simulation-muted">t = 03:42:18</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[["Orbit deviation","0.18","mm"],["Beam loss","0.004","%"],["Field quality","99.82","%"]].map(([k,v,u]) => <div className="glass-panel p-4" key={k}><p className="panel-label">{k}</p><p className="mt-2 font-mono text-2xl font-semibold">{v} <span className="text-sm text-muted-foreground">{u}</span></p></div>)}
          </div>
        </main>

        <aside className="space-y-4 xl:col-span-3">
          <Panel title="Convergence" action={<span className="font-mono text-xs font-semibold text-accent">−3.2% / step</span>}>
            <div className="flex h-32 items-end gap-1.5">{[92,78,65,54,43,35,28,22,16,11].map((n,i)=><div key={n} className={i>7?"bar-accent":"bar-primary"} style={{height:`${n}%`,opacity:.35+i*.065}} />)}</div>
            <div className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground"><span>STEP 40</span><span>STEP 120</span></div>
          </Panel>
          <Panel title="Live probes" action={<Activity className="h-4 w-4 text-accent" />}>
            <div className="probe-grid probe-head"><span>ID</span><span>x</span><span>B</span><span>β</span></div>
            {probes.map((p)=><div key={p[0]} className="probe-grid"><span className="text-muted-foreground">{p[0]}</span><span>{p[1]}</span><span className="text-brand-deep">{p[2]}</span><span>{p[3]}</span></div>)}
          </Panel>
          <Button variant="soft" className="h-12 w-full justify-between">Open parameter history <ChevronDown /></Button>
        </aside>
      </div>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        <Panel title="Beam envelope along lattice" action={<div className="flex gap-3 text-[10px]"><span className="legend-dot before:bg-primary">Horizontal</span><span className="legend-dot before:bg-accent">Vertical</span></div>}>
          <div className="chart-area">
            <svg viewBox="0 0 800 210" className="h-full w-full" preserveAspectRatio="none" aria-label="Beam envelope chart">
              <g className="chart-grid"><path d="M0 35H800M0 87H800M0 140H800M0 192H800" /></g>
              <path className="chart-line-primary" d="M0 150 C80 145 95 45 175 62 S270 178 345 128 S430 45 510 84 S625 175 700 105 S760 52 800 64" />
              <path className="chart-line-accent" d="M0 110 C85 118 110 170 180 145 S275 46 350 78 S455 159 530 127 S640 55 710 78 S770 133 800 118" />
            </svg>
          </div>
        </Panel>
        <Panel title="Quality summary" action={<Gauge className="h-4 w-4 text-primary" />}>
          <div className="space-y-3">{[["Optics match","98.6%",99],["Orbit stability","97.2%",97],["Field uniformity","94.8%",95],["Aperture margin","88.1%",88]].map(([l,v,w])=><div key={l}><div className="mb-1.5 flex justify-between text-xs"><span>{l}</span><b className="font-mono">{v}</b></div><div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width:`${w}%`}} /></div></div>)}</div>
        </Panel>
      </section>

      <section className="glass-panel mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between border-b border-border px-4 py-3">
          <div className="flex gap-1">{["Field overview","Magnet settings","Tolerance scan"].map(x=><Button key={x} variant={tab===x?"selected":"ghost"} size="sm" onClick={()=>setTab(x)}>{x}</Button>)}</div>
          <Button variant="outline" size="sm"><RotateCcw /> Recalculate</Button>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Dipole B1","1.204 T","Nominal"],["Quadrupole Q1","18.40 T/m","Nominal"],["Sextupole S1","104.2 T/m²","Watch"],["Corrector CH1","0.018 mrad","Nominal"]].map(([a,b,c])=><div className="reading-tile" key={a}><p className="panel-label">{a}</p><p className="mt-3 font-mono text-lg font-semibold">{b}</p><p className="mt-1 text-[10px] text-accent">{c}</p></div>)}
        </div>
      </section>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1 pb-4 text-[10px] text-muted-foreground"><span>BeamLab simulation workspace · Run BL-0241</span><span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> All systems nominal</span></footer>
    </div>
  </div>;
}