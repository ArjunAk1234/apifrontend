

import React, { useState } from 'react';
import axios from 'axios';
import { supabase } from './lib/supabase';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';
import AuthModal from './components/AuthModal';
import SaveModal from './components/SaveModal'; // <--- IMPORT THIS

const Dashboard = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false); // <--- NEW STATE
  
  // App State
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [method, setMethod] = useState('POST');
  const [headers, setHeaders] = useState([{ key: 'Accept', value: '*/*' }]);
  
  // Body State
  const [bodyType, setBodyType] = useState('raw');
  const [bodyRaw, setBodyRaw] = useState('{\n\t"title": "foo",\n\t"body": "bar",\n\t"userId": 1\n}');
  const [bodyFormData, setBodyFormData] = useState([]); 
  const [bodyUrlEncoded, setBodyUrlEncoded] = useState([]); 

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const BACKEND_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
  // alert(import.meta.env.VITE_API_BASE_URL);
  // alert(import.meta.env)
  // // --- SEND LOGIC ---
  const handleSend = async () => {
    setLoading(true);
    setResponse(null);

    const headerObj = headers.reduce((acc, cur) => {
      if(cur.key) acc[cur.key] = cur.value; 
      return acc;
    }, {});
    
    let finalBody = null;
    if (method !== 'GET' && bodyType !== 'none') {
      if (bodyType === 'raw') finalBody = bodyRaw;
      else if (bodyType === 'form-data') finalBody = bodyFormData;
      else if (bodyType === 'x-www-form-urlencoded') finalBody = bodyUrlEncoded;
    }

    try {
      const token = user ? (await supabase.auth.getSession()).data.session?.access_token : null;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const res = await axios.post(`${BACKEND_URL}/proxy`, { 
        method, url, headers: headerObj, body: finalBody, bodyType 
      }, config);
      
      setResponse(res.data);
      if(user) setRefreshTrigger(p => p + 1);

    } catch (err) {
      setResponse({ status: 0, statusText: 'Error', data: 'Failed to reach backend' });
    }
    setLoading(false);
  };

  // --- STEP 1: OPEN SAVE MODAL ---
  const handleSaveClick = () => {
    if (!user) return setShowAuthModal(true);
    setShowSaveModal(true);
  };

  // --- STEP 2: EXECUTE SAVE (Called by Modal) ---
  const executeSaveRequest = async (name, collectionId) => {
    try {
      const token = (await supabase.auth.getSession()).data.session.access_token;
      
      // Prepare Body to Save
      let savedBody = null;
      if (bodyType === 'raw') savedBody = bodyRaw;
      else if (bodyType === 'form-data') savedBody = bodyFormData;
      else if (bodyType === 'x-www-form-urlencoded') savedBody = bodyUrlEncoded;

      const payload = {
        collection_id: collectionId,
        name,
        url,
        method,
        headers: headers.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {}),
        body: { type: bodyType, content: savedBody }
      };

      await axios.post(`${BACKEND_URL}/requests`, payload, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      setRefreshTrigger(p => p + 1); // Updates Sidebar
      setShowSaveModal(false); // Close Modal
      // alert("Request Saved!"); // Optional feedback
    } catch (error) {
      console.error(error);
      alert("Error saving request");
    }
  };

  // --- LOAD REQUEST ---
  const loadRequest = (req) => {
    setUrl(req.url);
    setMethod(req.method);
    if (req.headers) setHeaders(Object.entries(req.headers).map(([key, value]) => ({ key, value })));
    else setHeaders([]);

    if (req.body && req.body.type) {
        setBodyType(req.body.type);
        if (req.body.type === 'raw') setBodyRaw(req.body.content);
        if (req.body.type === 'form-data') setBodyFormData(req.body.content || []);
        if (req.body.type === 'x-www-form-urlencoded') setBodyUrlEncoded(req.body.content || []);
    } else {
        setBodyType('raw');
        setBodyRaw(req.body ? JSON.stringify(req.body, null, 2) : '');
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar 
        onLoadRequest={loadRequest} 
        setShowAuthModal={setShowAuthModal} 
        refreshTrigger={refreshTrigger}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          <RequestPanel 
            url={url} setUrl={setUrl} 
            method={method} setMethod={setMethod}
            headers={headers} setHeaders={setHeaders}
            bodyType={bodyType} setBodyType={setBodyType}
            bodyRaw={bodyRaw} setBodyRaw={setBodyRaw}
            bodyFormData={bodyFormData} setBodyFormData={setBodyFormData}
            bodyUrlEncoded={bodyUrlEncoded} setBodyUrlEncoded={setBodyUrlEncoded}
            onSend={handleSend}
            onSave={handleSaveClick} // <--- Updated Handler
            loading={loading}
            user={user}
          />
          <ResponsePanel response={response} />
        </div>
      </div>
      
      {/* MODALS */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
      {showSaveModal && (
        <SaveModal 
          user={user}
          onClose={() => setShowSaveModal(false)} 
          onConfirm={executeSaveRequest} 
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}