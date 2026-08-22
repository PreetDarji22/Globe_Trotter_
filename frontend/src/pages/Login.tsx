import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Compass, Mail, Lock, User, Phone, MapPin, Globe, Sparkles, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

export default function Login({ isRegister = false }: { isRegister?: boolean }) {
  const navigate = useNavigate();
  const { login, register } = useStore() as any;
  
  const [mode, setMode] = useState<'login' | 'register'>(isRegister ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginEmail = email || (mode === 'login' ? 'mia.chen@globe.com' : '');
      const loginPass = password || 'password123';
      const success = await login(loginEmail, loginPass);
      setLoading(false);

      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during authentication.');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setEmail('mia.chen@globe.com');
    setPassword('password123');
    const success = await login('mia.chen@globe.com', 'password123');
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-200 w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[680px]">
        
        {/* Left Hero Banner */}
        <div className="w-full md:w-5/12 relative bg-slate p-8 md:p-12 flex flex-col justify-between text-white overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate via-slate/70 to-slate/30"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-terracotta flex items-center justify-center text-white font-black">
                <Compass size={22} />
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">Global<span className="text-terracotta">Trotter</span></span>
            </Link>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 text-amber-300 border border-white/10">
              <Sparkles size={14} /> AI-Powered Travel Planning
            </div>

            <h2 className="font-display font-black text-3xl md:text-4xl leading-tight mb-4 text-white">
              Discover, Plan & Share Your World Adventures.
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed font-medium mb-6">
              Create detailed day-by-day itineraries, track activity costs dynamically, and connect with fellow global travelers.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-stone-200 font-medium">
                <CheckCircle size={18} className="text-genz-green shrink-0" />
                <span>Curated Community Itineraries</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-200 font-medium">
                <CheckCircle size={18} className="text-genz-green shrink-0" />
                <span>Dynamic Budget & Expense Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-200 font-medium">
                <CheckCircle size={18} className="text-genz-green shrink-0" />
                <span>Connect with Verified Travel Buddies</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-6 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100" className="w-9 h-9 rounded-full border-2 border-slate object-cover" alt="User" />
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100" className="w-9 h-9 rounded-full border-2 border-slate object-cover" alt="User" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100" className="w-9 h-9 rounded-full border-2 border-slate object-cover" alt="User" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Join 10,000+ Explorers</p>
              <p className="text-[11px] text-stone-400 font-medium">Rating 4.9 ★★★★★</p>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-between bg-stone-50/50">
          <div>
            {/* Tab Switcher */}
            <div className="flex bg-stone-200/70 p-1.5 rounded-2xl mb-8 w-full max-w-sm mx-auto md:mx-0">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-white text-slate shadow-sm' : 'text-stone-500 hover:text-slate'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'register' ? 'bg-white text-slate shadow-sm' : 'text-stone-500 hover:text-slate'}`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-display font-black text-2xl text-slate mb-1">
                {mode === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
              </h3>
              <p className="text-stone-500 text-sm font-medium">
                {mode === 'login' ? 'Enter your credentials to access your trips' : 'Fill in your details to create a free account'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-200 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  {/* Preset Avatar Selection */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Choose Avatar</label>
                    <div className="flex gap-3 items-center">
                      <SafeImage src={avatarUrl} className="w-12 h-12 rounded-full object-cover border-2 border-terracotta shadow-sm" alt="Selected Avatar" />
                      <div className="flex gap-2">
                        {presetAvatars.map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setAvatarUrl(url)}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${avatarUrl === url ? 'border-terracotta scale-110' : 'border-stone-200 hover:border-stone-400'}`}
                          >
                            <SafeImage src={url} className="w-full h-full object-cover" alt="Preset" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-3.5 text-stone-400" />
                      <input
                        required
                        placeholder="First Name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                      />
                    </div>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-3.5 text-stone-400" />
                      <input
                        required
                        placeholder="Last Name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="relative">
                <Mail size={18} className="absolute left-4 top-3.5 text-stone-400" />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-stone-400" />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                />
              </div>

              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-3.5 text-stone-400" />
                      <input
                        placeholder="Phone Number"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                      />
                    </div>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-3.5 text-stone-400" />
                      <input
                        placeholder="City"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <Globe size={18} className="absolute left-4 top-3.5 text-stone-400" />
                    <input
                      placeholder="Country"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-terracotta text-white py-3.5 rounded-xl font-bold hover:bg-terracotta/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base"
              >
                {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In to GlobalTrotter' : 'Create Free Account')}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6">
            {mode === 'login' ? (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full border-2 border-stone-300 bg-white text-slate py-2.5 rounded-xl font-bold hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <span>⚡ Instant Demo Login (Mia Chen)</span>
                </button>
                <p className="text-center text-stone-500 text-xs font-medium">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setMode('register')} className="text-terracotta font-bold underline">
                    Register here
                  </button>
                </p>
              </div>
            ) : (
              <p className="text-center text-stone-500 text-xs font-medium">
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-terracotta font-bold underline">
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
