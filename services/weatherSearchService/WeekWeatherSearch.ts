export const WeekWeatherSearch = async () => {
  const apiKey = 'YUrGMy0V%2BGWA4GKHG9QRq2bT3GqSRCeMa62ZdYVwD55XvIiZOi6uwwRpxIOk43tfLmPrUStNlSceZzdWk1UnZQ%3D%3D';
  // 단기예보조회
  const forecast = `getMidTa`;
  const AreaCode = `11B10101`;

  const today = new Date();
  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hour = date.getHours();
    const timeCode = hour < 6 || hour >= 18 ? '1800' : '0600';

    return `${yyyy}${mm}${dd}${timeCode}`;
  };

  // 일 2회(06:00,18:00)회 생성 되며 발표시각을 입력
  // -최근 24시간 자료만 제공
  // 201309030600 와 같은 형식으로 입력
  const tmFc = formatDate(today);

  let url = `https://apis.data.go.kr/1360000/MidFcstInfoService/${forecast}?serviceKey=${apiKey}&pageNo=1&numOfRows=10&dataType=JSON&regId=${AreaCode}&tmFc=${tmFc}`;
  const response = await fetch(url);
  const json = await response.json();
  const items = json.response.body.items.item;

  console.log(items);
};
