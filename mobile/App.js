// App.js
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

function HomeScreen() {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef(null);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos().then(() => setRefreshing(false));
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch("https://mytube-fl0o.onrender.com/videos");
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setVideos(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const onStateChange = useCallback((state) => {
    // Update playing state based on player state
    if (state === "playing") {
      setIsPlaying(true);
    } else if (state === "paused") {
      setIsPlaying(false);
    } else if (state === "ended") {
      setIsPlaying(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Error Loading Content</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchVideos()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (selected) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelected(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to Videos</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>StreamVid</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* YouTube Player */}
          <View style={styles.videoContainer}>
            <YoutubePlayer
              ref={playerRef}
              height={220}
              play={isPlaying}
              videoId={selected.id}
              onChangeState={onStateChange}
            />
          </View>

          {/* Play/Pause Controls */}


          {/* Video Info */}
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{selected.snippet.title}</Text>
            <Text style={styles.channelTitle}>{selected.snippet.channelTitle}</Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>
                {selected.snippet.description || "No description available for this video."}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Homepage - List view
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>StreamVid</Text>
          <Text style={styles.subtitle}>Your curated collection of videos</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Featured Videos</Text>
        </View>

        {videos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📹</Text>
            <Text style={styles.emptyTitle}>No videos available</Text>
            <Text style={styles.emptyText}>Check back later for new content.</Text>
          </View>
        ) : (
          <View style={styles.videoGrid}>
            {videos.map((v) => (
              <TouchableOpacity key={v.id} onPress={() => setSelected(v)} style={styles.videoCard}>
                <Image
                  source={{ uri: v.snippet.thumbnails.medium.url }}
                  style={styles.thumbnail}
                />
                <View style={styles.videoDetails}>
                  <Text style={styles.videoCardTitle} numberOfLines={2}>
                    {v.snippet.title}
                  </Text>
                  <Text style={styles.videoCardChannel}>{v.snippet.channelTitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Dummy Profile Screen
function ProfileScreen() {
  return (
    <View style={styles.center}>
      <Text style={{ color: "white", fontSize: 20 }}>Profile Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: "#111827" },
          tabBarActiveTintColor: "#60a5fa",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home-outline";
            } else if (route.name === "Profile") {
              iconName = "person-outline";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111827" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111827" },
  loadingText: { color: "white", marginTop: 16, fontSize: 18 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111827", padding: 20 },
  errorEmoji: { fontSize: 48, marginBottom: 16 },
  errorTitle: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  errorMessage: { color: "#fecaca", textAlign: "center", marginBottom: 20 },
  retryButton: { backgroundColor: "#dc2626", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: "white", fontWeight: "600" },
  header: { paddingTop: 56, paddingLeft: 20,flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { fontSize: 24, fontWeight: "bold", color: "white" },
  subtitle: { color: "#9ca3af", fontSize: 14, marginTop: 4 },
  scrollView: { flex: 1 },
  videoContainer: { padding: 16 },
  controlsContainer: { alignItems: "center", marginBottom: 24 },
  playPauseButton: { backgroundColor: "#2563eb", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  playPauseButtonText: { color: "white", fontWeight: "600" },
  videoInfo: { paddingHorizontal: 16 },
  videoTitle: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  channelTitle: { color: "#9ca3af", marginBottom: 16 },
  actionButtons: { flexDirection: "row", marginBottom: 24 },
  actionButton: { backgroundColor: "#374151", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginRight: 16 },
  actionButtonText: { color: "white" },
  descriptionContainer: { backgroundColor: "rgba(55, 65, 81, 0.5)", borderRadius: 12, padding: 16, marginBottom: 24 },
  descriptionTitle: { color: "white", fontWeight: "600", marginBottom: 8 },
  descriptionText: { color: "#d1d5db", fontSize: 14 },
  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  sectionTitle: { color: "white", fontSize: 24, fontWeight: "bold" },
  emptyContainer: { alignItems: "center", padding: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: "white", fontSize: 20, fontWeight: "600", marginBottom: 8 },
  emptyText: { color: "#9ca3af" },
  videoGrid: { flexDirection: "row", flexWrap: "wrap", padding: 8, justifyContent: "space-between" },
  videoCard: { width: "48%", backgroundColor: "rgba(55, 65, 81, 0.5)", borderRadius: 12, marginBottom: 16, overflow: "hidden" },
  thumbnail: { width: "100%", aspectRatio: 16 / 9 },
  videoDetails: { padding: 12 },
  videoCardTitle: { color: "white", fontWeight: "600", marginBottom: 4 },
  videoCardChannel: { color: "#9ca3af", fontSize: 12 },
backButton: { paddingVertical: 15, paddingHorizontal: 12, backgroundColor: "#374151", borderRadius: 8 , marginLeft:20, marginRight:20},
  backButtonText: { color: "white" },
  headerSpacer: { width: 60 }, // To balance the header layout
});