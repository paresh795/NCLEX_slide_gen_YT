import { Card } from "@/components/ui/card";
import { SlideAStyle } from "./StyleControlsA";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Bold, Italic, Underline, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";

interface HorizontalControlsProps {
  style?: SlideAStyle;
  onStyleChange: (style: SlideAStyle) => void;
  onLockStyle: (style: SlideAStyle) => void;
  onUnlockStyle: () => void;
  onPropagateStyle: () => void;
  isLocked?: boolean;
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

export default function HorizontalControls({
  style: propStyle,
  onStyleChange,
  onLockStyle,
  onUnlockStyle,
  onPropagateStyle,
  isLocked = false
}: HorizontalControlsProps) {
  // Use provided style or default style
  const style = propStyle || defaultStyle;

  const updateStyle = (updates: Partial<SlideAStyle>) => {
    if (isLocked) return;
    onStyleChange({ ...style, ...updates });
  };

  const handleLockToggle = () => {
    if (isLocked) {
      onUnlockStyle();
    } else {
      onLockStyle(style);
    }
  };

  const fonts = [
    "Arial",
    "Times New Roman",
    "Helvetica",
    "Georgia",
    "Verdana",
    "Roboto",
    "Open Sans",
    "Lato",
    "Nunito",
    "Source Sans Pro",
    "Montserrat",
    "Ubuntu",
    "Calibri",
    "Segoe UI",
    "Trebuchet MS"
  ];
  const STEP = 2;

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header with Lock/Apply Buttons and Background Color */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center">
        <Label className="text-sm font-medium text-gray-700">Style Controls</Label>
        
        {/* Background Color Picker */}
        <div className="flex items-center gap-2 mx-auto bg-gray-50 px-3 py-1.5 rounded-full">
          <Label className="text-xs font-medium text-gray-600">Background Color</Label>
          <Input
            type="color"
            value={style.backgroundColor}
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
            className="w-8 h-8 p-1 cursor-pointer rounded-full"
            disabled={isLocked}
            title="Background Color"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleLockToggle}
            variant={isLocked ? "secondary" : "default"}
            size="sm"
            className={`transition-all ${
              isLocked 
                ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
          >
            {isLocked ? "Unlock Style" : "Lock Style"}
          </Button>
          <Button
            onClick={onPropagateStyle}
            variant="outline"
            size="sm"
            className="hover:shadow-sm transition-all"
            disabled={isLocked}
          >
            Apply to All Slides
          </Button>
        </div>
      </div>

      {/* Main Controls Area */}
      <div className="p-4 grid grid-cols-2 gap-6">
        {/* Question Controls */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-gray-700">Question</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={style.questionColor}
                onChange={(e) => updateStyle({ questionColor: e.target.value })}
                className="w-8 h-8 p-1 cursor-pointer rounded"
                disabled={isLocked}
                title="Text Color"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={style.questionFormat.bold ? "default" : "outline"}
              size="icon"
              onClick={() => updateStyle({
                questionFormat: { ...style.questionFormat, bold: !style.questionFormat.bold }
              })}
              disabled={isLocked}
              className="h-8 w-8"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={style.questionFormat.italic ? "default" : "outline"}
              size="icon"
              onClick={() => updateStyle({
                questionFormat: { ...style.questionFormat, italic: !style.questionFormat.italic }
              })}
              disabled={isLocked}
              className="h-8 w-8"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={style.questionFormat.underline ? "default" : "outline"}
              size="icon"
              onClick={() => updateStyle({
                questionFormat: { ...style.questionFormat, underline: !style.questionFormat.underline }
              })}
              disabled={isLocked}
              className="h-8 w-8"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Select
              value={style.questionFont}
              onValueChange={(value) => updateStyle({ questionFont: value })}
              disabled={isLocked}
            >
              <SelectTrigger className="h-8 flex-1">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={style.questionAlignment}
              onValueChange={(value) => updateStyle({ questionAlignment: value as 'left' | 'center' | 'right' })}
              disabled={isLocked}
            >
              <SelectTrigger className="h-8 w-24">
                <SelectValue placeholder="Align" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <Label className="text-xs text-gray-600">Font Size</Label>
              <span className="text-xs text-gray-500">{style.questionSize}px</span>
            </div>
            <Slider
              value={[style.questionSize]}
              onValueChange={([value]) => updateStyle({ questionSize: value })}
              min={12}
              max={48}
              step={1}
              disabled={isLocked}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 max-w-[120px] mx-auto">
            <div />
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                questionPosition: {
                  ...style.questionPosition,
                  y: Math.max(0, style.questionPosition.y - STEP)
                }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <div />
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                questionPosition: {
                  ...style.questionPosition,
                  x: Math.max(0, style.questionPosition.x - STEP)
                }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                questionPosition: { x: 50, y: 30 }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <LayoutGrid className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                questionPosition: {
                  ...style.questionPosition,
                  x: Math.min(100, style.questionPosition.x + STEP)
                }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
            <div />
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                questionPosition: {
                  ...style.questionPosition,
                  y: Math.min(100, style.questionPosition.y + STEP)
                }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
            <div />
          </div>
          <div className="text-xs text-gray-500 text-center">
            Position: ({Math.round(style.questionPosition.x)}%, {Math.round(style.questionPosition.y)}%)
          </div>
        </div>

        {/* Answer Controls */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium text-gray-700">Answers</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={style.answerColor}
                onChange={(e) => updateStyle({ answerColor: e.target.value })}
                className="w-8 h-8 p-1 cursor-pointer rounded"
                disabled={isLocked}
                title="Text Color"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={style.answerFormat.bold ? "default" : "outline"}
              size="icon"
              onClick={() => updateStyle({
                answerFormat: { ...style.answerFormat, bold: !style.answerFormat.bold }
              })}
              disabled={isLocked}
              className="h-8 w-8"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={style.answerFormat.italic ? "default" : "outline"}
              size="icon"
              onClick={() => updateStyle({
                answerFormat: { ...style.answerFormat, italic: !style.answerFormat.italic }
              })}
              disabled={isLocked}
              className="h-8 w-8"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={style.answerFormat.underline ? "default" : "outline"}
              size="icon"
              onClick={() => updateStyle({
                answerFormat: { ...style.answerFormat, underline: !style.answerFormat.underline }
              })}
              disabled={isLocked}
              className="h-8 w-8"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Select
              value={style.answerFont}
              onValueChange={(value) => updateStyle({ answerFont: value })}
              disabled={isLocked}
            >
              <SelectTrigger className="h-8 flex-1">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={style.answerAlignment}
              onValueChange={(value) => updateStyle({ answerAlignment: value as 'left' | 'center' | 'right' })}
              disabled={isLocked}
            >
              <SelectTrigger className="h-8 w-24">
                <SelectValue placeholder="Align" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <Label className="text-xs text-gray-600">Font Size</Label>
              <span className="text-xs text-gray-500">{style.answerSize}px</span>
            </div>
            <Slider
              value={[style.answerSize]}
              onValueChange={([value]) => updateStyle({ answerSize: value })}
              min={12}
              max={36}
              step={1}
              disabled={isLocked}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 max-w-[120px] mx-auto">
            <div />
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                answersPosition: {
                  ...style.answersPosition,
                  y: Math.max(0, style.answersPosition.y - STEP)
                }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <div />
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                answersPosition: {
                  ...style.answersPosition,
                  x: Math.max(0, style.answersPosition.x - STEP)
                }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                answersPosition: { x: 50, y: 60 }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <LayoutGrid className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                answersPosition: {
                  ...style.answersPosition,
                  x: Math.min(100, style.answersPosition.x + STEP)
                }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <ArrowRight className="h-3 w-3" />
            </Button>
            <div />
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStyle({
                answersPosition: {
                  ...style.answersPosition,
                  y: Math.min(100, style.answersPosition.y + STEP)
                }
              })}
              disabled={isLocked}
              className="h-7 w-7"
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
            <div />
          </div>
          <div className="text-xs text-gray-500 text-center">
            Position: ({Math.round(style.answersPosition.x)}%, {Math.round(style.answersPosition.y)}%)
          </div>
        </div>
      </div>
    </Card>
  );
} 