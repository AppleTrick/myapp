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

  // 지역코드
  const AreaCode = `11B10101`;

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hour = today.getHours();
  const minute = today.getMinutes();

  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // fcastDate , fcstTime 을 Date 형식으로 변환
  // 241101 , 1800 => 24년 11월 1일 18시 의 new Date() 로 변환
  const parseDateTime = (fcstDate: string, fcstTime: string) => {
    const year = fcstDate.substring(0, 4);
    const month = fcstDate.substring(4, 6);
    const day = fcstDate.substring(6, 8);
    const hour = fcstTime.substring(0, 2);
    const minute = fcstTime.substring(2, 4);

    return new Date(
      parseInt(year),
      parseInt(month) - 1, // JavaScript의 월은 0부터 시작
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
    );
  };

  // 초단기예보 검색
  const GetNowWeatherData = async () => {
    const base_date = `&base_date=${year}${month}${day}`;
    const base_time = minute <= 10 ? `&base_time=${String(hour - 1).padStart(2, '0')}00` : `&base_time=${String(hour).padStart(2, '0')}00`;
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast}?serviceKey=${apiKey}&pageNo=1&numOfRows=100&dataType=JSON${base_date}${base_time}${nx}${ny}`;

    // 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)

    const response = await fetch(url);
    const json = await response.json();
    const items = json.response.body.items.item;
    const getNowData = items.filter((item: any) => ['T1H', 'PTY'].includes(item.category));

    return getNowData;
  };

  const GetNowWeatherDataF = async () => {
    const base_date = `&base_date=${year}${month}${day}`;
    const base_time = minute <= 45 ? `&base_time=${String(hour - 1).padStart(2, '0')}30` : `&base_time=${String(hour).padStart(2, '0')}30`;
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast1}?serviceKey=${apiKey}&pageNo=1&numOfRows=100&dataType=JSON${base_date}${base_time}${nx}${ny}`;

    const response = await fetch(url);
    const json = await response.json();
    const items = json.response.body.items.item;
  };

  const GetHourWeatherData = async () => {
    // 기준시간에 따른 리턴 부분;
    const getDayByBaseTime = (baseTime: string) => {
      return baseTime === '2300' ? String(yesterday.getDate()).padStart(2, '0') : String(today.getDate()).padStart(2, '0');
    };

    // 시간과 분의 합
    const Sum = hour * 60 + minute;

    // 각 시간 구간의 경계와 base_time 값을 배열에 저장
    // 단기예보의 경우 다음과 같은 경우를 따지게된다. BaseTime 이 다르다.
    //  - Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
    // - API 제공 시간(~이후) : 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10
    // 14 시 안됨 08시 안되는 경우를 체크해서 해당 부분 삭제함
    const timeLimits = [130, 310, 490, 850, 1190, 1430];
    const baseTimes = ['2300', '0200', '0500', '1100', '1700', '2000'];

    // 조건에 맞는 base_time을 찾기
    // 검색할때 기준 시간 찾기
    const base_time = baseTimes[timeLimits.findIndex((limit) => Sum <= limit)];
    const base_time_onlyTemp = '1100';

    // base_time의 기준으로 날짜를 찾음
    // ex 예를 들어 base_time 이 23:00 경우에는 날짜가 하루전으로 가야되기 때문
    const day = getDayByBaseTime(base_time);

    const base_date = `&base_date=${year}${month}${day}`;

    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast2}?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=JSON${base_date}&base_time=${base_time}${nx}${ny}`;
    const url_onlyTemp = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast2}?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=JSON${base_date}&base_time=${base_time_onlyTemp}${nx}${ny}`;

    const items = fetchAndParseJSON(url);
    const items_onlyTemp = fetchAndParseJSON(url_onlyTemp);

    const getHourData = (await items).filter((item: any) => ['TMP', 'SKY'].includes(item.category));
    const getHourMaxMin = (await items_onlyTemp).filter((item: any) => ['TMN', 'TMX'].includes(item.category));

    console.log(getHourData);
    console.log(getHourMaxMin);

    return getHourData;
  };

  const GetWeekTemperatureData = async () => {
    const formatDate = (date: Date) => {
      const timeCode = hour < 6 || hour >= 18 ? '1800' : '0600';
      return `${year}${month}${day}${timeCode}`;
    };

    const tmFc = formatDate(today);
    const url = `https://apis.data.go.kr/1360000/MidFcstInfoService/${forecast3}?serviceKey=${apiKey}&pageNo=1&numOfRows=10&dataType=JSON&regId=${AreaCode}&tmFc=${tmFc}`;

    const response = await fetch(url);
    const json = await response.json();
    const items = json.response.body.items.item;

    const formatTemperatureData = (items: any) => {
      // 결과를 저장할 배열
      const result = [];

      // 3일부터 10일까지의 데이터 처리
      for (let day = 3; day <= 10; day++) {
        const maxKey = `taMax${day}`;
        const minKey = `taMin${day}`;

        // 각 일자별 최고/최저 기온 객체 생성
        const dayData = {
          day: `${day}일 후`,
          maxTemp: items[0][maxKey],
          minTemp: items[0][minKey],
        };

        result.push(dayData);
      }

      return result;
    };

    const formattedData = formatTemperatureData(items);
  };

  const GetWeekWeatherData = async () => {
    const formatDate = (date: Date) => {
      const timeCode = hour < 6 || hour >= 18 ? '1800' : '0600';
      return `${year}${month}${day}${timeCode}`;
    };

    const tmFc = formatDate(today);
    const url = `https://apis.data.go.kr/1360000/MidFcstInfoService/${forecast4}?serviceKey=${apiKey}&pageNo=1&numOfRows=10&dataType=JSON&regId=${AreaCode}&tmFc=${tmFc}`;

    const response = await fetch(url);
    const json = await response.json();
    const items = json.response.body.items.item;
  };

  GetNowWeatherData();
  GetNowWeatherDataF();
  GetHourWeatherData();
  GetWeekTemperatureData();
  GetWeekWeatherData();

  return 0;
};
