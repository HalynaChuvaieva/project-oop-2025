import React, { useState } from "react";
import ListView from "./components/visualizers/ListView";
import StackView from "./components/visualizers/StackView";
import QueueView from "./components/visualizers/QueueView";
import BSTView from "./components/visualizers/BSTView";
import GraphView from "./components/visualizers/GraphView";
import StructureMenu from "./components/StructureMenu";

export default function App(){
  const [sel, setSel] = useState("List");
  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-700">Algorithm Visualizer — Interactive</h1>
          <StructureMenu selected={sel} onChange={setSel} />
        </header>

        <main className="mt-4">
          {sel==="List" && <ListView initial={[5,10,15]} />}
          {sel==="Queue" && <QueueView initial={[1,2,3]} />}
          {sel==="Stack" && <StackView initial={["A","B"]} />}
          {sel==="BST" && <BSTView />}
          {sel==="Graph" && <GraphView />}
        </main>

        <footer className="mt-6 text-sm text-slate-500">Візуалізації: List / Queue / Stack / BST / Graph — інтерактивні, світла тема.</footer>
      </div>
    </div>
  );
}
