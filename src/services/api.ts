
import axios from 'axios';
import { TripRequest, TripPlanResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateTripPlan = async (request: TripRequest): Promise<TripPlanResponse> => {
  try {
    const response = await api.post<TripPlanResponse>('/api/plan', request);
    return response.data;
  } catch (error) {
    console.error('Error generating trip plan:', error);
    if (axios.isAxiosError(error) && error.response) {
       return {
         success: false,
         message: error.response.data?.message || 'Server error occurred',
       };
    }
    return {
      success: false,
      message: 'Network error or server unavailable',
    };
  }
};
