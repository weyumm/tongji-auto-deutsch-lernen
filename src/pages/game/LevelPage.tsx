import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

// 定义关卡数据类型
interface LevelData {
  id: string;
  title: string;
  description: string;
  vocabulary: {
    german: string;
    chinese: string;
    example?: string;
  }[];
  questions: Question[];
  backgroundImagePrompt: string;
}

// 定义问题类型
interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function LevelPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isCheckingAnswers, setIsCheckingAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Array<{germanIndex: number, chineseIndex: number}>>([]);

  // 处理匹配题配对
  const handleMatch = (germanIndex: number, chineseIndex: number) => {
    const germanItems = ['die Tür', 'die Batterie', 'das Lenkrad', 'der Bremsen'];
    const correctPairs = currentQuestion.correctAnswer as string[];
    const correctPair = correctPairs.find(pair => 
      pair.startsWith(germanItems[germanIndex])
    );
    
    if (correctPair) {
      const correctChinese = correctPair.split('-')[1];
      const chineseItems = ['方向盘', '车门', '刹车', '电池'];
      
      if (chineseItems[chineseIndex] === correctChinese) {
        setMatchedPairs(prev => [...prev, { germanIndex, chineseIndex }]);
        handleAnswerSubmit(currentQuestion.id, [
          ...(userAnswers[currentQuestion.id] || []),
          `${germanItems[germanIndex]}-${correctChinese}`
        ]);
      }
    }
  };

  // 模拟关卡数据 - 车辆工程专业德语词汇
  useEffect(() => {
    setIsLoading(true);
    
    // 根据不同关卡ID加载不同数据
    const mockLevelData: LevelData = {
      id: levelId || 'a1-1',
      title: levelId === 'vehicle-vocab' ? '车辆工程专业词汇' : 'A1.1 入门基础',
      description: levelId === 'vehicle-vocab' 
        ? '学习汽车工程核心德语术语，掌握专业词汇基础' 
        : '掌握德语发音和基础词汇，学习简单对话',
      backgroundImagePrompt: levelId === 'vehicle-vocab' 
        ? 'Automotive engineering vocabulary with 3D car model, technical documentation style' 
        : 'German language learning interface with automotive elements',
      vocabulary: [
        { german: 'das Auto', chinese: '汽车', example: 'Das Auto fährt schnell.' },
        { german: 'der Motor', chinese: '发动机', example: 'Der Motor läuft gut.' },
        { german: 'die Tür', chinese: '车门', example: 'Die Tür ist offen.' },
        { german: 'das Rad', chinese: '车轮', example: 'Das Rad dreht sich.' },
        { german: 'die Batterie', chinese: '电池', example: 'Die Batterie ist leer.' },
        { german: 'das Getriebe', chinese: '变速箱', example: 'Das Getriebe wechselt den Gang.' },
        { german: 'der Bremsen', chinese: '刹车', example: 'Die Bremsen funktionieren gut.' },
        { german: 'das Lenkrad', chinese: '方向盘', example: 'Das Lenkrad ist leicht.' }
      ],
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: '德语中"汽车"怎么说？',
          options: ['der Wagen', 'das Auto', 'die Maschine', 'der Fahrrad'],
          correctAnswer: 'das Auto',
          explanation: '在德语中，"汽车"是中性名词"das Auto"。',
          difficulty: 'easy'
        },
        {
          id: 'q2',
          type: 'multiple-choice',
          question: '哪个单词表示"发动机"？',
          options: ['der Motor', 'die Motor', 'das Motor', 'den Motor'],
          correctAnswer: 'der Motor',
          explanation: '"发动机"在德语中是阳性名词"der Motor"。',
          difficulty: 'easy'
        },
        {
          id: 'q3',
          type: 'fill-blank',
          question: '______ (车轮) dreht sich schnell.',
          correctAnswer: 'Das Rad',
          explanation: '正确答案是"Das Rad"，"Rad"是中性名词，意为"车轮"。',
          difficulty: 'medium'
        },
        {
          id: 'q4',
          type: 'matching',
          question: '将德语词汇与中文意思匹配',
          correctAnswer: ['die Tür-车门', 'die Batterie-电池', 'das Lenkrad-方向盘', 'der Bremsen-刹车'],
          explanation: '这些都是汽车工程中的基础德语术语，需要重点掌握。',
          difficulty: 'medium'
        }
      ]
    };
    
    setLevelData(mockLevelData);
    setIsLoading(false);
  }, [levelId]);

  // 处理答案提交
  const handleAnswerSubmit = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

   // 检查答案
  const checkAnswers = () => {
    if (!levelData) return;
    
    setIsCheckingAnswers(true);
    
    // 计算得分
    let newScore = 0;
    levelData.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      
      if (question.type === 'matching') {
        // 匹配题特殊处理
        const userAnswersArray = Array.isArray(userAnswer) ? userAnswer : [];
        const correctAnswersArray = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
        
        // 计算正确匹配的数量
        const correctMatches = userAnswersArray.filter(answer => 
          correctAnswersArray.includes(answer)
        ).length;
        
        // 匹配题按比例计分
        if (correctMatches > 0) {
          newScore += correctMatches / correctAnswersArray.length;
        }
      } else if (Array.isArray(question.correctAnswer)) {
        // 多选题
        const userAnswerSet = new Set(Array.isArray(userAnswer) ? userAnswer : [userAnswer]);
        const correctAnswerSet = new Set(question.correctAnswer);
        
        if (userAnswerSet.size === correctAnswerSet.size && 
            [...userAnswerSet].every(ans => correctAnswerSet.has(ans))) {
          newScore += 1;
        }
      } else if (userAnswer === question.correctAnswer) {
        // 单选题和填空题
        newScore += 1;
      }
    });
    
    // 四舍五入得分
    newScore = Math.round(newScore);
    setScore(newScore);
    
    // 保存进度
    const progress = JSON.parse(localStorage.getItem('germanLearningProgress') || '{}');
    progress[levelData.id] = {
      completed: newScore >= Math.floor(levelData.questions.length * 0.7),
      score: newScore,
      total: levelData.questions.length,
      lastAttempt: new Date().toISOString()
    };
    localStorage.setItem('germanLearningProgress', JSON.stringify(progress));
    
    // 显示完成提示
    if (newScore === levelData.questions.length) {
      toast.success('恭喜！完美通过本关卡！', { duration: 3000 });
    } else if (newScore >= Math.floor(levelData.questions.length * 0.7)) {
      toast.success(`恭喜过关！得分: ${newScore}/${levelData.questions.length}`, { duration: 3000 });
    } else {
      toast.error(`未通过关卡！得分: ${newScore}/${levelData.questions.length}，请再试一次`, { duration: 3000 });
    }
  };

  // 下一题
  const nextQuestion = () => {
    if (currentQuestionIndex < (levelData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      checkAnswers();
    }
  };

  // 上一题
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // 重置关卡
  const resetLevel = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsCheckingAnswers(false);
    setScore(0);
  };

  // 前往下一关
  const goToNextLevel = () => {
    if (!levelData) return;
    
    const levelMap: Record<string, string> = {
      'a1-1': 'a1-2',
      'a1-2': 'a2-1',
      'a2-1': 'a2-2',
      'a2-2': 'b1',
      'b1': 'vehicle-vocab',
      'vehicle-vocab': 'a1-1' // 循环回到开始
    };
    
    const nextLevelId = levelMap[levelData.id] || 'a1-2';
    navigate(`/game/level/${nextLevelId}`);
    resetLevel();
  };

  if (isLoading || !levelData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">加载关卡中...</h2>
          <p className="text-slate-400">正在准备学习内容</p>
        </div>
      </div>
    );
  }

  const currentQuestion = levelData.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / levelData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-slate-900/80 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/levels" className="text-slate-400 hover:text-white p-2">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          
          <div className="text-center">
            <h1 className="text-xl font-bold">{levelData.title}</h1>
            <p className="text-slate-400 text-sm">问题 {currentQuestionIndex + 1}/{levelData.questions.length}</p>
          </div>
          
          <button 
            className="text-slate-400 hover:text-white p-2"
            onClick={resetLevel}
          >
            <i className="fa-solid fa-refresh"></i>
          </button>
        </div>
        
        {/* 进度条 */}
        <div className="w-full bg-slate-800 h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 关卡介绍 */}
        <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-2">{levelData.title}</h2>
          <p className="text-slate-400 mb-4">{levelData.description}</p>
          
          <button 
            className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
            onClick={() => setShowVocabulary(!showVocabulary)}
          >
            <i className={`fa-solid ${showVocabulary ? 'fa-chevron-up' : 'fa-chevron-down'} mr-1`}></i>
            <span>{showVocabulary ? '隐藏词汇表' : '查看本关词汇表'}</span>
          </button>
          
          {showVocabulary && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
              {levelData.vocabulary.map((item, index) => (
                <div key={index} className="bg-slate-800/80 p-3 rounded-lg text-sm">
                  <div className="font-bold text-blue-400">{item.german}</div>
                  <div className="text-slate-300">{item.chinese}</div>
                  {item.example && (
                    <div className="text-xs text-slate-500 italic mt-1">{item.example}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 问题卡片 */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold mb-6">{currentQuestion.question}</h3>
            
            {currentQuestion.type === 'multiple-choice' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isCheckingAnswers 
                        ? option === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500/10'
                          : userAnswers[currentQuestion.id] === option
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-slate-700 bg-slate-800/50'
                        : userAnswers[currentQuestion.id] === option
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 bg-slate-800/50 hover:border-blue-500/50'
                    }`}
                    onClick={() => !isCheckingAnswers && handleAnswerSubmit(currentQuestion.id, option)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        isCheckingAnswers
                          ? option === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-500'
                            : userAnswers[currentQuestion.id] === option
                              ? 'border-red-500 bg-red-500'
                              : 'border-slate-500'
                          : userAnswers[currentQuestion.id] === option
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-500'
                      }`}>
                        {isCheckingAnswers && option === currentQuestion.correctAnswer && (
                          <i className="fa-solid fa-check text-white text-xs"></i>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {currentQuestion.type === 'fill-blank' && (
              <div>
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 mb-4 min-h-[100px] flex items-center justify-center text-lg">
                  {currentQuestion.question.replace('______', (
                    <span className="mx-2 relative">
                      {!isCheckingAnswers ? (
                        <input
                          type="text"
                          className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 w-48 focus:outline-none focus:border-blue-500"
                          placeholder="在此输入答案"
                          value={userAnswers[currentQuestion.id] || ''}
                          onChange={(e) => handleAnswerSubmit(currentQuestion.id, e.target.value)}
                        />
                      ) : userAnswers[currentQuestion.id] === currentQuestion.correctAnswer ? (
                        <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500">
                          {userAnswers[currentQuestion.id]}
                        </span>
                      ) : (
                        <>
                          <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500 mr-2">
                            {userAnswers[currentQuestion.id] || '未作答'}
                          </span>
                          <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500">
                            {currentQuestion.correctAnswer}
                          </span>
                        </>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
             {currentQuestion.type === 'matching' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">德语词汇</h4>
                  {['die Tür', 'die Batterie', 'das Lenkrad', 'der Bremsen'].map((item, index) => (
                    <div 
                      key={index}
                      className={`bg-slate-900/80 border border-slate-700 rounded-lg p-3 mb-2 cursor-move transition-all ${
                        draggedItem === `german-${index}` 
                          ? 'opacity-50 scale-95' 
                          : 'hover:border-blue-500 hover:bg-slate-800'
                      }`}
                      draggable
                      onDragStart={() => setDraggedItem(`german-${index}`)}
                      onDragEnd={() => setDraggedItem(null)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">中文意思</h4>
                  {['方向盘', '车门', '刹车', '电池'].map((item, index) => {
                    const isMatched = matchedPairs.some(pair => pair.chineseIndex === index);
                    const isCorrect = isCheckingAnswers && 
                      ['车门', '电池', '方向盘', '刹车'][index] === 
                      currentQuestion.correctAnswer[index].split('-')[1];
                      
                    return (
                      <div 
                        key={index}
                        className={`bg-slate-900/80 border rounded-lg p-3 mb-2 transition-all ${
                          isMatched 
                            ? 'border-green-500 bg-green-500/10' 
                            : isCheckingAnswers && isCorrect
                              ? 'border-green-500 bg-green-500/10'
                              : isCheckingAnswers && !isCorrect && !isMatched
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-slate-700 hover:border-blue-500 hover:bg-slate-800'
                        }`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedItem && draggedItem.startsWith('german-')) {
                            const germanIndex = parseInt(draggedItem.split('-')[1]);
                            handleMatch(germanIndex, index);
                          }
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {isCheckingAnswers && (
              <div className="mt-6 p-4 bg-slate-900/80 border border-slate-700 rounded-xl">
                <h4 className="text-sm font-medium text-blue-400 mb-2">答案解析</h4>
                <p className="text-slate-300 text-sm">{currentQuestion.explanation}</p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* 答案反馈 */}
        {isCheckingAnswers && (
          <div className="mb-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600/20 text-blue-400 mb-4">
              <span className="text-3xl font-bold">{score}/{levelData.questions.length}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">
              {score === levelData.questions.length 
                ? '太棒了！全部正确！' 
                : score > levelData.questions.length / 2 
                  ? '不错！继续加油！' 
                  : '再接再厉！'}
            </h3>
            <p className="text-slate-400 mb-6">
              {score === levelData.questions.length 
                ? '你已经完全掌握了本关内容！' 
                : score > levelData.questions.length / 2 
                  ? '大部分知识点已经掌握，继续巩固一下吧！' 
                  : '建议复习本关内容，再尝试一次！'}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={resetLevel}
              >
                重新学习本关
              </button>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={goToNextLevel}
              >
                前往下一关
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 底部导航 */}
      {!isCheckingAnswers && (
        <footer className="sticky bottom-0 z-40 backdrop-blur-lg bg-slate-900/90 border-t border-slate-800 py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between">
              <button
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                上一题
              </button>
              
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={nextQuestion}
              >
                {currentQuestionIndex < levelData.questions.length - 1 ? (
                  <>
                    下一题
                    <i className="fa-solid fa-arrow-right ml-2"></i>
                  </>
                ) : (
                  '提交答案'
                )}
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}