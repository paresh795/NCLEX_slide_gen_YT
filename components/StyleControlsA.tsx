import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Bold, Italic, Underline } from "lucide-react";

export interface SlideAStyle {
  backgroundColor: string;
  questionFont: string;
  questionSize: number;
  questionColor: string;
  questionAlignment: 'left' | 'center' | 'right';
  questionFormat: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  answerFont: string;
  answerSize: number;
  answerColor: string;
  answerAlignment: 'left' | 'center' | 'right';
  answerFormat: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  padding: number;
  questionPosition: {
    x: number;
    y: number;
  };
  answersPosition: {
    x: number;
    y: number;
  };
}

const defaultStyle: SlideAStyle = {
  backgroundColor: "#ffffff",
  questionFont: "Arial",
  questionSize: 24,
  questionColor: "#000000",
  questionAlignment: "left",
  questionFormat: {
    bold: false,
    italic: false,
    underline: false
  },
  answerFont: "Arial",
  answerSize: 18,
  answerColor: "#000000",
  answerAlignment: "left",
  answerFormat: {
    bold: false,
    italic: false,
    underline: false
  },
  padding: 40,
  questionPosition: {
    x: 50,
    y: 30,
  },
  answersPosition: {
    x: 50,
    y: 60,
  }
};

interface StyleControlsAProps {
  onStyleChange: (style: SlideAStyle) => void;
  onLockStyle: (style: SlideAStyle) => void;
  onUnlockStyle: () => void;
  isLocked?: boolean;
  initialStyle?: SlideAStyle;
}

export default function StyleControlsA({ 
  onStyleChange, 
  onLockStyle,
  onUnlockStyle,
  isLocked = false,
  initialStyle
}: StyleControlsAProps) {
  const [style, setStyle] = useState<SlideAStyle>(initialStyle || defaultStyle);

  // Update style when initialStyle changes (switching between questions)
  useEffect(() => {
    if (initialStyle) {
      setStyle(initialStyle);
    }
  }, [initialStyle]);

  const updateStyle = (updates: Partial<SlideAStyle>) => {
    if (isLocked) return;
    const newStyle = { ...style, ...updates };
    setStyle(newStyle);
    onStyleChange(newStyle);
  };

  const handleLockToggle = () => {
    if (isLocked) {
      onUnlockStyle();
    } else {
      onLockStyle(style);
    }
  };

  const fonts = ["Arial", "Times New Roman", "Helvetica", "Georgia", "Verdana"];

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Slide A Style Controls</h3>
        <p className="text-sm text-gray-500 mb-6">
          Customize the appearance of the question and answer choices.
        </p>
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={style.backgroundColor}
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
            className="w-12 h-8 p-1"
            disabled={isLocked}
          />
          <Input
            type="text"
            value={style.backgroundColor}
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
            className="font-mono"
            disabled={isLocked}
          />
        </div>
      </div>

      {/* Question Styling */}
      <div className="space-y-4">
        <h4 className="font-medium">Question Text</h4>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={style.questionFormat.bold ? "default" : "outline"}
            size="icon"
            onClick={() => updateStyle({
              questionFormat: {
                ...style.questionFormat,
                bold: !style.questionFormat.bold
              }
            })}
            disabled={isLocked}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={style.questionFormat.italic ? "default" : "outline"}
            size="icon"
            onClick={() => updateStyle({
              questionFormat: {
                ...style.questionFormat,
                italic: !style.questionFormat.italic
              }
            })}
            disabled={isLocked}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={style.questionFormat.underline ? "default" : "outline"}
            size="icon"
            onClick={() => updateStyle({
              questionFormat: {
                ...style.questionFormat,
                underline: !style.questionFormat.underline
              }
            })}
            disabled={isLocked}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={style.questionFont}
            onValueChange={(value) => updateStyle({ questionFont: value })}
            disabled={isLocked}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Text Alignment</Label>
          <Select
            value={style.questionAlignment}
            onValueChange={(value) => updateStyle({ questionAlignment: value as 'left' | 'center' | 'right' })}
            disabled={isLocked}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Size ({style.questionSize}px)</Label>
          <Slider
            value={[style.questionSize]}
            onValueChange={([value]) => updateStyle({ questionSize: value })}
            min={6}
            max={48}
            step={1}
            disabled={isLocked}
          />
        </div>

        <div className="space-y-2">
          <Label>Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.questionColor}
              onChange={(e) => updateStyle({ questionColor: e.target.value })}
              className="w-12 h-8 p-1"
              disabled={isLocked}
            />
            <Input
              type="text"
              value={style.questionColor}
              onChange={(e) => updateStyle({ questionColor: e.target.value })}
              className="font-mono"
              disabled={isLocked}
            />
          </div>
        </div>
      </div>

      {/* Answer Choices Styling */}
      <div className="space-y-4">
        <h4 className="font-medium">Answer Choices</h4>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={style.answerFormat.bold ? "default" : "outline"}
            size="icon"
            onClick={() => updateStyle({
              answerFormat: {
                ...style.answerFormat,
                bold: !style.answerFormat.bold
              }
            })}
            disabled={isLocked}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={style.answerFormat.italic ? "default" : "outline"}
            size="icon"
            onClick={() => updateStyle({
              answerFormat: {
                ...style.answerFormat,
                italic: !style.answerFormat.italic
              }
            })}
            disabled={isLocked}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={style.answerFormat.underline ? "default" : "outline"}
            size="icon"
            onClick={() => updateStyle({
              answerFormat: {
                ...style.answerFormat,
                underline: !style.answerFormat.underline
              }
            })}
            disabled={isLocked}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={style.answerFont}
            onValueChange={(value) => updateStyle({ answerFont: value })}
            disabled={isLocked}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Text Alignment</Label>
          <Select
            value={style.answerAlignment}
            onValueChange={(value) => updateStyle({ answerAlignment: value as 'left' | 'center' | 'right' })}
            disabled={isLocked}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Size ({style.answerSize}px)</Label>
          <Slider
            value={[style.answerSize]}
            onValueChange={([value]) => updateStyle({ answerSize: value })}
            min={6}
            max={36}
            step={1}
            disabled={isLocked}
          />
        </div>

        <div className="space-y-2">
          <Label>Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={style.answerColor}
              onChange={(e) => updateStyle({ answerColor: e.target.value })}
              className="w-12 h-8 p-1"
              disabled={isLocked}
            />
            <Input
              type="text"
              value={style.answerColor}
              onChange={(e) => updateStyle({ answerColor: e.target.value })}
              className="font-mono"
              disabled={isLocked}
            />
          </div>
        </div>
      </div>

      {/* Padding Control */}
      <div className="space-y-2">
        <Label>Content Padding ({style.padding}px)</Label>
        <Slider
          value={[style.padding]}
          onValueChange={([value]) => updateStyle({ padding: value })}
          min={20}
          max={80}
          step={4}
          disabled={isLocked}
        />
      </div>

      {/* Lock/Unlock Style Button */}
      <Button
        onClick={handleLockToggle}
        className="w-full"
        variant={isLocked ? "secondary" : "default"}
      >
        {isLocked ? "Unlock Style" : "Lock Style"}
      </Button>
    </Card>
  );
} 