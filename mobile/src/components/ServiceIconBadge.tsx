import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, serviceColorForCategory } from '../theme';

type Props = {
  category: string;
  size?: number;
};

function iconName(category: string): keyof typeof Feather.glyphMap {
  const map: Record<string, keyof typeof Feather.glyphMap> = {
    ELECTRICITY: 'zap',
    electricity: 'zap',
    INTERNET: 'wifi',
    internet: 'wifi',
    telecom: 'wifi',
    PHONE: 'smartphone',
    mobile_topup_or_bill: 'smartphone',
    GAS: 'droplet',
    gas: 'droplet',
    WATER: 'droplet',
    water: 'droplet',
    TV: 'tv',
    government: 'file-text',
    OTHER: 'file-text',
    other: 'file-text',
  };
  return map[category] ?? 'file-text';
}

export function ServiceIconBadge({ category, size = 48 }: Props) {
  const tint = serviceColorForCategory(category);
  const iconSize = Math.round(size * 0.45);

  return (
    <View style={[styles.badge, { backgroundColor: `${tint}22`, height: size, width: size, borderRadius: size / 2 }]}>
      <Feather color={tint} name={iconName(category)} size={iconSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
