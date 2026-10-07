import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { visitorsService } from "@/services/visitors";
import StatusBadge from "@/components/StatusBadge";
import { colors } from "@/theme/colors";

const purposes = ["Personal Visit", "Delivery", "Service Provider", "Guest", "Other"];

export default function VisitorScreen() {
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ["visitors"],
    queryFn: () => visitorsService.getMyVisitors(),
  });

  const visitors = data?.visitors || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const mutation = useMutation({
    mutationFn: visitorsService.preApproveVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      setVisitorName("");
      setVisitorPhone("");
      setPurpose("");
      setExpectedDate("");
      Alert.alert("Success", "Visitor pre-approved successfully");
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to pre-approve visitor");
    },
  });

  const handleSubmit = () => {
    if (!visitorName.trim()) {
      Alert.alert("Error", "Please enter visitor name");
      return;
    }
    if (!visitorPhone.trim()) {
      Alert.alert("Error", "Please enter visitor phone");
      return;
    }
    if (!purpose) {
      Alert.alert("Error", "Please select a purpose");
      return;
    }
    if (!expectedDate.trim()) {
      Alert.alert("Error", "Please enter expected date");
      return;
    }
    mutation.mutate({
      visitorName: visitorName.trim(),
      visitorPhone: visitorPhone.trim(),
      purpose,
      expectedDate: expectedDate.trim(),
    });
  };

  const handleCancel = (id: string) => {
    Alert.alert("Cancel Pre-approval", "Are you sure?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            await visitorsService.cancelPreApproval(id);
            refetch();
            Alert.alert("Success", "Pre-approval cancelled");
          } catch {
            Alert.alert("Error", "Failed to cancel");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Pre-approve a Visitor</Text>

        <Text style={styles.label}>Visitor Name</Text>
        <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.textSecondary} value={visitorName} onChangeText={setVisitorName} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder="03XX-XXXXXXX" placeholderTextColor={colors.textSecondary} value={visitorPhone} onChangeText={setVisitorPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Purpose</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {purposes.map((p) => (
            <TouchableOpacity key={p} style={[styles.chip, purpose === p && styles.chipActive]} onPress={() => setPurpose(p)}>
              <Text style={[styles.chipText, purpose === p && styles.chipTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Expected Date</Text>
        <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textSecondary} value={expectedDate} onChangeText={setExpectedDate} />

        <TouchableOpacity style={[styles.submitButton, mutation.isPending && { opacity: 0.7 }]} onPress={handleSubmit} disabled={mutation.isPending} activeOpacity={0.8}>
          {mutation.isPending ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.submitText}>Pre-approve Visitor</Text>}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Active Pre-approvals</Text>

      {visitors.length > 0 ? (
        visitors.map((visitor: any) => (
          <View key={visitor._id} style={styles.visitorCard}>
            <View style={styles.visitorTop}>
              <View style={styles.visitorInfo}>
                <Text style={styles.visitorName}>{visitor.visitorName}</Text>
                <Text style={styles.visitorDate}>{visitor.expectedDate?.split("T")[0] || "N/A"}</Text>
              </View>
              <StatusBadge status={visitor.status || "approved"} />
            </View>
            <View style={styles.visitorMeta}>
              <Text style={styles.visitorPurpose}>{visitor.purpose}</Text>
              {visitor.status?.toLowerCase() === "approved" && (
                <TouchableOpacity onPress={() => handleCancel(visitor._id)} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="person-add-outline" size={40} color={colors.border} />
          <Text style={styles.emptyText}>No active pre-approvals</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  formCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 24, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  formTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 8 },
  label: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 15, color: colors.text },
  chipScroll: { flexGrow: 0 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.text },
  chipTextActive: { color: colors.surface },
  submitButton: { backgroundColor: colors.primary, borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center", marginTop: 20 },
  submitText: { color: colors.surface, fontSize: 16, fontWeight: "700" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 12 },
  visitorCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 10, elevation: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  visitorTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  visitorInfo: { flex: 1 },
  visitorName: { fontSize: 15, fontWeight: "700", color: colors.text },
  visitorDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  visitorMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  visitorPurpose: { fontSize: 13, color: colors.textSecondary },
  cancelButton: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: colors.danger },
  cancelText: { fontSize: 12, fontWeight: "600", color: colors.danger },
  emptyState: { alignItems: "center", paddingVertical: 30 },
  emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: 8 },
});
