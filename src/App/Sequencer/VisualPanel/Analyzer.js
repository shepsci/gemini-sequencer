import { GeminiAnalyzer } from './GeminiAnalyzer';
import { areWeTapping } from 'App/reducers/abstractState/abstractEditorState';
import { startAnalyzer } from 'App/reducers/functions/animations';
import { ANALYZER_MODES } from 'App/reducers/screenSlice';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getGrid } from 'utils/getGrid';

export const Analyzer = () => {
  const { classes, data } = useAnalyzerState();

  const grid = useMemo(() => getGrid(16), []);

  const memo = useMemo(() => {
    if (data.analyzerMode === ANALYZER_MODES.GEMINI) return <GeminiAnalyzer />;
    return (
      <div className={classes.analyzer}>
        {grid.map((i) => {
          return (
            <div
              key={`freq-${i + 3}`}
              className='freq'
              data-scalex={data.scaleX}
              data-scaley={data.scaleY}
              // data-blur={data.blur}
              data-i={i}
            />
          );
        })}
      </div>
    );
  }, [classes.analyzer, data.scaleX, data.scaleY, grid]);
  return memo;
};

const useAnalyzerState = () => {
  const state = {};
  state.splitSamplePanel = useSelector((state) => state.screen.splitSamplePanel);
  state.editorMode = useSelector((state) => state.editor.mode);
  state.editing = useSelector((state) => state.editor.selectedSample !== -1);
  state.analyzerMode = useSelector((state) => state.screen.analyzer.mode);
  state.analyzerOn = useSelector((state) => state.screen.analyzer.on);

  const transportStarted = useSelector((state) => state.tone.transportState === 'started');
  const tapping = useSelector((state) => areWeTapping(state.editor.mode));
  if (state.analyzerOn) {
    if (transportStarted || tapping) startAnalyzer();
  }

  const { classes, data } = useAnalyzerStyle(state);

  return { classes, data };
};

const useAnalyzerStyle = ({ analyzerMode, analyzerOn, splitSamplePanel, editing }) => {
  const memo = useMemo(() => {
    const data = {};
    data.scaleX = analyzerMode === ANALYZER_MODES.WAVE ? 0.2 : 1;
    data.scaleY = analyzerMode === ANALYZER_MODES.RIPPLE ? 1 : 0;
    // data.blur = analyzerMode === ANALYZER_MODES.BARS ? 0 : 50;

    const classes = {};
    classes.analyzer = 'analyzer ' + analyzerMode;
    if (!splitSamplePanel) {
      classes.analyzer += ' bg3q';
      if (editing || !analyzerOn) classes.analyzer += ' hide';
    }

    return { classes, data };
  }, [analyzerMode, analyzerOn, editing, splitSamplePanel]);
  return memo;
};
