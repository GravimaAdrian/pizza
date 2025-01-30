import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

type Player = {
  id: string;
  name: string;
  score: number;
};

export default function StatsScreen() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    averageScore: 0,
    highestScore: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://192.168.178.28:3000/players");
        const data: Player[] = await response.json();

        const totalPlayers = data.length;
        const totalScore = data.reduce((sum, player) => sum + player.score, 0);
        const highestScore = Math.max(...data.map((player) => player.score), 0);
        const averageScore = totalPlayers > 0 ? totalScore / totalPlayers : 0;

        setStats({ totalPlayers, averageScore, highestScore });
      } catch (error) {
        console.error("Fehler beim Abrufen der Statistiken:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiken</Text>
      <Text style={styles.stat}>
        Gesamtanzahl Spieler: {stats.totalPlayers}
      </Text>
      <Text style={styles.stat}>
        Durchschnittlicher Punktestand: {stats.averageScore.toFixed(2)}
      </Text>
      <Text style={styles.stat}>
        Höchster Punktestand: {stats.highestScore}
      </Text>
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
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stat: {
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 10,
  },
});
