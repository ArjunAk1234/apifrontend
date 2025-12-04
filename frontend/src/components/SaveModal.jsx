import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, FolderPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SaveModal = ({ onClose, onConfirm, user }) => {
  const [name, setName] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newColName, setNewColName] = useState('');
  const [showNewColInput, setShowNewColInput] = useState(false);

  // Fetch collections when modal opens
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const token = (await supabase.auth.getSession()).data.session.access_token;
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/collections`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCollections(res.data);
        if (res.data.length > 0) setCollectionId(res.data[0].id);
      } catch (err) {
        console.error("Failed to load collections");
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [user]);

  const handleSave = () => {
    if (!name.trim()) return alert("Please enter a request name");
    if (!collectionId) return alert("Please select or create a collection");
    onConfirm(name, collectionId);
  };

  const createCollection = async () => {
    if(!newColName.trim()) return;
    try {
      const token = (await supabase.auth.getSession()).data.session.access_token;
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/collections`, 
        { name: newColName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Add to list and select it
      const newCol = res.data;
      setCollections([newCol, ...collections]);
      setCollectionId(newCol.id);
      setNewColName('');
      setShowNewColInput(false);
    } catch(err) {
      alert("Failed to create collection");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-900 p-6 rounded-lg w-96 border border-gray-700 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
          <X size={18} />
        </button>
        
        <h2 className="text-lg font-bold text-white mb-6">Save Request</h2>

        <div className="space-y-4">
          {/* Request Name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Request Name</label>
            <input 
              autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-blue-500"
              placeholder="e.g., Get User Profile"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Collection Select */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Save to Collection</label>
            
            {!showNewColInput ? (
               <div className="flex gap-2">
                 {loading ? (
                   <div className="text-xs text-gray-500 py-2">Loading folders...</div>
                 ) : (
                   <select 
                     value={collectionId}
                     onChange={e => setCollectionId(e.target.value)}
                     className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-blue-500"
                   >
                     {collections.map(c => (
                       <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                     {collections.length === 0 && <option value="">No collections found</option>}
                   </select>
                 )}
                 <button 
                   onClick={() => setShowNewColInput(true)}
                   className="bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white p-2 rounded"
                   title="Create New Folder"
                 >
                   <FolderPlus size={18} />
                 </button>
               </div>
            ) : (
              <div className="flex gap-2 animate-fade-in">
                <input 
                  className="flex-1 bg-gray-800 border border-blue-500 rounded p-2 text-white text-sm outline-none"
                  placeholder="New Folder Name"
                  value={newColName}
                  onChange={e => setNewColName(e.target.value)}
                />
                <button onClick={createCollection} className="bg-blue-600 hover:bg-blue-500 text-white px-3 rounded text-xs font-bold">Add</button>
                <button onClick={() => setShowNewColInput(false)} className="text-gray-400 hover:text-white px-2">Cancel</button>
              </div>
            )}
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded font-bold text-sm mt-4 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;