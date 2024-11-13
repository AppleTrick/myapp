import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { dfsXYConv } from './utils/GeolocationService';
import { TemperatureDataType } from './types/weatherTypes';
import { GetWeatherData } from './services/weatherSearchService/WeatherData';
import WeatherScroll from './components/WeekForecast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [city, setCity] = useState<null | string>('Loading');
  const [weekTemperature, setWeekTemperature] = useState<TemperatureDataType[] | null>([]);
  const [ok, setOk] = useState(true);
  const [temperature, setTemperature] = useState<string | null>('0');
  const [precipitation, setPrecipitation] = useState<string | null>(null);

  // 위치정보에 대한 데이터 가지고 오기
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    const rs = dfsXYConv('toXY', latitude, longitude);

    setCity(location[0].city);

    let nx: string;
    let ny: string;

    if ('x' in rs && 'y' in rs) {
      const data = await GetWeatherData(`&nx=${rs.x}`, `&ny=${rs.y}`);

      if (data) {
        setTemperature(data.today.temperature);
        setPrecipitation(data.today.precipitation);
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
        {weekTemperature?.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{ marginTop: 10 }} />
          </View>
        ) : (
          <>
            <View style={styles.day}>
              <Text style={styles.tempText}>현재 온도</Text>
              <Text style={styles.temp}>{Number(temperature).toFixed(1)} °C</Text>
              <Text style={styles.description}>{precipitation}</Text>
            </View>
            {weekTemperature && weekTemperature.map((item, index) => <WeatherScroll forecast={item} key={item.fcstDate} index={index} />)}
          </>
        )}
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
  },
  cityName: {
    fontSize: 58,
    fontWeight: '500',
    color: 'white',
  },
  weather: {
    // backgroundColor: 'blue',
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  tempText: {
    fontSize: 35,
    marginTop: 50,
    fontWeight: '600',
    color: 'white',
  },

  temp: {
    marginTop: 10,
    fontSize: 100,
    fontWeight: '600',
    color: 'white',
  },

  description: {
    marginTop: -5,
    fontSize: 25,
    color: 'white',
    fontWeight: '500',
  },
});
