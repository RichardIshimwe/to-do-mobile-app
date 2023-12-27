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
      {/* <TextInput style={styles.todoText} value={text}/> */}
      <Text style={[styles.todoText, isToggled && styles.toggled]}>{text}</Text>
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  container: {
    width: '75%',
    // height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    // backgroundColor: 'black'
  },

  todoText: {
    fontSize: 24,
  },

  toggled: {
    textDecorationLine: 'line-through',
  },
});