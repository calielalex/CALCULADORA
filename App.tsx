
import React, { useState, useEffect, useCallback } from 'react';
import { Calculator } from './components/Calculator';
import { CalculatorButton } from './components/CalculatorButton';
import { AnimatedBackground } from './components/AnimatedBackground';
import { FloatingAnimation } from './components/FloatingAnimation';
import { generateSpeech } from './services/geminiService';
import { useSoundEffects } from './hooks/useSoundEffects';

type FloatingNumber = {
  id: number;
  content: string;
  style: React.CSSProperties;
};

const App: React.FC = () => {
  const [expression, setExpression] = useState<string>('');
  const [display, setDisplay] = useState<string>('0');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [floatingAnimations, setFloatingAnimations] = useState<FloatingNumber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { playPop, playChime, playError, playMusic, stopMusic } = useSoundEffects();

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);
  
  useEffect(() => {
    playMusic();
    return () => stopMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const safeEval = (exp: string): number | null => {
    const sanitized = exp.replace(/[^0-9+\-*/.]/g, '');
    if (sanitized !== exp || /[+\-*/.]{2,}/.test(sanitized)) {
      return null;
    }
    try {
      // Using Function constructor is safer than direct eval
      return new Function(`return ${sanitized}`)();
    } catch (error) {
      console.error("Evaluation error:", error);
      return null;
    }
  };
  
  const expressionToWords = (exp: string, result: number): string => {
      const readableExp = exp
          .replace(/\*/g, ' times ')
          .replace(/\//g, ' divided by ')
          .replace(/\+/g, ' plus ')
          .replace(/-/g, ' minus ');
      return `${readableExp}... equals ${result}!`;
  };

  const handleEquals = useCallback(async () => {
    if (!expression || isLoading) return;

    setIsLoading(true);
    const result = safeEval(expression);

    if (result === null || !isFinite(result)) {
      setDisplay('Error');
      setExpression('');
      playError();
      setIsLoading(false);
      return;
    }
    
    setDisplay(result.toString());

    const resultParts = [...expression.split(/([+\-*/])/), '=', result.toString()];
    const newAnimations = resultParts.map((part, index) => ({
        id: Date.now() + index,
        content: part.replace('*','x'),
        style: {
            left: `${10 + index * (80 / resultParts.length)}%`,
            animationDelay: `${index * 0.2}s`,
            color: `hsl(${Math.random() * 360}, 90%, 60%)`
        }
    }));
    setFloatingAnimations(newAnimations);


    const textToSpeak = expressionToWords(expression, result);
    try {
        const { audioBase64, duration } = await generateSpeech(textToSpeak);
        
        setIsSpeaking(true);
        const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
        audio.play();
        playChime();
        
        audio.onended = () => {
            setIsSpeaking(false);
            setIsCelebrating(true);
            setTimeout(() => {
                setIsCelebrating(false);
                setFloatingAnimations([]);
            }, 2000);
        };

    } catch (error) {
        console.error("Gemini TTS Error:", error);
        setDisplay('Audio Error');
        playError();
        setIsSpeaking(false);
    } finally {
        setExpression('');
        setIsLoading(false);
    }
  }, [expression, isLoading, playChime, playError]);

  const handleButtonClick = (value: string) => {
    playPop();
    if (isLoading) return;

    if (value === '=') {
      handleEquals();
      return;
    }
    if (value === 'C') {
      setExpression('');
      setDisplay('0');
      setFloatingAnimations([]);
      return;
    }
    
    const newExpression = expression + value;
    setExpression(newExpression);
    setDisplay(newExpression.replace(/\*/g, 'x'));
  };

  const buttons = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '+', '='];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-purple-300 via-pink-300 to-red-300 overflow-hidden">
        <AnimatedBackground />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
            {floatingAnimations.map(anim => (
                <FloatingAnimation key={anim.id} style={anim.style}>
                    {anim.content}
                </FloatingAnimation>
            ))}
        </div>
        <main className="z-10 flex flex-col items-center p-4">
            <h1 className="font-fredoka text-5xl md:text-7xl text-white text-center mb-8 drop-shadow-lg">
                Calc-U-Bot 3000
            </h1>
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-2 border-white/50">
                <Calculator 
                    displayValue={display} 
                    isSpeaking={isSpeaking}
                    isCelebrating={isCelebrating}
                    isBlinking={isBlinking}
                    isLoading={isLoading}
                />
                <div className="grid grid-cols-4 gap-3 mt-6">
                    {buttons.map(btn => (
                        <CalculatorButton 
                            key={btn} 
                            label={btn === '*' ? 'x' : btn}
                            onClick={() => handleButtonClick(btn)}
                            isOperator={['/','*','-','+','='].includes(btn)}
                            isClear={btn === 'C'}
                        />
                    ))}
                </div>
            </div>
        </main>
    </div>
  );
}

export default App;
