import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { dfsXYConv } from './utils/GeolocationService';
import { TemperatureDataType } from './types/weatherTypes';
import { GetWeatherData } from './services/weatherSearchService/WeatherData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [city, setCity] = useState<null | string>('Loading');
  const [weekTemperature, setWeekTemperature] = useState<TemperatureDataType[] | null>(null);
  const [ok, setOk] = useState(true);
  const [temperature, setTemperature] = useState<string | null>('0');

  // 위치정보에 대한 데이터 가지고 오기
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    // 위도 경도를 기상청 api에 맞는 격자로 변환
    const rs = dfsXYConv('toXY', latitude, longitude);

    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);

    let nx: string;
    let ny: string;

    if ('x' in rs && 'y' in rs) {
      nx = `&nx=${rs.x}`;
      ny = `&ny=${rs.y}`;

      const data = await GetWeatherData(nx, ny);
      if (data) {
        setTemperature(data.today.temperature);
        setWeekTemperature(data.week);
      }
    } else {
      nx = `&nx=0`;
      ny = `&ny=0`;
      setTemperature('0');
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        <View style={styles.day}>
          <Text style={styles.tempText}>현재 온도</Text>
          <Text style={styles.temp}>{temperature}</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'royalblue',
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500',
  },
  weather: {
    // backgroundColor: 'blue',
  },
  day: {
    // flex: 1,
    // backgroundColor: 'blue',
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  tempText: {
    fontSize: 35,
    marginTop: 50,
  },
  temp: {
    // marginTop: 50,
    fontSize: 178,
    fontWeight: '600',
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
});
