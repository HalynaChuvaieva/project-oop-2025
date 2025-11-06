import React, { useState } from "react";

export default function GraphView() {
  const [graph, setGraph] = useState({ vertices: [1,2,3], edges: [[1,2],[2,3]] });
  const [vval, setVval] = useState("");
  const [u, setU] = useState("");
  const [w, setW] = useState("");

  const addVertex = ()=>{ if (vval==='') return; setGraph(prev=>({...prev, vertices: prev.vertices.includes(vval)?prev.vertices:[...prev.vertices, vval]})); setVval(""); };
  const addEdge = ()=>{
    if (u===''||w==='') return;
    setGraph(prev=>{ const edges = [...prev.edges, [u,w]]; return {...prev, edges}; });
    setU(''); setW('');
  };
  const clear = ()=> setGraph({vertices: [], edges: []});

  const {vertices, edges} = graph;
  const centerX = 400, centerY = 120, r = Math.min(120, 30 * vertices.length);
  const positions = {};
  vertices.forEach((vv,i)=>{ const angle = (2*Math.PI*i)/Math.max(1,vertices.length); positions[vv]={x:centerX + r*Math.cos(angle), y:centerY + r*Math.sin(angle)}; });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Graph</h2>
      <div className="flex gap-3 mb-4 items-center">
        <input value={vval} onChange={e=>setVval(e.target.value)} className="px-3 py-2 border rounded w-24" placeholder="vertex" />
        <button onClick={addVertex} className="px-3 py-2 bg-blue-500 text-white rounded">Add Vertex</button>
        <input value={u} onChange={e=>setU(e.target.value)} className="px-3 py-2 border rounded w-20" placeholder="u" />
        <input value={w} onChange={e=>setW(e.target.value)} className="px-3 py-2 border rounded w-20" placeholder="v" />
        <button onClick={addEdge} className="px-3 py-2 bg-emerald-500 text-white rounded">Add Edge</button>
        <button onClick={clear} className="px-3 py-2 bg-gray-300 rounded">Clear</button>
      </div>

      <div className="w-full bg-white rounded shadow p-4">
        <svg width="100%" height={260}>
          {edges.map(([a,b],i)=>{
            const p1 = positions[a], p2 = positions[b];
            if (!p1 || !p2) return null;
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#0f172a" strokeWidth={2} />;
          })}
          {vertices.map((vv,i)=>{
            const p = positions[vv];
            if (!p) return null;
            return (
              <g key={vv}>
                <circle cx={p.x} cy={p.y} r={22} className="fill-white stroke-slate-300" strokeWidth={2} />
                <text x={p.x} y={p.y+5} textAnchor="middle" fontSize={12} fill="#0f172a">{vv}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
