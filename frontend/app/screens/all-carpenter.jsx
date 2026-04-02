import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const allCarpenters = [
  {
    title: "Carpenter - Doors & Windows",
    location: "Chennai, TN",
    price: "₹800",
    perDay: "PER DAY",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=150&fit=crop",
    rating: 4.9,
  },
  {
    title: "Furniture Assembly",
    location: "Jaipur, RJ",
    price: "₹650",
    perDay: "PER DAY",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=150&fit=crop",
    rating: 4.5,
  },
  {
    title: "Custom Woodwork",
    location: "Bangalore, KA",
    price: "₹900",
    perDay: "PER DAY",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=150&fit=crop",
    rating: 4.8,
  },
  {
    title: "Cabinet Making",
    location: "Pune, MH",
    price: "₹850",
    perDay: "PER DAY",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=150&fit=crop",
    rating: 4.7,
  },
  {
    title: "Door Installation",
    location: "Delhi, DL",
    price: "₹750",
    perDay: "PER DAY",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=150&fit=crop",
    rating: 4.8,
  },
  {
    title: "Roof Carpentry",
    location: "Hyderabad, TG",
    price: "₹950",
    perDay: "PER DAY",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=150&fit=crop",
    rating: 4.6,
  },
];

export default function AllCarpenterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>🪵 All Carpenters</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.cardsGrid}>
          {allCarpenters.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: item.img }} style={styles.cardImg} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardLocationPrice}>
                  <Ionicons name="location" size={14} color="#999" />
                  <Text style={styles.cardSub}>{item.location}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Ionicons name="star" size={12} color="#ffc107" />
                  <Text style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>{item.rating}</Text>
                </View>
                <TouchableOpacity style={styles.applyBtn}>
                  <Text style={styles.applyText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003f87",
  },

  cardsGrid: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },

  cardImg: {
    height: 100,
    width: "100%",
    backgroundColor: "#f0f0f0",
  },

  cardContent: {
    padding: 10,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#222",
    marginBottom: 6,
  },

  cardLocationPrice: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  cardSub: {
    color: "#888",
    fontSize: 11,
    marginLeft: 4,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },

  cardPrice: {
    color: "#2e8b57",
    fontWeight: "bold",
    fontSize: 14,
  },

  perDay: {
    color: "#999",
    fontSize: 10,
    marginLeft: 4,
  },

  applyBtn: {
    backgroundColor: "#003f87",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 2,
  },

  applyText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
});
