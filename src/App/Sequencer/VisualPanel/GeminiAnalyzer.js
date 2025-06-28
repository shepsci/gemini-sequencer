import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { kitBus } from 'App/Tone';

export const GeminiAnalyzer = () => {
  const kickPulseRef = useRef(null);

  useEffect(() => {
    const meter = new Tone.Meter();
    kitBus.connect(meter);

    const loop = new Tone.Loop((time) => {
      const level = Tone.dbToGain(meter.getValue());
      if (level > 0.1) {
        kickPulseRef.current.classList.add('kick');
        setTimeout(() => {
          kickPulseRef.current.classList.remove('kick');
        }, 100);
      }
    }, '16n').start(0);

    return () => {
      loop.dispose();
      meter.dispose();
    };
  }, []);

  return (
    <div className='gemini-analyzer'>
      <h1 className='gemini-text'>gemini</h1>
      <div ref={kickPulseRef} className='kick-pulse' />
      <div className='gemini-analyzer-text gemini-top-right-1'>gemini</div>
      <div className='gemini-analyzer-text gemini-top-right-2'>gemini</div>
      <div className='gemini-analyzer-text gemini-top-right-3'>gemini</div>
      <div className='gemini-analyzer-text gemini-top-right-4'>gemini</div>
      <div className='gemini-analyzer-text gemini-top-right-5'>gemini</div>
      <div className='gemini-analyzer-text gemini-top-right-6'>gemini</div>
    </div>
  );
};
