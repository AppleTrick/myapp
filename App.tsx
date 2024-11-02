import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [city, setCity] = useState<null | string>('Loading');
  const [days, setDays] = useState([]); // 날씨를 배열형식으로 저장함
  const [ok, setOk] = useState(true);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // 위치정보에 대한 데이터 가지고 오기
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    setLatitude(String(latitude));
    setLongitude(String(longitude));

    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);

    // api 키
    const apiKey = 'YUrGMy0V%2BGWA4GKHG9QRq2bT3GqSRCeMa62ZdYVwD55XvIiZOi6uwwRpxIOk43tfLmPrUStNlSceZzdWk1UnZQ%3D%3D';

    let url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=JSON`;
    const base_date = `&base_date=${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;
    const base_time = `&base_time=${String(new Date().getHours()).padStart(2, '0')}00`;
    // const base_time = `&base_time=1800`;
    // const nx = `&nx=${latitude}`;
    const nx = `&nx=62`;
    // const ny = `&ny=${longitude}`;
    const ny = `&ny=126`;
    url = url + base_date + base_time + nx + ny;

    try {
      const response = await fetch(url);
      console.log(url);
      const json = await response.json();
    } catch (error) {
      console.error(error);
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
          <Text>{latitude}</Text>
          <Text>{longitude}</Text>
          <Text style={styles.temp}>28</Text>
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
