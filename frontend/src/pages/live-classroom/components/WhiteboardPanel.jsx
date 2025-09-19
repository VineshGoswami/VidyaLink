import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WhiteboardPanel = ({ isVisible = false, onToggleVisibility = () => {} }) => {
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#2563EB');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const [drawings, setDrawings] = useState([]);

  const tools = [
    { id: 'pen', name: 'Pen', icon: 'Pen' },
    { id: 'highlighter', name: 'Highlighter', icon: 'Highlighter' },
    { id: 'eraser', name: 'Eraser', icon: 'Eraser' },
    { id: 'text', name: 'Text', icon: 'Type' },
    { id: 'shapes', name: 'Shapes', icon: 'Square' }
  ];

  const colors = [
    '#2563EB', // Blue
    '#DC2626', // Red
    '#059669', // Green
    '#F59E0B', // Amber
    '#7C3AED', // Purple
    '#1F2937'  // Dark Gray
  ];

  const mockContent = [
    {
      type: 'text',
      content: 'VLSI Design Fundamentals',
      x: 50,
      y: 50,
      style: { fontSize: '24px', fontWeight: 'bold', color: '#1F2937' }
    },
    {
      type: 'text',
      content: '1. CMOS Technology Overview',
      x: 50,
      y: 100,
      style: { fontSize: '18px', color: '#2563EB' }
    },
    {
      type: 'text',
      content: '• Low power consumption\n• High noise immunity\n• Scalable technology',
      x: 70,
      y: 130,
      style: { fontSize: '14px', color: '#1F2937' }
    },
    {
      type: 'diagram',
      content: 'NMOS + PMOS = CMOS Inverter',
      x: 50,
      y: 220,
      style: { fontSize: '16px', color: '#059669' }
    }
  ];

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (canvas) {
      const ctx = canvas?.getContext('2d');
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      
      // Draw mock content
      mockContent?.forEach(item => {
        ctx.fillStyle = item?.style?.color;
        ctx.font = `${item?.style?.fontWeight || 'normal'} ${item?.style?.fontSize}`;
        
        if (item?.content?.includes('\n')) {
          const lines = item?.content?.split('\n');
          lines?.forEach((line, index) => {
            ctx?.fillText(line, item?.x, item?.y + (index * 20));
          });
        } else {
          ctx?.fillText(item?.content, item?.x, item?.y);
        }
      });
    }
  }, [isVisible]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;
    
    const ctx = canvas?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const y = e?.clientY - rect?.top;
    
    const ctx = canvas?.getContext('2d');
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
    setDrawings([]);
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        onClick={onToggleVisibility}
        className="fixed bottom-4 right-4 z-30"
      >
        <Icon name="PenTool" size={16} className="mr-2" />
        Whiteboard
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="PenTool" size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Interactive Whiteboard
              </h2>
              <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-full text-xs">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-card border-b border-border p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Tools */}
            <div className="flex items-center gap-2">
              {tools?.map((toolItem) => (
                <Button
                  key={toolItem?.id}
                  variant={tool === toolItem?.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTool(toolItem?.id)}
                  className="flex items-center gap-1"
                >
                  <Icon name={toolItem?.icon} size={14} />
                  <span className="hidden sm:inline">{toolItem?.name}</span>
                </Button>
              ))}
            </div>

            <div className="w-px h-6 bg-border"></div>

            {/* Colors */}
            <div className="flex items-center gap-2">
              {colors?.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    color === colorOption ? 'border-foreground scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>

            <div className="w-px h-6 bg-border"></div>

            {/* Stroke Width */}
            <div className="flex items-center gap-2">
              <Icon name="Minus" size={14} className="text-muted-foreground" />
              <input
                type="range"
                min="1"
                max="10"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(parseInt(e?.target?.value))}
                className="w-20"
              />
              <Icon name="Plus" size={14} className="text-muted-foreground" />
            </div>

            <div className="w-px h-6 bg-border"></div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
              >
                <Icon name="Trash2" size={14} className="mr-1" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Icon name="Undo" size={14} className="mr-1" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Icon name="Download" size={14} className="mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-white overflow-hidden">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {/* Footer */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Participants can view and interact</span>
              <div className="flex items-center gap-1">
                <Icon name="Users" size={14} />
                <span>24 viewing</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Auto-save enabled</span>
              <div className="w-2 h-2 bg-success rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPanel;