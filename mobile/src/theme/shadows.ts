import { ViewStyle } from 'react-native';

export const shadows = {
  card: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  } satisfies ViewStyle,
  cardHi: {
    shadowColor: '#0A1628',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 6,
  } satisfies ViewStyle,
  button: {
    shadowColor: '#1565E8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 5,
  } satisfies ViewStyle,
};
