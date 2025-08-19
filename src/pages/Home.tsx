import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

// 特色功能卡片组件
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} mb-6 group-hover:scale-110 transition-transform`}>
        <i className={`fa-solid ${icon} text-2xl`}></i>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </motion.div>
  );
}

// 技能训练卡片组件
interface SkillCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  imagePrompt: string;
  link: string;
}

function SkillCard({ icon, title, description, color, imagePrompt, link }: SkillCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/50 hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={`https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=${encodeURIComponent(imagePrompt)}`} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} mb-4`}>
          <i className={`fa-solid ${icon} text-xl`}></i>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-4">{description}</p>
        
        <Link 
          to={link}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          <span>开始训练</span>
          <i className="fa-solid fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </motion.div>
  );
}


// 定义关卡数据类型
interface LevelData {
  id: string;
  title: string;
  description: string;
  progress: number;
  locked: boolean;
  imagePrompt: string;
}

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  
  // 模拟关卡数据
  const featuredLevels: LevelData[] = [
    {
      id: 'a1-1',
      title: 'A1.1 入门基础',
      description: '掌握德语发音和基础词汇',
      progress: 0,
      locked: false,
      imagePrompt: 'German language learning interface with automotive elements, clean modern design, tech style'
    },
    {
      id: 'a1-2',
      title: 'A1.2 初级扩展',
      description: '基础语法和日常对话',
      progress: 0,
      locked: true,
      imagePrompt: 'Car dashboard with German language learning metrics, digital display, technical interface'
    },
    {
      id: 'vehicle-vocab',
      title: '车辆工程词汇',
      description: '汽车专业德语术语',
      progress: 0,
      locked: true,
      imagePrompt: 'Automotive engineering terminology visualization, 3D car model with labeled parts in German'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-x-hidden">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/70 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <i className="fa-solid fa-car text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              AutoDeutsch
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="切换主题"
            >
              {theme === 'dark' ? (
                <i className="fa-solid fa-sun text-yellow-400"></i>
              ) : (
                <i className="fa-solid fa-moon text-indigo-300"></i>
              )}
            </button>
            
            <Link 
              to="/dashboard"
              className="hidden md:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-all transform hover:scale-105"
            >
              <i className="fa-solid fa-user-circle"></i>
              <span>我的进度</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 英雄区域 */}
        <section className="relative mb-20 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80 z-10"></div>
          
          {/* 背景图形元素 */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 rounded-l-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-indigo-500/10 rounded-tr-full blur-3xl"></div>
          </div>
          
          <div className="relative z-20 px-8 py-16 md:py-24 md:px-16 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              >
                德语学习<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  驶入快车道
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg"
              >
                专为同济大学车辆工程专业设计的游戏化德语学习平台，从零基础到B1水平，让德语学习像驾驶一样充满乐趣！
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link 
                  to="/levels"
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 hover:shadow-xl"
                >
                  <span>开始学习之旅</span>
                  <i className="fa-solid fa-rocket"></i>
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl"></div>
                <img 
                  src={`https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=German%20language%20learning%20app%20interface%20with%20automotive%20dashboard%20elements%2C%20modern%20tech%20style%2C%20dark%20theme&sign=9a7f6d38d198b889262f40d296775b81`} 
                  alt="德语学习游戏界面预览" 
                  className="relative z-10 w-full h-full object-cover rounded-2xl border-2 border-blue-500/30 shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  全新体验
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* 特色功能区域 */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">游戏化学习体验</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">通过精心设计的游戏机制，让德语学习不再枯燥，激发你的学习动力</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 特色卡片 1: 分级闯关 */}
            <FeatureCard 
              icon="fa-trophy" 
              title="分级闯关系统" 
              description="从A1到B1，循序渐进掌握德语技能，每个关卡对应《新一代大学德语》知识点"
              color="from-amber-500 to-orange-500"
            />
            
            {/* 特色卡片 2: 知识图谱 */}
            <FeatureCard 
              icon="fa-project-diagram" 
              title="3D知识图谱" 
              description="可视化展示德语语法、词汇、句型间的关联，构建完整知识网络"
              color="from-blue-500 to-cyan-500"
            />
            
            {/* 特色卡片 3: 专业词汇 */}
            <FeatureCard 
              icon="fa-car" 
              title="车辆工程词汇" 
              description="专为汽车专业设计的德语术语库，提前掌握专业学习必备词汇"
              color="from-emerald-500 to-teal-500"
            />
            
            {/* 特色卡片 4: 四技能训练 */}
            <FeatureCard 
              icon="fa-graduation-cap" 
              title="四技能训练" 
              description="全面提升德语听、说、读、写能力，达到B1水平要求"
              color="from-purple-500 to-pink-500"
            />
          </div>
        </section>
        
        {/* 精选关卡区域 */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-3">精选学习关卡</h2>
              <p className="text-slate-400">从基础开始，逐步提升你的德语水平</p>
            </div>
            <Link 
              to="/levels"
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-2 font-medium"
            >
              <span>查看全部关卡</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredLevels.map((level, index) => (
              <motion.div 
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative rounded-2xl overflow-hidden border ${
                  level.locked ? 'border-slate-700 bg-slate-800/50' : 'border-blue-500/30 bg-slate-800/80'
                } transition-all hover:shadow-xl hover:shadow-blue-500/10`}
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={`https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=${encodeURIComponent(level.imagePrompt)}`} 
                    alt={level.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {level.locked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-4xl text-slate-400"></i>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{level.title}</h3>
                    {!level.locked && (
                      <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                        {level.progress}% 完成
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-6">{level.description}</p>
                  
                  <div className="relative">
                    {!level.locked ? (
                      <Link 
                        to={`/game/level/${level.id}`}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl text-center font-medium transition-all transform hover:scale-[1.02]"
                      >
                        开始学习
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-3 bg-slate-700 text-slate-500 rounded-xl text-center font-medium cursor-not-allowed"
                      >
                        完成前置关卡解锁
                      </button>
                    )}
                    
                    {/* 进度条 */}
                    {!level.locked && (
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          style={{ width: `${level.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* 知识图谱预览 */}
        <section className="mb-20">
          <div className="bg-slate-800/50 rounded-2xl p-6 md:p-10 border border-slate-700 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-purple-500/10 rounded-l-full blur-3xl"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold mb-4"
                >
                  可视化<span className="text-purple-400">知识图谱</span>
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-slate-300 mb-6"
                >
                  动态展示德语知识点之间的关联，帮助你构建完整的德语知识体系。随着学习进度的推进，解锁更多知识节点，形成个性化学习路径。
                </motion.p>
                
                <motion.ul 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-3 mb-8"
                >
                  <li className="flex items-start space-x-3">
                    <i className="fa-solid fa-check-circle text-purple-400 mt-1"></i>
                    <span>语法、词汇、句型关联可视化</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <i className="fa-solid fa-check-circle text-purple-400 mt-1"></i>
                    <span>汽车专业词汇与通用德语融合</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <i className="fa-solid fa-check-circle text-purple-400 mt-1"></i>
                    <span>实时追踪学习进度与知识掌握度</span>
                  </li>
                </motion.ul>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link 
                    to="/knowledge-graph"
                    className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full transition-all transform hover:scale-105"
                  >
                    <span>探索知识图谱</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative aspect-square max-w-md mx-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                <img 
                  src={`https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=3D%20knowledge%20graph%20visualization%20with%20German%20language%20nodes%2C%20automotive%20engineering%20theme%2C%20dark%20background%2C%20tech%20style&sign=7c3c02f02369d897adb1e1999d22dc49`} 
                  alt="德语知识图谱预览" 
                  className="relative z-10 w-full h-full object-cover rounded-2xl border border-purple-500/30 shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* 技能训练模块 */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">全面技能训练</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">听、说、读、写四项技能，全方位提升德语水平</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 听力和口语 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* 听力训练 */}
              <SkillCard 
                icon="fa-headphones" 
                title="听力训练" 
                description="汽车德语听力实验室，包含对话、新闻、指令等场景"
                color="from-blue-500 to-cyan-500"
                imagePrompt="German listening practice interface with audio wave visualization, car dashboard elements"
                link="/skills/listening"
              />
              
              {/* 口语训练 */}
              <SkillCard 
                icon="fa-microphone" 
                title="口语训练" 
                description="AI德语伙伴语音交互系统，模拟日常对话与专业场景"
                color="from-green-500 to-teal-500"
                imagePrompt="Voice interaction interface for German speaking practice, with automotive theme"
                link="/skills/speaking"
              />
            </div>
            
            {/* 阅读和写作 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* 阅读训练 */}
              <SkillCard 
                icon="fa-book" 
                title="阅读训练" 
                description="德语技术文档阅览室，提供汽车相关德语文章"
                color="from-amber-500 to-orange-500"
                imagePrompt="German reading interface with technical automotive documents, clean layout"
                link="/skills/reading"
              />
              
              {/* 写作训练 */}
              <SkillCard 
                icon="fa-pen-to-square" 
                title="写作训练" 
                description="德语邮件/报告生成器，练习专业场景写作"
                color="from-purple-500 to-pink-500"
                imagePrompt="German writing practice interface for automotive engineering reports, modern UI"
                link="/skills/writing"
              />
            </div>
          </div>
        </section>
        
        {/* 行动召唤区域 */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            <div className="absolute inset-0 bg-[url('https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Abstract%20automotive%20background%20with%20technical%20elements%2C%20dark%20blue%20theme&sign=f3e61e58c83c38bdca5fb83694cfa48c')] bg-cover bg-center opacity-20"></div>
            
            <div className="relative z-10 px-8 py-16 md:py-24 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">准备好开始你的德语学习之旅了吗？</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                加入数千名同济大学车辆工程专业学生的行列，通过游戏化方式轻松掌握德语B1水平
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/levels"
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  立即开始学习
                </Link>
                
                <Link 
                  to="/about"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-bold transition-all"
                >
                  了解更多
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-car text-white text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  AutoDeutsch
                </h2>
              </div>
              <p className="text-slate-400 mb-6">专为同济大学车辆工程专业设计的德语学习平台</p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-weixin text-xl"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-weibo text-xl"></i>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <i className="fa-brands fa-github text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">学习资源</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">课程大纲</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">教材配套</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">词汇表</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">语法指南</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">关于我们</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">开发团队</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">联系方式</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">反馈建议</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">隐私政策</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">联系我们</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <i className="fa-solid fa-envelope text-slate-400 mt-1"></i>
                  <span className="text-slate-400">german@tongji.edu.cn</span>
                </li>
                <li className="flex items-start space-x-3">
                  <i className="fa-solid fa-phone text-slate-400 mt-1"></i>
                  <span className="text-slate-400">021-12345678</span>
                </li>
                <li className="flex items-start space-x-3">
                  <i className="fa-solid fa-map-marker-alt text-slate-400 mt-1"></i>
                  <span className="text-slate-400">上海市嘉定区同济大学汽车学院</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
            <p>© 2025 AutoDeutsch 德语学习平台 - 同济大学车辆工程专业专用</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

