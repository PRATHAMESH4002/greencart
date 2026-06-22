import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets.js'
import { Link } from 'react-router-dom'

const MainBanner = () => {

  // ✅ Keep main image + add hero1, hero2, hero3
  const bannerImages = [
    assets.main_banner_bg,
    assets.hero1,
    assets.hero2,
    assets.hero3,
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative mt-10 overflow-hidden h-[500px]'>

      {/* Background Slider */}
      {bannerImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="banner"
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20'></div>

      {/* Content (unchanged design) */}
      <div className='absolute inset-0 flex flex-col items-center md:items-start
      justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'>

        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left
        max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15 gradient-text'>
          Freshness You Can Trust, Savings You Will Love !
        </h1>

        <div className='flex items-center mt-8 font-medium gap-4'>
          <Link to={'/products'} className='group flex items-center gap-2 px-8 md:px-10 py-4 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded-xl cursor-pointer shadow-lg hover:shadow-xl'>
            Shop Now
          </Link>

          <Link to={'/products'} className='group hidden md:flex items-center gap-2 px-10 py-4 glass-effect text-gray-800 rounded-xl cursor-pointer hover:bg-white/30 transition-all duration-300'>
            Explore deals
          </Link>
        </div>
      </div>

      {/* Floating elements (unchanged) */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-primary/30 rounded-full animate-bounce"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-secondary/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-accent/50 rounded-full animate-ping"></div>

    </div>
  )
}

export default MainBanner
