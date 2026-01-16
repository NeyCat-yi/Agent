
import { useState } from 'react';
import TripForm from './components/TripForm';
import TripPlanDisplay from './components/TripPlanDisplay';
import { generateTripPlan } from './services/api';
import { TripRequest, TripPlan } from './types';
import { Plane, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlanSubmit = async (request: TripRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateTripPlan(request);
      if (response.success && response.data) {
        setPlan(response.data);
      } else {
        setError(response.message || '生成行程失败，请稍后重试');
      }
    } catch (err) {
      setError('网络请求失败，请检查后端服务是否启动');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Navbar/Header */}
      <div className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI 智能旅行助手</h1>
            <p className="text-sm text-gray-500">为您量身定制完美的旅行行程</p>
          </div>
        </div>
        
        {plan && (
          <button
            onClick={handleReset}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> 重新规划
          </button>
        )}
      </div>

      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    计划您的下一次 <span className="text-blue-600">完美旅行</span>
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    告诉我们您的目的地、旅行日期和偏好，我们的智能助手将结合实时天气、热门景点和酒店评价，为您生成详细的每日行程。
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-100 p-1 rounded">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">智能景点推荐与路线规划</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-100 p-1 rounded">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">实时天气预报集成</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-100 p-1 rounded">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">精准的预算评估与酒店建议</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <TripForm onSubmit={handlePlanSubmit} isLoading={isLoading} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <TripPlanDisplay plan={plan} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">正在为您规划行程</h3>
                <p className="text-gray-500">正在获取天气、景点和最佳路线...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-8 right-8 max-w-md animate-bounce">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded shadow-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">发生错误</h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-xs font-bold text-red-800 uppercase tracking-wider hover:text-red-900"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 py-8 border-t border-gray-200 text-center text-gray-400 text-sm">
        &copy; 2024 AI 智能旅行助手. 让每一次旅行都与众不同.
      </footer>
    </div>
  );
}

export default App;
