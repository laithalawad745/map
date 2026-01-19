'use client'

import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { continentsData } from './continents';
import ContinentSelector from './ContinentSelector';

function CountryHighlight({ country }) {
  const spotlightRef = useRef();
  const targetRef = useRef();
  
  useFrame(() => {
    if (spotlightRef.current && targetRef.current) {
      spotlightRef.current.target = targetRef.current;
    }
  });
  
  const phi = (90 - country.lat) * (Math.PI / 180);
  const theta = (country.lng + 180) * (Math.PI / 180);
  
  const surfaceX = -(2.52 * Math.sin(phi) * Math.cos(theta));
  const surfaceY = 2.52 * Math.cos(phi);
  const surfaceZ = 2.52 * Math.sin(phi) * Math.sin(theta);
  
  const lightX = -(5 * Math.sin(phi) * Math.cos(theta));
  const lightY = 5 * Math.cos(phi);
  const lightZ = 5 * Math.sin(phi) * Math.sin(theta);
  
  return (
    <>
      <object3D position={[surfaceX, surfaceY, surfaceZ]} ref={targetRef} />
      <spotLight
        ref={spotlightRef}
        position={[lightX, lightY, lightZ]}
        angle={0.1}
        penumbra={0.2}
        intensity={15}
        color="#FFD700"
        distance={15}
        castShadow={false}
      />
    </>
  );
}

function Earth({ onCountryClick, markers, borders, learningMode, currentCountry, showHintMarker, autoRotate }) {
  const earthRef = useRef();
  const isDragging = useRef(false);
  const mouseDownPos = useRef({ x: 0, y: 0 });
  
  const earthTexture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
  
  useFrame(() => {
    if (earthRef.current && autoRotate) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  const handlePointerDown = (event) => {
    isDragging.current = false;
    mouseDownPos.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event) => {
    const deltaX = Math.abs(event.clientX - mouseDownPos.current.x);
    const deltaY = Math.abs(event.clientY - mouseDownPos.current.y);
    
    if (deltaX > 5 || deltaY > 5) {
      isDragging.current = true;
    }
  };

  const handleClick = async (event) => {
    event.stopPropagation();
    if (isDragging.current) return;
    
    const uv = event.uv;
    if (!uv) return;
    
    const lng = (uv.x * 360) - 180;
    const lat = (uv.y * 180) - 90;
    
    onCountryClick({ latitude: lat.toFixed(4), longitude: lng.toFixed(4), position: event.point });
  };

  return (
    <group ref={earthRef}>
      <mesh 
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial map={earthTexture} metalness={0.1} roughness={0.8} />
      </mesh>
      
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} color={marker.color} />
      ))}
      
      {borders.map((points, idx) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={idx} geometry={geometry}>
            <lineBasicMaterial color="#ffffff" linewidth={2} transparent opacity={0.7} />
          </line>
        );
      })}
      
      {learningMode && currentCountry && (
        <>
          <CountryHighlight country={currentCountry} />
          {showHintMarker && (
            <Marker 
              position={[
                -(2.5 * Math.sin((90 - currentCountry.lat) * (Math.PI / 180)) * Math.cos((currentCountry.lng + 180) * (Math.PI / 180))),
                2.5 * Math.cos((90 - currentCountry.lat) * (Math.PI / 180)),
                2.5 * Math.sin((90 - currentCountry.lat) * (Math.PI / 180)) * Math.sin((currentCountry.lng + 180) * (Math.PI / 180))
              ]} 
              color="#FFD700" 
            />
          )}
        </>
      )}
    </group>
  );
}

function Marker({ position, color = '#4d94ff' }) {
  const markerRef = useRef();
  
  useFrame((state) => {
    if (markerRef.current) {
      markerRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={markerRef} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.27, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.02, 0.06, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[2.55, 64, 64]} />
      <meshBasicMaterial color="#4d94ff" transparent opacity={0.1} side={THREE.BackSide} />
    </mesh>
  );
}

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshBasicMaterial color="#1a1a1a" wireframe />
    </mesh>
  );
}

export default function EarthGlobe() {
  const [gameState, setGameState] = useState('continent-select');
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [progressData, setProgressData] = useState({
    africa: [false, false, false, false, false],
    europe: [false, false, false, false]
  });
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [borders, setBorders] = useState([]);
  const [shuffledCountries, setShuffledCountries] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [clickedCorrectly, setClickedCorrectly] = useState(false);
  const [showHintMarker, setShowHintMarker] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        const lines = [];
        data.features.forEach(feature => {
          const coords = feature.geometry.coordinates;
          
          const processCoords = (coordArray) => {
            if (coordArray.length === 0) return;
            if (typeof coordArray[0] === 'number') return;
            
            if (typeof coordArray[0][0] === 'number') {
              const points = coordArray.map(([lng, lat]) => {
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                const x = -(2.52 * Math.sin(phi) * Math.cos(theta));
                const y = 2.52 * Math.cos(phi);
                const z = 2.52 * Math.sin(phi) * Math.sin(theta);
                return new THREE.Vector3(x, y, z);
              });
              if (points.length > 1) lines.push(points);
            } else {
              coordArray.forEach(subArray => processCoords(subArray));
            }
          };
          
          if (feature.geometry.type === 'Polygon') {
            processCoords(coords[0]);
          } else if (feature.geometry.type === 'MultiPolygon') {
            coords.forEach(polygon => processCoords(polygon[0]));
          }
        });
        setBorders(lines);
      })
      .catch(err => console.error('Error loading borders:', err));
  }, []);
  
  const handleSelectContinent = (continentId) => {
    setSelectedContinent(continentId);
    setGameState('menu');
  };
  
  const startLearning = (level) => {
    setCurrentLevel(level);
    setShuffledCountries(continentsData[selectedContinent].levels[level - 1]);
    setCurrentCountryIndex(0);
    setMarkers([]);
    setClickedCorrectly(false);
    setShowHintMarker(false);
    setGameState('learning');
  };
  
  const startTest = () => {
    const countries = [...continentsData[selectedContinent].levels[currentLevel - 1]];
    const shuffled = countries.sort(() => Math.random() - 0.5);
    setShuffledCountries(shuffled);
    setCurrentCountryIndex(0);
    setScore(0);
    setMarkers([]);
    setGameState('test');
  };
  
  const startFinalTest = () => {
    const shuffled = [...continentsData[selectedContinent].allCountries].sort(() => Math.random() - 0.5);
    setShuffledCountries(shuffled);
    setCurrentCountryIndex(0);
    setScore(0);
    setMarkers([]);
    setGameState('final-test');
  };
  
  const handleCountryClick = (data) => {
    if (gameState !== 'learning' && gameState !== 'test' && gameState !== 'final-test') return;
    
    const lat = parseFloat(data.latitude);
    const lng = parseFloat(data.longitude);
    const currentCountry = shuffledCountries[currentCountryIndex];
    
    if (gameState === 'learning') {
      const distance = Math.sqrt(Math.pow(lat - currentCountry.lat, 2) + Math.pow(lng - currentCountry.lng, 2));
      
      if (distance < 4) {
        setClickedCorrectly(true);
        setShowHintMarker(true);
        setFeedback({ type: 'correct', message: ' رائع! حفظت موقع ' + currentCountry.name });
        
        setTimeout(() => {
          setFeedback(null);
          setShowHintMarker(false);
          
          if (currentCountryIndex + 1 >= shuffledCountries.length) {
            setGameState('learning-complete');
          } else {
            setCurrentCountryIndex(currentCountryIndex + 1);
            setClickedCorrectly(false);
          }
        }, 2000);
      } else {
        setFeedback({ type: 'wrong', message: ' انقر على الدولة المضاءة من فضلك' });
        setTimeout(() => setFeedback(null), 1500);
      }
      return;
    }
    
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(2.5 * Math.sin(phi) * Math.cos(theta));
    const y = 2.5 * Math.cos(phi);
    const z = 2.5 * Math.sin(phi) * Math.sin(theta);
    const distance = Math.sqrt(Math.pow(lat - currentCountry.lat, 2) + Math.pow(lng - currentCountry.lng, 2));
    
    if (distance < 4) {
      setMarkers([...markers, { position: [x, y, z], color: '#00ff00' }]);
      setScore(score + 1);
      setFeedback({ type: 'correct', message: '✓ صحيح! ' + currentCountry.name });
    } else {
      setMarkers([...markers, { position: [x, y, z], color: '#ff0000' }]);
      setFeedback({ type: 'wrong', message: '✗ خطأ! ' + currentCountry.name });
    }
    
    setTimeout(() => {
      setFeedback(null);
      if (currentCountryIndex + 1 >= shuffledCountries.length) {
        if (gameState === 'test') {
          if (score + (distance < 4 ? 1 : 0) === 11) {
            const newProgress = { ...progressData };
            newProgress[selectedContinent][currentLevel - 1] = true;
            setProgressData(newProgress);
            setGameState('level-complete');
          } else {
            setGameState('test-failed');
          }
        } else if (gameState === 'final-test') {
          setGameState('final-complete');
        }
      } else {
        setCurrentCountryIndex(currentCountryIndex + 1);
      }
    }, 1500);
  };
  
  const backToMenu = () => {
    setGameState('menu');
    setMarkers([]);
    setScore(0);
    setCurrentCountryIndex(0);
    setClickedCorrectly(false);
  };

  const backToContinentSelect = () => {
    setGameState('continent-select');
    setSelectedContinent(null);
    setCurrentLevel(1);
    setMarkers([]);
    setScore(0);
    setCurrentCountryIndex(0);
    setClickedCorrectly(false);
  };

  const currentContinentData = selectedContinent ? continentsData[selectedContinent] : null;
  const currentLevelsCompleted = selectedContinent ? progressData[selectedContinent] : [];

 return (
    <div className="w-screen h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true }}>
        {(gameState === 'menu' || gameState === 'continent-select' || gameState === 'level-complete' || gameState === 'learning-complete' || gameState === 'test-failed' || gameState === 'final-complete') && (
          <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 3, 5]} intensity={2} />
            <pointLight position={[0, 5, 0]} intensity={0.8} />
          </>
        )}
        
        {gameState === 'learning' && (
          <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 3, 5]} intensity={0.5} />
          </>
        )}
        
        {(gameState === 'test' || gameState === 'final-test') && (
          <>
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 3, 5]} intensity={1.5} />
            <directionalLight position={[-5, 3, -5]} intensity={1.5} />
            <pointLight position={[0, 5, 0]} intensity={1} />
            <pointLight position={[0, -5, 0]} intensity={0.8} />
          </>
        )}
        
        <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade />
        
        <Suspense fallback={<Loader />}>
          <Earth 
            onCountryClick={handleCountryClick} 
            markers={markers} 
            borders={borders}
            learningMode={gameState === 'learning'}
            currentCountry={gameState === 'learning' && shuffledCountries[currentCountryIndex]}
            showHintMarker={showHintMarker}
            autoRotate={autoRotate}
          />
        </Suspense>
        
        <Atmosphere />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          minDistance={4}
          maxDistance={15}
        />
      </Canvas>
      
      {gameState === 'continent-select' && (
        <ContinentSelector 
          onSelectContinent={handleSelectContinent}
          progressData={progressData}
        />
      )}
      
      {gameState === 'menu' && currentContinentData && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/95 border-[3px] border-[#4d94ff] rounded-[20px] px-5 py-[30px] text-white font-sans w-[90%] max-w-[600px] text-center z-[2000] rtl max-h-[90vh] overflow-y-auto">
          <div className="text-[clamp(24px,5vw,42px)] mb-2.5 font-bold">
            {currentContinentData.emoji} {currentContinentData.name}
          </div>
          <div className="text-[clamp(14px,3vw,18px)] mb-2.5 opacity-80">
            تعلم مواقع {currentContinentData.totalCountries} دولة
          </div>
          <div className="text-[clamp(12px,2.5vw,16px)] mb-[30px] opacity-70">
            {currentLevelsCompleted.length} مستويات • 11 دولة في كل مستوى
          </div>
          
          <div className="mb-[30px]">
            <div className="text-[clamp(12px,2.5vw,16px)] mb-2.5 opacity-90">التقدم الكلي</div>
            <div className="w-full h-[30px] bg-white/10 rounded-[15px] overflow-hidden border-2 border-[#4d94ff]/30 flex">
              {currentLevelsCompleted.map((completed, i) => (
                <div key={i} className={`${completed ? 'bg-gradient-to-r from-[#00ff00] to-[#00cc00]' : 'bg-white/5'} flex items-center justify-center text-[clamp(12px,2.5vw,14px)] font-bold transition-all duration-500 ${i < currentLevelsCompleted.length - 1 ? 'border-r border-white/20' : ''}`} style={{width: `${100 / currentLevelsCompleted.length}%`}}>
                  {completed ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-5">
            {currentLevelsCompleted.map((completed, i) => (
              <button key={i} 
                onClick={() => startLearning(i + 1)} 
                disabled={i > 0 && !currentLevelsCompleted[i - 1]}
                className={`p-[15px_10px] text-[clamp(14px,3vw,18px)] ${completed ? 'bg-gradient-to-br from-[#00ff00] to-[#00cc00] border-[#00ff00]' : (i > 0 && !currentLevelsCompleted[i - 1]) ? 'bg-gray-500/20 border-gray-500 cursor-not-allowed opacity-50' : 'bg-gradient-to-br from-[#4d94ff] to-[#00d4ff] border-[#4d94ff] cursor-pointer'} border-2 rounded-[10px] text-white transition-all duration-300 font-bold min-h-[80px] flex flex-col items-center justify-center`}>
                <div>{completed ? '✓ ' : ''}المستوى {i + 1}</div>
                <div className="text-[clamp(11px,2.5vw,14px)] mt-[5px] opacity-90">11 دولة</div>
              </button>
            ))}
          </div>
          
          {currentLevelsCompleted.every(l => l) && (
            <button onClick={startFinalTest} className="p-[20px_15px] text-[clamp(16px,4vw,24px)] w-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] border-[3px] border-[#FFD700] rounded-[15px] text-white cursor-pointer font-bold mt-2.5 shadow-[0_4px_20px_rgba(255,215,0,0.4)]">
              الاختبار النهائي الكبير
              <div className="text-[clamp(12px,3vw,16px)] mt-2 opacity-90">
                اختبر نفسك في جميع الـ {currentContinentData.totalCountries} دولة!
              </div>
            </button>
          )}

          <button onClick={backToContinentSelect} className="p-[12px_30px] text-[clamp(14px,3vw,16px)] bg-white/10 border-2 border-white/30 rounded-lg text-white cursor-pointer mt-5 w-full">
            ← العودة لاختيار القارة
          </button>
        </div>
      )}
      
      <button 
        onClick={() => setAutoRotate(!autoRotate)}
        className={`absolute bottom-[30px] right-[30px] z-[1000] p-[10px_15px] text-[clamp(14px,3vw,18px)] ${autoRotate ? 'bg-red-500/90' : 'bg-green-500/90'} border-none rounded-[10px] text-white cursor-pointer font-bold rtl`}
      >
        {autoRotate ? 'إيقاف' : 'تشغيل'}
      </button>
      
      {gameState === 'learning' && (
        <>
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[calc(100%-20px)] max-w-[500px] z-[1000]">
            <div className="bg-black/90 p-[10px_15px] rounded-xl border-2 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)] rtl text-center">
              <div className="text-[13px] mb-2 text-[#FFD700] font-bold">
                 التقدم الكلي - المستوى {currentLevel} من {currentLevelsCompleted.length}
              </div>
              <div className="w-full h-5 bg-white/10 rounded-[10px] overflow-hidden border border-[#FFD700]/30 flex">
                {currentLevelsCompleted.map((completed, i) => (
                  <div key={i} className={`${completed ? 'bg-gradient-to-r from-[#00ff00] to-[#00cc00]' : i === currentLevel - 1 ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]' : 'bg-white/5'} flex items-center justify-center text-xs font-bold transition-all duration-500 ${i < currentLevelsCompleted.length - 1 ? 'border-r border-white/20' : ''}`} style={{width: `${100 / currentLevelsCompleted.length}%`}}>
                    {completed ? '✓' : i === currentLevel - 1 ? `${currentCountryIndex}/${shuffledCountries.length}` : i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 bg-black/90 p-[15px_20px] rounded-[15px] text-white text-sm font-bold z-[1000] rtl text-center w-[calc(100%-20px)] max-w-[400px] border-2 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)] pointer-events-none">
            <div className="text-sm mb-2.5 opacity-90">
              الدولة {currentCountryIndex + 1} من {shuffledCountries.length}
            </div>
            
            <div className="text-[26px] text-[#FFD700] mb-2.5 font-bold">
              {shuffledCountries[currentCountryIndex]?.name}
            </div>
            
            <div className="mt-2.5 p-2.5 bg-[#FFD700]/10 rounded-lg border-r-[3px] border-[#FFD700]">
              <div className="text-xs opacity-80 mb-[5px]">عاصمة الدولة :</div>
              <div className="text-[13px] leading-[1.4]">
                {shuffledCountries[currentCountryIndex]?.fact || 'دولة رائعة ومميزة!'}
              </div>
            </div>
          </div>
          
          {feedback && (
            <div className={`absolute bottom-[80px] left-1/2 -translate-x-1/2 ${feedback.type === 'correct' ? 'bg-[#16d416]/95' : 'bg-orange-500/95'} p-[20px_40px] rounded-[15px] text-white text-[22px] font-bold z-[1000] shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-[calc(100%-40px)] max-w-[400px] text-center`}>
              {feedback.message}
            </div>
          )}
        </>
      )}
      
      {gameState === 'learning-complete' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/95 border-[3px] border-[#FFD700] rounded-[20px] p-[clamp(20px,5vw,50px)] text-white font-sans w-[90%] max-w-[500px] text-center z-[2000] rtl max-h-[90vh] overflow-y-auto">
          <div className="text-[clamp(24px,6vw,32px)] mb-[15px] font-bold">
            أحسنت! أتممت التعلم
          </div>
          <div className="text-[clamp(14px,3.5vw,18px)] mb-[30px] opacity-90 leading-[1.8]">
            تعلمت مواقع 11 دولة في المستوى {currentLevel}!<br/>
            الآن حان وقت الاختبار 
          </div>
          
          <div className="flex flex-col gap-3">
            <button onClick={startTest} className="p-[clamp(15px,4vw,20px)_clamp(20px,5vw,40px)] text-[clamp(16px,4vw,22px)] bg-gradient-to-br from-[#4d94ff] to-[#00d4ff] border-[3px] border-[#4d94ff] rounded-xl text-white cursor-pointer font-bold shadow-[0_4px_15px_rgba(77,148,255,0.3)]">
               تعلمت وأريد الاختبار
            </button>
            
            <button onClick={() => startLearning(currentLevel)} className="p-[clamp(12px,3vw,15px)_clamp(20px,5vw,40px)] text-[clamp(14px,3.5vw,18px)] bg-white/10 border-2 border-white/30 rounded-[10px] text-white cursor-pointer font-bold">
               إعادة التعلم
            </button>
            
            <button onClick={backToMenu} className="p-[clamp(10px,2.5vw,12px)_clamp(15px,4vw,30px)] text-[clamp(13px,3vw,16px)] bg-transparent border-2 border-white/20 rounded-lg text-white cursor-pointer mt-2">
              ← القائمة الرئيسية
            </button>
          </div>
        </div>
      )}
      
      {(gameState === 'test' || gameState === 'final-test') && (
        <>
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[calc(100%-20px)] max-w-[500px] z-[1000]">
            <div className="bg-black/90 p-[15px_20px] rounded-[15px] border-2 border-[#4d94ff] text-white rtl text-center">
              <div className="text-base mb-2.5 font-bold">
                {gameState === 'final-test' ? ' الاختبار النهائي الكبير' : ` اختبار المستوى ${currentLevel}`}
              </div>
              
              <div className="text-lg mb-3">
                النقاط: <span className="text-[#4d94ff] text-2xl font-bold">{score}</span> / {shuffledCountries.length}
              </div>
              
              <div className="w-full h-2.5 bg-white/20 rounded-[10px] overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-[#4d94ff] to-[#00d4ff] transition-all duration-500 rounded-[10px]" style={{width: `${(currentCountryIndex / shuffledCountries.length) * 100}%`}} />
              </div>
              
              <div className="text-xl text-[#4d94ff] font-bold">
                ابحث عن: {shuffledCountries[currentCountryIndex]?.name}
              </div>
              <div className="text-sm opacity-70 mt-[5px]">
                السؤال {currentCountryIndex + 1} من {shuffledCountries.length}
              </div>
            </div>
          </div>
          
          {feedback && (
            <div className={`absolute bottom-[80px] left-1/2 -translate-x-1/2 ${feedback.type === 'correct' ? 'bg-[#16d416]/95' : 'bg-red-500/95'} p-[20px_40px] rounded-[15px] text-white text-[22px] font-bold z-[1000] shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-[calc(100%-40px)] max-w-[400px] text-center`}>
              {feedback.message}
            </div>
          )}
        </>
      )}
      
      {gameState === 'test-failed' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/95 border-[3px] border-[#ff6b6b] rounded-[20px] p-[50px] text-white font-sans w-[90%] max-w-[500px] text-center z-[2000] rtl">
          <div className="text-[32px] mb-5 font-bold text-[#ff6b6b]">
            لم تنجح في الاختبار
          </div>
          <div className="text-2xl mb-[15px]">
            نقاطك: <span className="text-[#4d94ff] text-[32px]">{score}</span> / 11
          </div>
          <div className="text-lg mb-10 opacity-90 leading-[1.8]">
            للانتقال للمستوى التالي يجب الإجابة على جميع الأسئلة بشكل صحيح (11/11)<br/>
            لا تقلق! حاول مرة أخرى 
          </div>
          
          <div className="flex flex-col gap-[15px]">
            <button onClick={startTest} className="p-[20px_40px] text-[22px] bg-gradient-to-br from-[#00ff00] to-[#00cc00] border-none rounded-xl text-white cursor-pointer font-bold">
               إعادة الاختبار
            </button>
            
            <button onClick={() => startLearning(currentLevel)} className="p-[15px_40px] text-lg bg-gradient-to-br from-[#FFD700] to-[#FFA500] border-none rounded-[10px] text-white cursor-pointer font-bold">
               إعادة التعلم أولاً
            </button>
            
            <button onClick={backToMenu} className="p-[12px_30px] text-base bg-white/10 border-2 border-white/30 rounded-lg text-white cursor-pointer mt-2.5">
              ← القائمة الرئيسية
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'level-complete' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/95 text-white font-sans text-center z-[2000] rtl box-border max-h-[90vh] overflow-y-auto" style={{
          border: window.innerWidth < 600 ? '2px solid #00ff00' : '3px solid #00ff00',
          borderRadius: window.innerWidth < 600 ? '12px' : '15px',
          padding: window.innerWidth < 600 ? '15px' : '50px',
          width: window.innerWidth < 600 ? '70%' : 'auto',
          minWidth: window.innerWidth < 600 ? 'auto' : '500px',
          maxWidth: window.innerWidth < 600 ? '70%' : '600px'
        }}>
          <div className="font-bold text-[#00ff00]" style={{fontSize: window.innerWidth < 600 ? '20px' : '36px', marginBottom: window.innerWidth < 600 ? '10px' : '15px'}}>
            نجحت! ممتاز!
          </div>
          <div style={{fontSize: window.innerWidth < 600 ? '16px' : '24px', marginBottom: window.innerWidth < 600 ? '8px' : '10px'}}>
            نقاطك: <span className="text-[#00ff00]" style={{fontSize: window.innerWidth < 600 ? '24px' : '36px'}}>11</span> / 11
          </div>
          <div className="opacity-90" style={{fontSize: window.innerWidth < 600 ? '14px' : '18px', marginBottom: window.innerWidth < 600 ? '15px' : '20px'}}>
            أكملت المستوى {currentLevel} بنجاح! 
          </div>
          
          <div style={{marginBottom: window.innerWidth < 600 ? '18px' : '40px'}}>
            <div className="opacity-90" style={{fontSize: window.innerWidth < 600 ? '13px' : '16px', marginBottom: window.innerWidth < 600 ? '8px' : '10px'}}>التقدم الكلي</div>
            <div className="w-full bg-white/10 overflow-hidden flex" style={{
              height: window.innerWidth < 600 ? '35px' : '30px',
              borderRadius: window.innerWidth < 600 ? '10px' : '15px',
              border: window.innerWidth < 600 ? '1px solid rgba(0, 255, 0, 0.3)' : '2px solid rgba(0, 255, 0, 0.3)'
            }}>
              {currentLevelsCompleted.map((completed, i) => (
                <div key={i} className={`${completed ? 'bg-gradient-to-r from-[#00ff00] to-[#00cc00]' : 'bg-white/5'} flex items-center justify-center font-bold transition-all duration-500 ${i < currentLevelsCompleted.length - 1 ? 'border-r border-white/20' : ''}`} style={{
                  width: `${100 / currentLevelsCompleted.length}%`,
                  fontSize: window.innerWidth < 600 ? '16px' : '16px'
                }}>
                  {completed ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col" style={{gap: window.innerWidth < 600 ? '10px' : '12px'}}>
            {currentLevel < currentLevelsCompleted.length && (
              <button onClick={() => startLearning(currentLevel + 1)} className="bg-gradient-to-br from-[#4d94ff] to-[#00d4ff] border-none text-white cursor-pointer font-bold" style={{
                padding: window.innerWidth < 600 ? '12px 20px' : '20px 40px',
                fontSize: window.innerWidth < 600 ? '16px' : '22px',
                borderRadius: window.innerWidth < 600 ? '10px' : '12px',
                minHeight: window.innerWidth < 600 ? '45px' : '50px'
              }}>
                المستوى التالي ({currentLevel + 1})
              </button>
            )}
            
            {currentLevelsCompleted.every(l => l) && (
              <button onClick={startFinalTest} className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white cursor-pointer font-bold shadow-[0_4px_20px_rgba(255,215,0,0.4)]" style={{
                padding: window.innerWidth < 600 ? '14px 20px' : '25px 40px',
                fontSize: window.innerWidth < 600 ? '17px' : '24px',
                border: window.innerWidth < 600 ? '2px solid #FFD700' : '3px solid #FFD700',
                borderRadius: window.innerWidth < 600 ? '10px' : '15px',
                minHeight: window.innerWidth < 600 ? '48px' : '55px'
              }}>
                🏆 الاختبار النهائي الكبير
              </button>
            )}
            
            <button onClick={backToMenu} className="bg-white/10 text-white cursor-pointer" style={{
              padding: window.innerWidth < 600 ? '10px 18px' : '12px 30px',
              fontSize: window.innerWidth < 600 ? '13px' : '16px',
              border: window.innerWidth < 600 ? '1px solid rgba(255, 255, 255, 0.3)' : '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: window.innerWidth < 600 ? '8px' : '8px',
              marginTop: window.innerWidth < 600 ? '5px' : '10px',
              minHeight: window.innerWidth < 600 ? '40px' : '45px'
            }}>
              ← القائمة الرئيسية
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'final-complete' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/95 border-[3px] border-[gold] rounded-[20px] p-[50px] text-white font-sans w-[90%] max-w-[500px] text-center z-[2000] rtl">
          <div className="text-[64px] mb-5">
            {score >= currentContinentData.totalCountries * 0.9 ? '🏆' : 
             score >= currentContinentData.totalCountries * 0.8 ? '🥇' : 
             score >= currentContinentData.totalCountries * 0.7 ? '🥈' : 
             score >= currentContinentData.totalCountries * 0.6 ? '🥉' : '📚'}
          </div>
          <div className="text-4xl mb-[30px] font-bold">
            {score >= currentContinentData.totalCountries * 0.9 ? 'خبير الجغرافيا!' : 
             score >= currentContinentData.totalCountries * 0.8 ? 'ممتاز جداً!' : 
             score >= currentContinentData.totalCountries * 0.7 ? 'رائع!' : 
             score >= currentContinentData.totalCountries * 0.6 ? 'جيد جداً!' : 'جيد! واصل التعلم!'}
          </div>
          
          <div className="text-[28px] mb-5">
            نقاطك النهائية: <span className="text-[#FFD700] text-[42px]">{score}</span> / {currentContinentData.totalCountries}
          </div>
          
          <div className="p-5 bg-[#FFD700]/10 rounded-[15px] mb-[30px] border-2 border-[#FFD700]/30">
            <div className="text-lg mb-[15px] opacity-90">
              نسبة النجاح: <span className="text-[#FFD700] text-2xl font-bold">
                {Math.round((score / currentContinentData.totalCountries) * 100)}%
              </span>
            </div>
            
            <div className="text-base opacity-80 leading-[1.6]">
              {score >= currentContinentData.totalCountries * 0.9 ? ' أداء استثنائي! أنت خبير حقيقي في جغرافيا ' + currentContinentData.name + '!' :
               score >= currentContinentData.totalCountries * 0.8 ? ' أداء رائع جداً! معرفة قوية بخريطة ' + currentContinentData.name + '!' :
               score >= currentContinentData.totalCountries * 0.7 ? ' أداء جيد! لديك معرفة قوية بـ' + currentContinentData.name + '!' :
               score >= currentContinentData.totalCountries * 0.6 ? ' أداء مقبول! تحتاج لمزيد من التدريب!' :
               ' استمر في التعلم والتدريب لتحسين أدائك!'}
            </div>
          </div>
          
          <div className="flex gap-[15px] justify-center flex-wrap">
            <button onClick={backToMenu} className="p-[18px_35px] text-xl bg-gradient-to-br from-[#4d94ff] to-[#00d4ff] border-none rounded-xl text-white cursor-pointer font-bold">
               القائمة الرئيسية
            </button>
            
            <button onClick={startFinalTest} className="p-[18px_35px] text-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] border-none rounded-xl text-white cursor-pointer font-bold">
               إعادة الاختبار النهائي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}