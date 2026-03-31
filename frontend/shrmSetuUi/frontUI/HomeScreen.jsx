import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { useRouter } from "expo-router";
import { ROUTES } from "@/config/routes";

// Default English fallback text
const DEFAULT_TEXT = {
  appName: "ShramSetu",
  tagline: "The Digital Foreman",
  hindiText: "Your contribution in building a stronger India.",
  empoweringText: "Empowering the Backbone of Infrastructure",
  buttonText: "Next",
  footerText: "✔ Verified Professional Platform",
};

export default function Home() {
  const { t, i18n } = useI18nextTranslation();
  const router = useRouter();
  
  // Ensure default language is English
  React.useEffect(() => {
    if (i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, [i18n]);
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/uiPhotos/homeScreenUi.png')}
        style={styles.background}
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={[
            "rgba(25,27,35,0.95)",
            "rgba(25,27,35,0.4)",
            "rgba(25,27,35,0.1)",
          ]}
          style={styles.overlay}
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{t('homeScreen.appName') || DEFAULT_TEXT.appName}</Text>

          <View style={styles.tag}>
            <Text style={styles.tagText}>{t('homeScreen.tagline') || DEFAULT_TEXT.tagline}</Text>
          </View>

          <Text style={styles.hindiText}>
            {t('homeScreen.hindiText') || DEFAULT_TEXT.hindiText}
          </Text>

          <Text style={styles.subText}>
            {t('homeScreen.empoweringText') || DEFAULT_TEXT.empoweringText}
          </Text>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push(ROUTES.LANGUAGE_SELECTION)}
          >
            <LinearGradient
              colors={["#003d9b", "#0052cc"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{t('homeScreen.buttonText') || DEFAULT_TEXT.buttonText}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.footer}>
            {t('homeScreen.footerText') || DEFAULT_TEXT.footerText}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "rgba(0,82,204,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 20,
  },
  tagText: {
    color: "#b2c5ff",
    fontSize: 12,
    letterSpacing: 1,
  },
  hindiText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    width: "100%",
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 15,
    fontSize: 10,
    color: "#aaa",
  },
});