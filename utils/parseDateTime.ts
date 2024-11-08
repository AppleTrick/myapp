// fcastDate , fcstTime 을 Date 형식으로 변환
// 241101 , 1800 => 24년 11월 1일 18시 의 new Date() 로 변환
export const parseDateTime = (fcstDate: string, fcstTime: string) => {
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
