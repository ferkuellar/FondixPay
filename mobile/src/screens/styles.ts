import { StyleSheet } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

export const sharedStyles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  amount: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: '700',
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  error: {
    color: colors.danger,
    fontSize: 15,
    lineHeight: 21,
  },
  input: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 18,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  link: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
  },
  providerChip: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  serviceIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  serviceRow: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  smallButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
});
