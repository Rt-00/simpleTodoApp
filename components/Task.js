import { Feather } from "@expo/vector-icons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Task(props) {
  const [isChecked, setChecked] = useState(false);

  const { getItem, setItem } = useAsyncStorage("@taskapp:tasks");

  async function handleCompleteTask(id) {
    const response = await getItem();
    const prevData = response ? JSON.parse(response) : [];

    const data = prevData.filter((task) => task.id !== id);
    setItem(JSON.stringify(data));
  }

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Checkbox
          style={styles.square}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? "#04D361" : "#7C7C8A"}
        />
        <Text
          style={{ textDecorationLine: isChecked ? "line-through" : "none" }}
        >
          {props.text}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleCompleteTask(props.idTask)}>
        <Feather
          name="trash-2"
          style={{
            color: "#CC2937",
            padding: 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#202024",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 24,
    height: 24,
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 20,
  },
  itemText: {
    maxWidth: "80%",
  },
});
