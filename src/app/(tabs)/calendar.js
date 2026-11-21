import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { cityById, deliveryDate, formatDate, useApp } from '../../context/AppContext';
import { fonts } from '../../theme';

const WEEK_STARTS_ON = 1; // 0 = domingo, 1 = lunes
const WINDOW_WEEKS = 2;

const startOfDay = (date) => { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; };
const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };
const startOfWeek = (date) => addDays(startOfDay(date), -((startOfDay(date).getDay() - WEEK_STARTS_ON + 7) % 7));
const dayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const weekday = (date) => new Intl.DateTimeFormat('es-MX', { weekday: 'short' }).format(date);
const dayMonth = (date) => new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(date);
const time = (date) => new Intl.DateTimeFormat('es-MX', { timeStyle: 'short' }).format(date);

export default function CalendarScreen() {
  const { orders, simulatedNow, selectOrder } = useApp();
  const { colors } = useTheme();

  const { weeks, byDay, later } = useMemo(() => {
    // La ventana siempre empieza en la semana de la fecha simulada: al cambiar de semana,
    // la primera desaparece y entra la siguiente.
    const start = startOfWeek(simulatedNow);
    const weeks = Array.from({ length: WINDOW_WEEKS }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
    const end = addDays(start, WINDOW_WEEKS * 7);
    const byDay = {};
    let later = 0;
    orders.filter((order) => order.status !== 'delivered').forEach((order) => {
      const date = deliveryDate(order);
      if (date >= end) { later += 1; return; }
      const key = dayKey(date);
      (byDay[key] = byDay[key] || []).push({ order, date });
    });
    Object.values(byDay).forEach((list) => list.sort((a, b) => a.date - b.date));
    return { weeks, byDay, later };
  }, [orders, simulatedNow]);

  const todayKey = dayKey(new Date(simulatedNow));

  return <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
    <Text variant="headlineSmall" style={styles.title}>Próximas entregas</Text>
    <Text style={[styles.clock, { color: colors.mutedText }]}>Fecha simulada: {formatDate(simulatedNow)}</Text>
    {weeks.map((days, index) => <View key={dayKey(days[0])}>
      <Text variant="titleMedium" style={[styles.week, { color: colors.primary }]}>
        {index === 0 ? 'Esta semana' : 'Siguiente semana'} · {dayMonth(days[0])} – {dayMonth(days[6])}
      </Text>
      {days.map((date) => {
        const key = dayKey(date);
        const isToday = key === todayKey;
        const isPast = date < startOfDay(simulatedNow);
        const items = byDay[key] || [];
        return <View key={key} style={[styles.row, { borderColor: colors.border, opacity: isPast ? 0.5 : 1 }]}>
          <View style={[styles.badge, isToday && { backgroundColor: colors.primary }]}>
            <Text style={{ color: isToday ? colors.onPrimary : colors.mutedText }}>{weekday(date)}</Text>
            <Text variant="titleMedium" style={{ color: isToday ? colors.onPrimary : colors.text, fontWeight: fonts.titleWeight }}>{date.getDate()}</Text>
          </View>
          <View style={styles.items}>
            {!items.length && <Text style={{ color: colors.mutedText }}>Sin entregas</Text>}
            {items.map(({ order, date: due }) => <Card key={order.id} style={styles.card} onPress={() => { selectOrder(order.id); router.push('/(tabs)/map'); }}>
              <Card.Content>
                <Text variant="titleSmall">{order.productName}</Text>
                <Text style={{ color: colors.mutedText }}>{time(due)} · {cityById(order.destinationCityId)?.name}</Text>
              </Card.Content>
            </Card>)}
          </View>
        </View>;
      })}
    </View>)}
    {later > 0 && <Text style={[styles.later, { color: colors.mutedText }]}>{later} {later === 1 ? 'envío llega' : 'envíos llegan'} después de estas dos semanas.</Text>}
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontWeight: fonts.titleWeight },
  clock: { marginVertical: 8 },
  week: { marginTop: 16, marginBottom: 8, fontWeight: fonts.titleWeight },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth },
  badge: { width: 52, alignItems: 'center', paddingVertical: 4, borderRadius: 10 },
  items: { flex: 1, justifyContent: 'center', gap: 8 },
  card: {},
});
