'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { NCLEXQuestion } from "@/lib/types";
import { SlideAStyle } from "@/components/StyleControlsA";
import SlidePreviewA from "@/components/SlidePreviewA";
import HorizontalControls from "@/components/HorizontalControls";
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { Settings } from "lucide-react";

interface QuestionStyle {
  isLocked: boolean;
  style: SlideAStyle;
}

interface SlideState {
  questionStyles: Record<number, QuestionStyle>;
  answerStyles: Record<number, QuestionStyle>;
  currentSlideType: 'question' | 'answer';
  currentQuestionIndex: number;
  isExporting: boolean;
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

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [questions, setQuestions] = useState<NCLEXQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slideState, setSlideState] = useState<SlideState>({
    questionStyles: {},
    answerStyles: {},
    currentSlideType: 'question',
    currentQuestionIndex: 0,
    isExporting: false
  });

  // Helper function to get current style
  const getCurrentStyle = () => {
    const styles = slideState.currentSlideType === 'question' 
      ? slideState.questionStyles 
      : slideState.answerStyles;
    return styles[slideState.currentQuestionIndex];
  };

  // Helper function to check if all styles are locked
  const areAllStylesLocked = () => {
    return questions.length > 0 && 
      questions.every((_, index) => 
        slideState.questionStyles[index]?.isLocked && 
        slideState.answerStyles[index]?.isLocked
      );
  };

  const handleParse = async () => {
    try {
      setLoading(true);
      setError('');
      
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        setError('Please set your OpenAI API key in the settings first');
        return;
      }
      
      const response = await fetch('/api/parse-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          text: inputText
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse questions');
      }

      setQuestions(data.questions);
      
      // Initialize styles for both question and answer slides
      const initialQuestionStyles: Record<number, QuestionStyle> = {};
      const initialAnswerStyles: Record<number, QuestionStyle> = {};
      
      data.questions.forEach((_: NCLEXQuestion, index: number) => {
        initialQuestionStyles[index] = {
          isLocked: false,
          style: { ...defaultStyle }
        };
        initialAnswerStyles[index] = {
          isLocked: false,
          style: { ...defaultStyle }
        };
      });

      setSlideState({
        questionStyles: initialQuestionStyles,
        answerStyles: initialAnswerStyles,
        currentSlideType: 'question',
        currentQuestionIndex: 0,
        isExporting: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStyleChange = (style: SlideAStyle) => {
    setSlideState(prev => {
      const styles = prev.currentSlideType === 'question' 
        ? { ...prev.questionStyles }
        : { ...prev.answerStyles };

      styles[prev.currentQuestionIndex] = {
        ...styles[prev.currentQuestionIndex],
        style,
        isLocked: false
      };

      return {
        ...prev,
        [prev.currentSlideType === 'question' ? 'questionStyles' : 'answerStyles']: styles
      };
    });
  };

  const handlePropagateStyle = () => {
    setSlideState(prev => {
      const currentStyle = getCurrentStyle()?.style;
      if (!currentStyle) return prev;

      const isQuestion = prev.currentSlideType === 'question';
      const styles = isQuestion ? { ...prev.questionStyles } : { ...prev.answerStyles };
      
      // Apply current style to all slides of the same type
      questions.forEach((_, index) => {
        if (index !== prev.currentQuestionIndex) { // Skip current slide
          styles[index] = {
            ...styles[index],
            style: { ...currentStyle },
            isLocked: false // Reset lock state for propagated styles
          };
        }
      });

      return {
        ...prev,
        [isQuestion ? 'questionStyles' : 'answerStyles']: styles
      };
    });
  };

  const handleStyleLock = (style: SlideAStyle) => {
    setSlideState(prev => {
      const styles = prev.currentSlideType === 'question' 
        ? { ...prev.questionStyles }
        : { ...prev.answerStyles };

      styles[prev.currentQuestionIndex] = {
        style,
        isLocked: true
      };

      return {
        ...prev,
        [prev.currentSlideType === 'question' ? 'questionStyles' : 'answerStyles']: styles
      };
    });
  };

  const handleStyleUnlock = () => {
    setSlideState(prev => {
      const styles = prev.currentSlideType === 'question' 
        ? { ...prev.questionStyles }
        : { ...prev.answerStyles };

      styles[prev.currentQuestionIndex] = {
        ...styles[prev.currentQuestionIndex],
        isLocked: false
      };

      return {
        ...prev,
        [prev.currentSlideType === 'question' ? 'questionStyles' : 'answerStyles']: styles
      };
    });
  };

  const handleSlideNavigation = (direction: 'prev' | 'next') => {
    setSlideState(prev => {
      const nextState = { ...prev };
      if (direction === 'next') {
        if (prev.currentSlideType === 'question') {
          nextState.currentSlideType = 'answer';
        } else {
          nextState.currentSlideType = 'question';
          nextState.currentQuestionIndex = Math.min(
            questions.length - 1,
            prev.currentQuestionIndex + 1
          );
        }
      } else {
        if (prev.currentSlideType === 'answer') {
          nextState.currentSlideType = 'question';
        } else {
          nextState.currentSlideType = 'answer';
          nextState.currentQuestionIndex = Math.max(
            0,
            prev.currentQuestionIndex - 1
          );
        }
      }
      return nextState;
    });
  };

  const generateAllSlides = async () => {
    if (!areAllStylesLocked()) return;
    
    const zip = new JSZip();
    const slides = zip.folder("slides");
    
    // Show loading state
    setLoading(true);
    
    try {
      for (let i = 0; i < questions.length; i++) {
        // Generate question slide
        setSlideState(prev => ({
          ...prev,
          currentQuestionIndex: i,
          currentSlideType: 'question',
          isExporting: true
        }));
        
        // Wait for state update and rendering
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const questionElement = document.querySelector('.slide-preview') as HTMLElement;
        if (questionElement) {
          // Update the preview component to export mode
          setSlideState(prev => ({
            ...prev,
            currentQuestionIndex: i,
            currentSlideType: 'question',
            isExporting: true
          }));

          // Wait for state update and rendering
          await new Promise(resolve => setTimeout(resolve, 100));

          const questionCanvas = await html2canvas(questionElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: getCurrentStyle()?.style.backgroundColor || '#ffffff',
            imageTimeout: 0,
            onclone: (clonedDoc) => {
              // Remove rounded corners in cloned element
              const previewCard = clonedDoc.querySelector('.slide-preview');
              if (previewCard) {
                previewCard.classList.add('rounded-none');
              }

              // Hide guidelines in cloned element
              const guidelines = clonedDoc.querySelector('.guidelines');
              if (guidelines) {
                guidelines.remove();
              }

              // Ensure fonts are loaded in the cloned document
              const style = clonedDoc.createElement('style');
              style.innerHTML = `
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');
              `;
              clonedDoc.head.appendChild(style);
            }
          });

          // Reset export mode
          setSlideState(prev => ({
            ...prev,
            isExporting: false
          }));

          const questionBlob = await new Promise<Blob>(resolve => {
            questionCanvas.toBlob(blob => resolve(blob!), 'image/png', 1.0);
          });
          slides?.file(`question_${i + 1}.png`, questionBlob);
        }
        
        // Generate answer slide with similar changes
        setSlideState(prev => ({
          ...prev,
          currentSlideType: 'answer',
          isExporting: true
        }));
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const answerElement = document.querySelector('.slide-preview') as HTMLElement;
        if (answerElement) {
          const answerCanvas = await html2canvas(answerElement, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: getCurrentStyle()?.style.backgroundColor || '#ffffff',
            imageTimeout: 0,
            onclone: (clonedDoc) => {
              // Remove rounded corners in cloned element
              const previewCard = clonedDoc.querySelector('.slide-preview');
              if (previewCard) {
                previewCard.classList.add('rounded-none');
              }

              // Hide guidelines in cloned element
              const guidelines = clonedDoc.querySelector('.guidelines');
              if (guidelines) {
                guidelines.remove();
              }

              // Ensure fonts are loaded in the cloned document
              const style = clonedDoc.createElement('style');
              style.innerHTML = `
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');
              `;
              clonedDoc.head.appendChild(style);
            }
          });

          // Reset export mode
          setSlideState(prev => ({
            ...prev,
            isExporting: false
          }));

          const answerBlob = await new Promise<Blob>(resolve => {
            answerCanvas.toBlob(blob => resolve(blob!), 'image/png', 1.0);
          });
          slides?.file(`answer_${i + 1}.png`, answerBlob);
        }
      }
      
      // Generate and download zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "nclex_slides.zip");
    } catch (error) {
      console.error('Error generating slides:', error);
      setError('Failed to generate slides. Please try again.');
    } finally {
      setLoading(false);
      // Reset to first slide
      setSlideState(prev => ({
        ...prev,
        currentQuestionIndex: 0,
        currentSlideType: 'question',
        isExporting: false
      }));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto p-8">
        <div className="max-w-[1600px] mx-auto space-y-8">
          {/* Header Section */}
          <motion.div 
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1" />
              <motion.div
                className="inline-flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Stethoscope className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NCLEX Slide Generator
                </h1>
              </motion.div>
              <div className="flex-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-gray-100"
                >
                  <Link href="/settings">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </Link>
                </Button>
              </div>
            </div>
            <motion.p 
              className="text-gray-500 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Create beautiful, professional NCLEX study slides with ease
            </motion.p>
          </motion.div>

          {/* Navigation Section - Only show when questions exist */}
          {questions.length > 0 && (
            <motion.div 
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-sm font-medium text-gray-500">
                {slideState.currentSlideType === 'question' ? 'Question' : 'Answer'} {slideState.currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={getCurrentStyle()?.isLocked ? handleStyleUnlock : () => handleStyleLock(getCurrentStyle()?.style)}
                  className={`hover:shadow-md transition-all ${
                    getCurrentStyle()?.isLocked 
                      ? 'border-green-500 text-green-600 hover:bg-green-50'
                      : 'border-blue-500 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {getCurrentStyle()?.isLocked ? 'Unlock Style' : 'Lock Style'}
                </Button>
                <div className="w-px h-6 bg-gray-200 my-auto" /> {/* Separator */}
                <Button
                  variant="outline"
                  onClick={() => handleSlideNavigation('prev')}
                  disabled={slideState.currentQuestionIndex === 0 && slideState.currentSlideType === 'question'}
                  className="hover:shadow-md transition-all"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSlideNavigation('next')}
                  disabled={
                    slideState.currentQuestionIndex === questions.length - 1 && 
                    slideState.currentSlideType === 'answer'
                  }
                  className="hover:shadow-md transition-all"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
        
          {/* Input Section */}
          {questions.length === 0 && (
            <motion.div 
              className="space-y-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Paste your NCLEX questions here:
                </label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your questions here..."
                  className="min-h-[200px] transition-all border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="mt-4">
                  <Button 
                    onClick={handleParse}
                    disabled={loading || !inputText.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Stethoscope className="w-4 h-4" />
                        </motion.div>
                        Parsing...
                      </div>
                    ) : (
                      'Parse Questions'
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <motion.div 
                  className="text-red-500 text-sm p-4 bg-red-50 rounded-lg border border-red-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Editor Section */}
          {questions.length > 0 && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Preview */}
              <div className="max-w-[1200px] mx-auto hover:shadow-lg transition-all duration-300" data-preview-component>
                {getCurrentStyle()?.style && (
                  slideState.currentSlideType === 'question' ? (
                    <SlidePreviewA
                      question={questions[slideState.currentQuestionIndex]}
                      style={getCurrentStyle().style}
                      isExporting={slideState.isExporting}
                    />
                  ) : (
                    <SlidePreviewA
                      question={questions[slideState.currentQuestionIndex]}
                      style={getCurrentStyle().style}
                      showAnswerRationale
                      isExporting={slideState.isExporting}
                    />
                  )
                )}
              </div>

              {/* Status Bar */}
              <motion.div 
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-sm text-gray-500">
                  {slideState.currentSlideType === 'question' ? 'Question' : 'Answer'} {slideState.currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="font-medium flex items-center gap-2" style={{ 
                  color: getCurrentStyle()?.isLocked 
                    ? 'rgb(34 197 94)' // green-500
                    : 'rgb(234 179 8)' // yellow-500
                }}>
                  <div className={`w-2 h-2 rounded-full ${getCurrentStyle()?.isLocked ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  {getCurrentStyle()?.isLocked 
                    ? "Style Locked"
                    : getCurrentStyle()?.style
                      ? "Style Configured (Not Locked)"
                      : "Style Not Configured"}
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <HorizontalControls
                  style={getCurrentStyle()?.style}
                  onStyleChange={handleStyleChange}
                  onLockStyle={handleStyleLock}
                  onUnlockStyle={handleStyleUnlock}
                  onPropagateStyle={handlePropagateStyle}
                  isLocked={getCurrentStyle()?.isLocked}
                />
              </motion.div>

              {/* Generate All Button */}
              {areAllStylesLocked() && (
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    className="w-48 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                    onClick={generateAllSlides}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Stethoscope className="w-4 h-4" />
                        </motion.div>
                        Generating...
                      </div>
                    ) : (
                      'Generate All Slides'
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
