import { useState, useEffect } from 'react';

// 断点定义
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

// 检测是否在指定断点之上
export function useBreakpoint(breakpoint: Breakpoint) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = `(min-width: ${breakpoints[breakpoint]}px)`;
    const media = window.matchMedia(query);

    // 设置初始值
    setMatches(media.matches);

    // 监听变化
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return matches;
}

// 检测移动端
export function useIsMobile() {
  return !useBreakpoint('md');
}

// 检测桌面端
export function useIsDesktop() {
  return useBreakpoint('lg');
}

// 获取当前屏幕尺寸
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 设置初始值
    updateSize();

    // 监听变化
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return screenSize;
}

// 获取设备方向
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateOrientation = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };

    // 设置初始值
    updateOrientation();

    // 监听变化
    window.addEventListener('resize', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return orientation;
}

// 检测触摸设备
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
}

// 综合响应式信息
export function useResponsive() {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const screenSize = useScreenSize();
  const orientation = useOrientation();
  const isTouchDevice = useIsTouchDevice();

  return {
    isMobile,
    isTablet: !isMobile && !isDesktop,
    isDesktop,
    screenSize,
    orientation,
    isTouchDevice,
    breakpoints: {
      sm: useBreakpoint('sm'),
      md: useBreakpoint('md'),
      lg: useBreakpoint('lg'),
      xl: useBreakpoint('xl'),
      '2xl': useBreakpoint('2xl'),
    },
  };
} 