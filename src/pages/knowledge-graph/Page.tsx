import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import KnowledgeGraph, { KnowledgeNode } from '@/components/knowledge/KnowledgeGraph';
import { useTheme } from '@/hooks/useTheme';

// 进度卡片组件
interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  icon: string;
  color: string;
}

function ProgressCard({ title, value, maxValue, icon, color }: ProgressCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} mb-4`}>
        <i className={`fa-solid ${icon} text-xl`}></i>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-400">{value}%</span>
        <span className="text-sm text-slate-400">{value}/{maxValue}</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </motion.div>
  );
}


export default function KnowledgeGraphPage() {
  const { theme } = useTheme();
  const [activeNode, setActiveNode] = useState<KnowledgeNode | null>(null);
  const [showNodeDetail, setShowNodeDetail] = useState(false);
  
  // 处理节点点击
  const handleNodeClick = (node: KnowledgeNode) => {
    setActiveNode(node);
    setShowNodeDetail(true);
  };
  
  // 关闭节点详情
  const closeNodeDetail = () => {
    setShowNodeDetail(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">
      {/* 页面头部 */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-slate-900/80 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-slate-400 hover:text-white">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="text-2xl font-bold">德语知识图谱</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fa-solid fa-question-circle mr-1"></i>
                <span>帮助</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fa-solid fa-cog mr-1"></i>
                <span>设置</span>
              </a>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
              <i className="fa-solid fa-user"></i>
            </div>
          </div>
        </div>
      </header>
      
      {/* 页面内容 */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* 页面标题和说明 */}
        <div className="mb-8 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">探索德语知识网络</h2>
            <p className="text-slate-400">
              交互式3D知识图谱展示德语语法、词汇、句型和车辆工程专业术语之间的关联。点击节点查看详情，完成学习任务解锁新节点。
            </p>
          </motion.div>
        </div>
        
        {/* 知识图谱容器 */}
        <div className="relative rounded-2xl border border-slate-700 overflow-hidden h-[70vh] mb-6 shadow-2xl shadow-purple-500/5">
          <KnowledgeGraph onNodeClick={handleNodeClick} />
        </div>
        
        {/* 学习进度概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <ProgressCard 
            title="总体进度" 
            value={25} 
            maxValue={100} 
            icon="fa-chart-pie" 
            color="from-blue-500 to-cyan-500" 
          />
          <ProgressCard 
            title="语法掌握" 
            value={35} 
            maxValue={100} 
            icon="fa-book" 
            color="from-blue-500 to-cyan-500" 
          />
          <ProgressCard 
            title="词汇掌握" 
            value={20} 
            maxValue={100} 
            icon="fa-language" 
            color="from-green-500 to-teal-500" 
          />
          <ProgressCard 
            title="车辆术语" 
            value={5} 
            maxValue={100} 
            icon="fa-car" 
            color="from-purple-500 to-pink-500" 
          />
        </div>
      </main>{/* 页脚 */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>拖动旋转视角 | 滚轮缩放 | 点击节点查看详情</p>
        </div>
      </footer>
      
      {/* 节点详情模态框 */}
      {showNodeDetail && activeNode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeNodeDetail}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `#${getNodeColor(activeNode.type, activeNode.unlocked).toString(16).padStart(6, '0')}`,
                      opacity: 0.8
                    }}
                  >
                    <i className={`fa-solid ${getNodeIcon(activeNode.type)} text-white text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{activeNode.name}</h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                        {activeNode.level.toUpperCase()} 级别
                      </span>
                      <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                        {activeNode.type === 'grammar' && '语法'}
                        {activeNode.type === 'vocabulary' && '词汇'}
                        {activeNode.type === 'sentence' && '句型'}
                        {activeNode.type === 'vehicle-term' && '车辆术语'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  className="text-slate-400 hover:text-white transition-colors"
                  onClick={closeNodeDetail}
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-bold mb-3 flex items-center">
                  <i className="fa-solid fa-info-circle text-blue-400 mr-2"></i>
                  知识点介绍
                </h4>
                <p className="text-slate-300">
                  {activeNode.type === 'grammar' && '德语语法是构建正确句子的基础，掌握名词词性是德语学习的第一步。'}
                  {activeNode.type === 'vocabulary' && '丰富的词汇量是德语学习的关键，从日常词汇开始积累，逐步扩展到专业领域。'}
                  {activeNode.type === 'sentence' && '掌握基础句型能够帮助你进行简单的德语交流，是德语会话的基础。'}
                  {activeNode.type === 'vehicle-term' && '车辆工程专业术语是阅读德语文献和技术资料的必备知识，也是未来专业学习的基础。'}
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-bold mb-3 flex items-center">
                  <i className="fa-solid fa-check-circle text-green-400 mr-2"></i>
                  学习目标
                </h4>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start">
                    <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                    <span>理解{activeNode.name}的基本概念和规则</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                    <span>能够正确运用{activeNode.name}进行简单表达</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-angle-right text-blue-400 mt-1 mr-2"></i>
                    <span>识别并纠正使用{activeNode.name}时的常见错误</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4 border-t border-slate-700">
                <button 
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  onClick={closeNodeDetail}
                >
                  稍后学习
                </button>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    // 跳转到对应知识点的学习页面
                    window.location.href = `/game/level/${activeNode.level}-${activeNode.type}`;
                  }}
                >
                  立即学习
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}



// 辅助函数：获取节点颜色
function getNodeColor(type: KnowledgeNode['type'], unlocked: boolean): number {
  if (!unlocked) return 0x444444; // 灰色 - 未解锁
  
  switch (type) {
    case 'grammar':
      return 0x3498db; // 蓝色 - 语法
    case 'vocabulary':
      return 0x2ecc71; // 绿色 - 词汇
    case 'sentence':
      return 0xf39c12; // 橙色 - 句型
    case 'vehicle-term':
      return 0x9b59b6; // 紫色 - 车辆术语
  }
}

// 辅助函数：获取节点图标
function getNodeIcon(type: KnowledgeNode['type']): string {
  switch (type) {
    case 'grammar':
      return 'fa-book';
    case 'vocabulary':
      return 'fa-language';
    case 'sentence':
      return 'fa-comment';
    case 'vehicle-term':
      return 'fa-car';
  }
}