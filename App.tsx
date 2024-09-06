import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = 'ad4be890c70a3d43fcf896515d0a9db2';
// const API_KEY = process.env.REACT_APP_WEATHER_KEY;

export default function App() {
  const [city, setCity] = useState<null | string>('Loading');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  // 위치정보에 대한 데이터 가지고 오기
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    // console.log(permission); // {"canAskAgain": true, "expires": "never", "granted": true, "status": "granted"}
    if (!granted) {
      setOk(false);
    }
    // const aa = await Location.getCurrentPositionAsync({ accuracy: 5 });
    // console.log(aa);
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);

    // 날씨 API 로 가지고 오기
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    const json = await response.json();
    setDays(json.weather);
  };

  // 실행되고 실행
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
          <Text style={styles.temp}>28</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
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
  temp: {
    marginTop: 50,
    fontSize: 178,
    fontWeight: '600',
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
});
