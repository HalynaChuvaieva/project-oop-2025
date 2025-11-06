import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StackView({ initial = [] }) {
  const [stack, setStack] = useState(initial);
  const [value, setValue] = useState("");

  const push = () => { if (value.trim()==="") return; setStack(prev=>[...prev, value.trim()]); setValue(""); };
  const pop = () => setStack(prev=>prev.slice(0,-1));
  const clear = () => setStack([]);

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Stack</h2>
      <div className="flex gap-3 mb-4">
        <input value={value} onChange={e=>setValue(e.target.value)} className="px-3 py-2 border rounded w-28" placeholder="value" />
        <button onClick={push} className="px-3 py-2 bg-blue-500 text-white rounded">Push</button>
        <button onClick={pop} className="px-3 py-2 bg-red-500 text-white rounded">Pop</button>
        <button onClick={clear} className="px-3 py-2 bg-gray-300 rounded">Clear</button>
      </div>

      <div className="w-56 h-64 border border-slate-200 bg-white rounded p-3 flex flex-col-reverse items-center overflow-y-auto">
        <AnimatePresence initial={false}>
          {stack.map((item,i)=>(
            <motion.div key={item + "-" + i} layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:40}} transition={{duration:0.25}} className="w-40 h-12 rounded bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center text-slate-900 font-semibold mb-2 shadow">
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
