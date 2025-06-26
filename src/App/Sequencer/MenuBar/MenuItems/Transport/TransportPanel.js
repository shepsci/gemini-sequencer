import React, { useEffect, useMemo } from 'react';
import * as Tone from 'tone';
import { useDispatch } from 'react-redux';
import { Button } from 'App/shared/Button';
import {
  StopIcon,
  StartIcon,
  PauseIcon,
  CheckIcon,
  RecordIcon,
  RestartIcon,
} from 'assets/icons';
import { pauseSequence, startSequence, stopSequence } from 'App/reducers/toneSlice';
import { startRecord } from 'App/reducers/thunks/toneThunks';
import { useBpmInput } from './useBpmInput';
import { TransportBtn } from './TransportBtn';
import { useShowTransportBtns } from './useShowTransportBtns';
import { scrollToTransport } from 'App/shared/Scrollable/scrollHelpers';

export const TransportPanel = () => {
  useEffect(() => setTimeout(scrollToTransport, 150), []);
  const memo = useMemo(() => {
    return (
      <div id='transport' className='menuItems transport'>
        <div className='transportWrapper'>
          <TransportBtns />
          <BpmInput />
        </div>
      </div>
    );
  }, []);
  return memo;
};

const TransportBtns = () => {
  const dispatch = useDispatch();
  const { recordBtn, restartBtn, startBtn, pauseBtn } = useShowTransportBtns();

  const onStop = () => dispatch(stopSequence());
  const onRecord = () => dispatch(startRecord());
  const onStart = () => {
    Tone.start();
    dispatch(startSequence());
  };
  const onPause = () => dispatch(pauseSequence());
  return (
    <>
      <TransportBtn id='stop' onClick={onStop} Icon={StopIcon} show={true} />
      <TransportBtn id='record' onClick={onRecord} Icon={RecordIcon} show={recordBtn} />
      <TransportBtn id='restart' onClick={onRecord} Icon={RestartIcon} show={restartBtn} />
      <TransportBtn id='start' onClick={onStart} Icon={StartIcon} show={startBtn} />
      <TransportBtn id='pause' onClick={onPause} Icon={PauseIcon} show={pauseBtn} />
    </>
  );
};

const BpmInput = () => {
  const { bpmEdited, tempBpm, onChange, onKeyPress, handleBpm } = useBpmInput();

  const memo = useMemo(() => {
    return (
      <div className='inputWrapper'>
        <input
          id='bpm'
          className={bpmEdited ? 'input edited' : 'input'}
          type='tel'
          value={tempBpm}
          onChange={onChange}
          onKeyPress={onKeyPress}
        ></input>
        <BpmOrBtn bpmEdited={bpmEdited} handleBpm={handleBpm} />
      </div>
    );
  }, [bpmEdited, handleBpm, onChange, onKeyPress, tempBpm]);
  return memo;
};

const BpmOrBtn = ({ bpmEdited, handleBpm }) => {
  return (
    <div className='bpmOrBtn'>
      {bpmEdited ? (
        <Button id='bpmBtn' classes='bpmBtn' onClick={handleBpm}>
          <label htmlFor='bpmBtn'>
            <CheckIcon />
          </label>
        </Button>
      ) : (
        <label htmlFor='bpm'>bpm</label>
      )}
    </div>
  );
};
