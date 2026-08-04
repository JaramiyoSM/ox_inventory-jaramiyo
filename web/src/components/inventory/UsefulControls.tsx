import { Locale } from '../../store/locale';
import React from 'react';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react';
import { sfx } from '../../utils/sfx';

interface Props {
  infoVisible: boolean;
  setInfoVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsefulControls: React.FC<Props> = ({ infoVisible, setInfoVisible }) => {
  const { refs, context } = useFloating({
    open: infoVisible,
    onOpenChange: setInfoVisible,
  });

  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });

  const { isMounted, styles } = useTransitionStyles(context);

  const { getFloatingProps } = useInteractions([dismiss]);

  const [muted, setMuted] = React.useState(sfx.isMuted());

  return (
    <>
      {isMounted && (
        <FloatingPortal>
          <FloatingOverlay lockScroll className="useful-controls-dialog-overlay" data-open={infoVisible} style={styles}>
            <FloatingFocusManager context={context}>
              <div ref={refs.setFloating} {...getFloatingProps()} className="useful-controls-dialog" style={styles}>
                <div className="useful-controls-dialog-title">
                  <p>{Locale.ui_usefulcontrols || 'Useful controls'}</p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div
                      className="useful-controls-dialog-close"
                      onClick={() => setMuted(sfx.toggleMute())}
                      aria-label="toggle sound"
                    >
                      {muted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                          <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
                          <path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" />
                        </svg>
                      )}
                    </div>
                    <div className="useful-controls-dialog-close" onClick={() => setInfoVisible(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 400 528">
                        <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="useful-controls-content-wrapper">
                  <p>
                    <kbd>RMB</kbd>
                    <br />
                    {Locale.ui_rmb}
                  </p>
                  <p>
                    <kbd>ALT + LMB</kbd>
                    <br />
                    {Locale.ui_alt_lmb}
                  </p>
                  <p>
                    <kbd>CTRL + LMB</kbd>
                    <br />
                    {Locale.ui_ctrl_lmb}
                  </p>
                  <p>
                    <kbd>SHIFT + Drag</kbd>
                    <br />
                    {Locale.ui_shift_drag}
                  </p>
                  <p>
                    <kbd>CTRL + SHIFT + LMB</kbd>
                    <br />
                    {Locale.ui_ctrl_shift_lmb}
                  </p>
                  <div style={{ textAlign: 'right', color: '#d9738f', fontSize: '18px' }}>✿</div>
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );
};

export default UsefulControls;
