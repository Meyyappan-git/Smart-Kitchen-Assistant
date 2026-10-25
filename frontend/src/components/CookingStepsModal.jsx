import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Volume2, VolumeX, CheckCircle2, Utensils, Clock, Flame, 
  ChefHat, Sparkles, Check, AlertCircle 
} from 'lucide-react';
import MascotChef from './MascotChef';

export default function CookingStepsModal({ 
  recipe, 
  onClose, 
  onFinishAndDeduct 
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const timerIntervalRef = useRef(null);

  const steps = recipe?.steps || [
    "Prepare and wash all ingredients.",
    "Heat cooking pan with butter or oil.",
    "Combine ingredients and cook according to recipe instructions.",
    "Season to taste and serve fresh."
  ];

  const totalSteps = steps.length;
  const progressPct = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Extract timer recommendation if step mentions minutes (e.g., "5 minutes", "10-15 minutes")
  useEffect(() => {
    const currentText = steps[currentStepIndex] || '';
    const match = currentText.match(/(\d+)(?:-\d+)?\s*(?:minutes|mins|min)/i);
    if (match) {
      const minutes = parseInt(match[1]);
      setTimerSeconds(minutes * 60);
    } else {
      setTimerSeconds(0);
    }
    setIsTimerRunning(false);
    stopSpeaking();
  }, [currentStepIndex]);

  // Timer interval handling
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            try {
              // Play gentle chime
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
              osc.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.5);
            } catch (e) {
              // ignore audio ctx restriction
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  // Read step aloud with Web Speech Synthesis
  const speakCurrentStep = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `Step ${currentStepIndex + 1}. ${steps[currentStepIndex]}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleIngredientCheck = (name) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const isFinalStep = currentStepIndex === totalSteps - 1;

  const handleNext = () => {
    if (!isFinalStep) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      stopSpeaking();
      onFinishAndDeduct();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Helper tips from Robot Chef for different stages
  const getChefTip = () => {
    if (currentStepIndex === 0) return "Prep all items in small bowls before starting heat for effortless cooking!";
    if (currentStepIndex === 1) return "Keep medium heat so garlic and aromatics release flavor without scorching.";
    if (currentStepIndex === totalSteps - 1) return "Taste test for salt, pepper, and freshness before plating!";
    return "Stir consistently to allow even heat distribution.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-stone-200/80">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center border border-stone-700">
              <Utensils className="w-4 h-4 text-stone-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-stone-800 text-[10px] font-medium uppercase tracking-wider text-stone-300">
                  Live Cooking Mode
                </span>
                <span className="text-xs text-stone-400 font-normal">
                  ₹{recipe?.cost_inr || 150} • {recipe?.difficulty || 'Easy'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight leading-tight mt-0.5">
                {recipe?.title || 'Cooking Recipe'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopSpeaking();
                onFinishAndDeduct();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium transition-all cursor-pointer border border-stone-700"
              title="Skip steps and mark as cooked"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark Cooked</span>
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Exit Cooking Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="w-full bg-stone-100 h-1.5 shrink-0">
          <div 
            className="h-full bg-stone-900 transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Main Body (Desktop 2-column layout: Left Step Instructions, Right Ingredients & Timer) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Step Guide & Narration (7 cols on desktop) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Step counter pill & Read button */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-100 text-stone-700 font-semibold text-xs tracking-wide uppercase">
                  <span>Step {currentStepIndex + 1} of {totalSteps}</span>
                </span>

                <button
                  type="button"
                  onClick={speakCurrentStep}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSpeaking 
                      ? 'bg-stone-900 text-white' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                  title="Listen to step hands-free"
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
                </button>
              </div>

              {/* Large Step Text */}
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/70 relative">
                <p className="text-lg sm:text-xl font-semibold text-stone-900 leading-relaxed">
                  {steps[currentStepIndex]}
                </p>

                {/* Friendly Chef Advice */}
                <div className="mt-5 pt-4 border-t border-stone-200/60 flex items-start gap-3">
                  <div className="shrink-0 pt-0.5">
                    <MascotChef variant="avatar" size={32} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                      Chef Tip
                    </span>
                    <p className="text-xs text-stone-600 font-normal italic mt-0.5">
                      "{getChefTip()}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className={`px-5 py-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                  isFinalStep
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                    : 'bg-stone-900 hover:bg-stone-800 text-white shadow-2xs'
                }`}
              >
                <span>{isFinalStep ? 'Finish & Deduct from Fridge' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>


          {/* Right Column: Interactive Kitchen Timer & Ingredients Checklist (5 cols on desktop) */}
          <div className="md:col-span-5 space-y-5 flex flex-col justify-between">
            
            {/* Step Kitchen Timer Card */}
            <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-md border border-stone-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>Kitchen Timer</span>
                </span>
                {timerSeconds > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isTimerRunning ? 'bg-orange-500/20 text-orange-400 animate-pulse' : 'bg-stone-800 text-stone-400'}`}>
                    {isTimerRunning ? 'Running' : 'Ready'}
                  </span>
                )}
              </div>

              {/* Digital Timer Clock Display */}
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-center py-2 text-orange-400 tracking-wider">
                {formatTimer(timerSeconds)}
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-2 mt-2">
                {timerSeconds > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isTimerRunning 
                          ? 'bg-amber-500 hover:bg-amber-600 text-stone-950' 
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSeconds(0);
                      }}
                      className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors cursor-pointer"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTimerSeconds(180)}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 rounded-lg cursor-pointer"
                    >
                      +3m
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimerSeconds(300)}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 rounded-lg cursor-pointer"
                    >
                      +5m
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimerSeconds(600)}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 rounded-lg cursor-pointer"
                    >
                      +10m
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients Checklist for this recipe */}
            <div className="bg-stone-50 rounded-3xl p-5 border border-stone-200/80 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Ingredients Checklist
                  </h3>
                  <span className="text-[10px] text-stone-500 font-semibold">
                    {Object.values(checkedIngredients).filter(Boolean).length} / {(recipe?.ingredients || []).length} ready
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {(recipe?.ingredients || []).map((ing, idx) => {
                    const isChecked = !!checkedIngredients[ing.name];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleIngredientCheck(ing.name)}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 line-through opacity-75' 
                            : 'bg-white text-slate-800 border border-stone-100 hover:border-orange-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-semibold capitalize">{ing.name}</span>
                        </div>
                        <span className="text-[11px] text-stone-500 font-bold">
                          {ing.amount} {ing.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recipe Quick Fact */}
              <div className="mt-3 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  {recipe?.calories || 400} calories
                </span>
                <span className="flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5 text-slate-600" />
                  {recipe?.cuisine || 'Gourmet'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
