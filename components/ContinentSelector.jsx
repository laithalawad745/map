import React from 'react';

// Mock data for demonstration
const continentsData = {
  africa: {
    name: 'أفريقيا',
    totalCountries: 54,
    levels: [1, 2, 3, 4, 5]
  },
  europe: {
    name: 'أوروبا',
    totalCountries: 44,
    levels: [1, 2, 3, 4]
  }
};

export default function ContinentSelector({ onSelectContinent, progressData }) {
  const calculateProgress = (continentId) => {
    if (!progressData || !progressData[continentId]) return 0;
    const completed = progressData[continentId].filter(l => l).length;
    const total = continentsData[continentId].levels.length;
    return Math.round((completed / total) * 100);
  };

  const getStars = (continentId) => {
    if (!progressData || !progressData[continentId]) return 0;
    return progressData[continentId].filter(l => l).length;
  };

  const getTotalStars = (continentId) => {
    return continentsData[continentId].levels.length;
  };

  const continents = [
    { 
      id: 'africa', 
      bgColor: 'bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500',
      hoverShadow: 'hover:shadow-orange-500/50',
      icon: ''
    },
    { 
      id: 'europe', 
      bgColor: 'bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500',
      hoverShadow: 'hover:shadow-blue-500/50',
      icon: ''
    }
  ];

  const allCompleted = progressData?.africa?.every(l => l) && progressData?.europe?.every(l => l);

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-2 border-blue-500/30 rounded-3xl p-6 md:p-12 text-white z-[2000] shadow-2xl" style={{ direction: 'rtl' }}>
      
      {/* العنوان */}
      <div className="text-4xl md:text-5xl lg:text-6xl mb-4 font-bold text-blue-400 text-center">
        رحلة تعلم جغرافيا العالم
      </div>

      <div className="text-base md:text-xl lg:text-2xl mb-10 opacity-90 text-center text-slate-300 font-medium">
        اختر القارة التي تريد استكشافها 
      </div>

      {/* كروت القارات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        {continents.map(continent => {
          const data = continentsData[continent.id];
          const progress = calculateProgress(continent.id);
          const stars = getStars(continent.id);
          const totalStars = getTotalStars(continent.id);

          return (
            <button
              key={continent.id}
              onClick={() => onSelectContinent?.(continent.id)}
              className={`${continent.bgColor} border-0 rounded-3xl p-0 cursor-pointer transition-all duration-500 ease-out shadow-2xl ${continent.hoverShadow} min-h-[220px] md:min-h-[280px] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-3 hover:scale-[1.02] hover:shadow-3xl`}
            >
              {/* تأثير الضوء المتحرك */}
              <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-white/20 via-transparent to-transparent animate-spin-slow pointer-events-none" style={{ animationDuration: '8s' }} />
              
              <div className="p-5 md:p-8 relative z-10">
                {/* الأيقونة */}
                <div className="text-5xl md:text-7xl lg:text-8xl mb-3 drop-shadow-lg animate-float">
                  {continent.icon}
                </div>
                
                {/* اسم القارة */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-xl tracking-wide">
                  {data.name}
                </div>
                
                {/* المعلومات */}
                <div className="text-sm md:text-base lg:text-lg opacity-95 mb-4 bg-black/20 px-5 py-3 rounded-2xl backdrop-blur-sm">
                  {data.totalCountries} دولة • {totalStars} مستويات
                </div>

                {/* النجوم */}
                <div className="flex justify-center gap-2 mb-4 text-2xl md:text-3xl">
                  {[...Array(totalStars)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`transition-all duration-300 ${i < stars ? 'drop-shadow-[0_0_8px_rgba(255,215,0,1)] opacity-100 scale-110' : 'grayscale opacity-30 scale-100'}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>

                {/* شريط التقدم */}
                <div>
                  <div className="text-xs md:text-sm lg:text-base mb-2 font-bold drop-shadow-md">
                    التقدم: {progress}%
                  </div>
                  <div className="w-full h-3.5 bg-black/30 rounded-full overflow-hidden border-2 border-white/20 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-white/90 to-white/70 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      {progress > 0 && (
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-slide" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* شارة الإكمال */}
              {progress === 100 && (
                <div className="absolute top-4 right-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-4xl font-bold shadow-[0_0_30px_rgba(0,255,0,0.8)] animate-pulse-scale border-4 border-white z-20">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* التقدم الإجمالي */}
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-5 md:p-8 border-2 border-slate-600/50 backdrop-blur-sm shadow-inner">
        <div className="text-xl md:text-2xl lg:text-3xl mb-5 font-bold text-amber-400 drop-shadow-lg flex items-center justify-center gap-3">
          التقدم الإجمالي
        </div>
        <div className="grid grid-cols-2 gap-5 text-sm md:text-base lg:text-lg">
          <div className="bg-slate-700/40 p-5 rounded-2xl border border-slate-600/50 transition-all duration-300 hover:bg-slate-700/60 hover:scale-105">
            <div className="opacity-80 mb-2 text-xs md:text-sm lg:text-base">القارات المكتملة</div>
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-400 drop-shadow-[0_0_20px_rgba(77,148,255,0.5)]">
              {(progressData?.africa?.every(l => l) ? 1 : 0) + (progressData?.europe?.every(l => l) ? 1 : 0)} / 2
            </div>
          </div>
          <div className="bg-slate-700/40 p-5 rounded-2xl border border-slate-600/50 transition-all duration-300 hover:bg-slate-700/60 hover:scale-105">
            <div className="opacity-80 mb-2 text-xs md:text-sm lg:text-base">إجمالي النجوم</div>
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
              {getStars('africa') + getStars('europe')} / {getTotalStars('africa') + getTotalStars('europe')}
            </div>
          </div>
        </div>
      </div>

      {/* رسالة تحفيزية */}
      {allCompleted && (
        <div className="mt-6 p-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl text-base md:text-xl lg:text-2xl font-bold shadow-[0_10px_40px_rgba(255,215,0,0.5)] animate-pulse-scale border-4 border-white/50">
           مبروك! أكملت جميع القارات! أنت خبير جغرافيا! 
        </div>
      )}

      <style jsx>{`
        /* إخفاء شريط السكرول */
        div {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slide {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slide {
          animation: slide 2s infinite;
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s infinite;
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}