import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  WebView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Platform
} from 'react-native';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos().then(() => setRefreshing(false));
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:4000/videos');
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setVideos(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const togglePlayPause = () => {
    // In React Native, you would typically use a video player library
    // like react-native-video for better control
    setIsPlaying(!isPlaying);
  };

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
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchVideos()}
        >
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
          <TouchableOpacity
            onPress={() => setSelected(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back to Videos</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>StreamVid</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Video Player Section */}
          <View style={styles.videoContainer}>
            <WebView
              style={styles.videoPlayer}
              source={{ uri: `https://www.youtube.com/embed/${selected.id}?autoplay=1&modestbranding=1&rel=0` }}
              allowsFullscreenVideo={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>

          {/* Play/Pause Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playPauseButton}
            >
              <Text style={styles.playPauseButtonText}>
                {isPlaying ? 'Pause' : 'Play'}
              </Text>
            </TouchableOpacity>
          </View>

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Featured Videos</Text>
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <View style={styles.sortDropdown}>
              <Text style={styles.sortText}>Most Popular</Text>
            </View>
          </View>
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
              <TouchableOpacity
                key={v.id}
                onPress={() => setSelected(v)}
                style={styles.videoCard}
              >
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{ uri: v.snippet.thumbnails.medium.url }}
                    style={styles.thumbnail}
                  />
                  <View style={styles.thumbnailOverlay}>
                    <View style={styles.playButton}>
                      <Text style={styles.playIcon}>▶</Text>
                    </View>
                  </View>
                </View>
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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2023 StreamVid. All rights reserved.</Text>
          <Text style={styles.footerText}>This is a demo application for educational purposes.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 20,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorMessage: {
    color: '#fecaca',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#d1d5db',
    marginLeft: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundGradient: 'linear-gradient(to right, #60a5fa, #a855f7)',
    backgroundClip: 'text',
    color: 'transparent',
  },
  headerSpacer: {
    width: 20,
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    padding: 16,
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: 'black',
    borderRadius: 12,
    overflow: 'hidden',
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  playPauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  playPauseButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
  },
  videoInfo: {
    paddingHorizontal: 16,
  },
  videoTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  channelTitle: {
    color: '#9ca3af',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  descriptionTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#d1d5db',
    fontSize: 14,
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    color: '#9ca3af',
    marginRight: 8,
  },
  sortDropdown: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortText: {
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: '#9ca3af',
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  videoCard: {
    width: '48%',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16/9,
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 12,
    backdropFilter: 'blur(10px)',
  },
  playIcon: {
    color: 'white',
    fontSize: 20,
  },
  videoDetails: {
    padding: 12,
  },
  videoCardTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
  },
  videoCardChannel: {
    color: '#9ca3af',
    fontSize: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});