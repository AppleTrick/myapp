export const GetTodayWeather = async () => {
  const base_time = minute <= 10 ? `&base_time=${String(hour - 1).padStart(2, '0')}00` : `&base_time=${String(hour).padStart(2, '0')}00`;
  const base_date = `&base_date=${year}${month}${day}`;
  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${forecast}?serviceKey=${apiKey}&pageNo=1&numOfRows=100&dataType=JSON${base_date}${base_time}${nx}${ny}`;
  const items = await fetchAndParseJSON(url);
  const getNowData = items.filter((item: any) => ['T1H', 'PTY'].includes(item.category));
  return getNowData;
};
