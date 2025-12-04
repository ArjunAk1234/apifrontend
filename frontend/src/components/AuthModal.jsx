import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const AuthModal = ({ onClose }) => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = isLogin ? await signIn(email, pass) : await signUp(email, pass);
    if (error) setError(error.message);
    else onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-80 border border-gray-700 relative shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white"><X size={18}/></button>
        <h2 className="text-xl font-bold text-white mb-4 text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" placeholder="Email" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-blue-500" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-blue-500" value={pass} onChange={e=>setPass(e.target.value)} required />
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-sm font-bold">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
        <p className="text-gray-500 text-xs text-center mt-4 cursor-pointer hover:text-gray-300" onClick={()=>setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign up" : "Have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;