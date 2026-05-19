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
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
});

