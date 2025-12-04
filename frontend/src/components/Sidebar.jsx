// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { useAuth } from '../context/AuthContext';
// // import { Clock, Database, Folder, LogIn, LogOut, Shield } from 'lucide-react';

// // const Sidebar = ({ onLoadRequest, setShowAuthModal, refreshTrigger }) => {
// //   const { user, signOut } = useAuth();
// //   const [history, setHistory] = useState([]);
// //   const [collections, setCollections] = useState([]);

// //   useEffect(() => {
// //     if (user) {
// //       const fetchUserData = async () => {
// //         const token = (await supabase.auth.getSession()).data.session.access_token;
// //         const headers = { Authorization: `Bearer ${token}` };
        
// //         try {
// //           const [histRes, colRes] = await Promise.all([
// //             axios.get('${import.meta.env.VITE_API_BASE_URL}/api/history', { headers }),
// //             axios.get('${import.meta.env.VITE_API_BASE_URL}/api/collections', { headers })
// //           ]);
// //           setHistory(histRes.data);
// //           setCollections(colRes.data);
// //         } catch (error) {
// //           console.error("Fetch error", error);
// //         }
// //       };
// //       fetchUserData();
// //     } else {
// //       setHistory([]);
// //       setCollections([]);
// //     }
// //   }, [user, refreshTrigger]);

// //   return (
// //     <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
// //       {/* Header */}
// //       <div className="p-4 border-b border-gray-800 flex items-center gap-2">
// //         <div className="bg-blue-600 p-1 rounded">
// //             <Shield size={20} className="text-white" />
// //         </div>
// //         <span className="font-bold text-gray-100 tracking-wider">APITESTER</span>
// //       </div>

// //       {/* Content */}
// //       <div className="flex-1 overflow-y-auto p-2">
// //         {!user ? (
// //           <div className="mt-10 flex flex-col items-center text-center px-4">
// //             <div className="bg-gray-800 p-3 rounded-full mb-3">
// //               <LogIn size={24} className="text-gray-400" />
// //             </div>
// //             <h3 className="text-gray-200 font-bold">Guest Mode</h3>
// //             <p className="text-xs text-gray-500 mt-2 mb-4">
// //               Login to save request history and create collections.
// //             </p>
// //             <button 
// //               onClick={() => setShowAuthModal(true)}
// //               className="bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 px-4 rounded w-full font-bold transition">
// //               Login / Sign Up
// //             </button>
// //           </div>
// //         ) : (
// //           <>
// //             {/* History List */}
// //             <div className="mb-6">
// //               <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2 flex items-center gap-2">
// //                 <Clock size={12} /> Recent History
// //               </h3>
// //               {history.map(req => (
// //                 <div key={req.id} onClick={() => onLoadRequest(req)}
// //                      className="px-2 py-2 hover:bg-gray-800 rounded cursor-pointer group flex items-center gap-2">
// //                   <span className={`text-[10px] font-bold w-8 ${
// //                     req.method === 'GET' ? 'text-emerald-400' :
// //                     req.method === 'POST' ? 'text-amber-400' :
// //                     req.method === 'DELETE' ? 'text-rose-400' : 'text-blue-400'
// //                   }`}>{req.method}</span>
// //                   <span className="text-xs text-gray-400 truncate w-full">{req.url}</span>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Collections List */}
// //             <div>
// //               <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2 flex items-center gap-2">
// //                 <Database size={12} /> Collections
// //               </h3>
// //               {collections.map(col => (
// //                 <div key={col.id} className="mb-2">
// //                   <div className="px-2 py-1 text-xs font-semibold text-gray-300 flex items-center gap-2">
// //                     <Folder size={12} /> {col.name}
// //                   </div>
// //                   {col.saved_requests?.map(req => (
// //                     <div key={req.id} onClick={() => onLoadRequest(req)}
// //                          className="pl-6 pr-2 py-1 hover:bg-gray-800 rounded cursor-pointer flex items-center gap-2">
// //                       <span className="text-[10px] text-blue-400 font-bold">{req.method}</span>
// //                       <span className="text-xs text-gray-500 truncate">{req.name}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               ))}
// //             </div>
// //           </>
// //         )}
// //       </div>

// //       {/* Footer */}
// //       {user && (
// //         <div className="p-4 border-t border-gray-800">
// //            <div className="text-xs text-gray-500 mb-2 truncate">{user.email}</div>
// //            <button onClick={signOut} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs">
// //              <LogOut size={14} /> Sign Out
// //            </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Sidebar;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { supabase } from '../lib/supabase'; // Ensure this path is correct
// import { useAuth } from '../context/AuthContext';
// import { Clock, Database, Folder, LogIn, LogOut, Shield, Trash2, RefreshCw } from 'lucide-react';

// const Sidebar = ({ onLoadRequest, setShowAuthModal, refreshTrigger }) => {
//   const { user, signOut } = useAuth();
//   const [history, setHistory] = useState([]);
//   const [collections, setCollections] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // --- FETCH DATA FUNCTION ---
//   const fetchData = async () => {
//     if (!user) return;
//     setLoading(true);
    
//     try {
//       // 1. Get Token Safely
//       const sessionData = await supabase.auth.getSession();
//       const token = sessionData.data.session?.access_token;

//       if (!token) {
//         console.warn("No access token found, skipping fetch.");
//         setLoading(false);
//         return;
//       }

//       const headers = { Authorization: `Bearer ${token}` };
//       const BACKEND_URL = '${import.meta.env.VITE_API_BASE_URL}/api';

//       // 2. Fetch Both concurrently
//       const [histRes, colRes] = await Promise.all([
//         axios.get(`${BACKEND_URL}/history`, { headers }),
//         axios.get(`${BACKEND_URL}/collections`, { headers })
//       ]);

//       setHistory(histRes.data);
//       setCollections(colRes.data);
//     } catch (error) {
//       console.error("Failed to fetch sidebar data:", error);
//       // Optional: alert("Error loading history. Check console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- DELETE HELPER (Optional Feature) ---
//   const deleteCollection = async (id, e) => {
//     e.stopPropagation();
//     if(!confirm("Delete this collection?")) return;
//     try {
//       const token = (await supabase.auth.getSession()).data.session.access_token;
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/collections/${id}`, {
//          headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchData(); // Reload
//     } catch(err) { console.error(err); }
//   };

//   // Trigger fetch when User logs in OR when refreshTrigger changes (after Send/Save)
//   useEffect(() => {
//     if (user) {
//       fetchData();
//     } else {
//       setHistory([]);
//       setCollections([]);
//     }
//   }, [user, refreshTrigger]);

//   return (
//     <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full text-gray-300">
      
//       {/* HEADER */}
//       <div className="p-4 border-b border-gray-800 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="bg-blue-600 p-1 rounded">
//             <Shield size={16} className="text-white" />
//           </div>
//           <span className="font-bold text-gray-100 text-sm tracking-wider">APITESTER</span>
//         </div>
//         {user && (
//           <button onClick={fetchData} className="text-gray-500 hover:text-white" title="Refresh">
//             <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
//           </button>
//         )}
//       </div>

//       {/* LIST CONTENT */}
//       <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
//         {!user ? (
//           <div className="mt-10 flex flex-col items-center text-center px-4 animate-fade-in">
//             <div className="bg-gray-800 p-3 rounded-full mb-3">
//               <LogIn size={24} className="text-gray-400" />
//             </div>
//             <h3 className="text-gray-200 font-bold text-sm">Guest Mode</h3>
//             <p className="text-[10px] text-gray-500 mt-2 mb-4 leading-relaxed">
//               Login to automatically save your request history and organize APIs into collections.
//             </p>
//             <button 
//               onClick={() => setShowAuthModal(true)}
//               className="bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 px-4 rounded w-full font-bold transition shadow-lg shadow-blue-900/20">
//               Login / Sign Up
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* HISTORY SECTION */}
//             <div className="mb-6">
//               <h3 className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-2 flex items-center gap-2 tracking-wider">
//                 <Clock size={10} /> Recent History
//               </h3>
//               <div className="space-y-0.5">
//                 {history.length === 0 && <div className="text-xs text-gray-600 px-2 italic">No history yet. Send a request!</div>}
                
//                 {history.map(req => (
//                   <div key={req.id} onClick={() => onLoadRequest(req)}
//                        className="px-2 py-2 hover:bg-gray-800/80 rounded cursor-pointer group flex items-center gap-2 transition">
//                     <span className={`text-[9px] font-bold w-8 text-center py-0.5 rounded ${
//                       req.method === 'GET' ? 'bg-emerald-900/30 text-emerald-400' :
//                       req.method === 'POST' ? 'bg-amber-900/30 text-amber-400' :
//                       req.method === 'DELETE' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
//                     }`}>{req.method}</span>
//                     <span className="text-xs text-gray-400 truncate w-full group-hover:text-gray-200">{req.url}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* COLLECTIONS SECTION */}
//             <div>
//               <h3 className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-2 flex items-center gap-2 tracking-wider">
//                 <Database size={10} /> Collections
//               </h3>
              
//               {collections.length === 0 && <div className="text-xs text-gray-600 px-2 italic">No collections found.</div>}

//               {collections.map(col => (
//                 <div key={col.id} className="mb-3">
//                   <div className="px-2 py-1 text-xs font-semibold text-gray-300 flex items-center justify-between group">
//                     <div className="flex items-center gap-2">
//                       <Folder size={12} className="text-blue-500"/> 
//                       <span>{col.name}</span>
//                     </div>
//                     {/* Delete Collection Button */}
//                     <button onClick={(e) => deleteCollection(col.id, e)} className="hidden group-hover:block text-gray-600 hover:text-red-400">
//                       <Trash2 size={10} />
//                     </button>
//                   </div>
                  
//                   {/* Requests inside Collection */}
//                   <div className="ml-2 border-l border-gray-800 pl-1 mt-1 space-y-0.5">
//                     {col.saved_requests?.map(req => (
//                       <div key={req.id} onClick={() => onLoadRequest(req)}
//                            className="px-2 py-1.5 hover:bg-gray-800 rounded cursor-pointer flex items-center gap-2 group">
//                         <span className={`text-[9px] font-bold w-6 ${
//                            req.method === 'GET' ? 'text-emerald-500' :
//                            req.method === 'POST' ? 'text-amber-500' : 'text-blue-500'
//                         }`}>{req.method}</span>
//                         <span className="text-xs text-gray-500 truncate group-hover:text-gray-300">{req.name}</span>
//                       </div>
//                     ))}
//                     {col.saved_requests?.length === 0 && (
//                       <div className="px-2 text-[10px] text-gray-700 italic">Empty</div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* FOOTER */}
//       {user && (
//         <div className="p-3 border-t border-gray-800 bg-gray-900/50">
//            <div className="text-[10px] text-gray-500 mb-2 truncate">Logged in as: <span className="text-gray-300">{user.email}</span></div>
//            <button onClick={signOut} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs w-full py-1 rounded hover:bg-gray-800 transition">
//              <LogOut size={12} /> Sign Out
//            </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, Database, Folder, LogIn, LogOut, Shield, 
  Trash2, RefreshCw, Plus, Check, X 
} from 'lucide-react';

const Sidebar = ({ onLoadRequest, setShowAuthModal, refreshTrigger }) => {
  const { user, signOut } = useAuth();
  
  // Data State
  const [history, setHistory] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Create Collection State
  const [showInput, setShowInput] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [creating, setCreating] = useState(false);

  // --- FETCH DATA ---
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const headers = { Authorization: `Bearer ${session.access_token}` };
      const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

      const [histRes, colRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/history`, { headers }),
        axios.get(`${BACKEND_URL}/collections`, { headers })
      ]);

      setHistory(histRes.data);
      setCollections(colRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CREATE COLLECTION ---
  const handleCreateCollection = async () => {
    if (!newColName.trim()) return;
    setCreating(true);
    try {
      const token = (await supabase.auth.getSession()).data.session.access_token;
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/collections`, 
        { name: newColName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewColName('');
      setShowInput(false);
      fetchData(); // Refresh list
    } catch (err) {
      alert("Failed to create collection");
    }
    setCreating(false);
  };

  // --- DELETE COLLECTION ---
  const deleteCollection = async (id, e) => {
    e.stopPropagation();
    if(!confirm("Delete this collection and all its requests?")) return;
    try {
      const token = (await supabase.auth.getSession()).data.session.access_token;
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/collections/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch(err) { console.error(err); }
  };

  // Initial Load
  useEffect(() => {
    if (user) fetchData();
    else { setHistory([]); setCollections([]); }
  }, [user, refreshTrigger]);

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full text-gray-300">
      
      {/* HEADER */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-100 text-sm tracking-wider">APITESTER</span>
        </div>
        {user && (
          <button onClick={fetchData} className="text-gray-500 hover:text-white transition" title="Refresh Data">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        )}
      </div>

      {/* SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        {!user ? (
          // GUEST VIEW
          <div className="mt-10 flex flex-col items-center text-center px-4">
            <div className="bg-gray-800 p-3 rounded-full mb-3">
              <LogIn size={24} className="text-gray-400" />
            </div>
            <h3 className="text-gray-200 font-bold text-sm">Guest Mode</h3>
            <p className="text-[10px] text-gray-500 mt-2 mb-4">Login to save history & collections.</p>
            <button onClick={() => setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 px-4 rounded w-full font-bold transition">
              Login / Sign Up
            </button>
          </div>
        ) : (
          <>
            {/* HISTORY */}
            <div className="mb-6">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase px-2 mb-2 flex items-center gap-2 tracking-wider">
                <Clock size={10} /> Recent History
              </h3>
              <div className="space-y-0.5">
                {history.length === 0 && <div className="text-xs text-gray-600 px-2 italic">Empty</div>}
                {history.map(req => (
                  <div key={req.id} onClick={() => onLoadRequest(req)}
                       className="px-2 py-2 hover:bg-gray-800 rounded cursor-pointer group flex items-center gap-2">
                    <span className={`text-[9px] font-bold w-8 text-center rounded py-0.5 ${
                      req.method==='GET'?'bg-emerald-900/30 text-emerald-400':
                      req.method==='POST'?'bg-amber-900/30 text-amber-400':
                      req.method==='DELETE'?'bg-red-900/30 text-red-400':'bg-blue-900/30 text-blue-400'
                    }`}>{req.method}</span>
                    <span className="text-xs text-gray-400 truncate w-full group-hover:text-gray-200">{req.url}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* COLLECTIONS */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2 group">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2 tracking-wider">
                  <Database size={10} /> Collections
                </h3>
                {/* NEW COLLECTION BUTTON */}
                <button 
                  onClick={() => setShowInput(true)} 
                  className="text-gray-500 hover:text-white transition" 
                  title="New Collection"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* INLINE CREATE FORM */}
              {showInput && (
                <div className="px-2 mb-2 animate-fade-in">
                  <div className="flex gap-1">
                    <input 
                      autoFocus
                      className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1 w-full outline-none focus:border-blue-500"
                      placeholder="Folder Name..."
                      value={newColName}
                      onChange={e => setNewColName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreateCollection()}
                    />
                    <button onClick={handleCreateCollection} disabled={creating} className="text-blue-500 hover:text-blue-400 bg-gray-800 px-1 rounded border border-gray-700">
                      <Check size={14} />
                    </button>
                    <button onClick={() => { setShowInput(false); setNewColName(''); }} className="text-red-500 hover:text-red-400 bg-gray-800 px-1 rounded border border-gray-700">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* COLLECTIONS LIST */}
              {collections.length === 0 && !showInput && <div className="text-xs text-gray-600 px-2 italic">No collections</div>}

              {collections.map(col => (
                <div key={col.id} className="mb-3">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-300 flex items-center justify-between group hover:bg-gray-800/50 rounded">
                    <div className="flex items-center gap-2">
                      <Folder size={12} className="text-blue-500"/> 
                      <span>{col.name}</span>
                    </div>
                    <button onClick={(e) => deleteCollection(col.id, e)} className="hidden group-hover:block text-gray-600 hover:text-red-400 transition">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  
                  {/* REQUESTS IN FOLDER */}
                  <div className="ml-2 border-l border-gray-800 pl-1 mt-1 space-y-0.5">
                    {col.saved_requests?.map(req => (
                      <div key={req.id} onClick={() => onLoadRequest(req)}
                           className="px-2 py-1.5 hover:bg-gray-800 rounded cursor-pointer flex items-center gap-2 group">
                        <span className={`text-[9px] font-bold w-6 ${
                           req.method === 'GET' ? 'text-emerald-500' :
                           req.method === 'POST' ? 'text-amber-500' : 'text-blue-500'
                        }`}>{req.method}</span>
                        <span className="text-xs text-gray-500 truncate group-hover:text-gray-300">{req.name}</span>
                      </div>
                    ))}
                    {(!col.saved_requests || col.saved_requests.length === 0) && (
                      <div className="px-2 text-[10px] text-gray-700 italic">Empty</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      {user && (
        <div className="p-3 border-t border-gray-800 bg-gray-900/50">
           <div className="text-[10px] text-gray-500 mb-2 truncate">User: <span className="text-gray-300">{user.email}</span></div>
           <button onClick={signOut} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs w-full py-1 rounded hover:bg-gray-800 transition">
             <LogOut size={12} /> Sign Out
           </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;