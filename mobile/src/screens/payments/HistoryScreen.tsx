import { ScrollView, Text, View } from 'react-native';

import { Screen } from '../../components/Screen';
import { usePaymentStore } from '../../store/paymentStore';
import { colors } from '../../theme/colors';
import { sharedStyles } from '../styles';

export function HistoryScreen() {
  const payments = usePaymentStore((state) => state.payments);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
        <Text style={sharedStyles.title}>Historial</Text>
        {payments.length === 0 ? <Text style={sharedStyles.body}>Aqui apareceran tus pagos.</Text> : null}
        {payments.map((payment) => (
          <View key={payment.id} style={sharedStyles.card}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>{payment.providerName}</Text>
            <Text style={sharedStyles.body}>{payment.serviceName}</Text>
            <Text style={{ color: colors.success, fontSize: 24, fontWeight: '800', marginTop: 8 }}>${payment.amount.toFixed(0)} ✓</Text>
            <Text style={{ color: colors.muted, marginTop: 8 }}>Folio {payment.folio}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
