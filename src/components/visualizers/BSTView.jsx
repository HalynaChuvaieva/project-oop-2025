import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Node({x,y,label}){
  return (
    <g>
      <circle cx={x} cy={y} r={20} className="fill-white stroke-slate-300" strokeWidth={2} />
      <text x={x} y={y+5} textAnchor="middle" fontSize={12} fill="#0f172a">{label}</text>
    </g>
  );
}

export default function BSTView() {
  const [values, setValues] = useState([30, 15, 45]);
  const [val, setVal] = useState("");

  const insert = ()=>{
    const n = Number(val);
    if (Number.isNaN(n)) return;
    setValues(prev=>[...prev, n]);
    setVal("");
  };
  const clear = ()=> setValues([]);

  // simple layout: sort inorder and draw nodes horizontally with lines
  const sorted = [...values].sort((a,b)=>a-b);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Binary Search Tree (simple view)</h2>
      <div className="flex gap-3 mb-4">
        <input value={val} onChange={e=>setVal(e.target.value)} className="px-3 py-2 border rounded w-28" placeholder="number" />
        <button onClick={insert} className="px-3 py-2 bg-blue-500 text-white rounded">Insert</button>
        <button onClick={clear} className="px-3 py-2 bg-gray-300 rounded">Clear</button>
      </div>

      <div className="w-full bg-white rounded shadow p-4">
        <svg width="100%" height={220}>
          {sorted.map((v,i)=>{
            const total = sorted.length;
            const gap = Math.min(120, Math.floor(800/Math.max(1,total)));
            const x = 60 + i * gap;
            const y = 100;
            return <Node key={v} x={x} y={y} label={v} />;
          })}
        </svg>
      </div>
    </div>
  );
}
