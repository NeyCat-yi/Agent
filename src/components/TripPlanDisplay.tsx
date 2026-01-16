
import React from 'react';
import { TripPlan, DayPlan, Attraction, Meal, Hotel, WeatherInfo } from '../types';
import { MapPin, Clock, DollarSign, Utensils, Bed, Sun, Wind, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

interface TripPlanDisplayProps {
  plan: TripPlan;
}

const WeatherCard: React.FC<{ info: WeatherInfo }> = ({ info }) => (
  <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
    <Sun className="w-4 h-4" />
    <span>{info.date}: {info.day_weather} ({info.day_temp}°C)</span>
    {info.wind_direction && (
      <span className="flex items-center ml-2">
        <Wind className="w-4 h-4 mr-1" /> {info.wind_direction} {info.wind_power}
      </span>
    )}
  </div>
);

const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => (
  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-2">
    <div className="flex items-start justify-between">
      <div>
        <h4 className="font-semibold text-indigo-900 flex items-center">
          <Bed className="w-4 h-4 mr-2" /> {hotel.name}
        </h4>
        <p className="text-sm text-indigo-700 mt-1">{hotel.address}</p>
        <div className="flex gap-2 mt-2 text-xs text-indigo-600">
          <span className="bg-indigo-100 px-2 py-1 rounded">{hotel.type || "酒店"}</span>
          <span className="bg-indigo-100 px-2 py-1 rounded">{hotel.rating}</span>
          <span className="bg-indigo-100 px-2 py-1 rounded">{hotel.price_range}</span>
        </div>
      </div>
    </div>
  </div>
);

const AttractionItem: React.FC<{ attraction: Attraction }> = ({ attraction }) => (
  <div className="border-l-4 border-green-500 pl-4 py-2 my-4 bg-white rounded-r-lg shadow-sm">
    <div className="flex justify-between items-start">
      <h4 className="font-bold text-gray-800 text-lg">{attraction.name}</h4>
      {attraction.ticket_price ? (
        <span className="text-sm text-green-600 font-medium flex items-center">
          <DollarSign className="w-3 h-3 mr-1" /> {attraction.ticket_price}
        </span>
      ) : null}
    </div>
    <div className="text-sm text-gray-600 mt-1 flex items-center gap-4">
      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {attraction.visit_duration}分钟</span>
      <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {attraction.address}</span>
    </div>
    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{attraction.description}</p>
  </div>
);

const MealItem: React.FC<{ meal: Meal }> = ({ meal }) => (
  <div className="border-l-4 border-orange-400 pl-4 py-2 my-2 bg-orange-50 rounded-r-lg">
    <h5 className="font-semibold text-orange-900 flex items-center text-sm">
      <Utensils className="w-3 h-3 mr-2" /> 
      {meal.type === 'breakfast' && '早餐'}
      {meal.type === 'lunch' && '午餐'}
      {meal.type === 'dinner' && '晚餐'}
      : {meal.name}
    </h5>
    <p className="text-xs text-orange-700 mt-1">{meal.description}</p>
    <p className="text-xs text-orange-600 mt-1">预估费用: ¥{meal.estimated_cost}</p>
  </div>
);

const DayCard: React.FC<{ day: DayPlan; weather?: WeatherInfo }> = ({ day, weather }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center">
            <Calendar className="w-5 h-5 mr-2" /> 第 {day.day_index + 1} 天
            <span className="text-sm font-normal ml-2 opacity-90">({day.date})</span>
          </h3>
          {weather && (
            <div className="flex items-center text-sm bg-white/20 px-3 py-1 rounded-full">
              <Sun className="w-4 h-4 mr-1" /> {weather.day_weather} {weather.day_temp}°C
            </div>
          )}
        </div>
        <p className="mt-2 text-blue-50 opacity-90 text-sm">{day.description}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Transportation & Accommodation Summary */}
        <div className="flex gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
           <span className="flex items-center"><span className="font-semibold mr-1">交通:</span> {day.transportation}</span>
           <span className="flex items-center"><span className="font-semibold mr-1">住宿:</span> {day.accommodation}</span>
        </div>

        {/* Attractions */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">今日景点</h4>
          {day.attractions.length > 0 ? (
            day.attractions.map((attr, idx) => (
              <AttractionItem key={idx} attraction={attr} />
            ))
          ) : (
            <p className="text-gray-500 italic">今日无特定景点安排</p>
          )}
        </div>

        {/* Meals */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">餐饮推荐</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {day.meals.map((meal, idx) => (
              <MealItem key={idx} meal={meal} />
            ))}
          </div>
        </div>

        {/* Hotel */}
        {day.hotel && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">入住酒店</h4>
            <HotelCard hotel={day.hotel} />
          </div>
        )}
      </div>
    </div>
  );
};

const TripPlanDisplay: React.FC<TripPlanDisplayProps> = ({ plan }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{plan.city} 之旅</h1>
        <p className="text-xl text-gray-600">{plan.start_date} 至 {plan.end_date}</p>
        
        {/* Overall Suggestions */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-left max-w-2xl mx-auto">
          <h3 className="font-bold text-yellow-800 mb-2">💡 总体建议</h3>
          <p className="text-yellow-900 text-sm leading-relaxed whitespace-pre-line">{plan.overall_suggestions}</p>
        </div>

        {/* Budget Summary */}
        {plan.budget && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm max-w-3xl mx-auto">
             <div className="bg-gray-100 p-2 rounded text-center">
                <div className="text-gray-500 text-xs">景点</div>
                <div className="font-bold">¥{plan.budget.total_attractions}</div>
             </div>
             <div className="bg-gray-100 p-2 rounded text-center">
                <div className="text-gray-500 text-xs">酒店</div>
                <div className="font-bold">¥{plan.budget.total_hotels}</div>
             </div>
             <div className="bg-gray-100 p-2 rounded text-center">
                <div className="text-gray-500 text-xs">餐饮</div>
                <div className="font-bold">¥{plan.budget.total_meals}</div>
             </div>
             <div className="bg-gray-100 p-2 rounded text-center">
                <div className="text-gray-500 text-xs">交通</div>
                <div className="font-bold">¥{plan.budget.total_transportation}</div>
             </div>
             <div className="bg-green-100 p-2 rounded text-center ring-2 ring-green-200">
                <div className="text-green-700 text-xs font-bold">总计</div>
                <div className="font-bold text-green-800">¥{plan.budget.total}</div>
             </div>
          </div>
        )}
      </div>

      {/* Daily Plans */}
      <div className="space-y-6">
        {plan.days.map((day) => {
          const weather = plan.weather_info.find(w => w.date === day.date);
          return <DayCard key={day.day_index} day={day} weather={weather} />;
        })}
      </div>
    </div>
  );
};

export default TripPlanDisplay;
