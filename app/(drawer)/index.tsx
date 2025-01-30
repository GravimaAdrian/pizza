import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const BASE_URL = "https://pizza.zeabur.app";

export default function HomeScreen() {
  const [inviteCode, setInviteCode] = useState("");
  const [joinResponse, setJoinResponse] = useState(null);

  const handleJoin = async () => {
    if (!inviteCode) {
      Alert.alert("Fehler", "Bitte gib einen Einladungscode ein.");
      return;
    }

    const generateInvite = async () => {
      await fetch(`${BASE_URL}/api/generate_session_code?invite=${inviteCode}`);
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/generate_session_code?invite=${inviteCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setJoinResponse(data);

      if (response.status === 202) {
        Alert.alert("Erfolgreich", "Du bist der Bestellung beigetreten!");
      } else if (response.status === 400) {
        Alert.alert("Fehler", "Ungültiger Einladungscode.");
      } else {
        Alert.alert(
          "Fehler",
          data.message || "Es gab ein Problem beim Beitreten."
        );
      }
    } catch (error) {
      console.error("Fehler beim Beitreten:", error);
      Alert.alert("Fehler", "Es gab ein Problem beim Beitreten.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pizza-Bestellung</Text>

      <TouchableOpacity style={styles.button} onPress={generateInvite}>
        <Text style={styles.buttonText}>Beitreten</Text>
      </TouchableOpacity>
      {joinResponse && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>Antwort von Server:</Text>
          <Text style={styles.responseText}>
            {JSON.stringify(joinResponse, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e2f",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    backgroundColor: "#333",
    color: "#ffffff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  responseContainer: {
    marginTop: 20,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
  },
  responseText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
