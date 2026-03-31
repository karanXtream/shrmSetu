import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/use-translation";
import ScreenContainer from "./ScreenContainer";

export default function RoleSelection() {
  const { t } = useTranslation();
  const { language } = useLanguage(); // Now triggered by language changes
  const [selectedRole, setSelectedRole] = useState(null);
  const router = useRouter();

  const handleContinue = () => {
    if (!selectedRole) return;

    // Navigate to profile creation screen
    router.push({
      pathname: "screens/create-profile",
      params: { role: selectedRole }
    });
  };

  return (
    <ScreenContainer
      heroImage={require("../../assets/images/uiPhotos/languageSelectUi.png")}
    >
      <Text style={styles.label}>{t("role.select_role")}</Text>

      {/* CARD 1 */}
      <TouchableOpacity
        style={[
          styles.card,
          selectedRole === "hire" && styles.activeCard,
        ]}
        onPress={() => setSelectedRole("hire")}
      >
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.cardText}>
          {t("role.hire")}
        </Text>

        {selectedRole === "hire" && (
          <Text style={styles.check}>✔</Text>
        )}
      </TouchableOpacity>

      {/* CARD 2 */}
      <TouchableOpacity
        style={[
          styles.card,
          selectedRole === "work" && styles.activeCard,
        ]}
        onPress={() => setSelectedRole("work")}
      >
        <Text style={styles.icon}>🛠</Text>
        <Text style={styles.cardText}>
          {t("role.work")}
        </Text>

        {selectedRole === "work" && (
          <Text style={styles.check}>✔</Text>
        )}
      </TouchableOpacity>

      {/* BUTTON */}
      <TouchableOpacity
        style={[
          styles.button,
          !selectedRole && { opacity: 0.5 },
        ]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <LinearGradient
          colors={["#003f87", "#0056b3"]}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>{t("buttons.continue")} →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#f5f3f3",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },

  activeCard: {
    borderColor: "#003f87",
    backgroundColor: "#eef3ff",
  },

  icon: {
    fontSize: 30,
    marginBottom: 5,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  check: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 16,
    color: "#003f87",
  },

  button: {
    marginTop: 20,
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