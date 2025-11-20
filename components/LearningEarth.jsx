'use client'

import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
const europeLevel1 = [
  { name: 'فرنسا', lat: 46, lng: 2, fact: 'باريس' },
  { name: 'ألمانيا', lat: 51, lng: 10, fact: 'برلين' },
  { name: 'إيطاليا', lat: 42, lng: 12, fact: 'روما' },
  { name: 'إسبانيا', lat: 40, lng: -4, fact: 'مدريد' },
  { name: 'بريطانيا', lat: 54, lng: -2, fact: 'لندن' },
  { name: 'بولندا', lat: 52, lng: 19, fact: 'وارسو' },
  { name: 'رومانيا', lat: 46, lng: 25, fact: 'بوخارست' },
  { name: 'هولندا', lat: 52, lng: 5, fact: 'أمستردام' },
  { name: 'بلجيكا', lat: 50, lng: 4, fact: 'بروكسل' },
  { name: 'اليونان', lat: 39, lng: 22, fact: 'أثينا' },
  { name: 'البرتغال', lat: 39, lng: -8, fact: 'لشبونة' }
];

const europeLevel2 = [
  { name: 'التشيك', lat: 49, lng: 15, fact: 'براغ' },
  { name: 'المجر', lat: 47, lng: 19, fact: 'بودابست' },
  { name: 'السويد', lat: 62, lng: 15, fact: 'ستوكهولم' },
  { name: 'النمسا', lat: 47, lng: 13, fact: 'فيينا' },
  { name: 'صربيا', lat: 44, lng: 21, fact: 'بلغراد' },
  { name: 'بلغاريا', lat: 43, lng: 25, fact: 'صوفيا' },
  { name: 'الدنمارك', lat: 56, lng: 10, fact: 'كوبنهاغن' },
  { name: 'فنلندا', lat: 64, lng: 26, fact: 'هلسنكي' },
  { name: 'سلوفاكيا', lat: 48, lng: 19, fact: 'براتيسلافا' },
  { name: 'النرويج', lat: 60, lng: 8, fact: 'أوسلو' },
  { name: 'أيرلندا', lat: 53, lng: -8, fact: 'دبلن' }
];

const europeLevel3 = [
  { name: 'كرواتيا', lat: 45, lng: 16, fact: 'زغرب' },
  { name: 'سويسرا', lat: 47, lng: 8, fact: 'برن' },
  { name: 'ليتوانيا', lat: 56, lng: 24, fact: 'فيلنيوس' },
  { name: 'سلوفينيا', lat: 46, lng: 15, fact: 'ليوبليانا' },
  { name: 'لاتفيا', lat: 57, lng: 25, fact: 'ريغا' },
  { name: 'إستونيا', lat: 59, lng: 26, fact: 'تالين' },
  { name: 'مقدونيا الشمالية', lat: 41, lng: 22, fact: 'سكوبيه' },
  { name: 'ألبانيا', lat: 41, lng: 20, fact: 'تيرانا' },
  { name: 'البوسنة والهرسك', lat: 44, lng: 18, fact: 'سراييفو' },
  { name: 'مولدوفا', lat: 47, lng: 29, fact: 'كيشيناو' },
  { name: 'بيلاروسيا', lat: 53, lng: 28, fact: 'مينسك' }
];

const europeLevel4 = [
  { name: 'أوكرانيا', lat: 49, lng: 32, fact: 'كييف' },
  { name: 'كوسوفو', lat: 42, lng: 21, fact: 'بريشتينا' },
  { name: 'لوكسمبورغ', lat: 49, lng: 6, fact: 'لوكسمبورغ' },
  { name: 'الجبل الأسود', lat: 42, lng: 19, fact: 'بودغوريتسا' },
  { name: 'مالطا', lat: 36, lng: 14, fact: 'فاليتا' },
  { name: 'أيسلندا', lat: 65, lng: -18, fact: 'ريكيافيك' },
  { name: 'أندورا', lat: 42, lng: 1, fact: 'أندورا لا فيلا' },
  { name: 'موناكو', lat: 43, lng: 7, fact: 'موناكو' },
  { name: 'ليختنشتاين', lat: 47, lng: 9, fact: 'فادوز' },
  { name: 'سان مارينو', lat: 43, lng: 12, fact: 'سان مارينو' },
  { name: 'الفاتيكان', lat: 41, lng: 12, fact: 'الفاتيكان' }
];

const europeLevels = [europeLevel1, europeLevel2, europeLevel3, europeLevel4];
const allEuropeCountries = [...europeLevel1, ...europeLevel2, ...europeLevel3, ...europeLevel4];

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
  const [gameState, setGameState] = useState('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelsCompleted, setLevelsCompleted] = useState([false, false, false, false]);
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
  
  const startLearning = (level) => {
    setCurrentLevel(level);
    setShuffledCountries(europeLevels[level - 1]);
    setCurrentCountryIndex(0);
    setMarkers([]);
    setClickedCorrectly(false);
    setShowHintMarker(false);
    setGameState('learning');
  };
  
  const startTest = () => {
    const countries = [...europeLevels[currentLevel - 1]];
    const shuffled = countries.sort(() => Math.random() - 0.5);
    setShuffledCountries(shuffled);
    setCurrentCountryIndex(0);
    setScore(0);
    setMarkers([]);
    setGameState('test');
  };
  
  const startFinalTest = () => {
    const shuffled = [...allEuropeCountries].sort(() => Math.random() - 0.5);
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
            const newCompleted = [...levelsCompleted];
            newCompleted[currentLevel - 1] = true;
            setLevelsCompleted(newCompleted);
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
  
  const resetGame = () => {
    setGameState('menu');
    setCurrentLevel(1);
    setMarkers([]);
    setScore(0);
    setCurrentCountryIndex(0);
    setClickedCorrectly(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true }}>
        {(gameState === 'menu' || gameState === 'level-complete' || gameState === 'learning-complete' || gameState === 'test-failed' || gameState === 'final-complete') && (
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
      
      {gameState === 'menu' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)', border: '3px solid #4d94ff', borderRadius: '20px',
          padding: '50px', color: 'white', fontFamily: 'Arial, sans-serif', minWidth: '600px',
          textAlign: 'center', zIndex: 2000, direction: 'rtl'
        }}>
          <div style={{ fontSize: '42px', marginBottom: '15px', fontWeight: 'bold' }}>رحلة تعلم أوروبا</div>
          <div style={{ fontSize: '18px', marginBottom: '10px', opacity: 0.8 }}>تعلم مواقع 44 دولة أوروبية</div>
          <div style={{ fontSize: '16px', marginBottom: '40px', opacity: 0.7 }}>4 مستويات • 11 دولة في كل مستوى • اختبار نهائي شامل</div>
          
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>التقدم الكلي</div>
            <div style={{ 
              width: '100%', height: '30px', background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px', overflow: 'hidden', border: '2px solid rgba(77, 148, 255, 0.3)',
              display: 'flex'
            }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: '25%', 
                  background: levelsCompleted[i] ? 'linear-gradient(90deg, #00ff00, #00cc00)' : 'rgba(255,255,255,0.05)',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 'bold',
                  transition: 'all 0.5s ease'
                }}>
                  {levelsCompleted[i] ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(level => (
              <button key={level} 
                onClick={() => startLearning(level)} 
                disabled={level > 1 && !levelsCompleted[level - 2]}
                style={{
                  padding: '20px', fontSize: '18px', 
                  background: levelsCompleted[level - 1] ? 'linear-gradient(135deg, #00ff00, #00cc00)' : 
                              (level > 1 && !levelsCompleted[level - 2]) ? 'rgba(100, 100, 100, 0.2)' :
                              'linear-gradient(135deg, #4d94ff, #00d4ff)',
                  border: '2px solid ' + (levelsCompleted[level - 1] ? '#00ff00' : '#4d94ff'),
                  borderRadius: '10px', color: 'white',
                  cursor: (level > 1 && !levelsCompleted[level - 2]) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s', fontWeight: 'bold',
                  opacity: (level > 1 && !levelsCompleted[level - 2]) ? 0.5 : 1
                }}>
                {levelsCompleted[level - 1] ? '✓ ' : ''}المستوى {level}
                <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.9 }}>11 دولة</div>
              </button>
            ))}
          </div>
          
          {levelsCompleted.every(l => l) && (
            <button onClick={startFinalTest} style={{
              padding: '25px', fontSize: '24px', width: '100%',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: '3px solid #FFD700', borderRadius: '15px', color: 'white',
              cursor: 'pointer', fontWeight: 'bold', marginTop: '10px',
              boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)'
            }}>
               الاختبار النهائي الكبير
              <div style={{ fontSize: '16px', marginTop: '8px', opacity: 0.9 }}>اختبر نفسك في جميع الـ 44 دولة!</div>
            </button>
          )}
        </div>
      )}
      
      <button 
        onClick={() => setAutoRotate(!autoRotate)}
        style={{
          position: 'absolute', bottom: '30px', right: '30px', zIndex: 1000,
          padding: '10px 15px', fontSize: '18px', 
          background: autoRotate ? 'rgba(255, 100, 100, 0.9)' : 'rgba(100, 255, 100, 0.9)',
          border: 'none', borderRadius: '10px', color: 'white',
          cursor: 'pointer', fontWeight: 'bold', direction: 'rtl'
        }}
      >
        {autoRotate ? ' إيقاف' : 'تشغيل'}
      </button>
      
      {gameState === 'learning' && (
        <>
          <div style={{
            position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
            width: 'calc(100% - 20px)', maxWidth: '500px', zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.9)', padding: '10px 15px', borderRadius: '12px',
              border: '2px solid #FFD700', boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
              direction: 'rtl', textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', marginBottom: '8px', color: '#FFD700', fontWeight: 'bold' }}>
                 التقدم الكلي - المستوى {currentLevel} من 4
              </div>
              <div style={{ 
                width: '100%', height: '20px', background: 'rgba(255,255,255,0.1)',
                borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255, 215, 0, 0.3)',
                display: 'flex'
              }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: '25%', 
                    background: levelsCompleted[i] ? 'linear-gradient(90deg, #00ff00, #00cc00)' : 
                               i === currentLevel - 1 ? 'linear-gradient(90deg, #FFD700, #FFA500)' : 
                               'rgba(255,255,255,0.05)',
                    borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 'bold',
                    transition: 'all 0.5s ease'
                  }}>
                    {levelsCompleted[i] ? '✓' : i === currentLevel - 1 ? `${currentCountryIndex}/${shuffledCountries.length}` : i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{
            position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.9)', padding: '15px 20px', borderRadius: '15px',
            color: 'white', fontSize: '14px', fontWeight: 'bold', zIndex: 1000,
            direction: 'rtl', textAlign: 'center', width: 'calc(100% - 20px)', maxWidth: '400px',
            border: '2px solid #FFD700', boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
            pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>
              الدولة {currentCountryIndex + 1} من {shuffledCountries.length}
            </div>
            
            <div style={{ fontSize: '26px', color: '#FFD700', marginBottom: '10px', fontWeight: 'bold' }}>
              {shuffledCountries[currentCountryIndex]?.name}
            </div>
            
            <div style={{ 
              marginTop: '10px', padding: '10px', background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '8px', borderRight: '3px solid #FFD700'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>عاصمة الدولة :</div>
              <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                {shuffledCountries[currentCountryIndex]?.fact || 'دولة رائعة ومميزة!'}
              </div>
            </div>
          </div>
          
{feedback && (
            <div style={{
              position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
              background: feedback.type === 'correct' ? 'rgba(22, 212, 22, 0.95)' : 'rgba(255, 165, 0, 0.95)',
              padding: '20px 40px', borderRadius: '15px', color: 'white',
              fontSize: '22px', fontWeight: 'bold', zIndex: 1000,
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              width: 'calc(100% - 40px)', maxWidth: '400px', textAlign: 'center'
            }}>
              {feedback.message}
            </div>
          )}
        </>
      )}
      
      {gameState === 'learning-complete' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)', border: '3px solid #FFD700', borderRadius: '20px',
          padding: '50px', color: 'white', fontFamily: 'Arial, sans-serif', minWidth: '500px',
          textAlign: 'center', zIndex: 2000, direction: 'rtl'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 'bold' }}>
            أحسنت! أتممت التعلم
          </div>
          <div style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.9, lineHeight: '1.8' }}>
            تعلمت مواقع 11 دولة في المستوى {currentLevel}!<br/>
            الآن حان وقت الاختبار 
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={startTest} style={{
              padding: '20px 40px', fontSize: '22px',
              background: 'linear-gradient(135deg, #4d94ff, #00d4ff)',
              border: '3px solid #4d94ff', borderRadius: '12px', color: 'white',
              cursor: 'pointer', fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(77, 148, 255, 0.3)'
            }}>
               تعلمت وأريد الاختبار
            </button>
            
            <button onClick={() => startLearning(currentLevel)} style={{
              padding: '15px 40px', fontSize: '18px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px', color: 'white',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
               إعادة التعلم
            </button>
            
            <button onClick={resetGame} style={{
              padding: '12px 30px', fontSize: '16px',
              background: 'transparent',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px', color: 'white',
              cursor: 'pointer', marginTop: '10px'
            }}>
              ← القائمة الرئيسية
            </button>
          </div>
        </div>
      )}
      
      {(gameState === 'test' || gameState === 'final-test') && (
        <>
          <div style={{
            position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
            width: 'calc(100% - 20px)', maxWidth: '500px', zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(0,0,0,0.9)', padding: '15px 20px', borderRadius: '15px',
              border: '2px solid #4d94ff', color: 'white', direction: 'rtl', textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', marginBottom: '10px', fontWeight: 'bold' }}>
                {gameState === 'final-test' ? ' الاختبار النهائي الكبير' : ` اختبار المستوى ${currentLevel}`}
              </div>
              
              <div style={{ fontSize: '18px', marginBottom: '12px' }}>
                النقاط: <span style={{ color: '#4d94ff', fontSize: '24px', fontWeight: 'bold' }}>{score}</span> / {shuffledCountries.length}
              </div>
              
              <div style={{
                width: '100%', height: '10px', background: 'rgba(255,255,255,0.2)',
                borderRadius: '10px', overflow: 'hidden', marginBottom: '12px'
              }}>
                <div style={{
                  width: `${(currentCountryIndex / shuffledCountries.length) * 100}%`,
                  height: '100%', background: 'linear-gradient(90deg, #4d94ff, #00d4ff)',
                  transition: 'width 0.5s ease', borderRadius: '10px'
                }} />
              </div>
              
              <div style={{ fontSize: '20px', color: '#4d94ff', fontWeight: 'bold' }}>
                ابحث عن: {shuffledCountries[currentCountryIndex]?.name}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '5px' }}>
                السؤال {currentCountryIndex + 1} من {shuffledCountries.length}
              </div>
            </div>
          </div>
          
          {feedback && (
            <div style={{
              position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
              background: feedback.type === 'correct' ? 'rgba(22, 212, 22, 0.95)' : 'rgba(255, 0, 0, 0.95)',
              padding: '20px 40px', borderRadius: '15px', color: 'white',
              fontSize: '22px', fontWeight: 'bold', zIndex: 1000,
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              width: 'calc(100% - 40px)', maxWidth: '400px', textAlign: 'center'
            }}>
              {feedback.message}
            </div>
          )}
        </>
      )}
      
      {gameState === 'test-failed' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)', border: '3px solid #ff6b6b', borderRadius: '20px',
          padding: '50px', color: 'white', fontFamily: 'Arial, sans-serif', minWidth: '500px',
          textAlign: 'center', zIndex: 2000, direction: 'rtl'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 'bold', color: '#ff6b6b' }}>
            لم تنجح في الاختبار
          </div>
          <div style={{ fontSize: '24px', marginBottom: '15px' }}>
            نقاطك: <span style={{ color: '#4d94ff', fontSize: '32px' }}>{score}</span> / 11
          </div>
          <div style={{ fontSize: '18px', marginBottom: '40px', opacity: 0.9, lineHeight: '1.8' }}>
            للانتقال للمستوى التالي يجب الإجابة على جميع الأسئلة بشكل صحيح (11/11)<br/>
            لا تقلق! حاول مرة أخرى 
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={startTest} style={{
              padding: '20px 40px', fontSize: '22px',
              background: 'linear-gradient(135deg, #00ff00, #00cc00)',
              border: 'none', borderRadius: '12px', color: 'white',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
               إعادة الاختبار
            </button>
            
            <button onClick={() => startLearning(currentLevel)} style={{
              padding: '15px 40px', fontSize: '18px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none', borderRadius: '10px', color: 'white',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
               إعادة التعلم أولاً
            </button>
            
            <button onClick={resetGame} style={{
              padding: '12px 30px', fontSize: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px', color: 'white',
              cursor: 'pointer', marginTop: '10px'
            }}>
              ← القائمة الرئيسية
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'level-complete' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)', border: '3px solid #00ff00', borderRadius: '20px',
          padding: '50px', color: 'white', fontFamily: 'Arial, sans-serif', minWidth: '500px',
          textAlign: 'center', zIndex: 2000, direction: 'rtl'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}></div>
          <div style={{ fontSize: '36px', marginBottom: '20px', fontWeight: 'bold', color: '#00ff00' }}>
            نجحت! ممتاز!
          </div>
          <div style={{ fontSize: '24px', marginBottom: '15px' }}>
            نقاطك: <span style={{ color: '#00ff00', fontSize: '36px' }}>11</span> / 11
          </div>
          <div style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>
            أكملت المستوى {currentLevel} بنجاح! 
          </div>
          
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '16px', marginBottom: '10px', opacity: 0.9 }}>التقدم الكلي</div>
            <div style={{ 
              width: '100%', height: '30px', background: 'rgba(255,255,255,0.1)',
              borderRadius: '15px', overflow: 'hidden', border: '2px solid rgba(0, 255, 0, 0.3)',
              display: 'flex'
            }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: '25%', 
                  background: levelsCompleted[i] ? 'linear-gradient(90deg, #00ff00, #00cc00)' : 'rgba(255,255,255,0.05)',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: 'bold',
                  transition: 'all 0.5s ease'
                }}>
                  {levelsCompleted[i] ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {currentLevel < 4 && (
              <button onClick={() => startLearning(currentLevel + 1)} style={{
                padding: '20px 40px', fontSize: '22px',
                background: 'linear-gradient(135deg, #4d94ff, #00d4ff)',
                border: 'none', borderRadius: '12px', color: 'white',
                cursor: 'pointer', fontWeight: 'bold'
              }}>
                المستوى التالي ({currentLevel + 1})
              </button>
            )}
            
            {levelsCompleted.every(l => l) && (
              <button onClick={startFinalTest} style={{
                padding: '25px 40px', fontSize: '24px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: '3px solid #FFD700', borderRadius: '15px', color: 'white',
                cursor: 'pointer', fontWeight: 'bold',
                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)'
              }}>
                الاختبار النهائي الكبير
              </button>
            )}
            
            <button onClick={resetGame} style={{
              padding: '12px 30px', fontSize: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px', color: 'white',
              cursor: 'pointer', marginTop: '10px'
            }}>
              ← القائمة الرئيسية
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'final-complete' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.95)', border: '3px solid gold',
          borderRadius: '20px', padding: '50px', color: 'white',
          fontFamily: 'Arial, sans-serif', minWidth: '500px',
          textAlign: 'center', zIndex: 2000, direction: 'rtl'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>
            {score >= 40 ? '' : score >= 35 ? '' : score >= 30 ? '' : score >= 25 ? '' : ''}
            {/* {score >= 40 ? '🏆' : score >= 35 ? '🥇' : score >= 30 ? '🥈' : score >= 25 ? '🥉' : '📚'} */}
          </div>
          <div style={{ fontSize: '36px', marginBottom: '30px', fontWeight: 'bold' }}>
            {score >= 40 ? 'خبير الجغرافيا!' : score >= 35 ? 'ممتاز جداً!' : score >= 30 ? 'رائع!' : score >= 25 ? 'جيد جداً!' : 'جيد! واصل التعلم!'}
          </div>
          
          <div style={{ fontSize: '28px', marginBottom: '20px' }}>
            نقاطك النهائية: <span style={{ color: '#FFD700', fontSize: '42px' }}>{score}</span> / 44
          </div>
          
          <div style={{ 
            padding: '20px', background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '15px', marginBottom: '30px',
            border: '2px solid rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '15px', opacity: 0.9 }}>
              نسبة النجاح: <span style={{ color: '#FFD700', fontSize: '24px', fontWeight: 'bold' }}>
                {Math.round((score / 44) * 100)}%
              </span>
            </div>
            
            <div style={{ fontSize: '16px', opacity: 0.8, lineHeight: '1.6' }}>
              {score >= 40 ? ' أداء استثنائي! أنت خبير حقيقي في جغرافيا أوروبا!' :
               score >= 35 ? ' أداء رائع جداً! معرفة قوية بخريطة أوروبا!' :
               score >= 30 ? ' أداء جيد! لديك معرفة قوية بأوروبا!' :
               score >= 25 ? ' أداء مقبول! تحتاج لمزيد من التدريب!' :
               ' استمر في التعلم والتدريب لتحسين أدائك!'}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={resetGame} style={{
              padding: '18px 35px', fontSize: '20px',
              background: 'linear-gradient(135deg, #4d94ff, #00d4ff)',
              border: 'none', borderRadius: '12px', color: 'white',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
               القائمة الرئيسية
            </button>
            
            <button onClick={startFinalTest} style={{
              padding: '18px 35px', fontSize: '20px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              border: 'none', borderRadius: '12px', color: 'white',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
               إعادة الاختبار النهائي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}