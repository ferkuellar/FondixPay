import { StyleSheet } from 'react-native';

import { colors } from '../theme/colors';

export const sharedStyles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 20,
  },
  amount: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
  },
  body: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    gap: 16,
  },
  error: {
    color: '#B91C1C',
    fontSize: 15,
    lineHeight: 21,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 18,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  link: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  providerChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  serviceIcon: {
    alignItems: 'center',
    backgroundColor: '#EEF8F5',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  serviceRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  smallButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
});
