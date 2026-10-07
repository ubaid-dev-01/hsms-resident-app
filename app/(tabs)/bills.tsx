import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { billsService } from "@/services/bills";
import BillCard from "@/components/BillCard";
import { colors } from "@/theme/colors";

export default function BillsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["bills"],
    queryFn: () => billsService.getBills(),
  });

  const bills = data?.bills || [];

  const totalOutstanding = bills
    .filter((b: any) => b.status?.toLowerCase() !== "paid")
    .reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleDownload = async (id: string) => {
    try {
      await billsService.downloadInvoice(id);
      Alert.alert("Success", "Invoice downloaded successfully");
    } catch {
      Alert.alert("Error", "Failed to download invoice");
    }
  };

  const handlePay = async (id: string) => {
    Alert.alert("Confirm Payment", "Are you sure you want to pay this bill?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Pay",
        onPress: async () => {
          try {
            await billsService.payBill(id);
            Alert.alert("Success", "Payment processed successfully");
            refetch();
          } catch {
            Alert.alert("Error", "Payment failed. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bills</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Ionicons name="wallet-outline" size={28} color={colors.danger} />
        </View>
        <View>
          <Text style={styles.summaryLabel}>Total Outstanding</Text>
          <Text style={styles.summaryAmount}>PKR {totalOutstanding.toLocaleString()}</Text>
        </View>
      </View>

      <FlatList
        data={bills}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => (
          <BillCard
            type={item.type || item.billType || "Bill"}
            amount={item.amount || 0}
            dueDate={item.dueDate?.split("T")[0] || "N/A"}
            status={item.status || "pending"}
            onDownload={() => handleDownload(item._id)}
            onPay={() => handlePay(item._id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No bills found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    gap: 14,
  },
  summaryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.danger,
  },
  listContent: {
    padding: 20,
    paddingTop: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
});
