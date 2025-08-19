import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 关卡数据处理工具函数
export const levelDataUtils = {
  // 获取关卡难度颜色
  getDifficultyColor: (difficulty: 'easy' | 'medium' | 'hard') => {
    switch(difficulty) {
      case 'easy': return 'from-green-500 to-teal-500';
      case 'medium': return 'from-yellow-500 to-amber-500';
      case 'hard': return 'from-red-500 to-pink-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  },

  // 获取关卡难度文本
  getDifficultyText: (difficulty: 'easy' | 'medium' | 'hard') => {
    switch(difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  },

  // 格式化德语名词（添加冠词）
  formatGermanNoun: (noun: string, gender: 'der' | 'die' | 'das') => {
    return `${gender} ${noun}`;
  },

  // 保存用户进度到本地存储
  saveUserProgress: (levelId: string, score: number, total: number) => {
    const progress = JSON.parse(localStorage.getItem('germanLearningProgress') || '{}');
    progress[levelId] = {
      completed: score >= Math.floor(total * 0.7),
      score,
      total,
      lastAttempt: new Date().toISOString()
    };
    localStorage.setItem('germanLearningProgress', JSON.stringify(progress));
    return progress[levelId].completed;
  },

  // 获取用户关卡进度
  getUserProgress: (levelId: string) => {
    const progress = JSON.parse(localStorage.getItem('germanLearningProgress') || '{}');
    return progress[levelId] || { completed: false, score: 0, total: 0 };
  },

  // 获取解锁的关卡
  getUnlockedLevels: () => {
    const unlocked = localStorage.getItem('unlockedLevels');
    return unlocked ? JSON.parse(unlocked) : ['a1-1'];
  },

  // 解锁新关卡
  unlockLevel: (levelId: string) => {
    const unlocked = levelDataUtils.getUnlockedLevels();
    if (!unlocked.includes(levelId)) {
      unlocked.push(levelId);
      localStorage.setItem('unlockedLevels', JSON.stringify(unlocked));
    }
  }
}
