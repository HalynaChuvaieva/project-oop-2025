import React from "react";

export default function StructureMenu({selected, onChange}){
  return (
    <div className="flex gap-2">
      {["List","Queue","Stack","BST","Graph"].map(s=>(
        <button key={s} onClick={()=>onChange(s)} className={'px-3 py-2 rounded ' + (selected===s ? 'bg-indigo-600 text-white':'bg-white border')}>{s}</button>
      ))}
    </div>
  );
}
