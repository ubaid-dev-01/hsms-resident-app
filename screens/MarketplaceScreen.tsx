import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketplaceService } from "@/services/marketplace";
import { colors } from "@/theme/colors";

const categoryOptions = ["Electronics", "Furniture", "Clothing", "Books", "Vehicles", "Sports", "Other"];
const conditionOptions = ["New", "Like New", "Good", "Fair"];

export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ["marketplace", searchQuery],
    queryFn: () => marketplaceService.getListings({ search: searchQuery || undefined }),
  });

  const listings = data?.listings || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const mutation = useMutation({
    mutationFn: marketplaceService.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      setShowForm(false);
      resetForm();
      Alert.alert("Success", "Listing created successfully");
    },
    onError: (error: any) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to create listing");
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setCondition("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !price.trim() || !category || !condition) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    mutation.mutate({
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      condition,
    });
  };

  const handleFavorite = async (id: string) => {
    try {
      await marketplaceService.toggleFavorite(id);
      refetch();
    } catch {
      Alert.alert("Error", "Failed to update favorite");
    }
  };

  const renderListing = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.listingCard} activeOpacity={0.7}>
      <View style={styles.listingImage}>
        <Ionicons name="image-outline" size={36} color={colors.border} />
      </View>
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingPrice}>PKR {item.price?.toLocaleString()}</Text>
        <View style={styles.listingMeta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.conditionText}>{item.condition}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.favoriteButton} onPress={() => handleFavorite(item._id)}>
        <Ionicons name={item.isFavorited ? "heart" : "heart-outline"} size={20} color={item.isFavorited ? colors.danger : colors.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search listings..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item: any) => item._id}
        renderItem={renderListing}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="storefront-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No listings found</Text>
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
          <Text style={styles.modalTitle}>New Listing</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Title *</Text>
          <TextInput style={styles.input} placeholder="What are you selling?" placeholderTextColor={colors.textSecondary} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Price (PKR) *</Text>
          <TextInput style={styles.input} placeholder="0" placeholderTextColor={colors.textSecondary} value={price} onChangeText={setPrice} keyboardType="numeric" />

          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categoryOptions.map((cat) => (
              <TouchableOpacity key={cat} style={[styles.chip, category === cat && styles.chipActive]} onPress={() => setCategory(cat)}>
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Condition *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {conditionOptions.map((cond) => (
              <TouchableOpacity key={cond} style={[styles.chip, condition === cond && styles.chipActive]} onPress={() => setCondition(cond)}>
                <Text style={[styles.chipText, condition === cond && styles.chipTextActive]}>{cond}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Describe your item..." placeholderTextColor={colors.textSecondary} value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" />

          <TouchableOpacity style={[styles.submitButton, mutation.isPending && { opacity: 0.7 }]} onPress={handleSubmit} disabled={mutation.isPending} activeOpacity={0.8}>
            {mutation.isPending ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.submitText}>Create Listing</Text>}
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, marginHorizontal: 20, marginTop: 12, marginBottom: 8, paddingHorizontal: 14, height: 46, borderRadius: 12, borderWidth: 1, borderColor: colors.border, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: colors.text },
  listContent: { padding: 14, paddingBottom: 80 },
  row: { justifyContent: "space-between" },
  listingCard: { width: "48%", backgroundColor: colors.surface, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, overflow: "hidden" },
  listingImage: { width: "100%", height: 110, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  listingContent: { padding: 10 },
  listingTitle: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 4 },
  listingPrice: { fontSize: 16, fontWeight: "800", color: colors.primary, marginBottom: 6 },
  listingMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoryBadge: { backgroundColor: colors.primary + "15", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  categoryText: { fontSize: 10, fontWeight: "600", color: colors.primary },
  conditionText: { fontSize: 10, color: colors.textSecondary },
  favoriteButton: { position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", elevation: 2 },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, color: colors.textSecondary, marginTop: 12 },
  fab: { position: "absolute", right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", elevation: 6, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  modalBody: { flex: 1, backgroundColor: colors.background },
  modalBodyContent: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: 6, marginTop: 16 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 15, color: colors.text },
  textArea: { height: 100, paddingTop: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.text },
  chipTextActive: { color: colors.surface },
  submitButton: { backgroundColor: colors.primary, borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center", marginTop: 30 },
  submitText: { color: colors.surface, fontSize: 17, fontWeight: "700" },
});
