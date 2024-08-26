"use client"

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const WeatherDisplay: React.FC = () => {
  const { data, loading, error } = useSelector((state: RootState) => state.weather);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const {
    temperature,
    humidity,
    wind_speed,
    wind_direction,
    rain_intensity,
    rain_accumulation
  } = data.locality_weather_data;

  return (
    <div className='flex max-w-96 m-auto items-center pt-5 '>
      <div className="max-w-md mx-auto   mt-8 bg-white rounded-xl shadow-md overflow-hidden ">
      <div className="md:flex">
        <div className="p-8">
          <h2 
              className="text-2xl font-bold text-gray-800 mb-4">Weather Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <WeatherItem label="Temperature" value={`${temperature.toFixed(1)}°C`} icon="🌡️" />
            <WeatherItem label="Humidity" value={`${humidity.toFixed(1)}%`} icon="💧" />
            <WeatherItem label="Wind Speed" value={`${wind_speed.toFixed(2)} km/h`} icon="💨" />
            <WeatherItem label="Wind Direction" value={`${wind_direction.toFixed(1)}°`} icon="🧭" />
            <WeatherItem label="Rain Intensity" value={`${rain_intensity.toFixed(2)} mm/h`} icon="🌧️" />
            <WeatherItem label="Rain Accumulation" value={`${rain_accumulation.toFixed(1)} mm`} icon="☔" />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

const WeatherItem: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="flex items-center">
    <span className="text-2xl mr-2">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center mt-8 text-red-500">
    <p className="text-xl font-semibold">Error</p>
    <p>{message}</p>
  </div>
);

export default WeatherDisplay;