import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Todo from './Todo';

interface TodoItem {
  text: string;
  isToggled: boolean;
}

const TodoList: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const handleCreateTodo = useCallback(async () => {
    setTodos(current => [...current, { text: newTodo, isToggled: false }]);

    setNewTodo('');
  }, [newTodo]);

  const handleToggleTodo = useCallback(async (index: number) => {
    setTodos(current =>
      current.map((todo, i) => {
        return index === i ? { ...todo, isToggled: !todo.isToggled } : todo;
      }),
    );
  }, []);

  const handleDeleteTodo = useCallback(async (index: number) => {
    setTodos(current => current.filter((_, i) => i !== index));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.newTodoContainer}>
        <TextInput
          style={styles.newTodoInput}
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <Button title="Create" onPress={handleCreateTodo} />
      </View>

      <View style={styles.todosContainer}>
        {todos.map((todo, index) => (
          <TouchableOpacity
          style={styles.todo}
            key={String(index)}
            onPress={() => handleToggleTodo(index)}
          >
            <Todo
              key={String(index)}
              text={todo.text}
              isToggled={todo.isToggled}
            />
            <FontAwesome name="trash" size={24} color="red" onPress={() => handleDeleteTodo(index)}/>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },

  newTodoContainer: {
    marginTop: 80,
    marginBottom: 10,
  },

  newTodoInput: {
    height: 48,
    marginBottom: 20,

    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#aaa',

    paddingHorizontal: 16,

    fontSize: 20,
  },
  todo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  todosContainer: {
    flex: 1,
  },
});