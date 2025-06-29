// components/PropertyImageSlider.js
"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PropertyImageSlider({ images, title }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="h-96 w-full"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              <img 
                src={src} 
                alt={`${title} - صورة ${i + 1}`}
                className="object-contain w-full h-full"
                loading={i > 1 ? 'lazy' : 'eager'}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}