import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import StatusBadge from "@/components/StatusBadge";
import { colors } from "@/theme/colors";
import api from "@/services/api";

export default function PollScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { data, refetch } = useQuery({
    queryKey: ["polls"],
    queryFn: async () => {
      const { data } = await api.get("/polls");
      return data;
    },
  });

  const polls = data?.polls || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleVote = async (pollId: string) => {
    const selectedOption = selectedOptions[pollId];
    if (!selectedOption) {
      Alert.alert("Error", "Please select an option before voting");
      return;
    }
    try {
      await api.post(`/polls/${pollId}/vote`, { option: selectedOption });
      refetch();
      Alert.alert("Success", "Your vote has been recorded");
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Failed to submit vote");
    }
  };

  const selectOption = (pollId: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [pollId]: option }));
  };

  const renderPoll = ({ item }: { item: any }) => {
    const isActive = item.status?.toLowerCase() === "active";
    const totalVotes = item.options?.reduce((sum: number, opt: any) => sum + (opt.votes || 0), 0) || 0;

    return (
      <View style={styles.pollCard}>
        <View style={styles.pollHeader}>
          <Text style={styles.pollTitle}>{item.title}</Text>
          <StatusBadge status={item.status || "active"} />
        </View>

        {item.type && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        )}

        {item.options?.map((option: any, index: number) => {
          const isSelected = selectedOptions[item._id] === option.text;
          const percentage = totalVotes > 0 ? Math.round((option.votes || 0) / totalVotes * 100) : 0;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionRow, isSelected && styles.optionRowSelected]}
              onPress={() => isActive && selectOption(item._id, option.text)}
              disabled={!isActive}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option.text}
                </Text>
              </View>
              {!isActive && (
                <View style={styles.resultBar}>
                  <View style={[styles.resultFill, { width: `${percentage}%` }]} />
                  <Text style={styles.resultPercent}>{percentage}%</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {isActive ? (
          <TouchableOpacity style={styles.voteButton} onPress={() => handleVote(item._id)} activeOpacity={0.8}>
            <Text style={styles.voteText}>Vote</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.totalVotes}>Total votes: {totalVotes}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={polls}
        keyExtractor={(item: any) => item._id}
        renderItem={renderPoll}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bar-chart-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No polls available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: 20 },
  pollCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 16,
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4,
  },
  pollHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  pollTitle: { fontSize: 17, fontWeight: "700", color: colors.text, flex: 1, marginRight: 10 },
  typeBadge: { backgroundColor: colors.secondary + "15", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, alignSelf: "flex-start", marginBottom: 14 },
  typeText: { fontSize: 11, fontWeight: "600", color: colors.secondary },
  optionRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 14, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 8, backgroundColor: colors.background,
  },
  optionRowSelected: { borderColor: colors.primary, backgroundColor: colors.primary + "10" },
  optionLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, marginRight: 10, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  optionText: { fontSize: 14, color: colors.text, flex: 1 },
  optionTextSelected: { fontWeight: "700", color: colors.primary },
  resultBar: { flexDirection: "row", alignItems: "center", width: 80 },
  resultFill: { height: 6, borderRadius: 3, backgroundColor: colors.primary, marginRight: 6 },
  resultPercent: { fontSize: 12, fontWeight: "700", color: colors.text, width: 32 },
  voteButton: { backgroundColor: colors.primary, borderRadius: 12, height: 44, alignItems: "center", justifyContent: "center", marginTop: 8 },
  voteText: { color: colors.surface, fontSize: 16, fontWeight: "700" },
  totalVotes: { fontSize: 13, color: colors.textSecondary, textAlign: "center", marginTop: 8 },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, color: colors.textSecondary, marginTop: 12 },
});
