'use client';

import React from 'react';

const monsteraImg = '/images/bs.webp';
const succulentImg = '/images/bs2.jpg';
const bonsaiImg = '/images/bs3.jpg';
const snakeImg = '/images/snake.jpg';
const roseImg = '/images/rose.jpg';

interface BodyProps {
  showManualCards?: boolean;
  showHero?:boolean;
  showTitle?:boolean;
}

export default function Body({ showManualCards = true, showHero = true , showTitle = true}: BodyProps) {
  return (
    <div className="bg-[#FCFCFC] min-h-screen font-sans pb-20">
      {/* 1. TOP NAV/TITLE AREA */}
      {showTitle && (
           <header className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex justify-between items-center">
        <h1 className="text-[#66BB6A] text-4xl font-black tracking-tight">
         Dashboard
      </h1>
        </header>
      )}


      <main className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* 2. HERO SECTION - Expanded for Desktop */}
        {showHero && (
          <section className="mb-12">
          <div className="relative bg-[#3DC352] rounded-4xl p-8 md:p-16 overflow-hidden shadow-lg flex items-center min-h-87.5">
            <div className="z-10 relative max-w-lg">
              <h2 className="text-white text-4xl md:text-5xl font-black leading-tight">
                New Arrivals
              </h2>
              <p className="text-white text-lg md:text-xl opacity-90 mt-4 font-medium">
                Explore the latest plants arrived in our garden. 
                Bring fresh energy to your home today.
              </p>
              <button className="mt-8 bg-[#53b959] text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95">
                Shop Now
              </button>
            </div>

            {/* Floating Circle Images - Larger & Better Positioned for Desktop */}
            <div className="hidden lg:block">
              <div className="absolute right-32 top-10 w-48 h-48 rounded-full border-8 border-white/20 overflow-hidden shadow-2xl rotate-12 transition-all hover:rotate-0">
                <img src={monsteraImg} alt="plant" className="w-full h-full object-cover" />
              </div>
              <div className="absolute right-10 top-40 w-40 h-40 rounded-full border-8 border-white/20 overflow-hidden shadow-2xl -rotate-12 transition-all hover:rotate-0">
                <img src={succulentImg} alt="plant" className="w-full h-full object-cover" />
              </div>
              <div className="absolute right-60 bottom-10 w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl transition-all hover:scale-110">
                <img src={bonsaiImg} alt="plant" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>
        )}

        {/* 3. INDOOR SECTION - Responsive Grid */}
        {showManualCards && (
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-3xl font-black text-gray-900">Indoor</h3>
              <div className="h-1.5 w-12 bg-[#3DC352] mt-2 rounded-full"></div>
            </div>
            <button className="text-[#3DC352] font-bold hover:underline">View All</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Snake Plant', price: 'Rs800', img: snakeImg },
              { title: 'Rose', price: 'Rs500', img: roseImg },
              { title: 'Jade Plant', price: 'Rs600', img: succulentImg },
              { title: 'Monstera', price: 'Rs1500', img: monsteraImg },
            ].map((plant, idx) => (
              <PlantCard key={idx} {...plant} category="Indoor" />
            ))}
          </div>
        </section>
        )}

        {/* 4. OUTDOOR SECTION */}
        {showManualCards && (
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-3xl font-black text-gray-900">Outdoor</h3>
              <div className="h-1.5 w-12 bg-[#3DC352] mt-2 rounded-full"></div>
            </div>
            <button className="text-[#3DC352] font-bold hover:underline">View All</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Peace Lily', price: 'Rs1200', img: succulentImg },
              { title: 'Jasmine', price: 'Rs600', img: bonsaiImg },
              { title: 'Lemon Plant', price: 'Rs1200', img: monsteraImg },
              { title: 'Lotus', price: 'Rs1000', img: snakeImg },
            ].map((plant, idx) => (
              <PlantCard key={idx} {...plant} category="Outdoor" />
            ))}
          </div>
        </section>
        )}
      </main>
    </div>
  );
}

// Sub-component to keep code clean
function PlantCard({ title, price, img, category }: any) {
  return (
    <div className="group bg-white rounded-4xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all border border-gray-50 flex flex-col">
      <div className="h-64 w-full rounded-3xl overflow-hidden mb-5">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      <div className="px-2">
        <h4 className="text-xl font-bold text-gray-800 mb-1">{title}</h4>
        <p className="text-sm text-gray-400 font-medium mb-3">{category}</p>
        <div className="flex justify-between items-center">
          <p className="text-[#3DC352] font-black text-xl">{price}</p>
          <button className="bg-gray-100 p-2 rounded-xl group-hover:bg-[#3DC352] group-hover:text-white transition-colors">
            <span className="material-icons text-sm">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}