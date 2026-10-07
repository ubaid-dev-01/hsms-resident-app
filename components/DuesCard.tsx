import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface DuesCardProps {
  amount: number;
  onPayNow?: () => void;
}

export default function DuesCard({ amount, onPayNow }: DuesCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="wallet-outline" size={24} color={colors.danger} />
        </View>
        <Text style={styles.label}>Pending Dues</Text>
      </View>
      <Text style={styles.amount}>PKR {amount.toLocaleString()}</Text>
      <TouchableOpacity style={styles.payButton} onPress={onPayNow} activeOpacity={0.8}>
        <Ionicons name="card-outline" size={18} color={colors.surface} />
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  amount: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.danger,
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  payButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700",
  },
});
