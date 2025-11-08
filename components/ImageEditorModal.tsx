import React, { useState, useEffect, useRef, useCallback } from 'react';
import { XMarkIcon, ArrowPathIcon, CropIcon } from './icons';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onSave: (editedImage: string) => void;
  aspectRatio?: number;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ 
    isOpen, 
    onClose, 
    imageSrc, 
    onSave, 
    aspectRatio = 16 / 9 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 }); // In image pixels
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const resetState = useCallback(() => {
    setFilters({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });
    setZoom(1);
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const container = containerRef.current;
    if(!container) return;

    // Fit canvas to container
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    let canvasWidth, canvasHeight;
    if (containerWidth / containerHeight > image.width / image.height) {
        canvasHeight = containerHeight;
        canvasWidth = image.width * (containerHeight / image.height);
    } else {
        canvasWidth = containerWidth;
        canvasHeight = image.height * (containerWidth / image.width);
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Apply filters
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)`;
    
    // Apply zoom
    const zoomedWidth = image.width * zoom;
    const zoomedHeight = image.height * zoom;
    
    // Center the image when zoomed
    const imageX = (image.width - zoomedWidth) / 2;
    const imageY = (image.height - zoomedHeight) / 2;
    
    ctx.drawImage(image, imageX, imageY, zoomedWidth, zoomedHeight);

    // Reset filter for drawing overlay
    ctx.filter = 'none';

    // Draw crop overlay
    const scaleX = canvasWidth / image.width;
    const scaleY = canvasHeight / image.height;
    
    const cropRect = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
    };
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.rect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
    ctx.closePath();
    ctx.fill('evenodd');

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);

  }, [crop, filters, zoom]);

  useEffect(() => {
    if (isOpen && imageSrc) {
        resetState();
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;
        img.onload = () => {
            imageRef.current = img;

            // Initialize crop rectangle
            let newCropWidth, newCropHeight;
            if(img.width / img.height > aspectRatio) {
                newCropHeight = img.height * 0.9;
                newCropWidth = newCropHeight * aspectRatio;
            } else {
                newCropWidth = img.width * 0.9;
                newCropHeight = newCropWidth / aspectRatio;
            }

            const newCrop = {
                width: newCropWidth,
                height: newCropHeight,
                x: (img.width - newCropWidth) / 2,
                y: (img.height - newCropHeight) / 2,
            };
            setCrop(newCrop);
        };
    } else {
        imageRef.current = null;
    }
  }, [isOpen, imageSrc, aspectRatio, resetState]);
  
  useEffect(() => {
      drawCanvas();
  }, [drawCanvas]);


  // FIX: Changed event type from React.MouseEvent<HTMLDivElement> to React.MouseEvent<HTMLCanvasElement>
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (canvas.width / imageRef.current!.width);
    const y = (e.clientY - rect.top) / (canvas.height / imageRef.current!.height);

    if (x > crop.x && x < crop.x + crop.width && y > crop.y && y < crop.y + crop.height) {
        setIsDragging(true);
        setDragStart({ x: x - crop.x, y: y - crop.y });
    }
  };

  // FIX: Changed event type from React.MouseEvent<HTMLDivElement> to React.MouseEvent<HTMLCanvasElement>
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !imageRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (canvas.width / imageRef.current.width);
    const y = (e.clientY - rect.top) / (canvas.height / imageRef.current.height);
    
    let newX = x - dragStart.x;
    let newY = y - dragStart.y;

    // Clamp position to image bounds
    newX = Math.max(0, Math.min(newX, imageRef.current.width - crop.width));
    newY = Math.max(0, Math.min(newY, imageRef.current.height - crop.height));
    
    setCrop(c => ({ ...c, x: newX, y: newY }));
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleSave = () => {
    const image = imageRef.current;
    if (!image) return;

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = crop.width / zoom;
    offscreenCanvas.height = crop.height / zoom;
    const ctx = offscreenCanvas.getContext('2d');

    if (!ctx) return;
    
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)`;

    const sourceX = crop.x / zoom + (image.width - image.width / zoom) / 2;
    const sourceY = crop.y / zoom + (image.height - image.height / zoom) / 2;

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      crop.width / zoom,
      crop.height / zoom,
      0,
      0,
      crop.width / zoom,
      crop.height / zoom
    );
    
    onSave(offscreenCanvas.toDataURL('image/jpeg', 0.9));
  };


  if (!isOpen) return null;
  
  const FilterSlider: React.FC<{label: string, value: number, onChange: (val: number) => void, min?: number, max?: number}> = ({label, value, onChange, min = 0, max = 200}) => (
    <div>
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <input 
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-grow flex items-center justify-center p-4 relative" ref={containerRef}>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="max-w-full max-h-full cursor-move"
          />
        </div>

        <div className="w-full md:w-72 bg-gray-900 text-white p-6 flex-shrink-0 flex flex-col space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Edit Image</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><XMarkIcon className="w-6 h-6"/></button>
          </div>
          <div className="space-y-4">
            <FilterSlider label="Brightness" value={filters.brightness} onChange={val => setFilters(f => ({...f, brightness: val}))} />
            <FilterSlider label="Contrast" value={filters.contrast} onChange={val => setFilters(f => ({...f, contrast: val}))} />
            <FilterSlider label="Grayscale" max={100} value={filters.grayscale} onChange={val => setFilters(f => ({...f, grayscale: val}))} />
            <FilterSlider label="Sepia" max={100} value={filters.sepia} onChange={val => setFilters(f => ({...f, sepia: val}))} />
            <FilterSlider label="Zoom" min={100} value={zoom * 100} onChange={val => setZoom(val / 100)} />
          </div>

          <div className="flex-grow"></div>
          
          <div className="space-y-2">
            <button onClick={resetState} className="w-full flex items-center justify-center space-x-2 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600">
                <ArrowPathIcon className="w-5 h-5" />
                <span>Reset</span>
            </button>
            <button onClick={handleSave} className="w-full py-3 bg-indigo-600 rounded-lg font-bold hover:bg-indigo-700">
                Save Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
