import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { AntDesign } from "@expo/vector-icons";

type Zutat = {
  id: string;
  name: string;
  vegetarisch: boolean;
};

export default function CustomizeScreen() {
  const [zutaten, setZutaten] = useState<Zutat[]>([]);
  const [likeZutaten, setLikeZutaten] = useState<string[]>([]);
  const [dislikeZutaten, setDislikeZutaten] = useState<string[]>([]);
  const [likeOpen, setLikeOpen] = useState(false);
  const [dislikeOpen, setDislikeOpen] = useState(false);

  useEffect(() => {
    const fetchZutaten = async () => {
      try {
        const response = await fetch("http://192.168.178.28:3000/zutaten");
        const data = await response.json();
        setZutaten(data);
      } catch (error) {
        console.error("Fehler beim Laden der Zutaten:", error);
        Alert.alert("Fehler", "Zutaten konnten nicht geladen werden.");
      }
    };
    fetchZutaten();
  }, []);

  const handleConfirmSelection = async () => {
    try {
      await fetch("http://192.168.178.28:3000/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ like: likeZutaten }),
      });

      await fetch("http://192.168.178.28:3000/dislike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dislike: dislikeZutaten }),
      });

      Alert.alert("Erfolgreich", "Deine Auswahl wurde gespeichert!");
    } catch (error) {
      console.error("Fehler beim Speichern der Auswahl:", error);
      Alert.alert("Fehler", "Deine Auswahl konnte nicht gespeichert werden.");
    }
  };

  const getMultipleText = (count: number) =>
    count === 1 ? "1 Zutat ausgewählt" : `${count} Zutaten ausgewählt`;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setLikeOpen(false);
        setDislikeOpen(false);
        Keyboard.dismiss();
      }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Wähle deine Zutaten</Text>

        <Text style={styles.subtitle}>Das soll auf der Pizza sein!</Text>
        <DropDownPicker
          open={likeOpen}
          setOpen={setLikeOpen}
          onOpen={() => setDislikeOpen(false)}
          onClose={() => setLikeOpen(false)}
          items={zutaten.map((zutat) => ({
            label: zutat.name,
            value: zutat.id,
          }))}
          multiple={true}
          min={0}
          max={3}
          value={likeZutaten}
          setValue={setLikeZutaten}
          placeholder="Wähle bis zu 3 Zutaten"
          multipleText={getMultipleText(likeZutaten.length)}
          zIndex={3000}
          zIndexInverse={1000}
        />
        <View style={styles.selectedContainer}>
          {likeZutaten.map((id) => (
            <View key={id} style={styles.selectedItem}>
              <Text style={styles.selectedText}>
                {zutaten.find((z) => z.id === id)?.name}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setLikeZutaten(likeZutaten.filter((item) => item !== id))
                }
              >
                <AntDesign name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.subtitle}>
          Das möchte ich auf keinen Fall auf der Pizza!
        </Text>
        <DropDownPicker
          open={dislikeOpen}
          setOpen={setDislikeOpen}
          onOpen={() => setLikeOpen(false)}
          onClose={() => setDislikeOpen(false)}
          items={zutaten.map((zutat) => ({
            label: zutat.name,
            value: zutat.id,
          }))}
          multiple={true}
          min={0}
          max={3}
          value={dislikeZutaten}
          setValue={setDislikeZutaten}
          placeholder="Wähle bis zu 3 Zutaten"
          multipleText={getMultipleText(dislikeZutaten.length)}
          zIndex={2000}
          zIndexInverse={2000}
        />
        <View style={styles.selectedContainer}>
          {dislikeZutaten.map((id) => (
            <View key={id} style={styles.selectedItem}>
              <Text style={styles.selectedText}>
                {zutaten.find((z) => z.id === id)?.name}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setDislikeZutaten(
                    dislikeZutaten.filter((item) => item !== id)
                  )
                }
              >
                <AntDesign name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmSelection}
        >
          <Text style={styles.confirmButtonText}>Bestätigen</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1e1e2f",
    padding: 30,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5c5c87",
    padding: 8,
    borderRadius: 5,
    margin: 5,
    marginBottom: 20,
  },
  selectedText: {
    color: "white",
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
