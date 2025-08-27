'use client'
import React from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '@/assets/loader.json';

interface LoaderProps {
  minHeight?: string;
  delay? : number;
}

const Loader: React.FC<LoaderProps> = ({ minHeight = "100vh" }) => (
  <div className="flex items-center justify-center" style={{ minHeight }}>
    <Lottie
      animationData={loaderAnimation}
      loop
      autoplay
      className="w-64 h-64 md:w-96 md:h-96"
    />
  </div>
);

export default Loader;
