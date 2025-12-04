// import React, { useState } from 'react';
// import { Play, Save, Plus, Trash2 } from 'lucide-react';

// const RequestPanel = ({ 
//   url, setUrl, method, setMethod, body, setBody, 
//   headers, setHeaders, onSend, onSave, loading, user 
// }) => {
//   const [activeTab, setActiveTab] = useState('body');

//   const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
//   const updateHeader = (i, field, val) => {
//     const newHeaders = [...headers];
//     newHeaders[i][field] = val;
//     setHeaders(newHeaders);
//   };
//   const removeHeader = (i) => setHeaders(headers.filter((_, idx) => idx !== i));

//   return (
//     <div className="flex flex-col h-full border-r border-gray-800 w-1/2">
//       {/* URL BAR */}
//       <div className="p-4 border-b border-gray-800 flex gap-2">
//         <select 
//           value={method} onChange={(e) => setMethod(e.target.value)}
//           className="bg-gray-800 text-white text-sm font-bold rounded px-2 outline-none border border-transparent focus:border-blue-500"
//         >
//           <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
//         </select>
//         <input 
//           value={url} onChange={e => setUrl(e.target.value)}
//           className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded outline-none border border-transparent focus:border-blue-500"
//           placeholder="https://api.example.com/v1/users"
//         />
//         <button onClick={onSend} disabled={loading}
//           className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded font-bold flex items-center gap-2 disabled:opacity-50 transition">
//           {loading ? '...' : <Play size={16} fill="white" />} Send
//         </button>
//         {user && (
//           <button onClick={onSave} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 rounded">
//             <Save size={18} />
//           </button>
//         )}
//       </div>

//       {/* TABS */}
//       <div className="flex border-b border-gray-800 bg-gray-900">
//         <button onClick={() => setActiveTab('body')} className={`px-4 py-2 text-xs font-bold ${activeTab === 'body' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}>Body</button>
//         <button onClick={() => setActiveTab('headers')} className={`px-4 py-2 text-xs font-bold ${activeTab === 'headers' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}>Headers</button>
//       </div>

//       {/* EDITOR */}
//       <div className="flex-1 bg-gray-950 p-2 overflow-auto">
//         {activeTab === 'body' ? (
//           <textarea 
//             value={body} onChange={e => setBody(e.target.value)}
//             className="w-full h-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none"
//             placeholder="{ 'key': 'value' }"
//           />
//         ) : (
//           <div className="p-2">
//              <button onClick={addHeader} className="text-xs text-blue-400 flex items-center gap-1 mb-2 hover:underline">
//                <Plus size={12} /> Add Header
//              </button>
//              {headers.map((h, i) => (
//                <div key={i} className="flex gap-2 mb-2">
//                  <input placeholder="Key" value={h.key} onChange={e => updateHeader(i, 'key', e.target.value)} className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-white w-1/2 outline-none focus:border-blue-500"/>
//                  <input placeholder="Value" value={h.value} onChange={e => updateHeader(i, 'value', e.target.value)} className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-white w-1/2 outline-none focus:border-blue-500"/>
//                  <button onClick={() => removeHeader(i)} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
//                </div>
//              ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RequestPanel;


import React, { useState, useEffect } from 'react';
import { Play, Save, Plus, Trash2, Code, FileText, List } from 'lucide-react';

const RequestPanel = ({ 
  url, setUrl, 
  method, setMethod, 
  headers, setHeaders,
  // New Body State Props
  bodyType, setBodyType,
  bodyRaw, setBodyRaw,
  bodyFormData, setBodyFormData,
  bodyUrlEncoded, setBodyUrlEncoded,
  onSend, onSave, loading, user 
}) => {
  const [activeTab, setActiveTab] = useState('body'); // 'body' | 'headers'

  // --- HELPER: KEY-VALUE EDITOR ---
  // Reusable component for Headers, Form-Data, and UrlEncoded
  const KeyValueEditor = ({ items, setItems, placeholderKey = "Key", placeholderValue = "Value" }) => {
    const addRow = () => setItems([...items, { key: '', value: '' }]);
    
    const updateRow = (index, field, val) => {
      const newItems = [...items];
      newItems[index][field] = val;
      setItems(newItems);
    };
    
    const removeRow = (index) => {
      setItems(items.filter((_, i) => i !== index));
    };

    return (
      <div className="flex flex-col h-full">
        <div className="mb-2">
          <button onClick={addRow} className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300">
            <Plus size={12} /> Add Item
          </button>
        </div>
        <div className="overflow-y-auto flex-1 pr-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2 group">
              <input 
                placeholder={placeholderKey}
                value={item.key} 
                onChange={(e) => updateRow(i, 'key', e.target.value)} 
                className="flex-1 bg-gray-900 border border-gray-800 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
              />
              <input 
                placeholder={placeholderValue}
                value={item.value} 
                onChange={(e) => updateRow(i, 'value', e.target.value)} 
                className="flex-1 bg-gray-900 border border-gray-800 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
              />
              <button onClick={() => removeRow(i)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition px-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-gray-700 text-xs italic text-center mt-4">Empty list</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full border-r border-gray-800 w-1/2 bg-gray-950">
      
      {/* 1. URL BAR */}
      <div className="p-3 border-b border-gray-800 flex gap-2 items-center bg-gray-900">
        <select 
          value={method} onChange={(e) => setMethod(e.target.value)}
          className="bg-gray-800 text-white text-xs font-bold rounded px-2 py-2 outline-none border border-gray-700 focus:border-blue-500"
        >
          <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
        </select>
        <input 
          value={url} onChange={e => setUrl(e.target.value)}
          className="flex-1 bg-gray-800 text-white text-xs px-3 py-2 rounded outline-none border border-gray-700 focus:border-blue-500 placeholder-gray-600"
          placeholder="https://api.example.com/v1/resource"
        />
        <button onClick={onSend} disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition shadow-lg shadow-blue-900/20">
          {loading ? 'Sending...' : <><Play size={12} fill="white" /> Send</>}
        </button>
        {user && (
          <button onClick={onSave} className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white p-2 rounded border border-gray-700 transition">
            <Save size={14} />
          </button>
        )}
      </div>

      {/* 2. MAIN TABS (Params vs Headers vs Body) */}
      <div className="flex border-b border-gray-800 bg-gray-900/50">
        <button 
          onClick={() => setActiveTab('body')} 
          className={`px-4 py-2 text-xs font-medium border-b-2 transition ${activeTab === 'body' ? 'border-blue-500 text-blue-400 bg-gray-900' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Body
        </button>
        <button 
          onClick={() => setActiveTab('headers')} 
          className={`px-4 py-2 text-xs font-medium border-b-2 transition ${activeTab === 'headers' ? 'border-blue-500 text-blue-400 bg-gray-900' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Headers <span className="text-[10px] ml-1 bg-gray-800 px-1 rounded-full text-gray-400">{headers.length}</span>
        </button>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        
        {/* --- HEADERS VIEW --- */}
        {activeTab === 'headers' && (
          <KeyValueEditor items={headers} setItems={setHeaders} placeholderKey="Header" placeholderValue="Value" />
        )}

        {/* --- BODY VIEW --- */}
        {activeTab === 'body' && (
          <div className="flex flex-col h-full">
            {/* Body Type Selector */}
            <div className="flex gap-4 mb-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="bodyType" checked={bodyType === 'none'} onChange={() => setBodyType('none')} className="accent-blue-500"/> 
                <span className={bodyType === 'none' ? 'text-white' : 'text-gray-500'}>None</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="bodyType" checked={bodyType === 'raw'} onChange={() => setBodyType('raw')} className="accent-blue-500"/> 
                <span className={bodyType === 'raw' ? 'text-white' : 'text-gray-500'}>Raw (JSON)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="bodyType" checked={bodyType === 'form-data'} onChange={() => setBodyType('form-data')} className="accent-blue-500"/> 
                <span className={bodyType === 'form-data' ? 'text-white' : 'text-gray-500'}>Form Data</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="bodyType" checked={bodyType === 'x-www-form-urlencoded'} onChange={() => setBodyType('x-www-form-urlencoded')} className="accent-blue-500"/> 
                <span className={bodyType === 'x-www-form-urlencoded' ? 'text-white' : 'text-gray-500'}>x-www-form-urlencoded</span>
              </label>
            </div>

            {/* Body Content Logic */}
            <div className="flex-1 border border-gray-800 rounded bg-gray-900/30 p-2 overflow-hidden relative">
              
              {bodyType === 'none' && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs">
                  This request has no body
                </div>
              )}

              {bodyType === 'raw' && (
                <textarea 
                  value={bodyRaw} 
                  onChange={e => setBodyRaw(e.target.value)}
                  className="w-full h-full bg-transparent text-green-300 font-mono text-xs outline-none resize-none p-2"
                  placeholder="{ 'key': 'value' }"
                />
              )}

              {bodyType === 'form-data' && (
                <KeyValueEditor items={bodyFormData} setItems={setBodyFormData} placeholderKey="Key" placeholderValue="Value" />
              )}

              {bodyType === 'x-www-form-urlencoded' && (
                <KeyValueEditor items={bodyUrlEncoded} setItems={setBodyUrlEncoded} placeholderKey="Key" placeholderValue="Value" />
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPanel;