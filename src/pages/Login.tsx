import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';

export default function Login({ isRegister = false }: { isRegister?: boolean }) {
  const navigate = useNavigate();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email.split('@')[0] || 'User', email);
    navigate('/');
  };

  if (isRegister) {
    return (
      <div className="max-w-2xl mx-auto p-4 flex flex-col items-center mt-12">
        <div className="w-28 h-28 rounded-full border-2 border-slate mb-8 flex items-center justify-center font-bold bg-white text-lg">Photo</div>
        <form onSubmit={handleSubmit} className="w-full border-2 border-slate rounded-2xl p-8 bg-white shadow-[4px_4px_0px_rgba(30,35,42,1)]">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <input required placeholder="First Name" className="border-2 border-slate rounded-xl px-4 py-3 outline-none focus:border-terracotta font-medium" />
            <input required placeholder="Last Name" className="border-2 border-slate rounded-xl px-4 py-3 outline-none focus:border-terracotta font-medium" />
            <input required type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="border-2 border-slate rounded-xl px-4 py-3 outline-none focus:border-terracotta font-medium" />
            <input required placeholder="Phone Number" className="border-2 border-slate rounded-xl px-4 py-3 outline-none focus:border-terracotta font-medium" />
            <input required placeholder="City" className="border-2 border-slate rounded-xl px-4 py-3 outline-none focus:border-terracotta font-medium" />
            <input required placeholder="Country" className="border-2 border-slate rounded-xl px-4 py-3 outline-none focus:border-terracotta font-medium" />
          </div>
          <textarea placeholder="Additional Information ...." rows={5} className="w-full border-2 border-slate rounded-xl px-4 py-3 mb-8 outline-none focus:border-terracotta font-medium"></textarea>
          <div className="flex justify-center mb-4">
             <button type="submit" className="border-2 border-slate rounded-full px-12 py-3 font-bold bg-genz-orange text-white hover:opacity-90 transition-opacity text-lg">Register Users</button>
          </div>
          <p className="text-center font-medium"><Link to="/login" className="underline hover:text-terracotta">Back to Login</Link></p>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center mt-24">
      <form onSubmit={handleSubmit} className="w-full border-2 border-slate rounded-2xl p-10 bg-white shadow-[4px_4px_0px_rgba(30,35,42,1)] flex flex-col items-center">
        <div className="w-28 h-28 rounded-full border-2 border-slate mb-10 flex items-center justify-center font-bold bg-white text-lg">Photo</div>
        <input required type="text" placeholder="Username" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-2 border-slate rounded-full px-6 py-3 mb-6 outline-none focus:border-terracotta font-medium" />
        <input required type="password" placeholder="Password" className="w-full border-2 border-slate rounded-full px-6 py-3 mb-10 outline-none focus:border-terracotta font-medium" />
        <button type="submit" className="border-2 border-slate rounded-full px-12 py-3 font-bold bg-genz-blue text-white hover:opacity-90 transition-opacity text-lg mb-6">Login Button</button>
        <p className="font-medium"><Link to="/register" className="underline hover:text-terracotta">Go to Registration</Link></p>
      </form>
    </div>
  );
}
