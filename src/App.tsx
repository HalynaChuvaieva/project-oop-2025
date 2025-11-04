import React, { useState, useEffect, useRef } from "react";

class LinkedList {
  constructor(arr = []) { this.arr = [...arr]; }
  insert_at(idx, value) { if (idx < 0) idx = 0; if (idx > this.arr.length) idx = this.arr.length; this.arr.splice(idx, 0, value); }
  remove_at(idx) { if (idx < 0 || idx >= this.arr.length) return; this.arr.splice(idx, 1); }
  clear() { this.arr = []; }
  toArray() { return [...this.arr]; }
}

class SimpleQueue {
  constructor(arr = []) { this.arr = [...arr]; }
  enqueue(v) { this.arr.push(v); }
  dequeue() { if (this.arr.length) this.arr.shift(); }
  toArray() { return [...this.arr]; }
  clear() { this.arr = []; }
}

class SimpleStack {
  constructor(arr = []) { this.arr = [...arr]; }
  push(v) { this.arr.push(v); }
  pop() { this.arr.pop(); }
  toArray() { return [...this.arr]; }
  clear() { this.arr = []; }
}

class SimpleBST {
  constructor() { this.root = null; }
  insert(v) {
    const node = { v, left: null, right: null };
    if (!this.root) { this.root = node; return; }
    let cur = this.root;
    while (true) {
      if (v < cur.v) { if (!cur.left) { cur.left = node; return; } cur = cur.left; }
      else { if (!cur.right) { cur.right = node; return; } cur = cur.right; }
    }
  }
  _inorder(node, out) { if (!node) return; this._inorder(node.left, out); out.push(node.v); this._inorder(node.right, out); }
  inorder() { const out = []; this._inorder(this.root, out); return out; }
  clear() { this.root = null; }
}

class Graph {
  constructor(vertices = []) { this.vertices = [...vertices]; this.edges = []; }
  addVertex(v) { if (!this.vertices.includes(v)) this.vertices.push(v); }
  addEdge(u, v) { if (!this.vertices.includes(u)) this.vertices.push(u); if (!this.vertices.includes(v)) this.vertices.push(v); this.edges.push([u,v]); this.edges.push([v,u]); }
  clear() { this.vertices = []; this.edges = []; }
  toJSON() { return { vertices: this.vertices, edges: this.edges }; }
  fromJSON(obj) { if (obj.vertices) this.vertices = [...obj.vertices]; if (obj.edges) this.edges = [...obj.edges]; }
}
function makeInitialState(algName) {
  if (algName === "Graph - Demo") {
    const g = new Graph([1,2,3,4,5]);
    g.addEdge(1,2); g.addEdge(1,3); g.addEdge(2,4); g.addEdge(3,5);
    return { algName, graphData: g.toJSON(), currentStep: 0 };
  }
  return { algName, listData: [1,2,3], currentStep: 0 };
}

export default function App() {
  const [state, setState] = useState(makeInitialState("Linked List - Insert"));
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [speedMs, setSpeedMs] = useState(600);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoplayRef = useRef(null);

  useEffect(() => { pushState(state); }, []);
  useEffect(() => {
    if (autoPlay) {
      autoplayRef.current = setInterval(() => stepForward(), speedMs);
    } else { if (autoplayRef.current) { clearInterval(autoplayRef.current); autoplayRef.current = null; } }
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [autoPlay, speedMs, state]);

  function deepCopy(s) { return JSON.parse(JSON.stringify(s)); }
  function pushState(s) {
    const copy = s ? deepCopy(s) : deepCopy(state);
    setHistory((h) => {
      const next = h.slice(0, historyIndex + 1); next.push(copy);
      setHistoryIndex(next.length - 1); return next;
    });
  }

  function selectAlgorithm(name) { const s = makeInitialState(name); setState(s); setHistory([]); setHistoryIndex(-1); pushState(s); }

  function stepForward() {
    const s = deepCopy(state);
    if (s.algName.includes("Linked List - Insert")) {
      const list = new LinkedList(s.listData); const val = 10 + s.currentStep; list.insert_at(1, val); s.listData = list.toArray();
    } else if (s.algName.includes("Linked List - Delete")) {
      const list = new LinkedList(s.listData); list.remove_at(0); s.listData = list.toArray();
    } else if (s.algName.includes("Queue")) {
      const q = new SimpleQueue(s.listData); if (s.currentStep % 2 === 0) q.enqueue(100 + s.currentStep); else q.dequeue(); s.listData = q.toArray();
    } else if (s.algName.includes("Stack")) {
      const st = new SimpleStack(s.listData); if (s.currentStep % 2 === 0) st.push(200 + s.currentStep); else st.pop(); s.listData = st.toArray();
    } else if (s.algName.includes("Binary Tree")) {
      const bst = new SimpleBST(); for (const v of s.listData) bst.insert(v);
      if (s.currentStep % 2 === 0) bst.insert(50 + s.currentStep);
      else { const removeVal = 50 + s.currentStep - 2; const arr = bst.inorder().filter(x => x!==removeVal); const newBst = new SimpleBST(); for (const v of arr) newBst.insert(v); s.listData = newBst.inorder(); }
      s.listData = bst.inorder();
    } else if (s.algName.includes("Graph")) {
      const g = new Graph(); g.fromJSON(s.graphData);
      const nextVertex = s.currentStep + 6;
      if (s.currentStep % 2 === 0) g.addVertex(nextVertex);
      else if (g.vertices.length > 1) g.addEdge(g.vertices[0], g.vertices[1]);
      s.graphData = g.toJSON();
    }
    s.currentStep++; setState(s); pushState(s);
  }

  function stepBackward() { if (historyIndex > 0) { const idx = historyIndex-1; setHistoryIndex(idx); setState(deepCopy(history[idx])); } }
  function reset() { if (history.length>0) { setHistoryIndex(0); setState(deepCopy(history[0])); } }

  function saveToFile() {
    const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="visualizer-state.json"; a.click();
    URL.revokeObjectURL(url);
  }

  function loadFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e)=> {
      try { const obj = JSON.parse(e.target.result); if (obj && obj.algName) { setState(obj); pushState(obj); } } catch(err){console.error(err);}
    };
    reader.readAsText(file);
  }

  // --- Рендерери ---
  function renderList(svgWidth) {
    const data = state.listData; const nodeW=80, nodeH=40, gap=30, totalW=data.length*(nodeW+gap), startX=Math.max(20,(svgWidth-totalW)/2);
    return (<svg width="100%" height={160}>
      {data.map((v,i)=>{const x=startX+i*(nodeW+gap), y=50; return (<g key={i}><rect x={x} y={y} width={nodeW} height={nodeH} rx={6} className="stroke-current text-slate-700 fill-white" strokeWidth={1} /><text x={x+nodeW/2} y={y+nodeH/2+5} textAnchor="middle" fontSize={16} fill="#111">{v}</text>{i+1<data.length && <g><line x1={x+nodeW} y1={y+nodeH/2} x2={x+nodeW+gap-10} y2={y+nodeH/2} stroke="#111" strokeWidth={2} /><polyline points={`${x+nodeW+gap-14},${y+nodeH/2-6} ${x+nodeW+gap-4},${y+nodeH/2} ${x+nodeW+gap-14},${y+nodeH/2+6}`} fill="#f9f9f9" stroke="#111" strokeWidth={2}/></g>}</g>);})}
    </svg>);
  }

  function renderStack(svgWidth) {
    const data = state.listData.slice().reverse(); const nodeW=120,nodeH=36,gap=10,startX=svgWidth/2-nodeW/2;
    return (<svg width="100%" height={240}>{data.map((v,i)=>{const y=40+i*(nodeH+gap); return (<g key={i}><rect x={startX} y={y} width={nodeW} height={nodeH} rx={6} className="stroke-current text-slate-700 fill-white" strokeWidth={1}/><text x={startX+nodeW/2} y={y+nodeH/2+5} textAnchor="middle" fontSize={14} fill="#f9f9f9">{v}</text></g>);})}</svg>);
  }

  function renderQueue(svgWidth) { return renderList(svgWidth); }

  function renderBST(svgWidth) {
    const arr = state.listData; const nodeW=70,nodeH=36,gap=20,totalW=arr.length*(nodeW+gap), startX=Math.max(20,(svgWidth-totalW)/2);
    return (<svg width="100%" height={200}>{arr.map((v,i)=>{const x=startX+i*(nodeW+gap), y=60; return (<g key={i}><circle cx={x+nodeW/2} cy={y} r={18} className="stroke-current text-slate-700 fill-white" strokeWidth={1}/><text x={x+nodeW/2} y={y+5} textAnchor="middle" fontSize={12} fill="#f9f9f9">{v}</text></g>);})}</svg>);
  }

  function renderGraph(svgWidth) {
    const data = state.graphData; const vertices=data.vertices, edges=data.edges; const radius=20;
    const centerX=svgWidth/2, centerY=100, r=Math.min(100, vertices.length*15); const positions={};
    vertices.forEach((v,i)=>{const angle=(2*Math.PI*i)/vertices.length; positions[v]={x:centerX+r*Math.cos(angle),y:centerY+r*Math.sin(angle)};});
    return (<svg width="100%" height={220}>
      {edges.map(([u,v],i)=>{const p1=positions[u],p2=positions[v]; return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#111" strokeWidth={2}/>;})}
      {vertices.map((v,i)=>{const {x,y}=positions[v]; return (<g key={i}><circle cx={x} cy={y} r={radius} className="stroke-current text-slate-700 fill-white" strokeWidth={2}/><text x={x} y={y+4} textAnchor="middle" fontSize={12} fill="#f9f9f9">{v}</text></g>);})}
    </svg>);
  }

  function Renderer({width}) {
    if (state.algName.includes("Linked List")) return renderList(width);
    if (state.algName.includes("Queue")) return renderQueue(width);
    if (state.algName.includes("Stack")) return renderStack(width);
    if (state.algName.includes("Binary Tree")) return renderBST(width);
    if (state.algName.includes("Graph")) return renderGraph(width);
    return <div className="p-4 text-sm">No renderer</div>;
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Algorithm Visualizer</h1>
          <div className="text-sm text-slate-500">Step: {state.currentStep}</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="border rounded p-4 bg-white mb-4">
              <div className="mb-2 font-medium">Visualization</div>
              <div className="w-full h-56 bg-slate-50 rounded flex items-center justify-center">
                <div style={{ width: "100%" }}><Renderer width={800} /></div>
              </div>
            </div>

            <div className="flex gap-2 items-center mb-4">
              <button onClick={stepBackward} className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200">◀ Back</button>
              <button onClick={stepForward} className="px-3 py-1 rounded bg-blue-600 text-white hover:opacity-95">Forward ▶</button>
              <button onClick={reset} className="px-3 py-1 rounded bg-yellow-100 hover:bg-yellow-200">Reset</button>

              <label className="ml-4 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={autoPlay} onChange={(e)=>setAutoPlay(e.target.checked)} /> Auto-play
              </label>
              <label className="ml-3 text-sm flex items-center gap-2">Speed
                <input type="range" min={100} max={1500} value={speedMs} onChange={(e)=>setSpeedMs(Number(e.target.value))} />
              </label>

              <div className="ml-auto flex gap-2">
                <button onClick={saveToFile} className="px-3 py-1 rounded border">Save</button>
                <label className="px-3 py-1 rounded border cursor-pointer">
                  Load
                  <input type="file" className="hidden" onChange={(e)=>loadFromFile(e.target.files[0])} />
                </label>
              </div>
            </div>
          </div>

          <aside className="p-4 border rounded bg-slate-50">
            <div className="mb-4">
              <label className="block text-sm mb-1">Algorithm</label>
              <select value={state.algName} onChange={(e)=>selectAlgorithm(e.target.value)} className="w-full p-2 border rounded">
                <option>Linked List - Insert</option>
                <option>Linked List - Delete</option>
                <option>Queue - Demo</option>
                <option>Stack - Demo</option>
                <option>Binary Tree - Demo</option>
                <option>Graph - Demo</option>
              </select>
            </div>

            <div className="mb-4">
              <div className="text-sm mb-1">Data</div>
              <div className="flex gap-2">
                <input type="text" value={state.listData?.join(",") || ""} onChange={(e)=>{const arr=e.target.value.split(",").map(s=>parseInt(s.trim())).filter(n=>!Number.isNaN(n)); setState(prev=>({...prev,listData:arr}));}} className="w-full p-2 border rounded" />
                <button onClick={()=>setState(prev=>({...prev,listData:[1,2,3]}))} className="px-3 rounded border">Reset</button>
              </div>
            </div>

            <div className="text-sm">
              <div className="mb-2 font-medium">History</div>
              <div className="flex gap-2 mb-2">
                <button onClick={()=>{if(historyIndex>0)setHistoryIndex(i=>{const ni=i-1; setState(deepCopy(history[ni])); return ni;});}} className="px-2 py-1 border rounded">◀</button>
                <button onClick={()=>{if(historyIndex+1<history.length)setHistoryIndex(i=>{const ni=i+1; setState(deepCopy(history[ni])); return ni;});}} className="px-2 py-1 border rounded">▶</button>
                <div className="text-xs text-slate-500">{historyIndex+1}/{history.length}</div>
              </div>
              <div className="text-xs text-slate-500">Tip: change algorithm to reset state</div>
            </div>
          </aside>
        </div>

        <footer className="mt-6 text-sm text-slate-500">Made for demo — lightweight visualizer (React + Tailwind). You can expand renderers and algorithm logic as needed.</footer>
      </div>
    </div>
  );
}
