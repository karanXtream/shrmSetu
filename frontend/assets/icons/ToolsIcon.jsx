import React from 'react';
import { View } from 'react-native';

export default function ToolsIcon({ size = 24, color = '#fff' }) {
  // SVG background in base64
  const svgBackground = `
    <svg width="100%" height="100%" viewBox="0 0 117 113" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; opacity: 0.1;">
      <path d="M131.2 144.2L87.4 100.4L104.2 83.6L148 127.4L131.2 144.2V144.2M20.8 144.2L4 127.4L59.2 72.2L45.6 58.6L40 64.2L29.8 54V70.4L24.2 76L0 51.8L5.6 46.2H22L12 36.2L40.4 7.8C43.0667 5.13333 45.9333 3.2 49 2C52.0667 0.8 55.2 0.2 58.4 0.2C61.6 0.2 64.7333 0.8 67.8 2C70.8667 3.2 73.7333 5.13333 76.4 7.8L58 26.2L68 36.2L62.4 41.8L76 55.4L94 37.4C93.4667 35.9333 93.0333 34.4 92.7 32.8C92.3667 31.2 92.2 29.6 92.2 28C92.2 20.1333 94.9 13.5 100.3 8.1C105.7 2.7 112.333 0 120.2 0C122.2 0 124.1 0.2 125.9 0.6C127.7 1 129.533 1.6 131.4 2.4L111.6 22.2L126 36.6L145.8 16.8C146.733 18.6667 147.367 20.5 147.7 22.3C148.033 24.1 148.2 26 148.2 28C148.2 35.8667 145.5 42.5 140.1 47.9C134.7 53.3 128.067 56 120.2 56C118.6 56 117 55.8667 115.4 55.6C113.8 55.3333 112.267 54.8667 110.8 54.2L20.8 144.2V144.2" fill="white"/>
    </svg>
  `;

  const svgBase64 = `data:image/svg+xml;base64,${Buffer.from(svgBackground).toString('base64')}`;

  return <View />;
}
