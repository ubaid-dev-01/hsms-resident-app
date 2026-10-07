import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 5 * 60 * 1000 },
  },
});

function AuthLoader({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, setLoading } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await authService.getProfile();
        if (data?.user) setUser(data.user);
        else clearUser();
      } catch {
        clearUser();
      }
    })();
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthLoader>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="screens/ComplaintScreen"
            options={{ headerShown: true, title: "My Complaints" }}
          />
          <Stack.Screen
            name="screens/NewComplaintScreen"
            options={{ headerShown: true, title: "New Complaint" }}
          />
          <Stack.Screen
            name="screens/MaintenanceScreen"
            options={{ headerShown: true, title: "Maintenance Requests" }}
          />
          <Stack.Screen
            name="screens/VisitorScreen"
            options={{ headerShown: true, title: "Visitor Management" }}
          />
          <Stack.Screen
            name="screens/FacilityBookingScreen"
            options={{ headerShown: true, title: "Facility Booking" }}
          />
          <Stack.Screen
            name="screens/EmergencyScreen"
            options={{ headerShown: true, title: "Emergency SOS" }}
          />
          <Stack.Screen
            name="screens/MarketplaceScreen"
            options={{ headerShown: true, title: "Marketplace" }}
          />
          <Stack.Screen
            name="screens/PollScreen"
            options={{ headerShown: true, title: "Polls & Voting" }}
          />
        </Stack>
      </AuthLoader>
    </QueryClientProvider>
  );
}
