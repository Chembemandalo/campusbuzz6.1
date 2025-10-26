import React, { useState, useEffect, useCallback } from 'react';
import { HeroSlide } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface HeroSliderProps {
    slides: HeroSlide[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = useCallback(() => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, slides.length]);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };
    
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setTimeout(nextSlide, 7000); // Auto-slide every 7 seconds
        return () => clearTimeout(timer);
    }, [currentIndex, nextSlide, slides.length]);


    if (!slides || slides.length === 0) {
        return (
            <div className="h-[500px] w-full m-auto relative group bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No banner content available.</p>
            </div>
        );
    }

    return (
        <div className="h-[500px] w-full m-auto relative group">
            <div 
                style={{ backgroundImage: `url(${slides[currentIndex].imageUrl})` }} 
                className="w-full h-full bg-center bg-cover duration-500"
            >
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white">
                <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">{slides[currentIndex].category}</p>
                <h2 className="text-4xl md:text-5xl font-extrabold my-2 max-w-3xl">{slides[currentIndex].title}</h2>
                <p className="max-w-2xl text-gray-200">{slides[currentIndex].description}</p>
              </div>
            </div>
            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <ChevronLeftIcon onClick={prevSlide} className="w-8 h-8" />
            </div>
            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <ChevronRightIcon onClick={nextSlide} className="w-8 h-8" />
            </div>
            <div className="absolute bottom-5 right-0 left-0 flex justify-center py-2 space-x-3">
                {slides.map((slide, slideIndex) => (
                    <div 
                        key={slideIndex} 
                        onClick={() => goToSlide(slideIndex)}
                        className={`cursor-pointer h-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'w-8 bg-white' : 'w-3 bg-white/50'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;