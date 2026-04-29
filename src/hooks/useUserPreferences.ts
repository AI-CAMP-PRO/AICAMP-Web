"use client";

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  // 首次访问跟踪
  hasCompletedWelcome: boolean;
  hasSeenGuide: boolean;
  
  // 功能使用跟踪
  hasUsedDemo: boolean;
  hasGeneratedQuiz: boolean;
  hasEditedQuiz: boolean;
  hasExportedQuiz: boolean;
  
  // UI偏好
  showDemoButtons: boolean;
  
  // 最后活动时间
  lastActive: string;
}

// 默认偏好
const defaultPreferences: UserPreferences = {
  hasCompletedWelcome: false,
  hasSeenGuide: false,
  hasUsedDemo: false,
  hasGeneratedQuiz: false,
  hasEditedQuiz: false,
  hasExportedQuiz: false,
  showDemoButtons: true,
  lastActive: new Date().toISOString(),
};

// 存储键
const STORAGE_KEY = 'quiz-generator-preferences';

/**
 * 用户偏好设置钩子
 * 管理和持久化用户偏好设置
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从localStorage加载偏好设置
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const storedPrefs = localStorage.getItem(STORAGE_KEY);
      if (storedPrefs) {
        const parsedPrefs = JSON.parse(storedPrefs);
        // 将保存的值与默认值合并，确保结构正确
        setPreferences(prev => ({
          ...defaultPreferences,
          ...parsedPrefs,
        }));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 保存到localStorage
  const savePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    if (typeof window === 'undefined') return;
    
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs, lastActive: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
      return updated;
    });
  }, []);

  // 完成欢迎流程
  const completeWelcome = useCallback(() => {
    savePreferences({ hasCompletedWelcome: true });
  }, [savePreferences]);

  // 完成引导
  const completeGuide = useCallback(() => {
    savePreferences({ hasSeenGuide: true });
  }, [savePreferences]);

  // 记录演示使用
  const trackDemoUsage = useCallback(() => {
    savePreferences({ hasUsedDemo: true });
  }, [savePreferences]);

  // 记录测验生成
  const trackQuizGeneration = useCallback(() => {
    savePreferences({ hasGeneratedQuiz: true });
  }, [savePreferences]);

  // 记录测验编辑
  const trackQuizEditing = useCallback(() => {
    savePreferences({ hasEditedQuiz: true });
  }, [savePreferences]);

  // 记录测验导出
  const trackQuizExport = useCallback(() => {
    savePreferences({ hasExportedQuiz: true });
  }, [savePreferences]);

  // 切换演示按钮显示
  const toggleDemoButtons = useCallback(() => {
    savePreferences({ showDemoButtons: !preferences.showDemoButtons });
  }, [preferences.showDemoButtons, savePreferences]);

  // 检查是否是新用户（首次访问）
  const isNewUser = isLoaded && !preferences.hasCompletedWelcome;

  // 检查是否需要显示引导
  const shouldShowGuide = isLoaded && preferences.hasCompletedWelcome && !preferences.hasSeenGuide;

  return {
    preferences,
    isLoaded,
    isNewUser,
    shouldShowGuide,
    completeWelcome,
    completeGuide,
    trackDemoUsage,
    trackQuizGeneration,
    trackQuizEditing,
    trackQuizExport,
    toggleDemoButtons,
    savePreferences,
  };
} 