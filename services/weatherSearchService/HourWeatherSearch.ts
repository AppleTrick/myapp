export const HourWeatherSearch = async (nx: string, ny: string) => {
  // api 키
  const apiKey = 'YUrGMy0V%2BGWA4GKHG9QRq2bT3GqSRCeMa62ZdYVwD55XvIiZOi6uwwRpxIOk43tfLmPrUStNlSceZzdWk1UnZQ%3D%3D';
  // 단기예보조회
  const forecast = `getVilageFcst`;

  // 단기예보의 경우 다음과 같은 경우를 따지게된다. BaseTime 이 다르다.
  //  - Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
  // - API 제공 시간(~이후) : 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10

  // API를 대상으로 한 기준 시간
  //   const base_time_index = [2, 5, 8, 11, 14, 17, 20, 23];
  // 14 시 안됨 08시 안됨

  // 현재 시간
  const getDayByBaseTime = (baseTime: string) => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    return baseTime === '2300' ? String(yesterday.getDate()).padStart(2, '0') : String(today.getDate()).padStart(2, '0');
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const Hour = today.getHours();
  const Minute = today.getMinutes();

  // 시간과 분의 합
  const Sum = Hour * 60 + Minute;

  // 각 시간 구간의 경계와 base_time 값을 배열에 저장
  const timeLimits = [130, 310, 490, 670, 850, 1030, 1190, 1430];
  const baseTimes = ['2300', '0200', '0500', '0800', '1100', '1400', '1700', '2000'];

  // 조건에 맞는 base_time을 찾기
  // 검색할때 기준 시간 찾기
  const base_time = baseTimes[timeLimits.findIndex((limit) => Sum <= limit)];

  // 시간에 따라 검색 날에기준이 바뀌므로 해당상황에 대한 코드
  const day = getDayByBaseTime(base_time);

  // 검색기준이 되는 날짜
  const base_date = `&base_date=${year}${month}${day}`;

  let url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast}?serviceKey=${apiKey}&pageNo=1&numOfRows=100&dataType=JSON`;
  url = url + base_date + `&base_time=` + base_time + nx + ny;

  console.log(url);

  const response = await fetch(url);
  const json = await response.json();
  const items = json.response.body.items.item;

  // TMP(현재 온도) 데이터만 추출 =>
  // TMX( 일 최고기온)
  // TMN (일 최저기온)
  const selctCategoryData = items.filter((item: any) => ['TMP'].includes(item.category));
  // 새롭게 날짜 데이터 만들어주는 함수
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

  // 현재시간 아래의 데이터들은 날려버림  // 온도에관련된 미래 정보만 남겨둠
  const filteredData = selctCategoryData
    .filter((item: any) => {
      const forecastDateTime = parseDateTime(item.fcstDate, item.fcstTime);
      return forecastDateTime >= today;
    })
    .map((item: any) => Number(item.fcstValue));
  return filteredData;
};
