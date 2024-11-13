import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface ForecastProps {
  forecast: {
    fcstDate: string;
    maxTemp: number;
    minTemp: number;
  };
  index: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WeatherScroll: React.FC<ForecastProps> = ({ forecast, index }) => {
  const formatDate = (fcstDate: string) => {
    // 받아온 날짜들
    const year = fcstDate.slice(0, 4);
    const month = fcstDate.slice(4, 6);
    const day = fcstDate.slice(6, 8);

    if (index === 0) return '오늘 날씨';
    if (index === 1) return '내일 날씨';
    if (index === 2) return '모레 날씨';

    return `${index}일 뒤 날씨`;
  };

  return (
    <View style={styles.day} key={forecast.fcstDate}>
      <Text style={styles.dateText}>{formatDate(forecast.fcstDate)}</Text>
      <View style={styles.tempContainer}>
        <Text style={styles.maxTempText}>{forecast.maxTemp}°C</Text>
        <Text style={styles.minTempText}>{forecast.minTemp}°C</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  dateText: {
    marginTop: 50,
    fontSize: 35,
    marginBottom: 10,
  },
  tempContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
  },
  maxTempText: {
    fontSize: 45,
    fontWeight: '600',
    color: 'red',
  },
  minTempText: {
    fontSize: 45,
    fontWeight: '600',
    color: 'blue',
  },
});

export default WeatherScroll;
