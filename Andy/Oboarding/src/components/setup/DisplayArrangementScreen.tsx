import React, { useState, useEffect, useRef } from 'react';
import { Monitor, MousePointer2, ChevronRight, RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { useSetup } from '../../contexts/SetupContext';

interface DisplayConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  isPrimary: boolean;
  label: number;
  orientation: 'landscape' | 'portrait';
}

const DisplayArrangementScreen: React.FC = () => {
  const { state, dispatch } = useSetup();
  const [displays, setDisplays] = useState<DisplayConfig[]>([
    { id: 'display-1', name: 'Dell U2720Q', width: 3840, height: 2160, x: 0, y: 0, isPrimary: true, label: 1, orientation: 'landscape' },
    { id: 'display-2', name: 'LG 27GN950', width: 3840, height: 2160, x: 3840, y: 0, isPrimary: false, label: 2, orientation: 'landscape' },
  ]);
  const [labelingMode, setLabelingMode] = useState(false);
  const [draggedDisplay] = useState<string | null>(null);
  const [scale, setScale] = useState(0.08);
  const canvasRef = useRef<HTMLDivElement>(null);

  const recommendedLayout = state.detectedPersona?.persona === 'Professional'
    ? 'side-by-side'
    : state.detectedPersona?.persona === 'Gamer'
    ? 'main-vertical'
    : 'side-by-side';

  // Calculate bounds for auto-fit
  useEffect(() => {
    handleFitToWindow();
  }, [displays]);

  const calculateBounds = () => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    displays.forEach(d => {
      minX = Math.min(minX, d.x);
      minY = Math.min(minY, d.y);
      maxX = Math.max(maxX, d.x + d.width);
      maxY = Math.max(maxY, d.y + d.height);
    });

    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  };

  const handleFitToWindow = () => {
    if (!canvasRef.current) return;

    const bounds = calculateBounds();
    const canvasWidth = canvasRef.current.clientWidth - 100; // Padding
    const canvasHeight = canvasRef.current.clientHeight - 100;

    const scaleX = canvasWidth / bounds.width;
    const scaleY = canvasHeight / bounds.height;
    const newScale = Math.min(scaleX, scaleY, 0.15); // Max scale 0.15

    setScale(newScale);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 0.2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.04));
  };

  const handleApplyRecommended = () => {
    if (recommendedLayout === 'side-by-side') {
      setDisplays([
        { ...displays[0], x: 0, y: 0, orientation: 'landscape' },
        { ...displays[1], x: 3840, y: 0, orientation: 'landscape' },
      ]);
    } else if (recommendedLayout === 'main-vertical') {
      setDisplays([
        { ...displays[0], x: 0, y: 0, orientation: 'landscape' },
        { ...displays[1], x: 3840, y: -500, orientation: 'portrait', width: 2160, height: 3840 },
      ]);
    }
  };

  const handleStartLabeling = () => {
    setLabelingMode(true);
    // In real implementation, this would show numbers on physical displays
    setTimeout(() => {
      setLabelingMode(false);
    }, 5000);
  };

  const handleRotateDisplay = (displayId: string) => {
    setDisplays(prev =>
      prev.map(d => {
        if (d.id === displayId) {
          const newOrientation = d.orientation === 'landscape' ? 'portrait' : 'landscape';
          return {
            ...d,
            orientation: newOrientation,
            width: d.height,
            height: d.width,
          };
        }
        return d;
      })
    );
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_PHASE', payload: 'display-calibration' });
  };

  const bounds = calculateBounds();
  const centerOffsetX = (canvasRef.current?.clientWidth || 800) / 2 - (bounds.width * scale) / 2 - bounds.minX * scale;
  const centerOffsetY = (canvasRef.current?.clientHeight || 320) / 2 - (bounds.height * scale) / 2 - bounds.minY * scale;

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
              <Monitor className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Arrange Your Displays
            </h1>
            <p className="text-lg text-gray-600">
              Configure how your monitors are positioned on your desk
            </p>
          </div>

          {/* Recommended Layout */}
          <Card variant="elevated" padding="md" className="mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Recommended Layout</h3>
                  <p className="text-sm text-gray-600">
                    Based on your {state.detectedPersona?.persona || 'Professional'} profile
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={handleApplyRecommended}>
                Apply Recommended
              </Button>
            </div>
          </Card>

          {/* Visual Arrangement */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Display Arrangement</h3>
                <p className="text-sm text-gray-600">
                  Drag displays to match your physical setup
                </p>
              </div>
              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleZoomOut} leftIcon={<ZoomOut className="w-4 h-4" />}>
                  Zoom Out
                </Button>
                <Button variant="ghost" size="sm" onClick={handleFitToWindow} leftIcon={<Maximize2 className="w-4 h-4" />}>
                  Fit
                </Button>
                <Button variant="ghost" size="sm" onClick={handleZoomIn} leftIcon={<ZoomIn className="w-4 h-4" />}>
                  Zoom In
                </Button>
                <span className="text-sm text-gray-600 ml-2">{Math.round(scale * 100)}%</span>
              </div>
            </div>

            {/* Canvas */}
            <div ref={canvasRef} className="relative w-full h-80 bg-gray-100 rounded-xl border-2 border-gray-300 overflow-hidden">
              {/* Grid background */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />

              {/* Displays */}
              {displays.map((display) => (
                <div
                  key={display.id}
                  className={`absolute cursor-move transition-all ${
                    draggedDisplay === display.id ? 'z-10 scale-105' : 'z-0'
                  }`}
                  style={{
                    left: `${centerOffsetX + display.x * scale}px`,
                    top: `${centerOffsetY + display.y * scale}px`,
                    width: `${display.width * scale}px`,
                    height: `${display.height * scale}px`,
                  }}
                >
                  <div className={`w-full h-full rounded-lg border-4 ${
                    display.isPrimary ? 'border-primary-600 bg-primary-100' : 'border-gray-400 bg-gray-200'
                  } shadow-lg flex flex-col items-center justify-center`}>
                    <div className="text-4xl font-bold text-gray-700">{display.label}</div>
                    {display.isPrimary && (
                      <div className="mt-2 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                        Primary
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-600">{display.name}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {display.width} × {display.height}
                    </div>
                  </div>
                </div>
              ))}

              {/* Desk reference line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-gray-400 to-transparent opacity-50" />
            </div>
          </Card>

          {/* Display Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {displays.map((display) => (
              <Card key={display.id} variant="outlined" padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-700">{display.label}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{display.name}</h4>
                      <p className="text-sm text-gray-600">{display.orientation}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRotateDisplay(display.id)}
                    leftIcon={<RotateCw className="w-4 h-4" />}
                  >
                    Rotate
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Labeling Instructions */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MousePointer2 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Identify Your Displays</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Click the button below to show numbers on each physical display. Match them to the arrangement above.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleStartLabeling}
                  disabled={labelingMode}
                >
                  {labelingMode ? 'Displaying numbers on screens...' : 'Show Numbers on Displays'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              rightIcon={<ChevronRight className="w-5 h-5" />}
            >
              Continue to Display Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayArrangementScreen;
