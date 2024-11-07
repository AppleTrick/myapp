export const NowWeatherSearch = async (nx: string, ny: string) => {
  // api 키
  const apiKey = 'YUrGMy0V%2BGWA4GKHG9QRq2bT3GqSRCeMa62ZdYVwD55XvIiZOi6uwwRpxIOk43tfLmPrUStNlSceZzdWk1UnZQ%3D%3D';
  // 정보조회 버전
  const forecast = `getUltraSrtNcst`; // 초단기실황조회

  const today = new Date();
  const hour = today.getHours();
  const Minute = today.getMinutes();

  // 검색하는 날짜
  const base_date = `&base_date=${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const base_time = Minute <= 10 ? `&base_time=${String(today.getHours() - 1).padStart(2, '0')}00` : `&base_time=${String(today.getHours()).padStart(2, '0')}00`;

  // 기본 URL
  let url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast}?serviceKey=${apiKey}&pageNo=1&numOfRows=100&dataType=JSON`;

  url = url + base_date + base_time + nx + ny;

  const response = await fetch(url);
  const json = await response.json();
  const items = json.response.body.items.item;
  const temperature = items.find((item: any) => item.category === 'T1H').obsrValue;
  // console.log(url);

  return temperature;
};
