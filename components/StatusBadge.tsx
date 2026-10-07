import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

interface StatusBadgeProps {
  status: string;
  size?: "small" | "medium";
}

const statusColors: Record<string, { bg: string; text: string }> = {
  paid: { bg: "#D1FAE5", text: "#065F46" },
  pending: { bg: "#FEF3C7", text: "#92400E" },
  overdue: { bg: "#FEE2E2", text: "#991B1B" },
  resolved: { bg: "#D1FAE5", text: "#065F46" },
  "in-progress": { bg: "#DBEAFE", text: "#1E40AF" },
  "in progress": { bg: "#DBEAFE", text: "#1E40AF" },
  open: { bg: "#FEF3C7", text: "#92400E" },
  closed: { bg: "#E2E8F0", text: "#475569" },
  approved: { bg: "#D1FAE5", text: "#065F46" },
  rejected: { bg: "#FEE2E2", text: "#991B1B" },
  active: { bg: "#D1FAE5", text: "#065F46" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B" },
  expired: { bg: "#E2E8F0", text: "#475569" },
  low: { bg: "#D1FAE5", text: "#065F46" },
  medium: { bg: "#FEF3C7", text: "#92400E" },
  high: { bg: "#FED7AA", text: "#C2410C" },
  urgent: { bg: "#FEE2E2", text: "#991B1B" },
};

const defaultColor = { bg: "#E2E8F0", text: "#475569" };

export default function StatusBadge({ status, size = "small" }: StatusBadgeProps) {
  const colorScheme = statusColors[status.toLowerCase()] || defaultColor;
  const isSmall = size === "small";

  return (
    <View style={[styles.badge, { backgroundColor: colorScheme.bg }, isSmall ? styles.small : styles.medium]}>
      <View style={[styles.dot, { backgroundColor: colorScheme.text }]} />
      <Text style={[styles.text, { color: colorScheme.text }, isSmall ? styles.smallText : styles.mediumText]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: "600",
  },
  smallText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 13,
  },
});
