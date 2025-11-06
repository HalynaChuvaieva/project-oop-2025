import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QueueView({ initial = [1,2,3] }) {
  const [queue, setQueue] = useState(initial);
  const [value, setValue] = useState("");

  const enqueue = () => { if (value.trim()==="") return; setQueue(prev=>[...prev, value.trim()]); setValue(""); };
  const dequeue = () => setQueue(prev=>prev.slice(1));
  const clear = () => setQueue([]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Queue</h2>
      <div className="flex gap-3 mb-4">
        <input value={value} onChange={e=>setValue(e.target.value)} className="px-3 py-2 border rounded w-28" placeholder="value" />
        <button onClick={enqueue} className="px-3 py-2 bg-blue-500 text-white rounded">Enqueue</button>
        <button onClick={dequeue} className="px-3 py-2 bg-red-500 text-white rounded">Dequeue</button>
        <button onClick={clear} className="px-3 py-2 bg-gray-300 rounded">Clear</button>
      </div>

      <div className="w-full h-32 bg-white rounded shadow p-4 flex items-center overflow-auto">
        <div className="flex gap-4 items-center pl-2">
          <AnimatePresence initial={false}>
            {queue.map((v,i)=>(
              <motion.div key={v + "-" + i} layout initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="w-28 h-14 rounded bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center text-slate-900 font-medium shadow">
                {v}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
