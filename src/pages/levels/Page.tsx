import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

// 定义关卡数据类型
interface Level {
  id: string;
  title: string;
  description: string;
  level: 'a1' | 'a2' | 'b1';
  stage: number;
  totalSublevels: number;
  completedSublevels: number;
  unlocked: boolean;
  imagePrompt: string;
  isSpecial?: boolean;
  requiredScore: number;
  experiencePoints: number;
  textbookUnit: string; // 对应《新一代大学德语》单元
  reward?: {
    type: 'skin' | 'car_part' | 'badge';
    name: string;
    imagePrompt: string;
  };
}

// 定义用户进度数据类型
interface UserProgress {
  levelId: string;
  completed: boolean;
  score: number;
  experienceGained: number;
  lastAttempt: string;
  rewardsCollected: string[];
}

export default function LevelSelectionPage() {
  const { theme } = useTheme();
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [showLevelDetail, setShowLevelDetail] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  
  // 加载用户数据
  useEffect(() => {
    const loadUserData = () => {
      const savedLevel = localStorage.getItem('userLevel');
      const savedXP = localStorage.getItem('experiencePoints');
      const savedNextLevelXP = localStorage.getItem('nextLevelXP');
      
      if (savedLevel) setUserLevel(parseInt(savedLevel));
      if (savedXP) setExperiencePoints(parseInt(savedXP));
      if (savedNextLevelXP) setNextLevelXP(parseInt(savedNextLevelXP));
    };
    
    loadUserData();
  }, []);
  
  // 模拟关卡数据
  const levels: Level[] = [
    {
      id: 'a1-1',
      title: 'A1.1 入门基础',
      description: '掌握德语发音和基础词汇，学习简单对话',
      level: 'a1',
      stage: 1,
      totalSublevels: 12,
      completedSublevels: 0,
      unlocked: true,
      requiredScore: 8,
      experiencePoints: 150,
      textbookUnit: '《新一代大学德语》第一单元',
      imagePrompt: 'German language learning interface A1 level with automotive elements, clean modern design, tech style',
      reward: {
        type: 'badge',
        name: '德语初学者',
        imagePrompt: 'Gold badge with German flag and beginner symbol, 3D rendering'
      }
    },
    {
      id: 'a1-2',
      title: 'A1.2 初级扩展',
      description: '扩展基础语法和词汇量，能够进行日常交流',
      level: 'a1',
      stage: 2,
      totalSublevels: 12,
      completedSublevels: 0,
      unlocked: false,
      requiredScore: 8,
      experiencePoints: 180,
      textbookUnit: '《新一代大学德语》第二单元',
      imagePrompt: 'German language learning interface A1.2 level with car dashboard elements, progress visualization',
      reward: {
        type: 'skin',
        name: '蓝色仪表盘',
        imagePrompt: 'Car dashboard with blue theme, digital display, modern design'
      }
    },
    {
      id: 'a2-1',
      title: 'A2.1 中级基础',
      description: '学习更复杂的语法结构，扩大词汇量',
      level: 'a2',
      stage: 1,
      totalSublevels: 15,
      completedSublevels: 0,
      unlocked: false,
      requiredScore: 10,
      experiencePoints: 220,
      textbookUnit: '《新一代大学德语》第三单元',
      imagePrompt: 'German language learning interface A2 level with technical automotive elements',
      reward: {
        type: 'car_part',
        name: '车轮模型',
        imagePrompt: '3D model of car wheel, technical drawing style, high detail'
      }
    },
    {
      id: 'a2-2',
      title: 'A2.2 中级扩展',
      description: '提高听说读写能力，学习专业相关基础词汇',
      level: 'a2',
      stage: 2,
      totalSublevels: 15,
      completedSublevels: 0,
      unlocked: false,
      requiredScore: 10,
      experiencePoints: 250,
      textbookUnit: '《新一代大学德语》第四单元',
      imagePrompt: 'Advanced German learning interface with automotive engineering vocabulary',
      reward: {
        type: 'car_part',
        name: '变速箱模型',
        imagePrompt: '3D model of car transmission, technical drawing style'
      }
    },
    {
      id: 'b1',
      title: 'B1 中级应用',
      description: '达到德语B1水平，能够理解和运用复杂语言结构',
      level: 'b1',
      stage: 1,
      totalSublevels: 15,
      completedSublevels: 0,
      unlocked: false,
      requiredScore: 12,
      experiencePoints: 300,
      textbookUnit: '《新一代大学德语》第五、六单元',
      imagePrompt: 'German B1 level learning interface with complex automotive technical content',
      reward: {
        type: 'badge',
        name: '德语工程师',
        imagePrompt: 'Silver badge with engineer symbol and German flag, 3D rendering'
      }
    },
    {
      id: 'vehicle-vocab',
      title: '车辆工程专业词汇',
      description: '掌握汽车工程领域的专业德语术语',
      level: 'a2',
      stage: 0,
      totalSublevels: 10,
      completedSublevels: 0,
      unlocked: false,
      isSpecial: true,
      requiredScore: 7,
      experiencePoints: 200,
      textbookUnit: '专业词汇补充单元',
      imagePrompt: 'Automotive engineering terminology learning interface with 3D car model and labeled parts in German',
      reward: {
        type: 'car_part',
        name: '发动机模型',
        imagePrompt: '3D model of car engine, technical drawing style, high detail'
      }
    }
  ];
  
  // 从本地存储加载关卡进度
  useEffect(() => {
    const loadLevelProgress = () => {
      const updatedLevels = levels.map(level => {
        const savedProgress = localStorage.getItem(`progress_${level.id}`);
        
        if (savedProgress) {
          const progress: UserProgress = JSON.parse(savedProgress);
          
          // 更新已完成的小关卡数量（简单模拟，实际应基于子关卡计算）
          const completedPercentage = progress.completed ? 0.8 : 0;
          
          return {
            ...level,
            completedSublevels: Math.floor(level.totalSublevels * completedPercentage),
            unlocked: level.id === 'a1-1' || progress.completed || checkUnlockCondition(level.id)
          };
        }
        
        return level;
      });
      
      // 更新关卡解锁状态（后续关卡）
      for (let i = 1; i < updatedLevels.length; i++) {
        if (!updatedLevels[i].unlocked) {
          updatedLevels[i].unlocked = checkUnlockCondition(updatedLevels[i].id, updatedLevels);
        }
      }
      
      // 更新状态
      // setLevels(updatedLevels);
    };
    
    loadLevelProgress();
  }, []);
  
  // 检查关卡解锁条件
  const checkUnlockCondition = (levelId: string, levels?: Level[]): boolean => {
    const levelList = levels || levels;
    
    if (levelId === 'a1-2') {
      const a1Level = levelList.find(l => l.id === 'a1-1');
      return a1Level?.completedSublevels >= a1Level?.totalSublevels * 0.8;
    }
    
    if (levelId === 'a2-1') {
      const a12Level = levelList.find(l => l.id === 'a1-2');
      return a12Level?.completedSublevels >= a12Level?.totalSublevels * 0.8;
    }
    
    if (levelId === 'a2-2') {
      const a21Level = levelList.find(l => l.id === 'a2-1');
      return a21Level?.completedSublevels >= a21Level?.totalSublevels * 0.8;
    }
    
    if (levelId === 'b1') {
      const a22Level = levelList.find(l => l.id === 'a2-2');
      return a22Level?.completedSublevels >= a22Level?.totalSublevels * 0.8;
    }
    
    if (levelId === 'vehicle-vocab') {
      const a12Level = levelList.find(l => l.id === 'a1-2');
      return a12Level?.completedSublevels >= a12Level?.totalSublevels * 0.8;
    }
    
    return false;
  };
  
  // 获取关卡解锁条件说明
  const getUnlockConditionText = (level: Level) => {
    if (level.id === 'a1-2') return '完成 A1.1 至少80%关卡解锁';
    if (level.id === 'a2-1') return '完成 A1.2 至少80%关卡解锁';
    if (level.id === 'a2-2') return '完成 A2.1 至少80%关卡解锁';
    if (level.id === 'b1') return '完成 A2.2 至少80%关卡解锁';
    if (level.id === 'vehicle-vocab') return '完成 A1.2 至少80%关卡解锁';
    return '默认解锁';
  };
  
  // 计算总体进度
  const calculateOverallProgress = () => {
    const total = levels.reduce((sum, level) => sum + level.totalSublevels, 0);
    const completed = levels.reduce((sum, level) => sum + level.completedSublevels, 0);
    return Math.round((completed / total) * 100);
  };
  
  // 打开关卡详情
  const openLevelDetail = (level: Level) => {
    setActiveLevel(level);
    setShowLevelDetail(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* 用户信息栏 */}
      <div className="bg-slate-800/80 border-b border-slate-700 py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <i className="fa-solid fa-user-circle text-2xl mr-2 text-blue-400"></i>
              <span>工程师 Lv.{userLevel}</span>
            </div>
            
            <div className="hidden md:flex items-center">
              <div className="w-32 bg-slate-700 h-2 rounded-full overflow-hidden mr-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((experiencePoints / nextLevelXP) * 100, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm text-slate-300">{experiencePoints}/{nextLevelXP} XP</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors">
              <i className="fa-solid fa-trophy"></i>
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors">
              <i className="fa-solid fa-garage"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* 页面头部 */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-slate-900/80 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-slate-400 hover:text-white transition-transform hover:scale-110">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="text-2xl font-bold">德语学习关卡</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-slate-800/70 backdrop-blur-lg rounded-full px-4 py-2 text-sm flex items-center">
              <i className="fa-solid fa-tachometer-alt text-amber-400 mr-2"></i>
              <span>总体进度: {calculateOverallProgress()}%</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* 页面标题和说明 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">选择你的学习关卡</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            从A1到B1，循序渐进掌握德语技能。每个大关卡包含多个小关卡，完成所有小关卡即可解锁下一阶段。
          </p>
        </motion.div>
        
        {/* 关卡进度概览 - 汽车仪表盘风格 */}
        <div className="relative mb-16 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-10">
          <h3 className="text-xl font-bold mb-8 text-center">学习进度</h3>
          
          <div className="relative">
            {/* 进度轨道 */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-2 bg-slate-700 -translate-y-1/2 z-0"></div>
            
            {/* 关卡节点 */}
            <div className="flex justify-between relative z-10">
              {levels.filter(l => !l.isSpecial).map((level, index) => (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => openLevelDetail(level)}
                >
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 relative ${
                      level.unlocked 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-blue-500/30 shadow-lg shadow-blue-500/10' 
                        : 'bg-slate-700 border-2 border-slate-600'
                    } transition-all hover:scale-110`}
                  >
                    <span className="text-xl font-bold">{level.stage}</span>
                    
                    {/* 完成标记 */}
                    {level.completedSublevels >= level.totalSublevels * 0.8 && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center">
                        <i className="fa-solid fa-check text-white text-xs"></i>
                      </div>
                    )}
                  </div>
                  
                  <span className="text-sm font-medium">{level.title.split(' ')[0]}</span>
                  
                  {/* 进度指示器 */}
                  <div className="mt-2 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-1000"
                      style={{ width: `${(level.completedSublevels / level.totalSublevels) * 100}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 主要关卡区域 */}
        <section className="mb-20">
          <h3 className="text-2xl font-bold mb-8 flex items-center">
            <i className="fa-solid fa-road text-blue-400 mr-2"></i>
            德语学习主线
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {levels.filter(l => !l.isSpecial).map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative rounded-2xl overflow-hidden border ${
                  level.unlocked 
                    ? 'border-blue-500/30 bg-slate-800/80 hover:shadow-xl hover:shadow-blue-500/10' 
                    : 'border-slate-700 bg-slate-800/50'
                } transition-all hover:translate-y-[-8px]`}
                onClick={() => openLevelDetail(level)}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={`https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=${encodeURIComponent(level.imagePrompt)}`} 
                    alt={level.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {!level.unlocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-4xl text-slate-400"></i>
                    </div>
                  )}
                  
                  {/* 关卡信息标签 */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    <span className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {level.level.toUpperCase()} 级别
                    </span>
                    <span className="bg-slate-800/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {level.textbookUnit}
                    </span>
                  </div>
                  
                  {/* 经验值标签 */}
                  <div className="absolute top-4 right-4 bg-amber-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center">
                    <i className="fa-solid fa-star mr-1"></i>
                    {level.experiencePoints} XP
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{level.title}</h3>
                      <div className="flex items-center mt-1">
                        <i className="fa-solid fa-book text-slate-400 mr-1"></i>
                        <span className="text-sm text-slate-400">{level.textbookUnit}</span>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {level.completedSublevels}/{level.totalSublevels} 关卡
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-6 line-clamp-2">{level.description}</p>
                  
                  <div className="relative">
                    {/* 进度条 */}
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                        style={{ width: `${(level.completedSublevels / level.totalSublevels) * 100}%` }}
                      ></div>
                    </div>
                    
                    {level.unlocked ? (
                      <Link 
                        to={`/game/level/${level.id}`}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl text-center font-medium transition-all transform hover:scale-[1.02]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        开始学习
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-3 bg-slate-700 text-slate-500 rounded-xl text-center font-medium cursor-not-allowed"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(getUnlockConditionText(level));
                        }}
                      >
                        {getUnlockConditionText(level)}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* 特色关卡区域 */}
        <section>
          <h3 className="text-2xl font-bold mb-8 flex items-center">
            <i className="fa-solid fa-car text-purple-400 mr-2"></i>
            车辆工程专业特色关卡
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {levels.filter(l => l.isSpecial).map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative rounded-2xl overflow-hidden border ${
                  level.unlocked 
                    ? 'border-purple-500/30 bg-slate-800/80 hover:shadow-xl hover:shadow-purple-500/10' 
                    : 'border-slate-700 bg-slate-800/50'
                } transition-all hover:translate-y-[-8px]`}
                onClick={() => openLevelDetail(level)}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={`https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=${encodeURIComponent(level.imagePrompt)}`} 
                    alt={level.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {!level.unlocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-4xl text-slate-400"></i>
                    </div>
                  )}
                  
                  {/* 特色标签 */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      专业特色
                    </span>
                  </div>
                  
                  {/* 经验值标签 */}
                  <div className="absolute top-4 right-4 bg-amber-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center">
                    <i className="fa-solid fa-star mr-1"></i>
                    {level.experiencePoints} XP
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold flex items-center">
                        {level.title}
                        <span className="ml-2 bg-purple-600/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                          特色
                        </span>
                      </h3>
                      <div className="flex items-center mt-1">
                        <i className="fa-solid fa-book text-slate-400 mr-1"></i>
                        <span className="text-sm text-slate-400">{level.textbookUnit}</span>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {level.completedSublevels}/{level.totalSublevels} 关卡
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-6 line-clamp-2">{level.description}</p>
                  
                  <div className="relative">
                    {/* 进度条 */}
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                        style={{ width: `${(level.completedSublevels / level.totalSublevels) * 100}%` }}
                      ></div>
                    </div>
                    
                    {level.unlocked ? (
                      <Link 
                        to={`/game/level/${level.id}`}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl text-center font-medium transition-all transform hover:scale-[1.02]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        开始学习专业术语
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-3 bg-slate-700 text-slate-500 rounded-xl text-center font-medium cursor-not-allowed"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(getUnlockConditionText(level));
                        }}
                      >
                        {getUnlockConditionText(level)}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>完成所有关卡，达到德语B1水平，为专业学习打下坚实基础</p>
        </div>
      </footer>
      
      {/* 关卡详情弹窗 */}
      <AnimatePresence>
        {showLevelDetail && activeLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLevelDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={`https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=${encodeURIComponent(activeLevel.imagePrompt)}`} 
                    alt={activeLevel.title} 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    onClick={() => setShowLevelDetail(false)}
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent h-32"></div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-bold">{activeLevel.title}</h2>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                          {activeLevel.level.toUpperCase()} 级别
                        </span>
                        <span className="bg-slate-800/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {activeLevel.textbookUnit}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-amber-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center">
                        <i className="fa-solid fa-star mr-1"></i>
                        {activeLevel.experiencePoints} XP
                      </div>
                      {activeLevel.reward && (
                        <div className="bg-purple-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm flex items-center">
                          <i className="fa-solid fa-gift mr-1"></i>
                          {activeLevel.reward.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3">关卡介绍</h3>
                  <p className="text-slate-300">{activeLevel.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-3">关卡信息</h3>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-blue-400 mt-1 mr-2"></i>
                        <div>
                          <span className="font-medium">总关卡数:</span> {activeLevel.totalSublevels}个小关卡
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-blue-400 mt-1 mr-2"></i>
                        <div>
                          <span className="font-medium">通过分数:</span> 至少{activeLevel.requiredScore}分
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-blue-400 mt-1 mr-2"></i>
                        <div>
                          <span className="font-medium">经验值奖励:</span> {activeLevel.experiencePoints} XP
                        </div>
                      </li>
                      <li className="flex items-start">
                        <i className={`fa-solid ${activeLevel.unlocked ? 'fa-lock-open text-green-400' : 'fa-lock text-red-400'} mt-1 mr-2`}></i>
                        <div>
                          <span className="font-medium">状态:</span> {activeLevel.unlocked ? '已解锁' : '未解锁'}
                        </div>
                      </li>
                      {!activeLevel.unlocked && (
                        <li className="flex items-start">
                          <i className="fa-solid fa-info-circle text-yellow-400 mt-1 mr-2"></i>
                          <div>
                            <span className="font-medium">解锁条件:</span> {getUnlockConditionText(activeLevel)}
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {activeLevel.reward && (
                    <div>
                      <h3 className="text-xl font-bold mb-3">完成奖励</h3>
                      <div className="bg-slate-700/50 rounded-xl p-4 flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={`https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=${encodeURIComponent(activeLevel.reward.imagePrompt)}`} 
                            alt={activeLevel.reward.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{activeLevel.reward.name}</h4>
                          <div className="flex items-center mt-1">
                            {activeLevel.reward.type === 'skin' && (
                              <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                                皮肤
                              </span>
                            )}
                            {activeLevel.reward.type === 'car_part' && (
                              <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">
                                汽车零件
                              </span>
                            )}
                            {activeLevel.reward.type === 'badge' && (
                              <span className="bg-yellow-600/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                                徽章
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3">学习内容</h3>
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-300 mb-4">
                      本关卡对应《新一代大学德语》{activeLevel.textbookUnit}的内容，包含以下主题：
                    </p>
                    <ul className="space-y-2 text-slate-300">
                      <li className="flex items-start">
                        <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                        <span>基础词汇和日常对话</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                        <span>基础语法结构和句型</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                        <span>听力理解和阅读理解练习</span>
                      </li>
                      {activeLevel.isSpecial && (
                        <li className="flex items-start">
                          <i className="fa-solid fa-angle-right text-purple-400 mt-1 mr-2"></i>
                          <span>汽车工程专业德语术语</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button 
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    onClick={() => setShowLevelDetail(false)}
                  >
                    关闭
                  </button>
                  
                  {activeLevel.unlocked && (
                    <Link 
                      to={`/game/level/${activeLevel.id}`}
                      className={`py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-105 ${
                        activeLevel.isSpecial 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white' 
                          : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white'
                      }`}
                    >
                      开始学习
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}