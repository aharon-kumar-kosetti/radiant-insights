import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, ArrowRight, BrainCircuit, Check, ChevronDown, Download, FileText, Gauge, Pause, Play, RotateCcw, Settings2, Sparkles, Thermometer, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Baghewala Digital Twin — Heavy-Oil Well Simulation" },
      { name: "description", content: "Interactive Baghewala heavy-oil well simulation, operating advisory, and modeled production analysis." },
      { property: "og:title", content: "Baghewala Digital Twin — Heavy-Oil Well Simulation" },
      { property: "og:description", content: "Interactive Baghewala heavy-oil well simulation, operating advisory, and modeled production analysis." },
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

const operatingConstraints = [
  ["Ambient temperature", "30 °C", "Normal"], ["Reservoir temperature", "58 °C", "Normal"],
  ["Wellhead / oil temperature", "56 °C", "Normal"], ["Steam injection temperature", "250 °C", "Normal"],
  ["Pumping speed", "5 SPM", "Normal"], ["SRP rod load index", "58%", "Watch"],
  ["Water cut", "20%", "Normal"], ["Mechanical state", "Stable", "Normal"],
];

const comparisonRows = [
  ["Reservoir matrix temperature", "48.0 °C", "55.0 °C", "+7.0 °C", "Thermal response"],
  ["Crude oil viscosity", "50,000 cP", "5,011.2 cP", "−89.98%", "Improved flow"],
  ["Darcy oil mobility", "0.0003", "0.0005", "+66.7%", "Increased"],
  ["Heavy oil production", "0.69 BOPD", "0.75 BOPD", "+8.7%", "Capacity gain"],
  ["SRP rod load index", "82%", "58%", "−24 pts", "Lower stress"],
  ["Multi-physics risk", "14 / 100", "9 / 100", "−5", "Low risk"],
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
  const [solver, setSolver] = useState("Reference baseline");
  const [tab, setTab] = useState("Well overview");
  return <div className="lab-shell min-h-screen bg-background text-foreground">
    <div className="mx-auto max-w-[1560px] px-4 py-4 sm:px-5">
      <header className="glass-panel mb-4 flex min-h-16 items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="brand-mark">B</div>
          <div><p className="font-display text-sm font-bold">Baghewala Digital Twin</p><p className="panel-label mt-1">Heavy-oil well · demonstration mode</p></div>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <span className="status-chip">Well BGH-01</span><span className="status-chip">Reference baseline</span>
          <span className="status-chip status-live"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />Converging</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download /> Export</Button>
          <Button size="sm" onClick={() => setRunning(!running)}>{running ? <Pause /> : <Play />}{running ? "Pause" : "Run"}</Button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-12">
        <aside className="space-y-4 xl:col-span-3">
          <Panel title="Surface weather" action={<Settings2 className="h-4 w-4 text-muted-foreground" />}>
            <div className="space-y-5"><RangeControl label="Ambient temperature" value={58} display="30 °C" /><RangeControl label="Humidity" value={49} display="49%" /><RangeControl label="Wind speed" value={26} display="4 m/s" /></div>
          </Panel>
          <Panel title="Scenario preset">
            <div className="space-y-1.5">{["Reference baseline", "Steam optimization", "High-load case", "Cold-start study"].map((item) => <Button key={item} variant={solver === item ? "selected" : "soft"} className="w-full justify-start" onClick={() => setSolver(item)}>{item}</Button>)}</div>
          </Panel>
          <Panel title="Model layers">
            <div className="space-y-3 text-xs">{["Thermal propagation", "Wellbore hydraulics", "Rod-load mechanics"].map((x, i) => <label key={x} className="flex items-center justify-between"><span>{x}</span><input type="checkbox" defaultChecked={i !== 2} className="accent-brand" /></label>)}</div>
          </Panel>
        </aside>

        <main className="xl:col-span-6">
          <div className="simulation-frame">
            <div className="simulation-stage" aria-label="Live magnetic beamline simulation">
              <div className="sim-grid" /><div className="beamline horizontal" /><div className="beamline vertical" />
              <div className="magnet magnet-a"><span>Q1</span></div><div className="magnet magnet-b"><span>Q2</span></div>
              <div className="field-arc arc-a" /><div className="field-arc arc-b" /><div className="field-arc arc-c" />
              <div className="sim-label label-a">18.4 T/m</div><div className="sim-label label-b">βx 12.7 m</div><div className="sim-label label-c">250 mA</div>
              <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase text-simulation-text"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Well state · live</div>
              <div className="absolute bottom-4 left-4 font-mono text-[9px] text-simulation-muted">STEAM PROPAGATION · SCALE 1:40</div>
              <div className="absolute bottom-4 right-4 font-mono text-[9px] text-simulation-muted">t = 03:42:18</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[["Oil viscosity","5,011","cP"],["Oil mobility","0.0005","D/cP"],["Production","0.75","BOPD"]].map(([k,v,u]) => <div className="glass-panel p-4" key={k}><p className="panel-label">{k}</p><p className="mt-2 font-mono text-2xl font-semibold">{v} <span className="text-sm text-muted-foreground">{u}</span></p></div>)}
          </div>
        </main>

        <aside className="space-y-4 xl:col-span-3">
          <Panel title="Convergence" action={<span className="font-mono text-xs font-semibold text-accent">−3.2% / step</span>}>
            <div className="flex h-32 items-end gap-1.5">{[92,78,65,54,43,35,28,22,16,11].map((n,i)=><div key={n} className={i>7?"bar-accent":"bar-primary"} style={{height:`${n}%`,opacity:.35+i*.065}} />)}</div>
            <div className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground"><span>STEP 40</span><span>STEP 120</span></div>
          </Panel>
          <Panel title="Live well probes" action={<Activity className="h-4 w-4 text-accent" />}>
            <div className="probe-grid probe-head"><span>ID</span><span>x</span><span>B</span><span>β</span></div>
            {probes.map((p)=><div key={p[0]} className="probe-grid"><span className="text-muted-foreground">{p[0]}</span><span>{p[1]}</span><span className="text-brand-deep">{p[2]}</span><span>{p[3]}</span></div>)}
          </Panel>
          <Button variant="soft" className="h-12 w-full justify-between">Open parameter history <ChevronDown /></Button>
        </aside>
      </div>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        <Panel title="Production and viscosity response" action={<div className="flex gap-3 text-[10px]"><span className="legend-dot before:bg-primary">Production</span><span className="legend-dot before:bg-accent">Viscosity</span></div>}>
          <div className="chart-area">
            <svg viewBox="0 0 800 210" className="h-full w-full" preserveAspectRatio="none" aria-label="Beam envelope chart">
              <g className="chart-grid"><path d="M0 35H800M0 87H800M0 140H800M0 192H800" /></g>
              <path className="chart-line-primary" d="M0 150 C80 145 95 45 175 62 S270 178 345 128 S430 45 510 84 S625 175 700 105 S760 52 800 64" />
              <path className="chart-line-accent" d="M0 110 C85 118 110 170 180 145 S275 46 350 78 S455 159 530 127 S640 55 710 78 S770 133 800 118" />
            </svg>
          </div>
        </Panel>
        <Panel title="Operating summary" action={<Gauge className="h-4 w-4 text-primary" />}>
          <div className="space-y-3">{[["Thermal response","96.6%",97],["Mobility gain","92.2%",92],["Production confidence","94.8%",95],["Mechanical margin","88.1%",88]].map(([l,v,w])=><div key={l}><div className="mb-1.5 flex justify-between text-xs"><span>{l}</span><b className="font-mono">{v}</b></div><div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width:`${w}%`}} /></div></div>)}</div>
        </Panel>
      </section>

      <section className="glass-panel mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between border-b border-border px-4 py-3">
          <div className="flex gap-1">{["Well overview","Steam controls","Sensitivity scan"].map(x=><Button key={x} variant={tab===x?"selected":"ghost"} size="sm" onClick={()=>setTab(x)}>{x}</Button>)}</div>
          <Button variant="outline" size="sm"><RotateCcw /> Recalculate</Button>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Reservoir temp","55.0 °C","Modeled"],["Steam rate","120 m³/day","Active"],["VFD frequency","50 Hz","Nominal"],["Soak duration","7 days","Scheduled"]].map(([a,b,c])=><div className="reading-tile" key={a}><p className="panel-label">{a}</p><p className="mt-3 font-mono text-lg font-semibold">{b}</p><p className="mt-1 text-[10px] text-accent">{c}</p></div>)}
        </div>
      </section>

      <section className="glass-panel mt-5 p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><p className="panel-label">Trained ML viscosity advisory</p><h2 className="mt-1 font-display text-xl font-bold">AI operating summary</h2><p className="mt-1 text-xs text-muted-foreground">Live inference from 30 heavy-oil wells and an 18-rule operating envelope.</p></div><span className="status-chip status-live"><BrainCircuit className="h-3 w-3" /> Confidence 99.3%</span></div>
        <div className="advisory-callout"><BrainCircuit className="h-5 w-5 text-primary" /><p><b>This is happening:</b> the model estimates <b>39.5 cP now</b> and <b>208.5 cP in 7 days</b>, while monitoring the forecast and evaluated constraints.</p></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Current viscosity","39.5 cP"],["7-day forecast","208.5 cP"],["Operating confidence","99.3%"],["Constraint violations","0"]].map(([a,b])=><div className="reading-tile" key={a}><p className="panel-label">{a}</p><p className="mt-2 font-mono text-xl font-semibold">{b}</p></div>)}</div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <Panel title="Operating controls" action={<Thermometer className="h-4 w-4 text-primary" />}>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2"><RangeControl label="Pumping speed" value={45} display="5 SPM" /><RangeControl label="VFD frequency" value={61} display="50 Hz" /><RangeControl label="Steam rate" value={72} display="120 m³/day" /><RangeControl label="Soak duration" value={40} display="7 days" /></div>
        </Panel>
        <Panel title="Operator action" action={<Check className="h-4 w-4 text-accent" />}><div className="success-callout"><Check className="h-5 w-5" /><div><b>Viscosity is under safe control.</b><p>Current parameters remain within all 18 optimal constraint limits.</p></div></div></Panel>
      </section>

      <section className="glass-panel mt-5 overflow-hidden">
        <div className="border-b border-border px-5 py-4"><p className="panel-label">Baghewala well · normal operating condition</p><h2 className="mt-1 font-display text-lg font-bold">18 operating constraints</h2></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">{operatingConstraints.map(([a,b,c])=><div className="constraint-cell" key={a}><div><p className="text-xs text-muted-foreground">{a}</p><p className="mt-1 font-mono text-sm font-semibold">{b}</p></div><span className={c==="Watch"?"tag-watch":"tag-ok"}>{c}</span></div>)}</div>
      </section>

      <section className="glass-panel mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div><p className="panel-label">Simulation result</p><h2 className="mt-1 font-display text-lg font-bold">Reference vs modeled scenario</h2></div><span className="status-chip">Baghewala baseline · 2026-09</span></div>
        <div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Metric</th><th>Reference</th><th>Modeled</th><th>Change</th><th>Interpretation</th></tr></thead><tbody>{comparisonRows.map(r=><tr key={r[0]}>{r.map((c,i)=><td key={c} className={i===2?"modeled-value":""}>{c}</td>)}</tr>)}</tbody></table></div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        {[["Production capacity","0.75 BOPD","Heavy-oil production","+8.7% modeled uplift"],["Reservoir context","5,011.2 cP","Crude-oil viscosity","Jodhpur Sandstone"],["Multi-physics risk","Low · 9/100","Thermal loss risk","Rod-load risk: low"]].map(([a,b,c,d])=><div className="glass-panel p-5" key={a}><p className="panel-label">{a}</p><p className="mt-3 font-mono text-2xl font-semibold">{b}</p><p className="mt-2 text-xs font-semibold">{c}</p><p className="mt-1 text-xs text-muted-foreground">{d}</p></div>)}
      </section>

      <section className="glass-panel mt-5 p-5">
        <div className="mb-5 flex items-center gap-3"><div className="icon-tile"><Waves /></div><div><p className="panel-label">Why did this change?</p><h2 className="mt-1 font-display text-lg font-bold">Causal decision trace</h2></div></div>
        <div className="trace-grid">{[["01","Thermal input","Modeled heating reduces heavy-oil resistance."],["02","Viscosity","Lower viscosity increases effective Darcy mobility."],["03","Inflow","Improved mobility changes modeled Vogel inflow potential."],["04","Risk","Higher oil rate updates the rod-load envelope."]].map(([n,a,b],i)=><div className="trace-step" key={n}><span>{n}</span><div><b>{a}</b><p>{b}</p></div>{i<3&&<ArrowRight className="trace-arrow" />}</div>)}</div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><div><b className="text-sm">Generate full simulation decision report</b><p className="mt-1 text-xs text-muted-foreground">Export a two-section engineering report with the full decision trace and model evidence.</p></div><Button><FileText /> Generate report</Button></div>
      </section>

      <section className="glass-panel mt-5 p-5">
        <p className="panel-label">Simulation dependency pipeline & execution chain</p><h2 className="mt-1 font-display text-lg font-bold">Causal model chain</h2><p className="mt-2 max-w-4xl text-xs text-muted-foreground">Parameter inputs propagate reactively through thermal heating, viscosity reduction, mobility, inflow, SRP mechanics, and risk evaluation.</p>
        <div className="pipeline mt-5">{["Surface inputs","Steam / CSS","Thermal model","Viscosity","Darcy mobility","Production","Risk score"].map((x,i)=><div key={x} className="pipeline-item"><div className="pipeline-node">{i+1}</div><span>{x}</span>{i<6&&<ArrowRight />}</div>)}</div>
      </section>

      <section className="glass-panel mt-5 p-5">
        <div className="success-callout"><Check className="h-5 w-5" /><div className="flex-1"><b>Scenario inputs validated and ready for simulation</b><p>Viscosity: 5,011 cP · Oil rate: 0.75 BOPD · Risk: low · Source: prototype reference data</p></div><Button onClick={()=>setRunning(true)}><Play /> Run simulation</Button></div>
      </section>

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1 pb-4 text-[10px] text-muted-foreground"><span>Baghewala Field · Jodhpur Sandstone Reservoir · Well BGH-01</span><span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Demonstration only</span></footer>
    </div>
  </div>;
}