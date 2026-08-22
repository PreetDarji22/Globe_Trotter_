import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt = '', className = '' }) => {
  const [error, setError] = useState(false);
  // Extremely robust fallback travel image
  const fallback = "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80";
  
  return (
    <img 
      src={error ? fallback : (src || fallback)} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  );
};
