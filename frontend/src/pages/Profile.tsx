import React, { useState } from 'react';
import { useStore } from '../store';
import { Settings, MapPin, Edit3, Trash2, Globe, Shield, User, Mail, Save, AlertTriangle, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SafeImage } from '../components/SafeImage';

export default function Profile() {
  const navigate = useNavigate();
  const { user, trips, logout, updateProfilePicture } = useStore() as any;

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || 'User');
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || '');
  const [email, setEmail] = useState(user?.email || 'user@example.com');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150');
  const [language, setLanguage] = useState('English 🇺🇸');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [savedDestinations, setSavedDestinations] = useState([
    { id: '1', name: 'Kyoto, Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600', tag: 'Cultural' },
    { id: '2', name: 'Amalfi Coast, Italy', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600', tag: 'Coastal' },
    { id: '3', name: 'Swiss Alps, Switzerland', img: 'https://images.unsplash.com/photo-1531366936337-77b12fce08f1?auto=format&fit=crop&w=600', tag: 'Alpine' }
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      user.name = `${firstName} ${lastName}`;
      user.email = email;
      user.avatar = avatar;
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    logout();
    navigate('/login');
  };

  const handleRemoveDestination = (id: string) => {
    setSavedDestinations(savedDestinations.filter(d => d.id !== id));
  };

  const handleUpdatePhoto = async () => {
    if (photoUrl) {
      await updateProfilePicture(photoUrl);
      setEditingPhoto(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-500 pb-24">
      
<<<<<<< HEAD
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-16 border-b border-stone-200 pb-12 mt-8">
        <div className="relative">
          <SafeImage src={user?.avatar || ''} alt="Profile" className="w-48 h-48 rounded-full border-4 border-white shadow-xl object-cover" />
          <button onClick={() => setEditingPhoto(true)} className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-md text-slate hover:text-terracotta transition-colors border border-stone-100">
            <Edit3 size={20} />
          </button>
        </div>

        {editingPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="font-bold text-xl text-slate mb-4">Update Profile Photo</h3>
              <input 
                placeholder="Paste Image URL" 
                value={photoUrl} 
                onChange={e => setPhotoUrl(e.target.value)} 
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 mb-6" 
              />
              <div className="flex gap-4">
                <button onClick={handleUpdatePhoto} className="flex-1 bg-slate text-white py-3 rounded-full font-bold">Save</button>
                <button onClick={() => setEditingPhoto(false)} className="flex-1 bg-stone-100 text-stone-600 py-3 rounded-full font-bold">Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 bg-white border border-stone-200 rounded-[2rem] p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between text-center md:text-left">
=======
      {/* Save Toast */}
      {savedSuccess && (
        <div className="mb-6 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 font-bold shadow-sm">
          <Check size={20} className="text-emerald-600" /> Profile & settings updated successfully!
        </div>
      )}

      {/* Profile Header Banner */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-stone-200 pb-12 mt-6">
        <div className="relative group shrink-0">
          <SafeImage src={avatar} alt="Profile" className="w-44 h-44 rounded-full border-4 border-white shadow-xl object-cover" />
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-md text-slate hover:text-terracotta transition-all border border-stone-200"
          >
            <Edit3 size={18} />
          </button>
        </div>

        <div className="flex-1 bg-white border border-stone-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 w-full">
>>>>>>> 161ec59 (feat: Add Budget, Calendar Timeline, Public Share, User Settings, and Admin Analytics screens)
          <div>
            <span className="bg-terracotta/10 text-terracotta px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2">
              User Settings & Preferences
            </span>
            <h1 className="text-4xl font-display font-black text-slate mb-1">{user?.name || 'Explorer User'}</h1>
            <p className="text-stone-500 font-medium text-sm flex items-center justify-center md:justify-start gap-1.5 mb-2">
              <Mail size={14} /> {user?.email || 'user@example.com'}
            </p>
            <p className="text-xs font-bold text-stone-400">Language: {language}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="border-2 border-slate text-slate px-6 py-2.5 rounded-full font-bold hover:bg-slate hover:text-white transition-all flex items-center gap-2 text-sm shadow-sm"
            >
              <Settings size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Settings'}
            </button>
            <button 
              onClick={() => logout()} 
              className="border-2 border-red-200 text-red-600 px-6 py-2.5 rounded-full font-bold hover:bg-red-50 transition-all text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Editable Fields Section (Key Spec #12) */}
      {isEditing && (
        <div className="bg-white border-2 border-slate rounded-[2.5rem] p-8 md:p-10 shadow-lg mb-14">
          <h3 className="font-display font-black text-2xl text-slate mb-6 flex items-center gap-2">
            <User size={22} className="text-terracotta" /> Update Account & Preferences
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">First Name</label>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)} 
                  className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-terracotta" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)} 
                  className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-terracotta" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-terracotta" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Profile Photo URL</label>
                <input 
                  type="url" 
                  value={avatar} 
                  onChange={e => setAvatar(e.target.value)} 
                  className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-terracotta" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Language Preference</label>
                <select 
                  value={language} 
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 font-medium outline-none focus:border-terracotta bg-white"
                >
                  <option>English 🇺🇸</option>
                  <option>Spanish 🇪🇸</option>
                  <option>French 🇫🇷</option>
                  <option>German 🇩🇪</option>
                  <option>Japanese 🇯🇵</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-stone-100 pt-6">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="px-6 py-2.5 rounded-full font-bold text-stone-500 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-terracotta text-white px-8 py-2.5 rounded-full font-bold shadow-md hover:bg-terracotta/90 transition-all flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Saved Destinations List (Key Spec #12) */}
      <div className="mb-14">
        <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-4">
          <div>
            <h3 className="font-display font-bold text-3xl text-slate">Saved Destinations</h3>
            <p className="text-stone-500 text-sm font-medium">Your bookmarked places to explore</p>
          </div>
          <span className="text-stone-400 font-bold text-sm">{savedDestinations.length} Bookmarked</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedDestinations.map(dest => (
            <div key={dest.id} className="relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-[4/3] border border-stone-200">
              <SafeImage src={dest.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={dest.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/30 to-transparent flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {dest.tag}
                  </span>
                  <button 
                    onClick={() => handleRemoveDestination(dest.id)}
                    className="bg-white/80 hover:bg-red-500 hover:text-white text-slate p-2 rounded-full transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl">{dest.name}</h4>
                  <Link to="/create-trip" className="mt-2 text-xs font-bold text-terracotta hover:underline block">
                    + Plan Trip Here
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Privacy & Delete Account (Key Spec #12) */}
      <div className="bg-red-50/40 border border-red-200 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h4 className="font-bold text-red-900 text-xl flex items-center gap-2">
            <AlertTriangle className="text-red-600" size={20} /> Delete Account & Clear Personal Data
          </h4>
          <p className="text-red-700 text-sm font-medium mt-1 max-w-xl">
            Permanently delete your account, saved itineraries, and clear all local session storage. This action cannot be undone.
          </p>
        </div>

        <button 
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-red-700 transition-all shrink-0 shadow-md"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-stone-200 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 font-bold">
              <AlertTriangle size={32} />
            </div>
            <h3 className="font-display font-black text-2xl text-slate mb-2">Are you sure?</h3>
            <p className="text-stone-500 font-medium text-sm mb-8">
              Deleting your account will purge your saved trips and login credentials. You will need to re-register to use GlobeTrotter.
            </p>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-full font-bold border-2 border-stone-200 text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-full font-bold bg-red-600 text-white hover:bg-red-700 shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
