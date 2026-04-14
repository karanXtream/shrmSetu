import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import YouTubeIframe from 'react-native-youtube-iframe';

const VIDEOS = [
  {
    id: 1,
    titleKey: 'learning.electrical_safety_rules',
    youtubeId: 'uSMW82dVPZA',
    youtubeUrl: 'https://youtu.be/uSMW82dVPZA',
    descriptionKey: 'learning.electrical_safety_rules_desc',
  },
  {
    id: 2,
    titleKey: 'learning.intro_to_plumbing',
    youtubeId: '-YCp-msm3oM',
    youtubeUrl: 'https://youtu.be/-YCp-msm3oM',
    descriptionKey: 'learning.intro_to_plumbing_desc',
  },
  {
    id: 3,
    titleKey: 'learning.electrician_basic',
    youtubeId: 'R8XsHjg70_Q',
    youtubeUrl: 'https://youtu.be/R8XsHjg70_Q',
    descriptionKey: 'learning.electrician_basic_desc',
  },
  {
    id: 4,
    titleKey: 'learning.electrical_hazards',
    youtubeId: 'sjRfXSL9Igk',
    youtubeUrl: 'https://youtu.be/sjRfXSL9Igk',
    descriptionKey: 'learning.electrical_hazards_desc',
  },
  {
    id: 5,
    titleKey: 'learning.mason_general',
    youtubeId: '0yZCH2jBnos',
    youtubeUrl: 'https://youtu.be/0yZCH2jBnos',
    descriptionKey: 'learning.mason_general_desc',
  },
];

export default function LearningScreen() {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getYoutubeThumbnail = (youtubeId) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  const handlePlayVideo = (video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('learning.title')}</Text>
        </View>

        <View style={styles.videosContainer}>
          {VIDEOS.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoCard}
              onPress={() => handlePlayVideo(video)}
              activeOpacity={0.7}
            >
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{ uri: getYoutubeThumbnail(video.youtubeId) }}
                  style={styles.thumbnail}
                />
                <View style={styles.playButtonOverlay}>
                  <View style={styles.playButton}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                </View>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{t(video.titleKey)}</Text>
                <Text style={styles.videoDescription}>{t(video.descriptionKey)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedVideo !== null && isPlaying}
        transparent={false}
        animationType="slide"
        onRequestClose={() => {
          setIsPlaying(false);
          setSelectedVideo(null);
        }}
      >
        <View style={styles.videoPlayerContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setIsPlaying(false);
              setSelectedVideo(null);
            }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Video Player */}
          {selectedVideo && (
            <View style={styles.playerWrapper}>
              <YouTubeIframe
                height={250}
                play={isPlaying}
                videoId={selectedVideo.youtubeId}
                onChangeState={(state) => {
                  console.log('Video state:', state);
                }}
              />
            </View>
          )}

          {/* Video Info */}
          <ScrollView style={styles.videoDetailsContainer}>
            {selectedVideo && (
              <>
                <Text style={styles.videoDetailsTitle}>{t(selectedVideo.titleKey)}</Text>
                <Text style={styles.videoDetailsDescription}>{t(selectedVideo.descriptionKey)}</Text>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#0f0f0f',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  videosContainer: {
    padding: 12,
  },
  videoCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: '#fff',
    marginLeft: 4,
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
  },
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 22,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  playerWrapper: {
    width: '100%',
    backgroundColor: '#000',
    paddingBottom: 12,
  },
  videoDetailsContainer: {
    flex: 1,
    padding: 16,
  },
  videoDetailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  videoDetailsDescription: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 22,
  },
});
