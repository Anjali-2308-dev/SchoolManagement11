
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Animated Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      <div className="absolute top-1/2 right-1/2 w-96 h-96 bg-cyan-200/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-6000" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-float animation-delay-1000" />
      <div className="absolute bottom-32 left-20 w-5 h-5 bg-pink-400 rounded-full animate-float animation-delay-2000" />
      <div className="absolute bottom-20 right-32 w-2 h-2 bg-cyan-400 rounded-full animate-float animation-delay-3000" />
    </div>
  );
};

export default AnimatedBackground;
