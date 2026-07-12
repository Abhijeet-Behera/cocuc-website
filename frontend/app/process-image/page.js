'use client';

import { useState, useEffect, useRef } from 'react';

export default function ProcessImagePage() {
  const [scale, setScale] = useState(0.8);
  const [yOffset, setYOffset] = useState(220);
  const [xOffset, setXOffset] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(768);
  const [canvasHeight, setCanvasHeight] = useState(1024);
  const [status, setStatus] = useState('');

  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const drawImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;

    const ctx = canvas.getContext('2d');
    // Clear and fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = imgRef.current;
    
    // Calculate destination dimensions
    // We scale the image relative to the canvas width
    const destWidth = canvas.width * scale;
    const destHeight = (img.height / img.width) * destWidth;

    // Center horizontally plus offset
    const destX = (canvas.width - destWidth) / 2 + xOffset;
    // Vertically position
    const destY = yOffset;

    // Draw the image
    ctx.drawImage(img, destX, destY, destWidth, destHeight);
  };

  useEffect(() => {
    drawImage();
  }, [scale, yOffset, xOffset, canvasWidth, canvasHeight]);

  const handleImageLoad = () => {
    drawImage();
  };

  const handleSave = async () => {
    setStatus('Saving...');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');

    try {
      const response = await fetch('/api/save-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus('Image saved successfully!');
      } else {
        setStatus('Error: ' + data.error);
      }
    } catch (err) {
      setStatus('Failed to save image: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f5f5f7', minHeight: '100vh' }}>
      <h1>Pastoral Image Alignment Tool</h1>
      <p>Use the sliders to adjust the middle image's framing and scale so it matches the other two pastors uniformly.</p>

      {/* Comparison View */}
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '2rem 0' }}>
        {/* Left: Ayub */}
        <div style={{ textAlign: 'center' }}>
          <h3>Rev. Dr. Ayub Chhinchani</h3>
          <div style={{ width: '280px', height: '373px', border: '1px solid #ccc', overflow: 'hidden' }}>
            <img 
              src="/images/pastors-note/ayub-chhinchani.png" 
              alt="Ayub" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
        </div>

        {/* Center: Live Canvas for Songram */}
        <div style={{ textAlign: 'center' }}>
          <h3>Rev. Songram Keshari Singh (Preview)</h3>
          <div style={{ width: '280px', height: '373px', border: '2px solid #0066cc', overflow: 'hidden', backgroundColor: '#fff' }}>
            <canvas 
              ref={canvasRef} 
              width={canvasWidth} 
              height={canvasHeight} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Right: Satish */}
        <div style={{ textAlign: 'center' }}>
          <h3>Rev. Satish Kumar Pani</h3>
          <div style={{ width: '280px', height: '373px', border: '1px solid #ccc', overflow: 'hidden' }}>
            <img 
              src="/images/pastors-note/satish-kumar-pani.png" 
              alt="Satish" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
        </div>
      </div>

      {/* Hidden original image element to read from */}
      <img 
        ref={imgRef}
        src="/images/pastors-note/songram-keshari-singh-backup.png" 
        alt="Original Songram"
        onLoad={handleImageLoad}
        onError={(e) => {
          // If backup doesn't exist, fall back to the main file path
          e.target.src = "/images/pastors-note/songram-keshari-singh.png";
        }}
        style={{ display: 'none' }}
      />

      {/* Controls */}
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Scale (Zoom): {scale.toFixed(2)}
          </label>
          <input 
            type="range" 
            min="0.4" 
            max="1.5" 
            step="0.01" 
            value={scale} 
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Y Offset (Vertical Position): {yOffset}px
          </label>
          <input 
            type="range" 
            min="0" 
            max="500" 
            step="1" 
            value={yOffset} 
            onChange={(e) => setYOffset(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            X Offset (Horizontal Position): {xOffset}px
          </label>
          <input 
            type="range" 
            min="-200" 
            max="200" 
            step="1" 
            value={xOffset} 
            onChange={(e) => setXOffset(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Canvas Width</label>
            <input 
              type="number" 
              value={canvasWidth} 
              onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 768)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Canvas Height</label>
            <input 
              type="number" 
              value={canvasHeight} 
              onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 1024)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '1rem',
            background: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Save Image
        </button>

        {status && (
          <p style={{ marginTop: '1rem', textAlign: 'center', fontWeight: 'bold', color: status.startsWith('Error') || status.startsWith('Failed') ? 'red' : 'green' }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
