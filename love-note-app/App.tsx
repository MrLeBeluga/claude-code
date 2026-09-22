import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "./firebase";
import { type Mood, randomMessage } from "./messages";

const NAME_KEY = "love-note:my-name";

type Heart = {
  id: string;
  from: string;
  mood: Mood;
  message: string;
  ts: number;
};

function todayKey(ts: number) {
  return new Date(ts).toISOString().slice(0, 10);
}

function timeAgo(ts: number) {
  const diffMs = Date.now() - ts;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
}

export default function App() {
  const [myName, setMyName] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [mood, setMood] = useState<Mood>("doux");
  const [message, setMessage] = useState(() => randomMessage("doux"));
  const [hearts, setHearts] = useState<Heart[]>([]);

  const heartScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [showFloatHeart, setShowFloatHeart] = useState(false);
  const isFirstSnapshot = useRef(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(NAME_KEY);
      if (stored) {
        setMyName(stored);
      } else {
        setEditingName(true);
      }
    })();
  }, []);

  useEffect(() => {
    const heartsQuery = query(
      collection(db, "hearts"),
      orderBy("ts", "desc"),
      limit(30),
    );
    const unsubscribe = onSnapshot(heartsQuery, (snapshot) => {
      const next: Heart[] = snapshot.docs.map((d) => {
        const data = d.data() as Omit<Heart, "id">;
        return { id: d.id, ...data };
      });
      setHearts(next);

      if (!isFirstSnapshot.current) {
        const incoming = snapshot
          .docChanges()
          .some((c) => c.type === "added" && c.doc.data().from !== myName);
        if (incoming) playReceiveAnimation();
      }
      isFirstSnapshot.current = false;
    });
    return unsubscribe;
  }, [myName]);

  const playReceiveAnimation = () => {
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
  };

  const sendLove = async () => {
    if (!myName) return;
    const nextMessage = randomMessage(mood, message);
    cardOpacity.setValue(0);
    setMessage(nextMessage);
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

    await addDoc(collection(db, "hearts"), {
      from: myName,
      mood,
      message: nextMessage,
      ts: Date.now(),
    });
  };

  const switchMood = (next: Mood) => {
    if (next === mood) return;
    setMood(next);
    setMessage(randomMessage(next));
  };

  const openNameEditor = () => {
    setNameDraft(myName ?? "");
    setEditingName(true);
  };

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    if (trimmed.length === 0) return;
    setMyName(trimmed);
    await AsyncStorage.setItem(NAME_KEY, trimmed);
    setEditingName(false);
  };

  const today = todayKey(Date.now());
  const sentToday = hearts.filter(
    (h) => h.from === myName && todayKey(h.ts) === today,
  ).length;
  const receivedToday = hearts.filter(
    (h) => h.from !== myName && todayKey(h.ts) === today,
  ).length;
  const received = hearts.filter((h) => h.from !== myName);

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
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={openNameEditor} style={styles.header}>
          <Text style={styles.headerText}>
            {myName ? `Salut ${myName} 💌` : "Envoie de l'amour 💌"}
          </Text>
          <Text style={styles.headerHint}>touche pour changer ton prénom</Text>
        </Pressable>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>💌 {sentToday} envoyé(s)</Text>
          <Text style={styles.statText}>💖 {receivedToday} reçu(s)</Text>
        </View>

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

        <Text style={styles.counter}>Touche le cœur pour envoyer ce message</Text>

        {received.length > 0 && (
          <View style={styles.feed}>
            <Text style={styles.feedTitle}>Reçus récemment</Text>
            {received.slice(0, 10).map((h) => (
              <View key={h.id} style={styles.feedItem}>
                <Text style={styles.feedItemFrom}>
                  {h.from} {h.mood === "doux" ? "💕" : "😂"}{" "}
                  <Text style={styles.feedItemTime}>{timeAgo(h.ts)}</Text>
                </Text>
                <Text style={styles.feedItemText}>{h.message}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={editingName} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>C'est qui, sur ce téléphone ?</Text>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              placeholder="ton prénom"
              style={styles.input}
              autoFocus
            />
            <View style={styles.modalRow}>
              {myName && (
                <Pressable onPress={() => setEditingName(false)} style={styles.modalCancel}>
                  <Text style={styles.modalCancelText}>Annuler</Text>
                </Pressable>
              )}
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
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 18,
  },
  header: { alignItems: "center", gap: 4 },
  headerText: { fontSize: 24, fontWeight: "700", color: "#c2185b" },
  headerHint: { fontSize: 12, color: "#b06a80" },
  statsRow: { flexDirection: "row", gap: 16 },
  statText: { fontSize: 13, color: "#a45874", fontWeight: "600" },
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
  feed: { width: "100%", gap: 10, marginTop: 8 },
  feedTitle: { fontSize: 14, fontWeight: "700", color: "#c2185b" },
  feedItem: {
    backgroundColor: "#ffffffcc",
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  feedItemFrom: { fontSize: 12, fontWeight: "700", color: "#c2185b" },
  feedItemTime: { fontWeight: "400", color: "#b06a80" },
  feedItemText: { fontSize: 14, color: "#4a2536", lineHeight: 20 },
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
