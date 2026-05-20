import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import type { RootStackParamList } from '../types';
import { colors, spacing, typography } from '../theme';

export type TabKey = 'Home' | 'AddService' | 'History' | 'Profile';

type TabItem = {
  key: TabKey;
  label: string;
  icon: keyof typeof Feather.glyphMap;
};

const TABS: TabItem[] = [
  { key: 'Home', label: 'Inicio', icon: 'home' },
  { key: 'AddService', label: 'Servicios', icon: 'layers' },
  { key: 'History', label: 'Historial', icon: 'clock' },
  { key: 'Profile', label: 'Perfil', icon: 'user' },
];

type Props = {
  active: TabKey;
};

export function BottomTabBar({ active }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.bar}>
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
            <Feather color={isActive ? colors.primary : colors.textMuted} name={tab.icon} size={22} />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.bg,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.xs,
  },
});
