import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '../theme';

const CONFETTI = ['#F59E0B', '#3B82F6', '#EF4444', '#22C55E', '#8B5CF6'];

type Props = {
  size?: number;
};

export function SuccessIllustration({ size = 96 }: Props) {
  return (
    <View style={[styles.wrap, { height: size + 32, width: size + 32 }]}>
      {CONFETTI.map((color, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: color,
              left: index % 2 === 0 ? 4 : size - 8,
              top: index * 12,
            },
          ]}
        />
      ))}
      <View style={[styles.circle, { height: size, width: size, borderRadius: size / 2 }]}>
        <Feather color="#FFFFFF" name="check" size={size * 0.45} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    backgroundColor: colors.success,
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 4,
    height: 8,
    position: 'absolute',
    width: 8,
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// Remove unused Text import - I imported Text but didn't use it