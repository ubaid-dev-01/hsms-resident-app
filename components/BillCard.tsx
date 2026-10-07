import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";
import { colors } from "@/theme/colors";

interface BillCardProps {
  type: string;
  amount: number;
  dueDate: string;
  status: string;
  onDownload?: () => void;
  onPay?: () => void;
}

export default function BillCard({ type, amount, dueDate, status, onDownload, onPay }: BillCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.typeContainer}>
          <Ionicons name="document-text-outline" size={20} color={colors.primary} />
          <Text style={styles.type}>{type}</Text>
        </View>
        <StatusBadge status={status} />
      </View>
      <View style={styles.detailRow}>
        <View>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>PKR {amount.toLocaleString()}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Due Date</Text>
          <Text style={styles.date}>{dueDate}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.downloadButton} onPress={onDownload} activeOpacity={0.7}>
          <Ionicons name="download-outline" size={16} color={colors.primary} />
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>
        {status.toLowerCase() !== "paid" && (
          <TouchableOpacity style={styles.payButton} onPress={onPay} activeOpacity={0.8}>
            <Ionicons name="card-outline" size={16} color={colors.surface} />
            <Text style={styles.payText}>Pay</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  type: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  amountLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  amount: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  downloadButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  downloadText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  payButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  payText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.surface,
  },
});
