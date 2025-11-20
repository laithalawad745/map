// app/page.js
'use client'
import dynamic from 'next/dynamic';

const EarthGlobe = dynamic(() => import('../components/LearningEarth'), {
  ssr: false
});

export default function Home() {
  return <EarthGlobe />;
}