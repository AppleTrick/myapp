import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { dfsXYConv } from './utils/GeolocationService';
import { HourWeatherSearch } from './services/weatherSearchService/HourWeatherSearch';
import { NowWeatherSearch } from './services/weatherSearchService/NowWeatherSearch';
import { WeekWeatherSearch } from './services/weatherSearchService/WeekWeatherSearch';
import { GetWeatherData } from './services/weatherSearchService/WeatherData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [city, setCity] = useState<null | string>('Loading');
  const [timeTemperature, setTimeTemperature] = useState([]); // 날씨를 배열형식으로 저장함
  const [ok, setOk] = useState(true);
  const [temperature, setTemperature] = useState(0);

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

      const temperature = await NowWeatherSearch(nx, ny);
      // const hourTemperature = await HourWeatherSearch(nx, ny);
      // const WeekTemperature = await WeekWeatherSearch();

      // setTimeTemperature(hourTemperature);
      // setTemperature(temperature);

      await GetWeatherData(nx, ny);
    } else {
      nx = `&nx=0`;
      ny = `&ny=0`;
      setTemperature(0);
    }
  };

  const ask = async () => {
    // 1. 권한에 대한 여부확인
    // const premission = await Location.requestForegroundPermissionsAsync();
    // console.log(premission);
    // {"canAskAgain": true, "expires": "never", "granted": true, "status": "granted"}
    // grant => 권한에 대한 변경권
    // const { granted } = await Location.requestForegroundPermissionsAsync();
    // if (!granted) {
    //   setOk(false);
    // }
    // 위치정보 가지고 오기
    // const loaction = await Location.getCurrentPositionAsync({ accuracy: 5 });
    // console.log(loaction);
    // {
    //   "coords":
    //       {
    //         "accuracy": 5,
    //         "altitude": 0,
    //         "altitudeAccuracy": -1,
    //         "heading": -1,
    //         "latitude": 37.785834,
    //         "longitude": -122.406417,
    //         "speed": -1
    //       },
    //     "timestamp": 1730456103939.91
    // }
    // const {
    //   coords: { latitude, longitude },
    // } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    // 3. 위치정보 다시 가지고 오기
    // const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    // console.log(location);
    // [{"city": "샌프란시스코", "country": "미 합중국", "district": "Union Square", "isoCountryCode": "US", "name": "Powell St", "postalCode": "94108", "region": "CA", "street": "Ellis St", "streetNumber": "2–16", "subregion": "샌프란시스코", "timezone": "America/Los_Angeles"}]
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
