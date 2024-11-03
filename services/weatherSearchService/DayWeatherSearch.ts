const dayWeatherSearch = async (nx: string, ny: string) => {
  // api 키
  const apiKey = 'YUrGMy0V%2BGWA4GKHG9QRq2bT3GqSRCeMa62ZdYVwD55XvIiZOi6uwwRpxIOk43tfLmPrUStNlSceZzdWk1UnZQ%3D%3D';
  // 정보조회 버전
  const forecast = `getUltraSrtNcst`; // 초단기실황조회
  // 검색하는 날짜
  const base_date = `&base_date=${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;
  // 검색하는 시간
  const base_time = `&base_time=${String(new Date().getHours()).padStart(2, '0')}00`;

  // 기본 URL
  let url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast}}?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=JSON`;

  url = url + base_date + base_time + nx + ny;

  const response = await fetch(url);
  const json = await response.json();
  const items = json.response.body.items.item;
  const temperature = items.find((item: any) => item.category === 'T1H');

  return temperature;
};
