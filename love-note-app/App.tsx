import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { type Mood, randomMessage } from "./messages";

const NAME_KEY = "love-note:name";
const COUNT_KEY = "love-note:count";
const DATE_KEY = "love-note:date";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [name, setName] = useState("mon amour");
  const [nameDraft, setNameDraft] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [mood, setMood] = useState<Mood>("doux");
  const [message, setMessage] = useState(() => randomMessage("doux"));
  const [count, setCount] = useState(0);

  const heartScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [showFloatHeart, setShowFloatHeart] = useState(false);

  useEffect(() => {
    (async () => {
      const storedName = await AsyncStorage.getItem(NAME_KEY);
      if (storedName) setName(storedName);

      const storedDate = await AsyncStorage.getItem(DATE_KEY);
      const storedCount = await AsyncStorage.getItem(COUNT_KEY);
      if (storedDate === todayKey() && storedCount) {
        setCount(parseInt(storedCount, 10));
      } else {
        await AsyncStorage.setItem(DATE_KEY, todayKey());
        await AsyncStorage.setItem(COUNT_KEY, "0");
      }
    })();
  }, []);

  const persistCount = async (next: number) => {
    setCount(next);
    await AsyncStorage.setItem(DATE_KEY, todayKey());
    await AsyncStorage.setItem(COUNT_KEY, String(next));
  };

  const sendLove = () => {
    cardOpacity.setValue(0);
    setMessage(randomMessage(mood, message));
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.35,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    floatAnim.setValue(0);
    setShowFloatHeart(true);
    Animated.timing(floatAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => setShowFloatHeart(false));

    persistCount(count + 1);
  };

  const switchMood = (next: Mood) => {
    if (next === mood) return;
    setMood(next);
    setMessage(randomMessage(next));
  };

  const openNameEditor = () => {
    setNameDraft(name);
    setEditingName(true);
  };

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    const finalName = trimmed.length > 0 ? trimmed : "mon amour";
    setName(finalName);
    await AsyncStorage.setItem(NAME_KEY, finalName);
    setEditingName(false);
  };

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });
  const floatOpacity = floatAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <LinearGradient colors={["#ffdde6", "#ffe8f0", "#fff5f8"]} style={styles.fill}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Pressable onPress={openNameEditor} style={styles.header}>
          <Text style={styles.headerText}>Pour {name} 💌</Text>
          <Text style={styles.headerHint}>touche pour changer le prénom</Text>
        </Pressable>

        <View style={styles.moodRow}>
          <Pressable
            onPress={() => switchMood("doux")}
            style={[styles.moodButton, mood === "doux" && styles.moodButtonActive]}
          >
            <Text style={[styles.moodText, mood === "doux" && styles.moodTextActive]}>
              Doux 💕
            </Text>
          </Pressable>
          <Pressable
            onPress={() => switchMood("drole")}
            style={[styles.moodButton, mood === "drole" && styles.moodButtonActive]}
          >
            <Text style={[styles.moodText, mood === "drole" && styles.moodTextActive]}>
              Drôle 😂
            </Text>
          </Pressable>
        </View>

        <Animated.View style={[styles.card, { opacity: cardOpacity }]}>
          <Text style={styles.cardText}>{message}</Text>
        </Animated.View>

        <View style={styles.heartWrap}>
          {showFloatHeart && (
            <Animated.Text
              style={[
                styles.floatingHeart,
                {
                  opacity: floatOpacity,
                  transform: [{ translateY: floatTranslateY }],
                },
              ]}
            >
              💖
            </Animated.Text>
          )}
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Pressable onPress={sendLove} style={styles.heartButton}>
              <Text style={styles.heartButtonText}>💗</Text>
            </Pressable>
          </Animated.View>
        </View>

        <Text style={styles.counter}>
          {count === 0
            ? "Touche le cœur pour ta première dose d'amour du jour"
            : `${count} dose${count > 1 ? "s" : ""} d'amour envoyée${count > 1 ? "s" : ""} aujourd'hui`}
        </Text>
      </View>

      <Modal visible={editingName} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Le prénom de ta moitié</Text>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              placeholder="mon amour"
              style={styles.input}
              autoFocus
            />
            <View style={styles.modalRow}>
              <Pressable onPress={() => setEditingName(false)} style={styles.modalCancel}>
                <Text style={styles.modalCancelText}>Annuler</Text>
              </Pressable>
              <Pressable onPress={saveName} style={styles.modalSave}>
                <Text style={styles.modalSaveText}>Enregistrer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 20,
  },
  header: { alignItems: "center", gap: 4 },
  headerText: { fontSize: 24, fontWeight: "700", color: "#c2185b" },
  headerHint: { fontSize: 12, color: "#b06a80" },
  moodRow: { flexDirection: "row", gap: 10 },
  moodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#ffffffaa",
  },
  moodButtonActive: { backgroundColor: "#ff6f91" },
  moodText: { color: "#c2185b", fontWeight: "600" },
  moodTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    minHeight: 140,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#c2185b",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardText: {
    fontSize: 18,
    textAlign: "center",
    color: "#4a2536",
    lineHeight: 26,
  },
  heartWrap: { alignItems: "center", justifyContent: "center" },
  floatingHeart: { position: "absolute", fontSize: 28, top: -10 },
  heartButton: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#c2185b",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  heartButtonText: { fontSize: 44 },
  counter: { fontSize: 13, color: "#a45874", textAlign: "center" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#c2185b" },
  input: {
    borderWidth: 1,
    borderColor: "#f0c4d3",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalRow: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  modalCancel: { paddingVertical: 8, paddingHorizontal: 14 },
  modalCancelText: { color: "#a45874" },
  modalSave: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ff6f91",
    borderRadius: 12,
  },
  modalSaveText: { color: "#fff", fontWeight: "700" },
});
