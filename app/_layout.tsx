import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Home from "./(drawer)/index";
import CustomizeScreen from "./(drawer)/customize";

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#1e1e2f" },
          headerTintColor: "#fff",
          drawerStyle: { backgroundColor: "#1e1e2f" },
          drawerActiveTintColor: "#5c5c87",
          drawerInactiveTintColor: "#fff",
        }}
      >
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Zutaten" component={CustomizeScreen} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
