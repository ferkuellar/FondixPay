import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../components/PrimaryButton';
import { Screen } from '../../components/Screen';
import { SUPPORT_PAGE_URL } from '../../constants/links';
import { colors, radius, spacing, typography, useAppTheme } from '../../theme';
import type { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportPlaceholder'>;

export function SupportPlaceholderScreen({ navigation, route }: Props) {
  const { theme } = useAppTheme();
  const { recovery } = route.params;

  function openSupportPage() {
    if (SUPPORT_PAGE_URL) void Linking.openURL(SUPPORT_PAGE_URL);
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
          <Feather color={colors.primary} name="help-circle" size={28} />
        </View>

        <Text style={[styles.title, { color: theme.fg }]}>¿Necesitas ayuda?</Text>
        <Text style={[styles.body, { color: theme.fg2 }]}>
          Guarda estos datos de referencia. Cuando nuestra página de soporte esté disponible
          podrás usarlos para dar seguimiento a este intento.
        </Text>

        <View style={[styles.references, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <ReferenceRow label="Referencia interna" value={recovery.paymentId} theme={theme} />
          <ReferenceRow label="Request ID" value={recovery.requestId ?? 'Pendiente'} theme={theme} />
          <ReferenceRow label="Correlation ID" value={recovery.correlationId ?? 'Pendiente'} theme={theme} />
        </View>

        {SUPPORT_PAGE_URL ? (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Abrir página de soporte"
            onPress={openSupportPage}
            style={({ pressed }) => [
              styles.linkRow,
              { backgroundColor: theme.surface, borderColor: theme.border },
              pressed ? styles.pressed : null,
            ]}
          >
            <Feather color={colors.primary} name="external-link" size={18} />
            <Text style={[styles.linkText, { color: colors.primary }]}>Ver soporte en línea</Text>
            <Feather color={theme.fg3} name="chevron-right" size={18} style={styles.linkChevron} />
          </Pressable>
        ) : (
          <Text style={[styles.comingSoon, { color: theme.fg3 }]}>
            Próximamente: página de soporte en línea
          </Text>
        )}

        <Text style={[styles.notice, { color: theme.fg3 }]}>
          No se abrió un chat real ni un ticket real en esta fase mock/dev.
        </Text>

        <PrimaryButton onPress={() => navigation.replace('Home')}>VOLVER AL INICIO</PrimaryButton>
      </View>
    </Screen>
  );
}

function ReferenceRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useAppTheme>['theme'];
}) {
  return (
    <View style={styles.refRow}>
      <Text style={[styles.refLabel, { color: theme.fg2 }]}>{label}</Text>
      <Text style={[styles.refValue, { color: theme.fg }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    textAlign: 'center',
  },
  comingSoon: {
    ...typography.caption,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
  },
  icon: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  linkChevron: {
    marginLeft: 'auto',
  },
  linkRow: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    width: '100%',
  },
  linkText: {
    ...typography.body,
    fontWeight: '700',
  },
  notice: {
    ...typography.caption,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
  refLabel: {
    ...typography.caption,
  },
  refRow: {
    gap: spacing.xs,
  },
  refValue: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  references: {
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    width: '100%',
  },
  title: {
    ...typography.title,
    textAlign: 'center',
  },
});
