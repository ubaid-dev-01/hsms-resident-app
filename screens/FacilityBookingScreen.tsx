import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { facilitiesService } from "@/services/facilities";
import { colors } from "@/theme/colors";

export default function FacilityBookingScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ["facilities"],
    queryFn: () => facilitiesService.getFacilities(),
  });

  const facilities = data?.facilities || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const mutation = useMutation({
    mutationFn: facilitiesService.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      setSelectedFacility(null);
      resetForm();
      Alert.alert("Success", "Facility booked successfully");
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to book facility");
    },
  });

  const resetForm = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    setPurpose("");
  };

  const handleBook = () => {
    if (!date.trim() || !startTime.trim() || !endTime.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    mutation.mutate({
      facilityId: selectedFacility._id,
      date: date.trim(),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      purpose: purpose.trim(),
    });
  };

  const renderFacility = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.facilityCard} onPress={() => setSelectedFacility(item)} activeOpacity={0.7}>
      <View style={styles.facilityIconContainer}>
        <Ionicons
          name={
            item.type === "gym" ? "fitness-outline" :
            item.type === "pool" ? "water-outline" :
            item.type === "hall" ? "business-outline" :
            item.type === "court" ? "basketball-outline" :
            "home-outline"
          }
          size={32}
          color={colors.primary}
        />
      </View>
      <View style={styles.facilityInfo}>
        <Text style={styles.facilityName}>{item.name}</Text>
        <Text style={styles.facilityType}>{item.type}</Text>
        <View style={styles.facilityMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>Capacity: {item.capacity || "N/A"}</Text>
          </View>
          <Text style={styles.facilityRate}>PKR {item.ratePerHour || item.rate || 0}/hr</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={facilities}
        keyExtractor={(item: any) => item._id}
        renderItem={renderFacility}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No facilities available</Text>
          </View>
        }
      />

      <Modal visible={!!selectedFacility} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => { setSelectedFacility(null); resetForm(); }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Book {selectedFacility?.name}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.modalContent}>
          <Text style={styles.label}>Date *</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textSecondary} value={date} onChangeText={setDate} />

          <Text style={styles.label}>Start Time *</Text>
          <TextInput style={styles.input} placeholder="HH:MM (e.g. 09:00)" placeholderTextColor={colors.textSecondary} value={startTime} onChangeText={setStartTime} />

          <Text style={styles.label}>End Time *</Text>
          <TextInput style={styles.input} placeholder="HH:MM (e.g. 11:00)" placeholderTextColor={colors.textSecondary} value={endTime} onChangeText={setEndTime} />

          <Text style={styles.label}>Purpose</Text>
          <TextInput style={styles.input} placeholder="Purpose of booking" placeholderTextColor={colors.textSecondary} value={purpose} onChangeText={setPurpose} />

          <TouchableOpacity style={[styles.bookButton, mutation.isPending && { opacity: 0.7 }]} onPress={handleBook} disabled={mutation.isPending} activeOpacity={0.8}>
            {mutation.isPending ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.bookText}>Book Facility</Text>}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: 20 },
  facilityCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  facilityIconContainer: { width: 60, height: 60, borderRadius: 14, backgroundColor: colors.primary + "15", alignItems: "center", justifyContent: "center", marginRight: 14 },
  facilityInfo: { flex: 1 },
  facilityName: { fontSize: 16, fontWeight: "700", color: colors.text },
  facilityType: { fontSize: 12, color: colors.textSecondary, textTransform: "capitalize", marginTop: 2 },
  facilityMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: colors.textSecondary },
  facilityRate: { fontSize: 13, fontWeight: "700", color: colors.primary },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, color: colors.textSecondary, marginTop: 12 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  modalContent: { flex: 1, backgroundColor: colors.background, padding: 20 },
  label: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 15, color: colors.text },
  bookButton: { backgroundColor: colors.primary, borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center", marginTop: 30 },
  bookText: { color: colors.surface, fontSize: 17, fontWeight: "700" },
});
