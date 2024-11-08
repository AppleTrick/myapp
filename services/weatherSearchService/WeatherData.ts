import { fetchAndParseJSON } from '../../utils/FetchAndParseJSON';

export const GetWeatherData = async (nx: any, ny: any) => {
  // api 키
  const apiKey = 'YUrGMy0V%2BGWA4GKHG9QRq2bT3GqSRCeMa62ZdYVwD55XvIiZOi6uwwRpxIOk43tfLmPrUStNlSceZzdWk1UnZQ%3D%3D';

  // 정보조회 버전
  const forecast = `getUltraSrtNcst`; // 초단기실황조회
  const forecast1 = `getUltraSrtFcst`; // 초단기예보조회
  const forecast2 = `getVilageFcst`; // 단기예보조회
  const forecast3 = `getMidTa`; // 중기기온예보
  const forecast4 = `getMidLandFcst`; // 중기날씨예보

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hour = today.getHours();
  const minute = today.getMinutes();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const GetNowWeatherData = async () => {
    const base_time = minute <= 10 ? `&base_time=${String(hour - 1).padStart(2, '0')}00` : `&base_time=${String(hour).padStart(2, '0')}00`;
    const base_date = `&base_date=${year}${month}${day}`;
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast}?serviceKey=${apiKey}&pageNo=1&numOfRows=100&dataType=JSON${base_date}${base_time}${nx}${ny}`;
    const items = await fetchAndParseJSON(url);
    const getNowData = items.filter((item: any) => ['T1H', 'PTY'].includes(item.category));
    return getNowData;
  };

  // 시간별 날씨에 대한 정보를 가지고오는 함수
  const GetHourWeatherData = async () => {
    const getDayByBaseTime = (baseTime: string) => {
      return baseTime === '2300' ? String(yesterday.getDate()).padStart(2, '0') : String(today.getDate()).padStart(2, '0');
    };

    const Sum = hour * 60 + minute;
    const timeLimits = [130, 310, 490, 850, 1190, 1430];
    const baseTimes = ['2300', '0200', '0500', '1100', '1700', '2000'];
    const base_time = baseTimes[timeLimits.findIndex((limit) => Sum <= limit)];
    const day = getDayByBaseTime(base_time);
    const base_date = `&base_date=${year}${month}${day}`;
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast2}?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=JSON${base_date}&base_time=${base_time}${nx}${ny}`;
    const items = await fetchAndParseJSON(url);
    const getHourData = items.filter((item: any) => ['TMP', 'SKY'].includes(item.category));
    return getHourData;
  };

  // 오늘 최저기온 최고기온에 대한 정보를 가지고 오는 함수
  const getMaxMinTemperatureHourData = async () => {
    const Sum = hour * 60 + minute;
    const MaxMinday = Sum < 130 ? String(yesterday.getDate()).padStart(2, '0') : String(today.getDate()).padStart(2, '0');
    const base_date = `&base_date=${year}${month}${MaxMinday}`;
    const base_time = '0200';
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast2}?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=JSON${base_date}&base_time=${base_time}${nx}${ny}`;
    const items = await fetchAndParseJSON(url);
    const getHourMaxMin = items.filter((item: any) => ['TMN', 'TMX'].includes(item.category));

    const transformData = (data: any) => {
      const result = [];
      const map = new Map();

      data.forEach((item: any) => {
        const { fcstDate, category, fcstValue } = item;

        // 날짜별로 데이터를 분리하여 Map에 저장
        if (!map.has(fcstDate)) {
          map.set(fcstDate, { fcstDate });
        }
        if (category === 'TMX') {
          map.get(fcstDate).maxTemp = Number(fcstValue);
        } else if (category === 'TMN') {
          map.get(fcstDate).minTemp = Number(fcstValue);
        }
      });

      // Map의 값들을 배열로 변환
      for (const value of map.values()) {
        result.push(value);
      }

      return result;
    };

    const result = transformData(getHourMaxMin);

    return result;
  };

  // 주간 온도 데이터
  const GetWeekTemperatureData = async () => {
    const AreaCode = `11B10101`; // 서울

    const formatDate = (date: Date) => {
      const timeCode = hour < 6 || hour >= 18 ? '1800' : '0600';
      return `${year}${month}${day}${timeCode}`;
    };

    const tmFc = formatDate(today);
    const url = `https://apis.data.go.kr/1360000/MidFcstInfoService/${forecast3}?serviceKey=${apiKey}&pageNo=1&numOfRows=10&dataType=JSON&regId=${AreaCode}&tmFc=${tmFc}`;
    const items = await fetchAndParseJSON(url);

    const formatTemperatureData = (items: any) => {
      const result = [];

      for (let day = 3; day <= 10; day++) {
        const maxKey = `taMax${day}`;
        const minKey = `taMin${day}`;

        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + Number(day));
        const formattedDate = `${forecastDate.getFullYear()}${String(forecastDate.getMonth() + 1).padStart(2, '0')}${String(forecastDate.getDate()).padStart(2, '0')}`;

        const dayData = {
          fcstDate: formattedDate,
          maxTemp: items[0][maxKey],
          minTemp: items[0][minKey],
        };

        result.push(dayData);
      }

      return result;
    };

    const formattedData = formatTemperatureData(items);

    return formattedData;
  };

  // 주간 기상 데이터
  const GetWeekWeatherData = async () => {
    const AreaCode = '11B00000'; // 서울 경기 인천

    const formatDate = (date: Date) => {
      const timeCode = hour < 6 || hour >= 18 ? '1800' : '0600';
      return `${year}${month}${day}${timeCode}`;
    };

    const tmFc = formatDate(today);
    const url = `https://apis.data.go.kr/1360000/MidFcstInfoService/${forecast4}?serviceKey=${apiKey}&pageNo=1&numOfRows=10&dataType=JSON&regId=${AreaCode}&tmFc=${tmFc}`;

    const items = await fetchAndParseJSON(url);
    const weatherData = items[0]; // 첫 번째 객체에 접근

    const weekWeather = Array.from({ length: 5 }, (_, i) => {
      const dayOffset = i + 3; // 예보가 3일 후부터 시작

      return {
        day: `${dayOffset}일 후`,
        am: {
          precipitation: weatherData[`rnSt${dayOffset}Am`] || null,
          weather: weatherData[`wf${dayOffset}Am`] || null,
        },
        pm: {
          precipitation: weatherData[`rnSt${dayOffset}Pm`] || null,
          weather: weatherData[`wf${dayOffset}Pm`] || null,
        },
      };
    });

    return weekWeather;
  };

  const A = await getMaxMinTemperatureHourData();
  const B = await GetWeekTemperatureData();
  const weekTemperature = [...A, ...B];
  console.log(weekTemperature);
  GetNowWeatherData();
  GetHourWeatherData();
  GetWeekWeatherData();

  return 0;
};

// 각 시간 구간의 경계와 base_time 값을 배열에 저장
// 단기예보의 경우 다음과 같은 경우를 따지게된다. BaseTime 이 다르다.
// Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
// API 제공 시간(~이후) : 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10
// 14 시 안됨 08시 안되는 경우를 체크해서 해당 부분 삭제함
