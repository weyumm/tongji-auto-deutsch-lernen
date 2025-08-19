import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

// 技能类型定义
type SkillType = 'listening' | 'speaking' | 'reading' | 'writing';

// 技能数据类型定义
interface Skill {
  id: SkillType;
  title: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  imagePrompt: string;
  exercises: Exercise[];
}

// 练习数据类型定义
interface Exercise {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  duration: number;
}

export default function SkillsPage() {const { skillType } = useParams<{ skillType: SkillType }>();
  const { theme } = useTheme();
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  
  // 模拟技能数据
  const skills: Skill[] = [
    {
      id: 'listening',
      title: '听力训练',
      description: '提高德语听力理解能力，从简单对话到复杂技术文章',
      icon: 'fa-headphones',
      color: 'from-blue-500 to-cyan-500',
      progress: 10,
      imagePrompt: 'German listening practice interface with audio wave visualization, car dashboard elements, tech style',
      exercises: [
        { id: 'l1', title: '日常对话听力', difficulty: 'easy', completed: true, duration: 5 },
        { id: 'l2', title: '新闻听力理解', difficulty: 'medium', completed: false, duration: 8 },
        { id: 'l3', title: '汽车技术讲座', difficulty: 'hard', completed: false, duration: 12 },
        { id: 'l4', title: '德语广播节目', difficulty: 'medium', completed: false, duration: 10 }
      ]
    },
    {
      id: 'speaking',
      title: '口语训练',
      description: '练习德语发音和口语表达，从基础对话到专业演讲',
      icon: 'fa-microphone',
      color: 'from-red-500 to-pink-500',
      progress: 5,
      imagePrompt: 'Voice interaction interface for German speaking practice, with automotive theme, modern UI',
      exercises: [
        { id: 's1', title: '发音练习', difficulty: 'easy', completed: true, duration: 5 },
        { id: 's2', title: '日常对话', difficulty: 'easy', completed: false, duration: 7 },
        { id: 's3', title: '专业术语表达', difficulty: 'medium', completed: false, duration: 10 },
        { id: 's4', title: '技术演讲', difficulty: 'hard', completed: false, duration: 15 }
      ]
    },
    {
      id: 'reading',
      title: '阅读训练',
      description: '提高德语阅读理解能力，掌握专业技术文献阅读技巧',
      icon: 'fa-book',
      color: 'from-amber-500 to-orange-500',
      progress: 15,
      imagePrompt: 'German reading interface with technical automotive documents, clean layout, modern design',
      exercises: [
        { id: 'r1', title: '简单故事阅读', difficulty: 'easy', completed: true, duration: 6 },
        { id: 'r2', title: '新闻文章阅读', difficulty: 'medium', completed: true, duration: 8 },
        { id: 'r3', title: '汽车技术手册', difficulty: 'medium', completed: false, duration: 12 },
        { id: 'r4', title: '专业论文选段', difficulty: 'hard', completed: false, duration: 15 }
      ]
    },
    {
      id: 'writing',
      title: '写作训练',
      description: '练习德语写作能力，从简单句子到专业报告和论文',
      icon: 'fa-pen-to-square',
      color: 'from-green-500 to-teal-500',
      progress: 5,
      imagePrompt: 'German writing practice interface for automotive engineering reports, modern UI, tech style',
      exercises: [
        { id: 'w1', title: '简单句子写作', difficulty: 'easy', completed: true, duration: 7 },
        { id: 'w2', title: '电子邮件写作', difficulty: 'medium', completed: false, duration: 10 },
        { id: 'w3', title: '技术说明写作', difficulty: 'medium', completed: false, duration: 12 },
        { id: 'w4', title: '专业报告写作', difficulty: 'hard', completed: false, duration: 20 }
      ]
    }
  ];
  
  // 初始化活动技能
  useState(() => {
    if (skillType) {
      const skill = skills.find(s => s.id === skillType);
      if (skill) {
        setActiveSkill(skill);
      } else {
        setActiveSkill(skills[0]);
      }
    } else {
      setActiveSkill(skills[0]);
    }
  }, [skillType]);
  
  if (!activeSkill) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-400">加载技能训练内容中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* 页面头部 */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-slate-900/80 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-slate-400 hover:text-white p-2">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="text-xl font-bold">德语技能训练</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
              title="技能概览"
            >
              <i className="fa-solid fa-chart-pie"></i>
            </button>
            
            <button 
              className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
              title="设置"
            >
              <i className="fa-solid fa-cog"></i>
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* 技能选择标签 */}
        <div className="mb-12 overflow-x-auto pb-2">
          <div className="flex space-x-4 min-w-max">
            {skills.map((skill) => (
              <Link
                key={skill.id}
                to={`/skills/${skill.id}`}
                className={`flex-shrink-0 px-6 py-3 rounded-full transition-all ${
                  activeSkill.id === skill.id
                    ? `bg-gradient-to-r ${skill.color} text-white shadow-lg shadow-blue-500/10`
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <i className={`fa-solid ${skill.icon} mr-2`}></i>
                <span>{skill.title}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 技能概览 */}
          <div className="lg:col-span-1 space-y-8">
            {/* 技能信息卡片 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="aspect-video relative">
                <img 
                  src={`https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=${encodeURIComponent(activeSkill.imagePrompt)}`} 
                  alt={activeSkill.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${activeSkill.color} border-2 border-blue-500/30 shadow-lg shadow-blue-500/10`}>
                    <i className={`fa-solid ${activeSkill.icon} text-2xl`}></i>
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-0">
                <h2 className="text-2xl font-bold mb-2">{activeSkill.title}</h2>
                <p className="text-slate-400 mb-6">{activeSkill.description}</p>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">技能进度</span>
                    <span className="text-sm text-blue-400">{activeSkill.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${activeSkill.color}`}
                      style={{ width: `${activeSkill.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                    <p className="text-2xl font-bold text-blue-400">
                      {activeSkill.exercises.filter(e => e.completed).length}
                    </p>
                    <p className="text-sm text-slate-400">已完成练习</p>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
                    <p className="text-2xl font-bold text-blue-400">
                      {activeSkill.exercises.reduce((sum, e) => sum + (e.completed ? e.duration : 0), 0)}
                    </p>
                    <p className="text-sm text-slate-400">学习分钟</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* 技能提示卡片 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <i className="fa-solid fa-lightbulb text-yellow-400 mr-2"></i>
                学习建议
              </h3>
              
              <ul className="space-y-3 text-slate-300">
                {activeSkill.id === 'listening' && (
                  <>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>每天至少听15分钟德语内容，培养语感</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>先盲听，再看文本听，最后跟读模仿发音</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>汽车技术讲座可以反复听，重点学习专业词汇</span>
                    </li>
                  </>
                )}
                
                {activeSkill.id === 'speaking' && (
                  <>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>对着镜子练习，注意口型和发音</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>录下自己的声音，与标准发音对比</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>尝试用德语描述你看到的汽车零件和技术</span>
                    </li>
                  </>
                )}
                
                {activeSkill.id === 'reading' && (
                  <>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>先快速阅读了解大意，再仔细阅读细节</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>遇到生词先猜测意思，读完后再查词典</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>技术手册阅读时，注意图表和说明的对应关系</span>
                    </li>
                  </>
                )}
                
                {activeSkill.id === 'writing' && (
                  <>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>先列提纲，再组织内容，最后检查语法和拼写</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>学习专业报告的格式和常用表达</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-400 mt-1 mr-2"></i>
                      <span>尝试用德语写汽车技术相关的简短总结</span>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          </div>
          
          {/* 练习列表 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center mb-6"
            >
              <h2 className="text-2xl font-bold">练习列表</h2>
              <div className="flex space-x-2">
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  <i className="fa-solid fa-filter mr-1"></i>
                  筛选
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                  <i className="fa-solid fa-sort mr-1"></i>
                  排序
                </button>
              </div>
            </motion.div>
            
            <div className="space-y-6">
              {activeSkill.exercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden transition-all ${
                    exercise.completed 
                      ? 'opacity-80' 
                      : 'hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-xl font-bold">{exercise.title}</h3>
                          {exercise.completed && (
                            <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded-full">
                              已完成
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <i className={`fa-solid fa-clock text-slate-400 mr-1`}></i>
                            <span className="text-slate-400 text-sm">{exercise.duration} 分钟</span>
                          </div>
                          <div className="flex items-center">
                            <i className={`fa-solid fa-signal text-slate-400 mr-1`}></i>
                            <span className="text-slate-400 text-sm">
                              {exercise.difficulty === 'easy' && '简单'}
                              {exercise.difficulty === 'medium' && '中等'}
                              {exercise.difficulty === 'hard' && '困难'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {exercise.completed ? (
                        <button className="bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                          <i className="fa-solid fa-redo mr-1"></i>
                          再次练习
                        </button>
                      ) : (
                        <Link
                          to={`/skills/${activeSkill.id}/exercise/${exercise.id}`}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-[1.02] ${
                            exercise.difficulty === 'easy' 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : exercise.difficulty === 'medium'
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          开始练习
                        </Link>
                      )}
                    </div>
                    
                    {!exercise.completed && (
                      <div className="pt-4 border-t border-slate-700">
                        <h4 className="text-sm font-bold mb-2">练习目标</h4>
                        <ul className="text-slate-300 text-sm space-y-1">
                          {exercise.id === 'l1' && (
                            <>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>理解日常德语对话的主要内容</span>
                              </li>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>掌握基本问候和自我介绍的表达</span>
                              </li>
                            </>
                          )}
                          {exercise.id === 'l2' && (
                            <>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>理解德语新闻的主要内容和观点</span>
                              </li>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>学习新闻报道中的常用词汇和表达</span>
                              </li>
                            </>
                          )}
                          {exercise.id === 'l3' && (
                            <>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>理解汽车技术讲座的核心内容</span>
                              </li>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>掌握汽车工程领域的基础德语术语</span>
                              </li>
                            </>
                          )}
                          {exercise.id === 's1' && (
                            <>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>掌握德语字母和基本发音规则</span>
                              </li>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>提高德语单词的正确发音能力</span>
                              </li>
                            </>
                          )}
                          {exercise.id === 's2' && (
                            <>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>进行简单的德语日常对话</span>
                              </li>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>提高德语口语表达的流利度</span>
                              </li>
                            </>
                          )}
                          {exercise.id === 'r1' && (
                            <>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>理解简单德语故事的主要情节</span>
                              </li>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>学习故事中的常用词汇和表达</span>
                              </li>
                            </>
                          )}
                          {exercise.id === 'r2' && (
                            <>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>理解德语新闻文章的主要内容</span>
                              </li>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>提高阅读速度和理解能力</span>
                              </li>
                            </>
                          )}
                          {exercise.id === 'w1' && (
                            <>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>写出正确的德语简单句</span>
                              </li>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>掌握基本的德语语法和句型</span>
                              </li>
                            </>
                          )}
                          {exercise.id === 'w2' && (
                            <>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>写出规范的德语电子邮件</span>
                              </li>
                              <li className="flex items-start">
                                <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                                <span>掌握正式和非正式邮件的写作格式</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>德语技能训练系统 - 同济大学车辆工程专业专用</p>
        </div>
      </footer>
    </div>
  );
}