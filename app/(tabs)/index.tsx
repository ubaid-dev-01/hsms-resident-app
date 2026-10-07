import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { billsService } from "@/services/bills";
import { announcementsService } from "@/services/announcements";
import DuesCard from "@/components/DuesCard";
import AnnouncementCard from "@/components/AnnouncementCard";
import { colors } from "@/theme/colors";

const quickActions = [
  { icon: "card-outline" as const, label: "Pay Dues", route: "/(tabs)/bills" },
  { icon: "chatbox-ellipses-outline" as const, label: "Complaint", route: "/screens/ComplaintScreen" },
  { icon: "calendar-outline" as const, label: "Book Facility", route: "/screens/FacilityBookingScreen" },
  { icon: "person-add-outline" as const, label: "Pre-approve", route: "/screens/VisitorScreen" },
];

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const { data: billsData, refetch: refetchBills } = useQuery({
    queryKey: ["bills", "pending"],
    queryFn: () => billsService.getBills({ status: "pending", limit: 5 }),
  });

  const { data: announcementsData, refetch: refetchAnnouncements } = useQuery({
    queryKey: ["announcements", "recent"],
    queryFn: () => announcementsService.getAnnouncements({ limit: 3 }),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchBills(), refetchAnnouncements()]);
    setRefreshing(false);
  }, [refetchBills, refetchAnnouncements]);

  const totalDues = billsData?.bills?.reduce(
    (sum: number, bill: any) => sum + (bill.amount || 0),
    0
  ) || 0;

  const upcomingInstallment = billsData?.bills?.[0];
  const announcements = announcementsData?.announcements || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || "Resident"}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <DuesCard amount={totalDues} onPayNow={() => router.push("/(tabs)/bills")} />

      {upcomingInstallment && (
        <View style={styles.installmentCard}>
          <View style={styles.installmentHeader}>
            <Ionicons name="time-outline" size={20} color={colors.warning} />
            <Text style={styles.installmentTitle}>Upcoming Installment</Text>
          </View>
          <Text style={styles.installmentAmount}>
            PKR {upcomingInstallment.amount?.toLocaleString()}
          </Text>
          <Text style={styles.installmentDate}>Due: {upcomingInstallment.dueDate}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsRow}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.quickAction}
            onPress={() => router.push(action.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name={action.icon} size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Announcements</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/community")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {announcements.length > 0 ? (
        announcements.map((item: any) => (
          <AnnouncementCard
            key={item._id}
            title={item.title}
            date={item.createdAt?.split("T")[0] || ""}
            category={item.category || "general"}
            description={item.description}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="megaphone-outline" size={40} color={colors.border} />
          <Text style={styles.emptyText}>No recent announcements</Text>
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 56,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  installmentCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  installmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  installmentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.warning,
  },
  installmentAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  installmentDate: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 8,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickAction: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
