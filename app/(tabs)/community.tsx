import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { announcementsService } from "@/services/announcements";
import { marketplaceService } from "@/services/marketplace";
import AnnouncementCard from "@/components/AnnouncementCard";
import { colors } from "@/theme/colors";

export default function CommunityScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { data: announcementsData, refetch: refetchAnnouncements } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => announcementsService.getAnnouncements({ limit: 10 }),
  });

  const { data: marketplaceData, refetch: refetchMarketplace } = useQuery({
    queryKey: ["marketplace"],
    queryFn: () => marketplaceService.getListings({ limit: 10 }),
  });

  const announcements = announcementsData?.announcements || [];
  const listings = marketplaceData?.listings || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchAnnouncements(), refetchMarketplace()]);
    setRefreshing(false);
  }, [refetchAnnouncements, refetchMarketplace]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
      </View>

      {/* Announcements Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      {announcements.length > 0 ? (
        <FlatList
          horizontal
          data={announcements}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => (
            <View style={styles.horizontalCard}>
              <AnnouncementCard
                title={item.title}
                date={item.createdAt?.split("T")[0] || ""}
                category={item.category || "general"}
                description={item.description}
              />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="megaphone-outline" size={32} color={colors.border} />
          <Text style={styles.emptyText}>No announcements</Text>
        </View>
      )}

      {/* Marketplace Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Marketplace</Text>
        <TouchableOpacity onPress={() => router.push("/screens/MarketplaceScreen")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      {listings.length > 0 ? (
        <FlatList
          horizontal
          data={listings}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listingCard}>
              <View style={styles.listingImagePlaceholder}>
                <Ionicons name="image-outline" size={32} color={colors.border} />
              </View>
              <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.listingPrice}>PKR {item.price?.toLocaleString()}</Text>
              <View style={styles.listingCategoryBadge}>
                <Text style={styles.listingCategoryText}>{item.category}</Text>
              </View>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="storefront-outline" size={32} color={colors.border} />
          <Text style={styles.emptyText}>No listings yet</Text>
        </View>
      )}

      {/* Forum Topics Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Forum Topics</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.forumList}>
        {["Water Supply Schedule Update", "Parking Area Expansion Discussion", "Community Garden Initiative"].map(
          (topic, index) => (
            <TouchableOpacity key={index} style={styles.forumItem}>
              <Ionicons name="chatbubbles-outline" size={20} color={colors.primary} />
              <View style={styles.forumContent}>
                <Text style={styles.forumTitle}>{topic}</Text>
                <Text style={styles.forumMeta}>General Discussion</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )
        )}
      </View>

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
    paddingBottom: 20,
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  horizontalList: {
    paddingHorizontal: 14,
  },
  horizontalCard: {
    width: 280,
    marginHorizontal: 6,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
  listingCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 6,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  listingImagePlaceholder: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 6,
  },
  listingCategoryBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  listingCategoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.primary,
  },
  forumList: {
    paddingHorizontal: 20,
  },
  forumItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    gap: 12,
  },
  forumContent: {
    flex: 1,
  },
  forumTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  forumMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
