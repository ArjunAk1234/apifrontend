import React from 'react';

const ResponsePanel = ({ response }) => {
  if (!response) {
    return (
      <div className="w-1/2 bg-gray-900 flex items-center justify-center text-gray-600 text-sm">
        Enter URL and hit Send
      </div>
    );
  }

  const isError = response.status >= 400;
  
  return (
    <div className="w-1/2 bg-gray-900 flex flex-col h-full border-l border-gray-800">
      <div className="p-3 border-b border-gray-800 flex items-center justify-between bg-gray-800/50">
        <div className="flex gap-3">
          <span className={`text-xs font-bold px-2 py-1 rounded ${isError ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {response.status} {response.statusText}
          </span>
          <span className="text-xs text-gray-400 py-1">Time: {response.time}</span>
          <span className="text-xs text-gray-400 py-1">Size: {response.size}</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className={`text-xs font-mono whitespace-pre-wrap break-all ${isError ? 'text-amber-100' : 'text-green-300'}`}>
          {JSON.stringify(response.data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ResponsePanel;