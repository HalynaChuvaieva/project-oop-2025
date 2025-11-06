import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ListView({ initial = [1,2,3] }) {
  const [list, setList] = useState(initial);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(list.length);

  const insert = () => {
    const v = value.trim();
    const idx = Number(index);
    if (v === "" || Number.isNaN(idx)) return;
    const copy = [...list];
    const i = Math.max(0, Math.min(copy.length, idx));
    copy.splice(i, 0, v);
    setList(copy);
    setValue("");
  };
  const remove = () => {
    const idx = Number(index);
    if (Number.isNaN(idx) || idx<0 || idx>=list.length) return;
    const copy = [...list];
    copy.splice(idx,1);
    setList(copy);
  };
  const clear = () => setList([]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Linked List</h2>
      <div className="flex items-center gap-3 mb-4">
        <input value={value} onChange={e=>setValue(e.target.value)} className="px-3 py-2 border rounded w-28" placeholder="value" />
        <input value={index} onChange={e=>setIndex(e.target.value)} className="px-3 py-2 border rounded w-20" placeholder="index" />
        <button onClick={insert} className="px-3 py-2 bg-blue-500 text-white rounded">Insert</button>
        <button onClick={remove} className="px-3 py-2 bg-red-500 text-white rounded">Remove</button>
        <button onClick={clear} className="px-3 py-2 bg-gray-300 rounded">Clear</button>
      </div>

      <div className="w-full h-40 bg-white rounded shadow p-4 flex items-center overflow-auto">
        <div className="flex gap-4 items-center pl-2">
          <AnimatePresence initial={false}>
            {list.map((v,i)=>(
              <motion.div key={v + "-" + i} layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className="flex flex-col items-center">
                <div className="w-24 h-12 rounded bg-gradient-to-r from-indigo-100 to-indigo-200 flex items-center justify-center text-slate-900 font-medium shadow">{v}</div>
                <div className="text-xs text-slate-500 mt-2">#{i}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
