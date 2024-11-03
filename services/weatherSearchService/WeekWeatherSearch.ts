export const WeekWeatherSearch = () => {
  // api 키
  const apiKey = 'YUrGMy0V%2BGWA4GKHG9QRq2bT3GqSRCeMa62ZdYVwD55XvIiZOi6uwwRpxIOk43tfLmPrUStNlSceZzdWk1UnZQ%3D%3D';
  // 단기예보조회
  const forecast = `getVilageFcst`;

  // 검색하는 날짜
  const base_date = `&base_date=${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`;

  // 단기예보의 경우 다음과 같은 경우를 따지게된다. BaseTime 이 다르다.
  //  - Base_time : 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
  // - API 제공 시간(~이후) : 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10

  // API를 대상으로 한 기준 시간
  const base_time_index = [2, 5, 8, 11, 14, 17, 20, 23];

  // 현재 시간
  const current_time_Hour = new Date().getHours();
  const current_time_Minute = new Date().getMinutes();

  console.log('현재시간', current_time_Hour, current_time_Minute);

  let closest_base_time_index = 0;

  // 02:10 보다 작은 경우 전날로 가야된다.

  if (current_time_Hour <= 2 && current_time_Minute <= 10) {
    // 전날로 돌아가고 base time 은 2300 인 알고리즘이 필요하다.
  } else {
    for (let i = 0; i < base_time_index.length; i++) {
      if (current_time_Hour <= base_time_index[i]) {
        closest_base_time_index = i;
        break;
      }
    }
  }

  console.log(base_time_index[closest_base_time_index]);
};
