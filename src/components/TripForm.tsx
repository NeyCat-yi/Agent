
import React, { useState } from 'react';
import { TripRequest } from '../types';
import { differenceInDays, parseISO } from 'date-fns';
import { Calendar, MapPin, Truck, Home, Heart, FileText } from 'lucide-react';

interface TripFormProps {
  onSubmit: (request: TripRequest) => void;
  isLoading: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Partial<TripRequest>>({
    city: '北京',
    start_date: '2025-06-01',
    end_date: '2025-06-03',
    transportation: '公共交通',
    accommodation: '经济型酒店',
    preferences: [],
    free_text_input: '',
  });

  const [prefInput, setPrefInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPreference = () => {
    if (prefInput.trim()) {
      setFormData(prev => ({
        ...prev,
        preferences: [...(prev.preferences || []), prefInput.trim()]
      }));
      setPrefInput('');
    }
  };

  const removePreference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.start_date || !formData.end_date) return;

    const days = differenceInDays(parseISO(formData.end_date), parseISO(formData.start_date)) + 1;
    
    const request: TripRequest = {
      city: formData.city,
      start_date: formData.start_date,
      end_date: formData.end_date,
      travel_days: days > 0 ? days : 1,
      transportation: formData.transportation || '公共交通',
      accommodation: formData.accommodation || '经济型酒店',
      preferences: formData.preferences,
      free_text_input: formData.free_text_input
    };

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">定制您的旅行计划</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 mr-2" /> 目的地城市
          </label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例如：北京"
          />
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-2" /> 旅行日期
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              name="start_date"
              required
              value={formData.start_date}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <span className="self-center">-</span>
            <input
              type="date"
              name="end_date"
              required
              value={formData.end_date}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Transportation */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Truck className="w-4 h-4 mr-2" /> 交通方式
          </label>
          <select
            name="transportation"
            value={formData.transportation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="公共交通">公共交通</option>
            <option value="自驾">自驾</option>
            <option value="打车">打车</option>
            <option value="步行">步行</option>
          </select>
        </div>

        {/* Accommodation */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Home className="w-4 h-4 mr-2" /> 住宿偏好
          </label>
          <select
            name="accommodation"
            value={formData.accommodation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="经济型酒店">经济型酒店</option>
            <option value="舒适型酒店">舒适型酒店</option>
            <option value="豪华型酒店">豪华型酒店</option>
            <option value="民宿">民宿</option>
            <option value="青年旅社">青年旅社</option>
          </select>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Heart className="w-4 h-4 mr-2" /> 偏好标签
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={prefInput}
            onChange={(e) => setPrefInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPreference())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="输入偏好（如：历史、美食）按回车添加"
          />
          <button
            type="button"
            onClick={handleAddPreference}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            添加
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.preferences?.map((pref, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {pref}
              <button
                type="button"
                onClick={() => removePreference(index)}
                className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Free Text */}
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <FileText className="w-4 h-4 mr-2" /> 其他要求
        </label>
        <textarea
          name="free_text_input"
          value={formData.free_text_input}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="例如：希望行程不要太赶，多安排一些自然风光..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium text-lg 
          ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
      >
        {isLoading ? '正在规划行程...' : '开始规划行程'}
      </button>
    </form>
  );
};

export default TripForm;
