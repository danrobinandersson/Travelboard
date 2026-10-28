export interface WeatherDescription {
  text: string;
  icon: string;
}

const UNKNOWN: WeatherDescription = { text: 'Unknown', icon: '❓' };

export function describeSymbol(symbol: string | null): WeatherDescription {
  if (!symbol) return UNKNOWN;

  const base = symbol.replace(/_(day|night|polartwilight)$/, '');

  switch (base) {
    case 'clearsky':
      return { text: 'Clear sky', icon: '☀️' };
    case 'fair':
      return { text: 'Fair', icon: '🌤️' };
    case 'partlycloudy':
      return { text: 'Partly cloudy', icon: '⛅' };
    case 'cloudy':
      return { text: 'Cloudy', icon: '☁️' };
    case 'fog':
      return { text: 'Fog', icon: '🌫️' };
  }

  const prefix = base.startsWith('light') ? 'Light' : base.startsWith('heavy') ? 'Heavy' : '';
  const label = (word: string): string =>
    prefix ? `${prefix} ${word}` : word.charAt(0).toUpperCase() + word.slice(1);

  if (base.includes('thunder')) return { text: 'Thunderstorm', icon: '⛈️' };
  if (base.includes('snow')) return { text: label('snow'), icon: '🌨️' };
  if (base.includes('sleet')) return { text: label('sleet'), icon: '🌧️' };
  if (base.includes('showers')) return { text: label('showers'), icon: '🌦️' };
  if (base.includes('rain')) return { text: label('rain'), icon: '🌧️' };

  return UNKNOWN;
}
