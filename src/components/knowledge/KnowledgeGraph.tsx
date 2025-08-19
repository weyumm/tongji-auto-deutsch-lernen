import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion } from 'framer-motion';

// 知识节点类型定义
export interface KnowledgeNode {
  id: string;
  name: string;
  type: 'grammar' | 'vocabulary' | 'sentence' | 'vehicle-term';
  level: 'a1' | 'a2' | 'b1';
  unlocked: boolean;
  position: { x: number; y: number; z: number };
  connections: string[];
}

// 模拟知识节点数据
const knowledgeNodes: KnowledgeNode[] = [
  // 中心节点
  {
    id: 'central',
    name: '德语基础',
    type: 'grammar',
    level: 'a1',
    unlocked: true,
    position: { x: 0, y: 0, z: 0 },
    connections: ['g1', 'v1', 's1', 'vt1']
  },
  
  // 语法节点
  {
    id: 'g1',
    name: '名词词性',
    type: 'grammar',
    level: 'a1',
    unlocked: true,
    position: { x: -150, y: 50, z: 0 },
    connections: ['central', 'g2', 'g3']
  },
  {
    id: 'g2',
    name: '动词变位',
    type: 'grammar',
    level: 'a1',
    unlocked: true,
    position: { x: -200, y: 150, z: 50 },
    connections: ['g1', 'g4']
  },
  {
    id: 'g3',
    name: '冠词使用',
    type: 'grammar',
    level: 'a1',
    unlocked: true,
    position: { x: -200, y: -50, z: 50 },
    connections: ['g1', 'g5']
  },
  {
    id: 'g4',
    name: '现在时',
    type: 'grammar',
    level: 'a1',
    unlocked: false,
    position: { x: -250, y: 200, z: 100 },
    connections: ['g2']
  },
  {
    id: 'g5',
    name: '复数形式',
    type: 'grammar',
    level: 'a1',
    unlocked: false,
    position: { x: -250, y: -100, z: 100 },
    connections: ['g3']
  },
  
  // 词汇节点
  {
    id: 'v1',
    name: '日常词汇',
    type: 'vocabulary',
    level: 'a1',
    unlocked: true,
    position: { x: 150, y: 50, z: 0 },
    connections: ['central', 'v2', 'v3']
  },
  {
    id: 'v2',
    name: '数字表达',
    type: 'vocabulary',
    level: 'a1',
    unlocked: true,
    position: { x: 200, y: 150, z: -50 },
    connections: ['v1', 'v4']
  },
  {
    id: 'v3',
    name: '时间表达',
    type: 'vocabulary',
    level: 'a1',
    unlocked: true,
    position: { x: 200, y: -50, z: -50 },
    connections: ['v1', 'v5']
  },
  {
    id: 'v4',
    name: '方位词汇',
    type: 'vocabulary',
    level: 'a1',
    unlocked: false,
    position: { x: 250, y: 200, z: -100 },
    connections: ['v2']
  },
  {
    id: 'v5',
    name: '食物词汇',
    type: 'vocabulary',
    level: 'a1',
    unlocked: false,
    position: { x: 250, y: -100, z: -100 },
    connections: ['v3']
  },
  
  // 句型节点
  {
    id: 's1',
    name: '基础句型',
    type: 'sentence',
    level: 'a1',
    unlocked: true,
    position: { x: 0, y: -150, z: 0 },
    connections: ['central', 's2', 's3']
  },
  {
    id: 's2',
    name: '陈述句',
    type: 'sentence',
    level: 'a1',
    unlocked: true,
    position: { x: 100, y: -200, z: 50 },
    connections: ['s1', 's4']
  },
  {
    id: 's3',
    name: '疑问句',
    type: 'sentence',
    level: 'a1',
    unlocked: true,
    position: { x: -100, y: -200, z: 50 },
    connections: ['s1', 's5']
  },
  {
    id: 's4',
    name: '否定句',
    type: 'sentence',
    level: 'a1',
    unlocked: false,
    position: { x: 150, y: -250, z: 100 },
    connections: ['s2']
  },
  {
    id: 's5',
    name: '祈使句',
    type: 'sentence',
    level: 'a1',
    unlocked: false,
    position: { x: -150, y: -250, z: 100 },
    connections: ['s3']
  },
  
  // 车辆工程术语节点
  {
    id: 'vt1',
    name: '汽车基础术语',
    type: 'vehicle-term',
    level: 'a1',
    unlocked: false,
    position: { x: 0, y: 0, z: 150 },
    connections: ['central', 'vt2', 'vt3']
  },
  {
    id: 'vt2',
    name: '发动机术语',
    type: 'vehicle-term',
    level: 'a2',
    unlocked: false,
    position: { x: 100, y: 50, z: 200 },
    connections: ['vt1']
  },
  {
    id: 'vt3',
    name: '底盘术语',
    type: 'vehicle-term',
    level: 'a2',
    unlocked: false,
    position: { x: -100, y: 50, z: 200 },
    connections: ['vt1']
  }
];

// 获取节点颜色 based on 类型
const getNodeColor = (type: KnowledgeNode['type'], unlocked: boolean): number => {
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
};

// 获取节点图标 based on 类型
const getNodeIcon = (type: KnowledgeNode['type']): string => {
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
};

interface KnowledgeGraphProps {
  onNodeClick?: (node: KnowledgeNode) => void;
}

export default function KnowledgeGraph({ onNodeClick }: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Three.js相关变量
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const animationFrameRef = useRef<number | null>(null);
  
  // 节点对象映射
  const nodeObjectsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  
  // 初始化Three.js场景
  useEffect(() => {
    if (!containerRef.current) return;
    
    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;
    
    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // 添加点光源
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 300;
    cameraRef.current = camera;
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minDistance = 200;
    controls.maxDistance = 600;
    controlsRef.current = controls;
    
    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(500, 20, 0x333344, 0x222233);
    scene.add(gridHelper);
    
    // 添加坐标轴辅助线
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);
    
    // 创建连接线
    const createConnections = () => {
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x666688,
        transparent: true,
        opacity: 0.6
      });
      
      knowledgeNodes.forEach(node => {
        node.connections.forEach(connectionId => {
          const targetNode = knowledgeNodes.find(n => n.id === connectionId);
          if (!targetNode) return;
          
          const points = [];
          points.push(
            new THREE.Vector3(node.position.x, node.position.y, node.position.z),
            new THREE.Vector3(targetNode.position.x, targetNode.position.y, targetNode.position.z)
          );
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, lineMaterial);
          scene.add(line);
        });
      });
    };
    
    // 创建节点
    const createNodes = () => {
      knowledgeNodes.forEach(node => {
        // 创建节点几何体
        const geometry = new THREE.SphereGeometry(node.id === 'central' ? 15 : 10, 32, 32);
        
        // 创建材质
        const material = new THREE.MeshStandardMaterial({
          color: getNodeColor(node.type, node.unlocked),
          emissive: node.unlocked ? getNodeColor(node.type, node.unlocked) : 0x000000,
          emissiveIntensity: 0.2,
          transparent: true,
          opacity: 0.9,
          shininess: 100
        });
        
        // 创建网格对象
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(node.position.x, node.position.y, node.position.z);
        sphere.name = node.id;
        
        // 添加点击事件支持
        sphere.userData = { node };
        
        // 添加到场景
        scene.add(sphere);
        nodeObjectsRef.current.set(node.id, sphere);
        
        // 添加节点标签（使用CSS2DRenderer实现，这里简化处理）
      });
    };
    
    // 渲染循环
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    // 窗口大小调整处理
    const handleWindowResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleWindowResize);
    
    // 鼠标移动事件 - 用于节点选择
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      // 计算鼠标在标准化设备坐标中的位置 (-1 to +1)
      mouseRef.current.x = (event.clientX / containerRef.current.clientWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / containerRef.current.clientHeight) * 2 + 1;
    };
    
    // 鼠标点击事件 - 用于节点点击
    const handleMouseClick = () => {
      if (!cameraRef.current || !sceneRef.current) return;
      
      // 通过鼠标位置更新射线投射器
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      // 计算与射线相交的对象
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);
      
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        if (selectedObject.userData && selectedObject.userData.node) {
          const node = selectedObject.userData.node as KnowledgeNode;
          setSelectedNode(node);
          if (onNodeClick && node.unlocked) {
            onNodeClick(node);
          }
        }
      } else {
        setSelectedNode(null);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);
    
    // 初始化场景内容
    createConnections();
    createNodes();
    
    // 开始动画循环
    animate();
    
    // 加载完成
    setIsLoading(false);
    
    // 清理函数
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // 清理Three.js资源
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            }
          }
        });
      }
      
      controlsRef.current?.dispose();
      rendererRef.current?.dispose();
    };
  }, [onNodeClick]);
  
  // 渲染节点详情
  const renderNodeDetails = () => {
    if (!selectedNode) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-slate-800/90 backdrop-blur-lg rounded-xl p-6 border border-slate-700 shadow-2xl z-10"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: `#${getNodeColor(selectedNode.type, selectedNode.unlocked).toString(16).padStart(6, '0')}`,
                opacity: 0.8
              }}
            >
              <i className={`fa-solid ${getNodeIcon(selectedNode.type)} text-white text-xl`}></i>
            </div>
            <div>
              <h3 className="text-xl font-bold">{selectedNode.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                  {selectedNode.level.toUpperCase()} 级别
                </span>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                  {selectedNode.type === 'grammar' && '语法'}
                  {selectedNode.type === 'vocabulary' && '词汇'}
                  {selectedNode.type === 'sentence' && '句型'}
                  {selectedNode.type === 'vehicle-term' && '车辆术语'}
                </span>
                {!selectedNode.unlocked && (
                  <span className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded-full">
                    未解锁
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {selectedNode.unlocked && (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              onClick={() => onNodeClick && onNodeClick(selectedNode)}
            >
              学习此知识点
            </button>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-slate-300 text-sm">
            {selectedNode.unlocked ? (
              <>
                点击"学习此知识点"按钮开始学习。
                {selectedNode.type === 'vehicle-term' && ' 此为车辆工程专业术语，掌握这些词汇将有助于阅读专业德语文献。'}
              </>
            ) : (
              '完成前置关卡即可解锁此知识点。继续学习，加油！'
            )}
          </p>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <h3 className="text-xl font-bold mb-2">加载知识图谱中...</h3>
            <p className="text-slate-400">正在构建德语知识网络，请稍候</p>
          </div>
        </div>
      )}
      
      {renderNodeDetails()}
      
      <div className="absolute top-4 left-4 z-10 bg-slate-800/70 backdrop-blur-lg rounded-lg p-3 border border-slate-700">
        <h3 className="text-lg font-bold mb-2">知识图谱导航</h3>
        <div className="space-y-2 text-sm">
          <p className="flex items-center text-slate-300">
            <i className="fa-solid fa-mouse-pointer mr-2"></i>
            <span>点击节点查看详情</span>
          </p>
          <p className="flex items-center text-slate-300">
            <i className="fa-solid fa-hand-paper mr-2"></i>
            <span>拖动旋转视角</span>
          </p>
          <p className="flex items-center text-slate-300">
            <i className="fa-solid fa-search-plus mr-2"></i>
            <span>滚轮缩放图谱</span>
          </p>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button 
          className="bg-slate-800/70 hover:bg-slate-700/70 backdrop-blur-lg rounded-lg p-2 border border-slate-700 transition-colors"
          title="重置视角"
          onClick={() => {
            if (controlsRef.current) {
              controlsRef.current.reset();
            }
          }}
        >
          <i className="fa-solid fa-compress-arrows-alt"></i>
        </button>
      </div>
    </div>
  );
}