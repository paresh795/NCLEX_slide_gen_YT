import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { SlideAStyle } from "./StyleControlsA";

interface LayoutControlsProps {
  style: SlideAStyle;
  onStyleChange: (style: SlideAStyle) => void;
  isLocked?: boolean;
}

export default function LayoutControls({ 
  style, 
  onStyleChange,
  isLocked = false 
}: LayoutControlsProps) {
  
  const updateQuestionPosition = (updates: Partial<typeof style.questionPosition>) => {
    if (isLocked) return;
    onStyleChange({
      ...style,
      questionPosition: {
        ...style.questionPosition,
        ...updates
      }
    });
  };

  const updateAnswersPosition = (updates: Partial<typeof style.answersPosition>) => {
    if (isLocked) return;
    onStyleChange({
      ...style,
      answersPosition: {
        ...style.answersPosition,
        ...updates
      }
    });
  };

  const centerBoth = () => {
    if (isLocked) return;
    onStyleChange({
      ...style,
      questionPosition: {
        x: 50,
        y: 30
      },
      answersPosition: {
        x: 50,
        y: 60
      }
    });
  };

  const STEP = 5; // 5% movement per click

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Layout Controls</h3>
        <p className="text-sm text-gray-500 mb-6">
          Position the question and answer choices on the slide.
        </p>
      </div>

      {/* Question Position Controls */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Question Position</h4>
          <div className="text-sm text-gray-500">
            ({Math.round(style.questionPosition.x)}%, {Math.round(style.questionPosition.y)}%)
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          <div></div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuestionPosition({ y: Math.max(0, style.questionPosition.y - STEP) })}
            disabled={isLocked}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <div></div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuestionPosition({ x: Math.max(0, style.questionPosition.x - STEP) })}
            disabled={isLocked}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={centerBoth}
            disabled={isLocked}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuestionPosition({ x: Math.min(100, style.questionPosition.x + STEP) })}
            disabled={isLocked}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div></div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuestionPosition({ y: Math.min(100, style.questionPosition.y + STEP) })}
            disabled={isLocked}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <div></div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Horizontal Position</Label>
            <Slider
              value={[style.questionPosition.x]}
              onValueChange={([x]) => updateQuestionPosition({ x })}
              min={0}
              max={100}
              step={1}
              disabled={isLocked}
            />
          </div>
          <div className="space-y-2">
            <Label>Vertical Position</Label>
            <Slider
              value={[style.questionPosition.y]}
              onValueChange={([y]) => updateQuestionPosition({ y })}
              min={0}
              max={100}
              step={1}
              disabled={isLocked}
            />
          </div>
        </div>
      </div>

      {/* Answer Choices Position Controls */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Answer Choices Position</h4>
          <div className="text-sm text-gray-500">
            ({Math.round(style.answersPosition.x)}%, {Math.round(style.answersPosition.y)}%)
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          <div></div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateAnswersPosition({ y: Math.max(0, style.answersPosition.y - STEP) })}
            disabled={isLocked}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <div></div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updateAnswersPosition({ x: Math.max(0, style.answersPosition.x - STEP) })}
            disabled={isLocked}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={centerBoth}
            disabled={isLocked}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateAnswersPosition({ x: Math.min(100, style.answersPosition.x + STEP) })}
            disabled={isLocked}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div></div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateAnswersPosition({ y: Math.min(100, style.answersPosition.y + STEP) })}
            disabled={isLocked}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <div></div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Horizontal Position</Label>
            <Slider
              value={[style.answersPosition.x]}
              onValueChange={([x]) => updateAnswersPosition({ x })}
              min={0}
              max={100}
              step={1}
              disabled={isLocked}
            />
          </div>
          <div className="space-y-2">
            <Label>Vertical Position</Label>
            <Slider
              value={[style.answersPosition.y]}
              onValueChange={([y]) => updateAnswersPosition({ y })}
              min={0}
              max={100}
              step={1}
              disabled={isLocked}
            />
          </div>
        </div>
      </div>
    </Card>
  );
} 