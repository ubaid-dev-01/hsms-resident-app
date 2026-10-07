import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complaintsService } from "@/services/complaints";
import StatusBadge from "@/components/StatusBadge";
import { colors } from "@/theme/colors";

const categories = ["Plumbing", "Electrical", "HVAC", "Structural", "Painting", "Carpentry", "Other"];
const priorityOptions = [
  { label: "Low", value: "low", color: "#10B981" },
  { label: "Medium", value: "medium", color: "#F59E0B" },
  { label: "High", value: "high", color: "#F97316" },
  { label: "Urgent", value: "urgent", color: "#EF4444" },
];

export default function MaintenanceScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("medium");
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ["maintenance"],
    queryFn: () => complaintsService.getComplaints({ category: "maintenance" }),
  });

  const requests = data?.complaints || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const mutation = useMutation({
    mutationFn: complaintsService.createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      setShowForm(false);
      resetForm();
      Alert.alert("Success", "Maintenance request submitted successfully");
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to submit request");
    },
  });

  const resetForm = () => {
    setCategory("");
    setTitle("");
    setDescription("");
    setLocation("");
    setPriority("medium");
  };

  const handleSubmit = () => {
    if (!category || !title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    mutation.mutate({
      category: `Maintenance - ${category}`,
      title: title.trim(),
      description: `${description.trim()}${location ? `\nLocation: ${location}` : ""}`,
      priority,
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <StatusBadge status={item.status || "open"} />
      </View>
      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="construct-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{item.category}</Text>
        </View>
        <StatusBadge status={item.priority || "medium"} size="small" />
      </View>
      <Text style={styles.cardDate}>{item.createdAt?.split("T")[0] || "N/A"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item: any) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="construct-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No maintenance requests</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color={colors.surface} />
      </TouchableOpacity>

      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => { setShowForm(false); resetForm(); }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>New Maintenance Request</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalContentPadding} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Title *</Text>
          <TextInput style={styles.input} placeholder="Brief title" placeholderTextColor={colors.textSecondary} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Description *</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the issue..." placeholderTextColor={colors.textSecondary} value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />

          <Text style={styles.label}>Location</Text>
          <TextInput style={styles.input} placeholder="e.g. Block A, Floor 2, Unit 201" placeholderTextColor={colors.textSecondary} value={location} onChangeText={setLocation} />

          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityRow}>
            {priorityOptions.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[styles.priorityButton, priority === p.value && { backgroundColor: p.color, borderColor: p.color }]}
                onPress={() => setPriority(p.value)}
              >
                <Text style={[styles.priorityText, priority === p.value && styles.priorityTextActive]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.submitButton, mutation.isPending && { opacity: 0.7 }]} onPress={handleSubmit} disabled={mutation.isPending} activeOpacity={0.8}>
            {mutation.isPending ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.submitText}>Submit Request</Text>}
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: 20, paddingBottom: 80 },
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: colors.text, flex: 1, marginRight: 10 },
  cardMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: colors.textSecondary },
  cardDate: { fontSize: 12, color: colors.textSecondary },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, color: colors.textSecondary, marginTop: 12 },
  fab: { position: "absolute", right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", elevation: 6, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  modalContent: { flex: 1, backgroundColor: colors.background },
  modalContentPadding: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 8, marginTop: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.text },
  chipTextActive: { color: colors.surface },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontSize: 15, color: colors.text },
  textArea: { height: 100, paddingTop: 14 },
  priorityRow: { flexDirection: "row", gap: 10 },
  priorityButton: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", backgroundColor: colors.surface },
  priorityText: { fontSize: 13, fontWeight: "700", color: colors.text },
  priorityTextActive: { color: colors.surface },
  submitButton: { backgroundColor: colors.primary, borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center", marginTop: 30 },
  submitText: { color: colors.surface, fontSize: 17, fontWeight: "700" },
});
