import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import type { RootStackParamList } from '../types';
import { spacing, typography, useAppTheme } from '../theme';

export type TabKey = 'Home' | 'AddService' | 'History' | 'Profile';

type TabItem = {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

const TABS: TabItem[] = [
  { key: 'Home', label: 'Inicio', icon: 'home' },
  { key: 'AddService', label: 'Pagar', icon: 'credit-card' },
  { key: 'History', label: 'Historial', icon: 'clock' },
  { key: 'Profile', label: 'Cuenta', icon: 'user' },
];

type Props = {
  active: TabKey;
};

export function BottomTabBar({ active }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, mode } = useAppTheme();

  const barBg = mode === 'night' ? 'rgba(7, 15, 30, 0.97)' : 'rgba(255, 255, 255, 0.97)';

  return (
    <View style={[styles.bar, { backgroundColor: barBg, borderTopColor: theme.border }]}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => navigation.navigate(tab.key)}
            style={styles.tab}
          >
            <Feather
              color={isActive ? theme.primary : theme.fg3}
              name={tab.icon}
              size={24}
              strokeWidth={isActive ? 2.3 : 1.8}
            />
            <Text style={[styles.label, { color: isActive ? theme.primary : theme.fg3 }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    minHeight: 56,
    paddingVertical: spacing.xs,
  },
});
