import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ScreenContainer({
  heroImage,
  children,
  showFooter = true,
}) {
  return (
    <View style={styles.container}>
      {/* HERO SECTION */}
      <View style={styles.hero} pointerEvents="none">
        <ImageBackground
          source={heroImage}
          style={styles.heroImage}
        >
          <View style={styles.overlay} />
          {/* GRADIENT FADE */}
          <LinearGradient
            colors={["transparent", "rgba(255, 255, 255, 0.8)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientFade}
          />
        </ImageBackground>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.main}>
        {children}
      </View>

      {/* FLOATING FOOTER */}
      {showFooter && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ✔ Secure Infrastructure
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  hero: {
    height: "40%",
  },

  heroImage: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,63,135,0.3)",
  },

  gradientFade: {
    ...StyleSheet.absoluteFillObject,
  },

  main: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "flex-start",
    position: "relative",
    marginTop: -20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#ffffff",
    zIndex: 1,
    overflow: "visible",
  },

  footer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },

  footerText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
