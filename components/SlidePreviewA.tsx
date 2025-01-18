import { NCLEXQuestion } from "@/lib/types";
import { SlideAStyle } from "./StyleControlsA";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

interface SlidePreviewAProps {
  question: NCLEXQuestion;
  style: SlideAStyle;
  showAnswerRationale?: boolean;
  isExporting?: boolean;
}

export default function SlidePreviewA({ question, style, showAnswerRationale = false, isExporting = false }: SlidePreviewAProps) {
  return (
    <Card className={`slide-preview w-full overflow-hidden bg-white ${isExporting ? 'rounded-none' : ''}`}>
      <AspectRatio ratio={16 / 9}>
        <div
          className="h-full w-full relative"
          style={{
            backgroundColor: style.backgroundColor,
            padding: `${style.padding}px`,
          }}
        >
          {/* Center Guidelines - Only show when not exporting */}
          {!isExporting && (
            <div className="guidelines absolute inset-0 pointer-events-none opacity-10">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-400" />
            </div>
          )}

          {showAnswerRationale ? (
            <>
              {/* Answer Section */}
              <div
                className="absolute transform -translate-x-1/2"
                style={{
                  fontFamily: style.questionFont,
                  fontSize: `${style.questionSize}px`,
                  color: style.questionColor,
                  left: `${style.questionPosition.x}%`,
                  top: `${style.questionPosition.y}%`,
                  maxWidth: '80%',
                  width: '100%',
                  textAlign: style.questionAlignment,
                  transform: 'translate(-50%, 0)',
                }}
              >
                <div
                  style={{
                    lineHeight: '1.4',
                    fontWeight: style.questionFormat.bold ? 'bold' : 'normal',
                    fontStyle: style.questionFormat.italic ? 'italic' : 'normal',
                    textDecoration: style.questionFormat.underline ? 'underline' : 'none',
                  }}
                >
                  <div className="font-medium mb-2">Correct Answer:</div>
                  {question.correctAnswer}
                </div>
              </div>

              {/* Rationale */}
              <div
                className="absolute transform -translate-x-1/2 space-y-4"
                style={{
                  fontFamily: style.answerFont,
                  fontSize: `${style.answerSize}px`,
                  color: style.answerColor,
                  left: `${style.answersPosition.x}%`,
                  top: `${style.answersPosition.y}%`,
                  maxWidth: '80%',
                  width: '100%',
                  textAlign: style.answerAlignment,
                  transform: 'translate(-50%, 0)',
                  lineHeight: '1.4',
                  fontWeight: style.answerFormat.bold ? 'bold' : 'normal',
                  fontStyle: style.answerFormat.italic ? 'italic' : 'normal',
                  textDecoration: style.answerFormat.underline ? 'underline' : 'none',
                }}
              >
                <div className="font-medium mb-2">Rationale:</div>
                {question.rationale}
              </div>
            </>
          ) : (
            <>
              {/* Question Text with Number */}
              <div
                className="absolute transform -translate-x-1/2"
                style={{
                  fontFamily: style.questionFont,
                  fontSize: `${style.questionSize}px`,
                  color: style.questionColor,
                  left: `${style.questionPosition.x}%`,
                  top: `${style.questionPosition.y}%`,
                  maxWidth: '80%',
                  width: '100%',
                  textAlign: style.questionAlignment,
                  transform: 'translate(-50%, 0)',
                }}
              >
                {/* Question Number - Only shown on question slides */}
                <div 
                  style={{
                    fontSize: `${style.questionSize * 0.8}px`,
                    marginBottom: '1em',
                    opacity: 0.8,
                    fontWeight: 'bold'
                  }}
                >
                  Question {question.questionNumber}
                </div>

                {/* Question Text */}
                <div
                  style={{
                    lineHeight: '1.4',
                    fontWeight: style.questionFormat.bold ? 'bold' : 'normal',
                    fontStyle: style.questionFormat.italic ? 'italic' : 'normal',
                    textDecoration: style.questionFormat.underline ? 'underline' : 'none',
                  }}
                >
                  {question.questionStem}
                </div>
              </div>

              {/* Answer Choices */}
              <div
                className="absolute transform -translate-x-1/2 space-y-4"
                style={{
                  fontFamily: style.answerFont,
                  fontSize: `${style.answerSize}px`,
                  color: style.answerColor,
                  left: `${style.answersPosition.x}%`,
                  top: `${style.answersPosition.y}%`,
                  maxWidth: '80%',
                  width: '100%',
                  textAlign: style.answerAlignment,
                  transform: 'translate(-50%, 0)',
                  lineHeight: '1.4',
                  fontWeight: style.answerFormat.bold ? 'bold' : 'normal',
                  fontStyle: style.answerFormat.italic ? 'italic' : 'normal',
                  textDecoration: style.answerFormat.underline ? 'underline' : 'none',
                }}
              >
                {question.answerChoices.map((answer, index) => (
                  <div key={index} className="flex gap-2">
                    <span>{answer}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </AspectRatio>
    </Card>
  );
} 