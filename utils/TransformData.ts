export const transformDataMaxTempMinTemp = (data: any) => {
  const result = [];
  const map = new Map();

  data.forEach((item: any) => {
    const { fcstDate, category, fcstValue } = item;
    if (!map.has(fcstDate)) {
      map.set(fcstDate, { fcstDate });
    }
    if (category === 'TMX') {
      map.get(fcstDate).maxTemp = Number(fcstValue);
    } else if (category === 'TMN') {
      map.get(fcstDate).minTemp = Number(fcstValue);
    }
  });
  for (const value of map.values()) {
    result.push(value);
  }

  return result;
};

// - 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
// - 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
//                       (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)

export const formatTemperatureData = (items: any, today: Date) => {
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

// export const formatTodayTemperature = (items: any) => {
//   const precipitationCodes: { [key: string]: string } = {
//     '0': '없음',
//     '1': '비',
//     '2': '비/눈',
//     '3': '눈',
//     '5': '빗방울',
//     '6': '빗방울눈날림',
//     '7': '눈날림',
//   };

//   const temperature = items.find((item: any) => item.category === 'T1H')?.obsrValue || null;
//   const precipitationCode = items.find((item: any) => item.category === 'PTY')?.obsrValue as string;
//   const precipitation = precipitationCodes[precipitationCode] || '알 수 없음';

//   const result = {
//     temperature,
//     precipitation,
//   };

//   return result;
// };

interface WeatherItem {
  baseDate: string;
  baseTime: string;
  category: 'PTY' | 'T1H';
  nx: number;
  ny: number;
  obsrValue: string;
}

export const formatTodayTemperature = (items: WeatherItem[]) => {
  const precipitationCodes: Record<'0' | '1' | '2' | '3' | '5' | '6' | '7', string> = {
    '0': '맑음',
    '1': '비',
    '2': '비/눈',
    '3': '눈',
    '5': '빗방울',
    '6': '빗방울눈날림',
    '7': '눈날림',
  };

  const temperatureItem = items.find((item) => item.category === 'T1H');
  const precipitationItem = items.find((item) => item.category === 'PTY');

  const temperature = temperatureItem?.obsrValue || null;

  const precipitation = precipitationItem ? precipitationCodes[precipitationItem.obsrValue as keyof typeof precipitationCodes] : '알 수 없음';

  return {
    temperature,
    precipitation,
  };
};
