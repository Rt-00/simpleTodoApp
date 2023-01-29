import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import Task from "./components/Task";

export default function App() {
  const [task, setTask] = useState();
  const [taskList, setTaskList] = useState([]);

  const { getItem, setItem, removeItem } = useAsyncStorage("@taskapp:tasks");

  useEffect(() => {
    fetchData();
  }, [taskList]);

  async function fetchData() {
    const response = await getItem();
    const data = response ? JSON.parse(response) : [];
    setTaskList(data);
  }

  async function handleAddTask() {
    if (!task) {
      Alert.alert("Ops!", "Cannot add a null task");
      return;
    }

    const id = uuid.v4();
    const newTask = {
      id,
      task,
    };

    const response = await getItem();
    const previousData = response ? JSON.parse(response) : [];
    const data = [...previousData, newTask];
    await setItem(JSON.stringify(data));

    setTask(null);
  }

  return (
    <>
      <StatusBar translucent style="light" />
      <View style={styles.container}>
        <View style={styles.taskWrapper}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>

          <View style={styles.items}></View>
          {taskList.map((task) => {
            return <Task key={task.id} text={task.task} idTask={task.id} />;
          })}
        </View>

        {/*"Write a Task"*/}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder={"Write a task"}
            value={task}
            onChangeText={(text) => setTask(text)}
          />

          <TouchableOpacity onPress={handleAddTask}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121214",
  },
  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  items: {
    marginTop: 15,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 25,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    borderRadius: 60,
    width: 250,
    borderColor: "#8257E5",
    borderWidth: 2,
  },
  addWrapper: {
    borderWidth: 2,
    borderColor: "#8257E5",
    width: 50,
    height: 50,
    backgroundColor: "#633BBC",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    fontSize: 25,
  },
});
