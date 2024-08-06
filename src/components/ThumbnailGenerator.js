'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UploadCloud } from 'lucide-react';

const ThumbnailGenerator = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('This is a title');
  const [subtitle, setSubtitle] = useState('This is a subtitle');
  const [titleFontSize, setTitleFontSize] = useState(60);
  const [subtitleFontSize, setSubtitleFontSize] = useState(40);
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [subtitleColor, setSubtitleColor] = useState('#ffffff');
  const [titleHorizontalShift, setTitleHorizontalShift] = useState(0);
  const [titleVerticalShift, setTitleVerticalShift] = useState(0);
  const [subtitleHorizontalShift, setSubtitleHorizontalShift] = useState(0);
  const [subtitleVerticalShift, setSubtitleVerticalShift] = useState(0);
  const [vignetteOpacity, setVignetteOpacity] = useState(0);
  const [vignetteSize, setVignetteSize] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [overlayColor, setOverlayColor] = useState('#000000');
  const [frameSize, setFrameSize] = useState(0);
  const [framePadding, setFramePadding] = useState(0);
  const [frameColor, setFrameColor] = useState('#ffffff');
  const [titleFont, setTitleFont] = useState('Impact');
  const [subtitleFont, setSubtitleFont] = useState('Impact');

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const fontOptions = [
    'Impact',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier',
    'Verdana',
    'Georgia',
    'Palatino',
    'Garamond',
    'Bookman',
    'Comic Sans MS',
    'Trebuchet MS',
    'Arial Black',
    'Arial Narrow',
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderThumbnail = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas size
      canvas.width = 1280;
      canvas.height = 720;

      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1 - vignetteSize / 100, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${vignetteOpacity / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply overlay
      ctx.fillStyle = overlayColor;
      ctx.globalAlpha = overlayOpacity / 100;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Draw frame
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = frameSize;
      ctx.strokeRect(
        framePadding,
        framePadding,
        canvas.width - 2 * framePadding,
        canvas.height - 2 * framePadding
      );

      // Draw title
      ctx.fillStyle = titleColor;
      ctx.font = `${titleFontSize}px ${titleFont}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        title,
        canvas.width / 2 + titleHorizontalShift,
        canvas.height / 2 + titleVerticalShift
      );

      // Draw subtitle
      ctx.fillStyle = subtitleColor;
      ctx.font = `${subtitleFontSize}px ${subtitleFont}`;
      ctx.fillText(
        subtitle,
        canvas.width / 2 + subtitleHorizontalShift,
        canvas.height / 2 + 80 + subtitleVerticalShift
      );
    };

    img.src = image;
  };

  useEffect(() => {
    if (image) {
      renderThumbnail();
    }
  }, [
    image,
    title,
    subtitle,
    titleFontSize,
    subtitleFontSize,
    titleColor,
    subtitleColor,
    titleHorizontalShift,
    titleVerticalShift,
    subtitleHorizontalShift,
    subtitleVerticalShift,
    vignetteOpacity,
    vignetteSize,
    overlayOpacity,
    overlayColor,
    frameSize,
    framePadding,
    frameColor,
  ]);

  const exportImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'youtube-thumbnail.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // ... (rest of the component remains the same)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Image generation</h1>

      <div className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center">
        <Button onClick={() => fileInputRef.current.click()}>
          <UploadCloud className="mr-2 h-4 w-4" /> Drop new image
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      <div className="mb-4">
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold mb-2">Background options</h2>
          <div className="mb-2">
            <label>Vignette opacity</label>
            <Slider
              value={[vignetteOpacity]}
              onValueChange={(v) => setVignetteOpacity(v[0])}
              max={100}
            />
          </div>
          <div className="mb-2">
            <label>Vignette size</label>
            <Slider
              value={[vignetteSize]}
              onValueChange={(v) => setVignetteSize(v[0])}
              max={100}
            />
          </div>
          <div className="mb-2">
            <label>Overlay opacity</label>
            <Slider
              value={[overlayOpacity]}
              onValueChange={(v) => setOverlayOpacity(v[0])}
              max={100}
            />
          </div>
          <div className="mb-2">
            <label>Overlay color</label>
            <Input
              type="color"
              value={overlayColor}
              onChange={(e) => setOverlayColor(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Frame options</h2>
          <div className="mb-2">
            <label>Frame size</label>
            <Slider
              value={[frameSize]}
              onValueChange={(v) => setFrameSize(v[0])}
              max={100}
            />
          </div>
          <div className="mb-2">
            <label>Frame padding</label>
            <Slider
              value={[framePadding]}
              onValueChange={(v) => setFramePadding(v[0])}
              max={100}
            />
          </div>
          <div className="mb-2">
            <label>Frame color</label>
            <Input
              type="color"
              value={frameColor}
              onChange={(e) => setFrameColor(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Title options</h2>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2"
          />
          <div className="mb-2">
            <label>Title font</label>
            <Select value={titleFont} onValueChange={setTitleFont}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-2">
            <label>Title font size</label>
            <Input
              type="number"
              value={titleFontSize}
              onChange={(e) => setTitleFontSize(Number(e.target.value))}
            />
          </div>
          <div className="mb-2">
            <label>Title horizontal shift</label>
            <Input
              type="number"
              value={titleHorizontalShift}
              onChange={(e) => setTitleHorizontalShift(Number(e.target.value))}
            />
          </div>
          <div className="mb-2">
            <label>Title vertical shift</label>
            <Input
              type="number"
              value={titleVerticalShift}
              onChange={(e) => setTitleVerticalShift(Number(e.target.value))}
            />
          </div>
          <div className="mb-2">
            <label>Title color</label>
            <Input
              type="color"
              value={titleColor}
              onChange={(e) => setTitleColor(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Subtitle options</h2>
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="mb-2"
          />
          <div className="mb-2">
            <label>Subtitle font</label>
            <Select value={subtitleFont} onValueChange={setSubtitleFont}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-2">
            <label>Subtitle font size</label>
            <Input
              type="number"
              value={subtitleFontSize}
              onChange={(e) => setSubtitleFontSize(Number(e.target.value))}
            />
          </div>
          <div className="mb-2">
            <label>Subtitle horizontal shift</label>
            <Input
              type="number"
              value={subtitleHorizontalShift}
              onChange={(e) =>
                setSubtitleHorizontalShift(Number(e.target.value))
              }
            />
          </div>
          <div className="mb-2">
            <label>Subtitle vertical shift</label>
            <Input
              type="number"
              value={subtitleVerticalShift}
              onChange={(e) => setSubtitleVerticalShift(Number(e.target.value))}
            />
          </div>
          <div className="mb-2">
            <label>Subtitle color</label>
            <Input
              type="color"
              value={subtitleColor}
              onChange={(e) => setSubtitleColor(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button onClick={renderThumbnail} className="mt-4 mr-2">
        Preview
      </Button>
      <Button onClick={exportImage} className="mt-4">
        Export
      </Button>
    </div>
  );
};

export default ThumbnailGenerator;
