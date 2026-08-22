import React from 'react';
import { ActionBar } from '../components/ActionBar';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';

export default function Community() {
  const posts = [
    { 
      id: 1, 
      user: 'Mia Explorer', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150', 
      img: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=1000', 
      title: 'Hidden Tokyo Alleyways', 
      likes: 124,
      desc: 'A 5-day dive into the underground cafes and off-the-beaten-path shrines of Tokyo.' 
    },
    { 
      id: 2, 
      user: 'Sam Ventures', 
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150', 
      img: 'https://images.unsplash.com/photo-1531366936337-77b12fce08f1?auto=format&fit=crop&w=1000', 
      title: 'Alps Roadtrip', 
      likes: 89,
      desc: 'Driving through the majestic Swiss Alps. Perfect route for summer.' 
    },
    { 
      id: 3, 
      user: 'Lila Walks', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150', 
      img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000', 
      title: 'Paris on a Budget', 
      likes: 304,
      desc: 'Seeing the City of Light without breaking the bank. Free museums and cheap eats.' 
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <ActionBar />
      
      <div className="flex justify-between items-end mb-10 mt-8 border-b border-stone-200 pb-4">
        <h2 className="font-display font-black text-3xl text-slate">Community Feed</h2>
        <span className="text-stone-500 font-medium">Discover & fork itineraries</span>
      </div>
      
      <div className="space-y-12">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-col md:flex-row gap-6">
            
            <div className="flex flex-col items-center gap-2 md:w-20 shrink-0">
              <SafeImage src={post.avatar} className="w-16 h-16 rounded-full border-4 border-white shadow-sm object-cover" alt={post.user} />
              <span className="text-xs font-bold text-slate text-center">{post.user}</span>
            </div>
            
            <div className="flex-1 bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-64 relative">
                <SafeImage src={post.img} className="w-full h-full object-cover" alt={post.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-display font-bold text-2xl">{post.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate/80 font-medium leading-relaxed mb-6">{post.desc}</p>
                <div className="flex justify-between items-center border-t border-stone-100 pt-4">
                  <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-stone-500 font-bold hover:text-terracotta transition-colors">
                      <Heart size={20} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-2 text-stone-500 font-bold hover:text-blue-500 transition-colors">
                      <MessageCircle size={20} /> Reply
                    </button>
                  </div>
                  <button className="bg-slate text-white px-5 py-2 rounded-full font-bold shadow-sm hover:bg-slate/90 transition-colors">
                    Fork Itinerary
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
