import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as Tone from 'tone';

// Circular Knob Component
const CircularKnob = ({
  min = 0,
  max = 100,
  initialValue = 50,
  size = 120,
  knobColor = '#2a2a2a',
  indicatorColor = '#ffffff',
  backgroundColor = '#1a1a1a',
  tickColor = '#666',
  valueColor = '#888',
  minAngle = -135,
  maxAngle = 135,
  showTicks = true,
  showMinMax = true,
  showValue = true,
  label = '',
  onChange = () => {},
}) => {
  const knobRef = useRef(null);
  const valueRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startValueRef = useRef(initialValue);
  const currentValueRef = useRef(initialValue);
  const lastUpdateTimeRef = useRef(0);
  const [internalValue, setInternalValue] = useState(initialValue);

  const valueToAngle = useCallback((value) => {
    const normalized = (value - min) / (max - min);
    return minAngle + normalized * (maxAngle - minAngle);
  }, [min, max, minAngle, maxAngle]);

  const updateKnobRotation = useCallback((value) => {
    if (knobRef.current) {
      const angle = valueToAngle(value);
      knobRef.current.style.transform = `rotate(${angle}deg)`;
    }
  }, [valueToAngle]);

  const updateValueDisplay = useCallback((value) => {
    if (valueRef.current && showValue) {
      valueRef.current.textContent = Math.round(value);
    }
  }, [showValue]);

  const handleValueChange = useCallback((clientY) => {
    const deltaY = startYRef.current - clientY;
    const sensitivity = (max - min) / 200;
    const newValue = Math.max(min, Math.min(max, startValueRef.current + deltaY * sensitivity));
    
    currentValueRef.current = newValue;
    updateKnobRotation(newValue);
    updateValueDisplay(newValue);
    
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > 33) {
      lastUpdateTimeRef.current = now;
      setInternalValue(newValue);
      onChange(newValue);
    }
  }, [min, max, updateKnobRotation, updateValueDisplay, onChange]);

  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startValueRef.current = currentValueRef.current;
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isDraggingRef.current) {
      handleValueChange(e.clientY);
    }
  }, [handleValueChange]);

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setInternalValue(currentValueRef.current);
      onChange(currentValueRef.current);
    }
  }, [onChange]);

  const handleTouchStart = useCallback((e) => {
    isDraggingRef.current = true;
    startYRef.current = e.touches[0].clientY;
    startValueRef.current = currentValueRef.current;
    e.preventDefault();
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (isDraggingRef.current) {
      handleValueChange(e.touches[0].clientY);
    }
  }, [handleValueChange]);

  const handleTouchEnd = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setInternalValue(currentValueRef.current);
      onChange(currentValueRef.current);
    }
  }, [onChange]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    updateKnobRotation(initialValue);
    updateValueDisplay(initialValue);
  }, []);

  const renderTicks = () => {
    if (!showTicks) return null;
    
    const ticks = [];
    const tickCount = 11;
    
    for (let i = 0; i < tickCount; i++) {
      const angle = minAngle + (i / (tickCount - 1)) * (maxAngle - minAngle);
      const radian = (angle * Math.PI) / 180;
      const isMainTick = i === 0 || i === tickCount - 1 || i === Math.floor(tickCount / 2);
      const tickLength = isMainTick ? 8 : 5;
      const tickWidth = isMainTick ? 2 : 1;
      
      const x1 = size / 2 + (size / 2 - 15) * Math.cos(radian);
      const y1 = size / 2 + (size / 2 - 15) * Math.sin(radian);
      const x2 = size / 2 + (size / 2 - 15 - tickLength) * Math.cos(radian);
      const y2 = size / 2 + (size / 2 - 15 - tickLength) * Math.sin(radian);
      
      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={tickColor}
          strokeWidth={tickWidth}
        />
      );
    }
    
    return ticks;
  };

  return (
    <div className="flex flex-col items-center">
      {label && (
        <div className="text-xs font-mono mb-2" style={{ color: valueColor }}>
          {label}
        </div>
      )}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill={backgroundColor}
            stroke={tickColor}
            strokeWidth="1"
          />
          {renderTicks()}
        </svg>
        
        <div
          ref={knobRef}
          className="absolute inset-0 cursor-pointer"
          style={{
            width: size * 0.7,
            height: size * 0.7,
            top: '50%',
            left: '50%',
            marginLeft: -size * 0.35,
            marginTop: -size * 0.35,
            borderRadius: '50%',
            backgroundColor: knobColor,
            boxShadow: `
              inset 0 2px 4px rgba(0,0,0,0.5),
              0 2px 8px rgba(0,0,0,0.3),
              0 0 0 1px rgba(255,255,255,0.1)
            `,
            transition: 'none',
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div
            style={{
              position: 'absolute',
              width: '3px',
              height: '40%',
              backgroundColor: indicatorColor,
              left: '50%',
              top: '8px',
              marginLeft: '-1.5px',
              borderRadius: '1.5px',
              boxShadow: '0 0 4px rgba(255,255,255,0.5)',
            }}
          />
        </div>
        
        {showMinMax && (
          <>
            <div
              className="absolute text-xs font-mono"
              style={{
                color: valueColor,
                left: '10px',
                bottom: '5px',
              }}
            >
              {min}
            </div>
            <div
              className="absolute text-xs font-mono"
              style={{
                color: valueColor,
                right: '10px',
                bottom: '5px',
              }}
            >
              {max}
            </div>
          </>
        )}
      </div>
      
      {showValue && (
        <div
          ref={valueRef}
          className="mt-2 text-lg font-mono"
          style={{ color: valueColor }}
        >
          {Math.round(initialValue)}
        </div>
      )}
    </div>
  );
};

// Slider Component
const Slider = ({
  min = 0,
  max = 100,
  initialValue = 50,
  orientation = 'horizontal',
  length = 200,
  thickness = 40,
  sliderColor = '#333',
  handleColor = '#666',
  trackColor = '#222',
  tickColor = '#555',
  valueColor = '#999',
  showTicks = true,
  showValue = true,
  label = '',
  onChange = () => {},
}) => {
  const sliderRef = useRef(null);
  const handleRef = useRef(null);
  const valueRef = useRef(null);
  const isDraggingRef = useRef(false);
  const currentValueRef = useRef(initialValue);
  const lastUpdateTimeRef = useRef(0);
  const [internalValue, setInternalValue] = useState(initialValue);

  const valueToPosition = useCallback((value) => {
    const normalized = (value - min) / (max - min);
    return normalized * (length - thickness);
  }, [min, max, length, thickness]);

  const positionToValue = useCallback((position) => {
    const normalized = Math.max(0, Math.min(1, position / (length - thickness)));
    return min + normalized * (max - min);
  }, [min, max, length, thickness]);

  const updateHandlePosition = useCallback((value) => {
    if (handleRef.current) {
      const position = valueToPosition(value);
      if (orientation === 'horizontal') {
        handleRef.current.style.transform = `translateX(${position}px)`;
      } else {
        handleRef.current.style.transform = `translateY(${length - thickness - position}px)`;
      }
    }
  }, [valueToPosition, orientation, length, thickness]);

  const updateValueDisplay = useCallback((value) => {
    if (valueRef.current && showValue) {
      valueRef.current.textContent = typeof value === 'number' ? value.toFixed(2) : value;
    }
  }, [showValue]);

  const handleValueChange = useCallback((clientPos) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    let position;
    
    if (orientation === 'horizontal') {
      position = clientPos - rect.left - thickness / 2;
    } else {
      position = length - (clientPos - rect.top - thickness / 2);
    }
    
    const newValue = positionToValue(position);
    const clampedValue = Math.max(min, Math.min(max, newValue));
    
    currentValueRef.current = clampedValue;
    updateHandlePosition(clampedValue);
    updateValueDisplay(clampedValue);
    
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > 33) {
      lastUpdateTimeRef.current = now;
      setInternalValue(clampedValue);
      onChange(clampedValue);
    }
  }, [min, max, orientation, thickness, length, positionToValue, updateHandlePosition, updateValueDisplay, onChange]);

  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    handleValueChange(orientation === 'horizontal' ? e.clientX : e.clientY);
    e.preventDefault();
  }, [handleValueChange, orientation]);

  const handleMouseMove = useCallback((e) => {
    if (isDraggingRef.current) {
      handleValueChange(orientation === 'horizontal' ? e.clientX : e.clientY);
    }
  }, [handleValueChange, orientation]);

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setInternalValue(currentValueRef.current);
      onChange(currentValueRef.current);
    }
  }, [onChange]);

  const handleTouchStart = useCallback((e) => {
    isDraggingRef.current = true;
    const touch = e.touches[0];
    handleValueChange(orientation === 'horizontal' ? touch.clientX : touch.clientY);
    e.preventDefault();
  }, [handleValueChange, orientation]);

  const handleTouchMove = useCallback((e) => {
    if (isDraggingRef.current) {
      const touch = e.touches[0];
      handleValueChange(orientation === 'horizontal' ? touch.clientX : touch.clientY);
    }
  }, [handleValueChange, orientation]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  useEffect(() => {
    updateHandlePosition(initialValue);
    updateValueDisplay(initialValue);
  }, []);

  const renderTicks = () => {
    if (!showTicks) return null;
    
    const ticks = [];
    const tickCount = 5;
    
    for (let i = 0; i < tickCount; i++) {
      const position = (i / (tickCount - 1)) * length;
      const isMainTick = i === 0 || i === tickCount - 1;
      const tickLength = isMainTick ? 8 : 5;
      
      if (orientation === 'horizontal') {
        ticks.push(
          <line
            key={i}
            x1={position}
            y1={thickness + 5}
            x2={position}
            y2={thickness + 5 + tickLength}
            stroke={tickColor}
            strokeWidth={isMainTick ? 2 : 1}
          />
        );
      } else {
        ticks.push(
          <line
            key={i}
            x1={thickness + 5}
            y1={position}
            x2={thickness + 5 + tickLength}
            y2={position}
            stroke={tickColor}
            strokeWidth={isMainTick ? 2 : 1}
          />
        );
      }
    }
    
    return ticks;
  };

  const width = orientation === 'horizontal' ? length : thickness;
  const height = orientation === 'horizontal' ? thickness : length;

  return (
    <div className="flex flex-col items-center">
      {label && (
        <div className="text-xs font-mono mb-2" style={{ color: valueColor }}>
          {label}
        </div>
      )}
      <div
        ref={sliderRef}
        className="relative cursor-pointer"
        style={{ width, height }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className="absolute"
          style={{
            width: orientation === 'horizontal' ? '100%' : thickness,
            height: orientation === 'horizontal' ? thickness : '100%',
            backgroundColor: trackColor,
            borderRadius: '4px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
          }}
        />
        
        <div
          ref={handleRef}
          className="absolute"
          style={{
            width: thickness,
            height: thickness,
            backgroundColor: handleColor,
            borderRadius: '4px',
            boxShadow: `
              inset 0 1px 2px rgba(255,255,255,0.3),
              0 2px 4px rgba(0,0,0,0.5),
              0 0 0 1px rgba(255,255,255,0.1)
            `,
            transition: 'none',
          }}
        />
        
        <svg
          width={width}
          height={height + 20}
          className="absolute"
          style={{ top: orientation === 'horizontal' ? 0 : -10, pointerEvents: 'none' }}
        >
          {renderTicks()}
        </svg>
      </div>
      
      {showValue && (
        <div
          ref={valueRef}
          className="mt-2 text-lg font-mono"
          style={{ color: valueColor }}
        >
          {typeof initialValue === 'number' ? initialValue.toFixed(2) : initialValue}
        </div>
      )}
    </div>
  );
};

// Toggle Button Component
const ToggleButton = ({
  size = 60,
  label = '',
  onColor = '#ff4444',
  offColor = '#444',
  labelColor = '#ddd',
  initialState = false,
  onChange = () => {},
}) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleClick = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange(newState);
  };

  return (
    <button
      className="relative cursor-pointer focus:outline-none"
      style={{
        width: size,
        height: size,
        backgroundColor: isOn ? onColor : offColor,
        borderRadius: '8px',
        border: '2px solid #222',
        boxShadow: isOn
          ? `inset 0 2px 4px rgba(0,0,0,0.3), 0 0 20px ${onColor}66`
          : 'inset 0 2px 4px rgba(0,0,0,0.5)',
        transition: 'all 0.2s ease',
      }}
      onClick={handleClick}
    >
      {label && (
        <div
          className="absolute inset-0 flex items-center justify-center text-xs font-bold"
          style={{ color: labelColor }}
        >
          {label}
        </div>
      )}
      <div
        className="absolute top-1 left-1 right-1"
        style={{
          height: '30%',
          background: isOn
            ? 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
          borderRadius: '4px',
        }}
      />
    </button>
  );
};

// Note Button Component
const NoteButton = ({
  note,
  size = 50,
  activeColor = '#4a9eff',
  inactiveColor = '#333',
  labelColor = '#ddd',
  isPressed = false,
  onNoteOn = () => {},
  onNoteOff = () => {},
}) => {
  const [isMouseActive, setIsMouseActive] = useState(false);
  const isActive = isMouseActive || isPressed;

  const handleMouseDown = () => {
    setIsMouseActive(true);
    onNoteOn(note);
  };

  const handleMouseUp = () => {
    setIsMouseActive(false);
    onNoteOff(note);
  };

  const handleMouseLeave = () => {
    if (isMouseActive) {
      setIsMouseActive(false);
      onNoteOff(note);
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsMouseActive(true);
    onNoteOn(note);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsMouseActive(false);
    onNoteOff(note);
  };

  return (
    <button
      className="relative cursor-pointer focus:outline-none select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: isActive ? activeColor : inactiveColor,
        borderRadius: '50%',
        border: '3px solid #222',
        boxShadow: isActive
          ? `inset 0 4px 8px rgba(0,0,0,0.5), 0 0 20px ${activeColor}66`
          : `inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)`,
        transform: isActive ? 'translateY(2px)' : 'translateY(0)',
        transition: 'all 0.1s ease',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
        style={{ color: labelColor }}
      >
        {note}
      </div>
      <div
        className="absolute top-2 left-2 right-2"
        style={{
          height: '30%',
          background: isActive
            ? 'none'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
          borderRadius: '50%',
        }}
      />
    </button>
  );
};

// Waveform Selector Component
const WaveformSelector = ({
  options = ['sine', 'triangle', 'sawtooth', 'square'],
  initialValue = 'sine',
  onChange = () => {},
}) => {
  const [selected, setSelected] = useState(initialValue);

  const handleSelect = (option) => {
    setSelected(option);
    onChange(option);
  };

  const getWaveformPath = (type) => {
    switch (type) {
      case 'sine':
        return 'M 0,15 Q 7.5,5 15,15 T 30,15';
      case 'triangle':
        return 'M 0,25 L 7.5,5 L 22.5,5 L 30,25';
      case 'sawtooth':
        return 'M 0,25 L 20,5 L 20,25 M 20,5 L 30,25';
      case 'square':
        return 'M 0,25 L 0,5 L 15,5 L 15,25 L 30,25';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-mono mb-2 text-gray-400">Waveform</div>
      <div className="flex space-x-2">
        {options.map((option) => (
          <button
            key={option}
            className="relative focus:outline-none"
            style={{
              width: 50,
              height: 40,
              backgroundColor: selected === option ? '#4a9eff' : '#333',
              borderRadius: '4px',
              border: '2px solid #222',
              boxShadow: selected === option
                ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 0 10px #4a9eff66'
                : 'inset 0 2px 4px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => handleSelect(option)}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              className="absolute inset-0 m-auto"
              style={{ pointerEvents: 'none' }}
            >
              <path
                d={getWaveformPath(option)}
                fill="none"
                stroke={selected === option ? '#fff' : '#999'}
                strokeWidth="2"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

// ADSR Visualizer Component
const ADSRVisualizer = ({ attack, decay, sustain, release }) => {
  const width = 200;
  const height = 100;
  const padding = 10;
  
  const totalTime = attack + decay + release + 0.5;
  const timeScale = (width - 2 * padding) / totalTime;
  
  const attackX = padding + attack * timeScale;
  const decayX = attackX + decay * timeScale;
  const releaseStartX = decayX + 0.5 * timeScale;
  const releaseEndX = releaseStartX + release * timeScale;
  
  const sustainY = padding + (1 - sustain) * (height - 2 * padding);
  
  const pathData = `
    M ${padding},${height - padding}
    L ${attackX},${padding}
    L ${decayX},${sustainY}
    L ${releaseStartX},${sustainY}
    L ${releaseEndX},${height - padding}
  `;

  return (
    <div className="bg-black p-4 rounded">
      <div className="text-xs font-mono text-gray-400 mb-2">ADSR Shape</div>
      <svg width={width} height={height} className="bg-black rounded">
        <path
          d={pathData}
          fill="none"
          stroke="#4a9eff"
          strokeWidth="2"
        />
        <circle cx={attackX} cy={padding} r="3" fill="#4a9eff" />
        <circle cx={decayX} cy={sustainY} r="3" fill="#4a9eff" />
        <circle cx={releaseStartX} cy={sustainY} r="3" fill="#4a9eff" />
      </svg>
    </div>
  );
};

// Oscilloscope Component
const Oscilloscope = ({ analyser }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.size;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      const dataArray = analyser.getValue();
      
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#4a9eff';
      ctx.beginPath();
      
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] + 1) / 2; // Normalize from [-1, 1] to [0, 1]
        const y = v * canvas.height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="text-xs font-mono text-gray-400 mb-2">Waveform</div>
      <canvas
        ref={canvasRef}
        width={250}
        height={100}
        className="bg-black rounded"
      />
    </div>
  );
};

// Main Synthesizer Component
export default function RetroSynth() {
  const synthRef = useRef(null);
  const filterRef = useRef(null);
  const reverbRef = useRef(null);
  const analyserRef = useRef(null);
  
  const [volume, setVolume] = useState(-10);
  const [filterFreq, setFilterFreq] = useState(1000);
  const [reverbWet, setReverbWet] = useState(0.3);
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(0.5);
  const [waveform, setWaveform] = useState('sine');
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [reverbEnabled, setReverbEnabled] = useState(true);
  const [activeNotes, setActiveNotes] = useState(new Set());

  useEffect(() => {
    // Initialize audio chain
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: waveform },
      envelope: { attack, decay, sustain, release }
    });
    
    filterRef.current = new Tone.Filter(filterFreq, 'lowpass');
    reverbRef.current = new Tone.Reverb({ wet: reverbWet });
    analyserRef.current = new Tone.Analyser('waveform', 256);
    
    // Connect audio chain
    synthRef.current.connect(filterRef.current);
    filterRef.current.connect(reverbRef.current);
    reverbRef.current.connect(analyserRef.current);
    analyserRef.current.toDestination();
    
    synthRef.current.volume.value = volume;

    return () => {
      synthRef.current?.dispose();
      filterRef.current?.dispose();
      reverbRef.current?.dispose();
      analyserRef.current?.dispose();
    };
  }, []);

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (synthRef.current) {
      synthRef.current.volume.value = value;
    }
  };

  const handleFilterChange = (value) => {
    setFilterFreq(value);
    if (filterRef.current && filterEnabled) {
      filterRef.current.frequency.value = value;
    }
  };

  const handleReverbChange = (value) => {
    setReverbWet(value);
    if (reverbRef.current && reverbEnabled) {
      reverbRef.current.wet.value = value;
    }
  };

  const handleAttackChange = (value) => {
    setAttack(value);
    if (synthRef.current) {
      synthRef.current.set({ envelope: { attack: value } });
    }
  };

  const handleDecayChange = (value) => {
    setDecay(value);
    if (synthRef.current) {
      synthRef.current.set({ envelope: { decay: value } });
    }
  };

  const handleSustainChange = (value) => {
    setSustain(value);
    if (synthRef.current) {
      synthRef.current.set({ envelope: { sustain: value } });
    }
  };

  const handleReleaseChange = (value) => {
    setRelease(value);
    if (synthRef.current) {
      synthRef.current.set({ envelope: { release: value } });
    }
  };

  const handleWaveformChange = (value) => {
    setWaveform(value);
    if (synthRef.current) {
      synthRef.current.set({ oscillator: { type: value } });
    }
  };

  const handleFilterToggle = (enabled) => {
    setFilterEnabled(enabled);
    if (filterRef.current) {
      filterRef.current.frequency.value = enabled ? filterFreq : 20000;
    }
  };

  const handleReverbToggle = (enabled) => {
    setReverbEnabled(enabled);
    if (reverbRef.current) {
      reverbRef.current.wet.value = enabled ? reverbWet : 0;
    }
  };

  const playNote = async (note) => {
    await Tone.start();
    synthRef.current?.triggerAttack(note);
    setActiveNotes(prev => new Set(prev).add(note));
  };

  const stopNote = (note) => {
    synthRef.current?.triggerRelease(note);
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  };

  // Keyboard mapping
  const keyboardMap = {
    'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
    'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
    'u': 'A#4', 'j': 'B4', 'k': 'C5', 'o': 'C#5', 'l': 'D5',
    'p': 'D#5', ';': 'E5'
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      const note = keyboardMap[e.key.toLowerCase()];
      if (note && !activeNotes.has(note)) {
        playNote(note);
      }
    };

    const handleKeyUp = (e) => {
      const note = keyboardMap[e.key.toLowerCase()];
      if (note) {
        stopNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes]);

  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Retro Synthesizer
        </h1>
        
        <div className="grid grid-cols-12 gap-4">
          {/* Oscillator Section */}
          <div className="col-span-12 md:col-span-8 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-white text-sm font-mono mb-4">OSCILLATOR</h2>
            <div className="grid grid-cols-4 gap-4">
              {/* Volume Control */}
              <div className="col-span-1">
                <CircularKnob
                  label="Volume"
                  min={-60}
                  max={0}
                  initialValue={volume}
                  size={100}
                  indicatorColor="#4a9eff"
                  onChange={handleVolumeChange}
                />
              </div>
              
              {/* Filter Control */}
              <div className="col-span-1">
                <CircularKnob
                  label="Filter"
                  min={100}
                  max={5000}
                  initialValue={filterFreq}
                  size={100}
                  indicatorColor="#ff9f4a"
                  onChange={handleFilterChange}
                />
              </div>
              
              {/* Reverb Control */}
              <div className="col-span-1">
                <CircularKnob
                  label="Reverb"
                  min={0}
                  max={1}
                  initialValue={reverbWet}
                  size={100}
                  indicatorColor="#4aff9f"
                  onChange={handleReverbChange}
                  showValue={false}
                />
              </div>
              
              {/* Effects Toggles */}
              <div className="col-span-1 flex flex-col items-center justify-center space-y-2">
                <ToggleButton
                  size={50}
                  label="FLT"
                  onColor="#ff9f4a"
                  initialState={filterEnabled}
                  onChange={handleFilterToggle}
                />
                <ToggleButton
                  size={50}
                  label="REV"
                  onColor="#4aff9f"
                  initialState={reverbEnabled}
                  onChange={handleReverbToggle}
                />
              </div>
            </div>
            
            {/* Waveform Selector */}
            <div className="mt-6">
              <WaveformSelector
                initialValue={waveform}
                onChange={handleWaveformChange}
              />
            </div>
          </div>
          
          {/* Oscilloscope */}
          <div className="col-span-12 md:col-span-4">
            <Oscilloscope analyser={analyserRef.current} />
          </div>
          
          {/* ADSR Controls with Visualizer */}
          <div className="col-span-12 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-white text-sm font-mono mb-4">ENVELOPE</h2>
            <div className="flex justify-center items-center gap-4">
              <div className="flex gap-3">
                <Slider
                  label="Attack"
                  min={0.001}
                  max={2}
                  initialValue={attack}
                  orientation="vertical"
                  length={120}
                  thickness={30}
                  onChange={handleAttackChange}
                />
                <Slider
                  label="Decay"
                  min={0.001}
                  max={2}
                  initialValue={decay}
                  orientation="vertical"
                  length={120}
                  thickness={30}
                  onChange={handleDecayChange}
                />
                <Slider
                  label="Sustain"
                  min={0}
                  max={1}
                  initialValue={sustain}
                  orientation="vertical"
                  length={120}
                  thickness={30}
                  onChange={handleSustainChange}
                />
                <Slider
                  label="Release"
                  min={0.001}
                  max={3}
                  initialValue={release}
                  orientation="vertical"
                  length={120}
                  thickness={30}
                  onChange={handleReleaseChange}
                />
              </div>
              <div className="ml-8">
                <ADSRVisualizer
                  attack={attack}
                  decay={decay}
                  sustain={sustain}
                  release={release}
                />
              </div>
            </div>
          </div>
          
          {/* Note Buttons */}
          <div className="col-span-12 bg-gray-800 p-4 rounded-lg">
            <h2 className="text-white text-sm font-mono mb-4">KEYBOARD</h2>
            <div className="flex justify-center space-x-2">
              {notes.map((note) => (
                <NoteButton
                  key={note}
                  note={note}
                  size={60}
                  isPressed={activeNotes.has(note)}
                  onNoteOn={playNote}
                  onNoteOff={stopNote}
                />
              ))}
            </div>
            <div className="text-center mt-4 text-xs text-gray-400 font-mono">
              Use keyboard: A S D F G H J K (white keys) | W E T Y U O P (black keys)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}