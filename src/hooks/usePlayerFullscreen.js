import { useCallback, useEffect, useRef, useState } from 'react';

export function usePlayerFullscreen(containerRef, videoRef, setIsFullscreen, nativeVideoEnabled, disabled) {
  const [expanded, setExpanded] = useState(false);
  const orientationLocked = useRef(false);

  const unlockOrientation = useCallback(() => {
    if (!orientationLocked.current) return;
    orientationLocked.current = false;
    try { screen.orientation?.unlock?.(); } catch { /* Browser may have already unlocked. */ }
  }, []);

  const lockLandscape = useCallback(async () => {
    if (!window.matchMedia('(pointer: coarse)').matches || !screen.orientation?.lock) return;
    try {
      await screen.orientation.lock('landscape');
      orientationLocked.current = true;
      const element = document.fullscreenElement || document.webkitFullscreenElement;
      if (!containerRef.current?.contains(element) && !videoRef.current?.webkitDisplayingFullscreen) {
        unlockOrientation();
      }
    } catch (error) {
      console.info('[PLAYER] Landscape lock unavailable', error.name);
    }
  }, [containerRef, videoRef, unlockOrientation]);

  useEffect(() => {
    if (!disabled) return;
    setExpanded(false);
    setIsFullscreen(false);
    unlockOrientation();
  }, [disabled, setIsFullscreen, unlockOrientation]);

  useEffect(() => {
    const onFullscreenChange = () => {
      const element = document.fullscreenElement || document.webkitFullscreenElement;
      const container = containerRef.current;
      const active = !!(element && container && (element === container || container.contains(element)));
      setIsFullscreen(active);
      if (active) {
        setExpanded(false);
        void lockLandscape();
      } else {
        unlockOrientation();
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      unlockOrientation();
      setIsFullscreen(false);
    };
  }, [containerRef, setIsFullscreen, lockLandscape, unlockOrientation]);

  useEffect(() => {
    const video = nativeVideoEnabled ? videoRef.current : null;
    if (!video) return;
    const onBegin = () => setIsFullscreen(true);
    const onEnd = () => { setIsFullscreen(false); unlockOrientation(); };
    video.addEventListener('webkitbeginfullscreen', onBegin);
    video.addEventListener('webkitendfullscreen', onEnd);
    return () => {
      video.removeEventListener('webkitbeginfullscreen', onBegin);
      video.removeEventListener('webkitendfullscreen', onEnd);
    };
  }, [nativeVideoEnabled, videoRef, setIsFullscreen, unlockOrientation]);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = event => {
      if (event.key === 'Escape') { setExpanded(false); setIsFullscreen(false); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded, setIsFullscreen]);

  const toggleFullscreen = useCallback(async () => {
    const element = document.fullscreenElement || document.webkitFullscreenElement;
    try {
      if (element) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        await exit?.call(document);
      } else if (videoRef.current?.webkitDisplayingFullscreen) {
        videoRef.current.webkitExitFullscreen();
      } else if (expanded) {
        setExpanded(false);
        setIsFullscreen(false);
      } else {
        const container = containerRef.current;
        const request = container?.requestFullscreen || container?.webkitRequestFullscreen;
        const enabled = document.fullscreenEnabled ?? document.webkitFullscreenEnabled ?? true;
        if (request && enabled) {
          await request.call(container);
        } else if (nativeVideoEnabled && videoRef.current?.webkitEnterFullscreen) {
          videoRef.current.webkitEnterFullscreen();
        } else {
          setExpanded(true);
          setIsFullscreen(true);
        }
      }
    } catch (error) {
      // Fullscreen permission failure must never change the playback source.
      console.warn('[PLAYER] Fullscreen unavailable', error.name);
    }
  }, [expanded, containerRef, videoRef, nativeVideoEnabled, setIsFullscreen]);

  return { expanded, toggleFullscreen };
}
