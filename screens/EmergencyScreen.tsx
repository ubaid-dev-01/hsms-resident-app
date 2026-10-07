import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { emergencyService } from "@/services/emergency";
import StatusBadge from "@/components/StatusBadge";
import { colors } from "@/theme/colors";

const alertTypes = [
  { label: "SOS", value: "sos", icon: "alert-circle-outline" as const, color: "#EF4444" },
  { label: "Fire", value: "fire", icon: "flame-outline" as const, color: "#F97316" },
  { label: "Medical", value: "medical", icon: "medkit-outline" as const, color: "#3B82F6" },
  { label: "Security", value: "security", icon: "shield-outline" as const, color: "#8B5CF6" },
  { label: "Gas Leak", value: "gas_leak", icon: "cloud-outline" as const, color: "#F59E0B" },
];

export default function EmergencyScreen() {
  const [selectedType, setSelectedType] = useState("sos");

  const { data: alertsData, refetch } = useQuery({
    queryKey: ["activeAlerts"],
    queryFn: () => emergencyService.getActiveAlerts(),
  });

  const activeAlerts = alertsData?.alerts || [];

  const mutation = useMutation({
    mutationFn: emergencyService.triggerAlert,
    onSuccess: () => {
      refetch();
      Alert.alert("Alert Sent", "Emergency alert has been triggered. Help is on the way.");
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to trigger alert");
    },
  });

  const handleTrigger = () => {
    Alert.alert(
      "Confirm Emergency Alert",
      `Are you sure you want to trigger a ${selectedType.toUpperCase()} alert? This will notify security and management immediately.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "TRIGGER ALERT",
          style: "destructive",
          onPress: () => mutation.mutate({ type: selectedType }),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.sosSection}>
        <TouchableOpacity
          style={[styles.sosButton, mutation.isPending && styles.sosButtonDisabled]}
          onPress={handleTrigger}
          disabled={mutation.isPending}
          activeOpacity={0.7}
        >
          {mutation.isPending ? (
            <ActivityIndicator size="large" color={colors.surface} />
          ) : (
            <>
              <Ionicons name="alert-circle" size={64} color={colors.surface} />
              <Text style={styles.sosText}>SOS</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.triggerLabel}>Trigger Alert</Text>
        <Text style={styles.triggerSubtitle}>Tap the button above to send an emergency alert</Text>
      </View>

      <Text style={styles.sectionTitle}>Alert Type</Text>
      <View style={styles.typesRow}>
        {alertTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.typeCard,
              selectedType === type.value && { borderColor: type.color, borderWidth: 2, backgroundColor: type.color + "10" },
            ]}
            onPress={() => setSelectedType(type.value)}
          >
            <Ionicons name={type.icon} size={24} color={type.color} />
            <Text style={[styles.typeLabel, selectedType === type.value && { color: type.color, fontWeight: "800" }]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Active Alerts</Text>
      {activeAlerts.length > 0 ? (
        activeAlerts.map((alert: any) => (
          <View key={alert._id} style={styles.alertCard}>
            <View style={styles.alertTop}>
              <View style={styles.alertInfo}>
                <Text style={styles.alertType}>{alert.type?.toUpperCase()}</Text>
                <Text style={styles.alertTime}>{alert.createdAt?.split("T")[0] || "N/A"}</Text>
              </View>
              <StatusBadge status={alert.status || "active"} />
            </View>
            {alert.description && <Text style={styles.alertDesc}>{alert.description}</Text>}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={40} color={colors.primary} />
          <Text style={styles.emptyText}>No active alerts</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  sosSection: { alignItems: "center", marginVertical: 20 },
  sosButton: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: colors.danger,
    alignItems: "center", justifyContent: "center",
    elevation: 8,
    shadowColor: colors.danger, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12,
  },
  sosButtonDisabled: { opacity: 0.7 },
  sosText: { fontSize: 24, fontWeight: "900", color: colors.surface, marginTop: 4 },
  triggerLabel: { fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 16 },
  triggerSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4, textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginTop: 24, marginBottom: 12 },
  typesRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeCard: {
    width: "30%", flexGrow: 1,
    backgroundColor: colors.surface, borderRadius: 12, padding: 14,
    alignItems: "center", borderWidth: 1, borderColor: colors.border,
    elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  typeLabel: { fontSize: 12, fontWeight: "600", color: colors.text, marginTop: 6 },
  alertCard: {
    backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 10,
    elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  alertTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  alertInfo: { flex: 1 },
  alertType: { fontSize: 15, fontWeight: "700", color: colors.danger },
  alertTime: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  alertDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 8 },
  emptyState: { alignItems: "center", paddingVertical: 30 },
  emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
});
