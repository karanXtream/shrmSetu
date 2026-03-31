import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { useLanguage } from "../../hooks/use-translation";
import ScreenContainer from "./ScreenContainer";

export default function LanguageSelection() {
  const { t, i18n } = useTranslation();
  const { changeLanguage, language: contextLanguage } = useLanguage();
  const router = useRouter();
  const [language, setLanguage] = useState(contextLanguage || "en");
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const heroHeight = screenHeight * 0.4;

  // Map language codes to translation keys
  const languageMap = {
    en: "english",
    hi: "hindi",
    bn: "bengali",
    te: "telugu",
    mr: "marathi",
    ta: "tamil",
    gu: "gujarati",
    kn: "kannada",
    ml: "malayalam",
    th: "thai",
    vi: "vietnamese",
    id: "indonesian",
  };

  const toggleDropdown = () => {
    if (!open && dropdownRef.current) {
      // Measure the dropdown button position
      dropdownRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Convert screen-relative coordinates to main-container-relative
        // main starts at: heroHeight - 20 (marginTop adjustment)
        // main has paddingTop: 70
        // So we subtract both to get position within main's padding area
        const adjustedTop = pageY - heroHeight + 20 - 70;
        
        setDropdownPosition({
          top: adjustedTop + height, // Position below the button
          left: x, // Use local x coordinate
          width: width,
        });
      });
    }
    setOpen(!open);
  };

  const selectLanguage = (code, key) => {
    setLanguage(code);
    changeLanguage(code);  // Use LanguageContext's changeLanguage instead of i18n directly
    setOpen(false);
  };

  // Set default language to English on mount and sync with context changes
  useEffect(() => {
    if (contextLanguage) {
      setLanguage(contextLanguage);
      i18n.changeLanguage(contextLanguage);
    }
  }, [contextLanguage, i18n]);

  const handleContinue = () => {
    // Navigate to UserRole selection screen
    router.push("screens/user-role");
  };

  const handleBack = () => {
    // Navigate back to previous screen
    router.back();
  };

  return (
    <ScreenContainer
      heroImage={require('../../assets/images/uiPhotos/languageSelectUi.png')}
    >
      <Text style={styles.label}>{t("language.select_language")}</Text>

      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          ref={dropdownRef}
          onPress={toggleDropdown} 
          style={styles.dropdownHeader}
        >
          <Text style={styles.dropdownText}>
            {t(`language.${languageMap[language]}`)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <LinearGradient
          colors={["#003f87", "#0056b3"]}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>{t("buttons.continue")} →</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* FLOATING DROPDOWN OVERLAY - INSIDE MAIN FOR CORRECT POSITIONING */}
      {open && (
        <View 
          style={[
            styles.dropdownOverlay,
            {
              top: dropdownPosition.top,
              left: (screenWidth / 2) - (dropdownPosition.width / 2),
            }
          ]} 
          pointerEvents="box-none"
        >
          <View style={[styles.dropdownListInline, { width: dropdownPosition.width || "100%" }]}>
          <ScrollView 
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            style={styles.scrollView}
          >
            {Object.entries(languageMap).map(([code, key]) => (
              <TouchableOpacity
                key={code}
                activeOpacity={0.6}
                onPress={() => selectLanguage(code, key)}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{t(`language.${key}`)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 40,
    textAlign: "center",
  },

  dropdownContainer: {
    marginBottom: 20,
    zIndex: 100,
  },

  dropdownHeader: {
    backgroundColor: "#f5f3f3",
    padding: 15,
    borderRadius: 12,
  },

  dropdownText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  dropdownOverlay: {
    position: "absolute",
    pointerEvents: "box-none",
    zIndex: 9998,
  },

  dropdownListInline: {
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 9999,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: "hidden",
  },

  scrollView: {
    flex: 1,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  dropdownItemText: {
    fontSize: 15,
    color: "#333",
  },

  button: {
    marginTop: 10,
  },

  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});