import { EDITOR_MODE_INFO, setInfo } from 'App/reducers/editorSlice';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useShowAndHideClass } from 'hooks/useShowAndHide';
import { Analyzer } from './Analyzer';
import { useCurrentPath } from 'hooks/useGoTo';
import './_visualPanel.scss';

export const VisualPanel = () => {
  return (
    <div id='visualPanel' className='visualPanel'>
      <Info />
      <Analyzer />
    </div>
  );
};

const Info = () => {
  const { state, classes } = useInfoState();

  const memo = useMemo(() => {
    return (
      <div className={classes.container}>
        {state.countIn ? (
          <p className={classes.countIn}>{state.countIn}</p>
        ) : (
          <p className={classes.infoText}>{state.infoText}</p>
        )}
      </div>
    );
  }, [classes, state]);

  return memo;
};

const useInfoState = () => {
  const editorMode = useSelector((state) => state.editor.mode);

  const state = {};
  state.editing = useSelector((state) => state.editor.selectedSample !== -1);
  state.transportStarted = useSelector((state) => state.tone.transportState === 'started');
  state.analyzerOn = useSelector((state) => state.screen.analyzer.on);
  state.splitSamplePanel = useSelector((state) => state.screen.splitSamplePanel);
  state.countIn = useSelector((state) => state.tone.countIn);
  state.infoText = useSelector((state) => state.editor.info);
  state.flashInfo = useSelector((state) => state.app.flashInfo);
  const { mixing } = useCurrentPath();
  state.mixing = mixing;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setInfo(EDITOR_MODE_INFO[editorMode]));
  }, [dispatch, editorMode]);

  const classes = useInfoStyle(state);

  return { state, classes };
};

const useInfoStyle = (state) => {
  const classes = {};
  classes.countIn = useShowAndHideClass('countIn', 100, state.countIn);
  classes.infoText = useShowAndHideClass('infoText', 3000, state.infoText, state.flashInfo);

  let showInfo = !state.editing;
  if (state.transportStarted && state.analyzerOn) showInfo = false;
  if (!state.splitSamplePanel && state.mixing) showInfo = false;
  classes.container = showInfo ? 'info show' : 'info';

  return classes;
};
