import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Splash() {
  const router = useRouter();

  const handleButtonPress = () => {
    router.replace("/screens");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={{
          uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA94zolNKQYwJcfbBvFnQ12q9WKZJZ9CdiPd1djIxK2CvdsB3ubBzT7yVvtVMsvXankVmo8LLD1gdDGDwJOC-Dal1QQuUvEX5oJIl7gkB-gmbDfUvfbYyRjlLtqq1RUg3QdvuF-Hc2xchaF8MMUS31m9HnG_9qI_aHX7QkS55j9Q4mGFG2q-FsvSBQV7WTStT_K4iod-qKCjGWw4PN4IxL6hnh3Xx090B48qHnlChy3DxXHyVallMLY5-VQgsHcZChugzI1GJvAFsf9",
        }}
        style={styles.image}
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={[
            "rgba(0,64,161,0.6)",
            "rgba(0,64,161,0.3)",
            "rgba(0,64,161,0.6)",
          ]}
          style={styles.overlay}
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>श्रम</Text>
            <Text style={styles.title}>सेतु</Text>
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>भारत के कामगारों का डिजिटल साथी</Text>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>चलो शुरू करें</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0040a1",
  },

  image: {
    flex: 1,
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 20,
  },

  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 90,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 120,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },

  tagline: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },

  button: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    elevation: 10,
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0040a1",
  },
});
