import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ForecastProps {
  forecast: {
    fcstDate: string;
    maxTemp: number;
    minTemp: number;
  };
}

const WeatherScroll: React.FC<ForecastProps> = ({ forecast }) => {
  const formatDate = (fcstDate: string) => {
    const year = fcstDate.slice(0, 4);
    const month = fcstDate.slice(4, 6);
    const day = fcstDate.slice(6, 8);
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.day} key={forecast.fcstDate}>
      <Text style={styles.dateText}>{formatDate(forecast.fcstDate)}</Text>
      <Text style={styles.tempText}>최고: {forecast.maxTemp}°C</Text>
      <Text style={styles.tempText}>최저: {forecast.minTemp}°C</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  day: {
    width: 200,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  tempText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WeatherScroll;
