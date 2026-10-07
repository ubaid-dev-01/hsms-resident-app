import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

interface AnnouncementCardProps {
  title: string;
  date: string;
  category: string;
  description?: string;
  onPress?: () => void;
}

const categoryColors: Record<string, string> = {
  general: "#3B82F6",
  urgent: "#EF4444",
  maintenance: "#F59E0B",
  event: "#8B5CF6",
  notice: "#10B981",
};

export default function AnnouncementCard({
  title,
  date,
  category,
  description,
  onPress,
}: AnnouncementCardProps) {
  const badgeColor = categoryColors[category?.toLowerCase()] || "#64748B";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.topRow}>
        <View style={[styles.categoryBadge, { backgroundColor: badgeColor + "20" }]}>
          <Text style={[styles.categoryText, { color: badgeColor }]}>
            {category?.charAt(0).toUpperCase() + category?.slice(1)}
          </Text>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {description ? (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
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
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
