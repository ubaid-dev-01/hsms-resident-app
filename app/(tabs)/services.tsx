import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import ServiceCard from "@/components/ServiceCard";
import { colors } from "@/theme/colors";

const services = [
  { icon: "chatbox-ellipses-outline" as const, title: "Complaints", description: "File and track complaints", route: "/screens/ComplaintScreen" },
  { icon: "construct-outline" as const, title: "Maintenance", description: "Request maintenance work", route: "/screens/MaintenanceScreen" },
  { icon: "calendar-outline" as const, title: "Facility Booking", description: "Book community facilities", route: "/screens/FacilityBookingScreen" },
  { icon: "person-add-outline" as const, title: "Visitor Pre-approval", description: "Pre-approve your visitors", route: "/screens/VisitorScreen" },
  { icon: "qr-code-outline" as const, title: "Gate Pass", description: "Generate gate passes", route: "/screens/VisitorScreen" },
  { icon: "warning-outline" as const, title: "Emergency SOS", description: "Trigger emergency alerts", route: "/screens/EmergencyScreen" },
  { icon: "videocam-outline" as const, title: "Meetings", description: "View upcoming meetings", route: "/screens/PollScreen" },
  { icon: "bar-chart-outline" as const, title: "Polls", description: "Vote on society matters", route: "/screens/PollScreen" },
];

export default function ServicesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
        <Text style={styles.headerSubtitle}>Access all society services</Text>
      </View>

      <View style={styles.grid}>
        {services.map((service, index) => {
          const isLastOdd = index === services.length - 1 && services.length % 2 !== 0;
          return (
            <View key={service.title} style={isLastOdd ? styles.halfWidth : styles.gridItem}>
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                onPress={() => router.push(service.route as any)}
              />
            </View>
          );
        })}
      </View>
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
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 14,
  },
  gridItem: {
    width: "50%",
  },
  halfWidth: {
    width: "50%",
  },
});
