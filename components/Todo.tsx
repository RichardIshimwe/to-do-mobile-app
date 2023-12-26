import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface TodoProps {
  text: string;
  isToggled: boolean;
}

const Todo: React.FC<TodoProps> = ({ text, isToggled }) => {
  return (
    <View style={styles.container}>
      {/* <TextInput style={styles.todoText}>{text}</TextInput> */}
      <Text style={[styles.todoText, isToggled && styles.toggled]}>{text}</Text>
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },

  todoText: {
    fontSize: 24,
  },

  toggled: {
    textDecorationLine: 'line-through',
  },
});