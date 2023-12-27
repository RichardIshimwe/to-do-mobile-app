import React, { useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SQLite from 'expo-sqlite';
import Todo from './Todo';

interface TodoItem {
  id: number;
  text: string;
  isToggled: boolean;
}

const TodoList: React.FC = () => {
  
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todosList, setTodosList] = useState<TodoItem[]>([]);

  const db = SQLite.openDatabase('todos.db');

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, isToggled INTEGER);'
      )
    })
  }

  // const getAllTodos = async () => {
  //   let allTodos: TodoItem[] = [];
  //   db.transaction(async (tx) => {
  //    tx.executeSql('SELECT * FROM todos', [], (tx, results) => {
  //       let len = results.rows.length;
  //       for(let i = 0; i < len; i++){
  //         let row = results.rows.item(i);
  //         let finalRow = {id: row.id, text: row.text, isToggled: row.isToggled == 1 ? true : false};
  //         allTodos.push(finalRow);
  //       }
  
  //     })
  //    });
  //    setTodosList(allTodos);
  // }

  useEffect(() => {

    const handleCreateTodo = async () => {
      let allTodos: TodoItem[] = [];
     db.transaction((tx) => {
      tx.executeSql('SELECT * FROM todos', [], (tx, results) => {
        let len = results.rows.length;
        for(let i = 0; i < len; i++){
          let row = results.rows.item(i);
          let finalRow = {id: row.id, text: row.text, isToggled: row.isToggled == 1 ? true : false};
          allTodos.push(finalRow); 
        }
        setTodos(allTodos);
      })
     });
      setNewTodo('');
    };
    handleCreateTodo();
    
  }, [])

  // useEffect(() => {
  //   createTable();
  //   getAllTodos();
  // }, []);

  // useEffect(() => {
  //   getAllTodos();
  // }, [newTodo]);

  const handleCreateTodo = useCallback(async () => {
    let allTodos: TodoItem[] = [];
   db.transaction((tx) => {
    tx.executeSql('INSERT INTO todos (text, isToggled) VALUES (?, ?)', [newTodo, 0], (tx, results) => {
    });
    tx.executeSql('SELECT * FROM todos', [], (tx, results) => {
      let len = results.rows.length;
      for(let i = 0; i < len; i++){
        let row = results.rows.item(i);
        let finalRow = {id: row.id, text: row.text, isToggled: row.isToggled == 1 ? true : false};
        allTodos.push(finalRow); 
      }
      setTodos(allTodos);
    })
   });
    // setTodos(current => [...current, { text: newTodo, isToggled: false }]);
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
    console.log("The id is : ", index);
    let allTodos: TodoItem[] = [];
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM todos WHERE id = ? ', [index], (tx, result) => {
      })
      tx.executeSql('SELECT * FROM todos', [], (tx, results) => {
        let len = results.rows.length;
        for(let i = 0; i < len; i++){
          let row = results.rows.item(i);
          let finalRow = {id: row.id, text: row.text, isToggled: row.isToggled == 1 ? true : false};
          allTodos.push(finalRow); 
        }
        setTodos(allTodos);
      })
     });
    // setTodos(current => current.filter((_, i) => i !== index));
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
            // onPress={() => handleToggleTodo(index)}
          >
            <Todo
              key={String(index)}
              text={todo.text}
              isToggled={todo.isToggled}
            />
            <View style={styles.iconsCont}>
            <CheckBox
            checked={todo.isToggled}
            onPress={() => handleToggleTodo(index)}
            />
            <FontAwesome name="trash" size={24} color="red" onPress={() => handleDeleteTodo(todo.id)}/>
            </View>
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
    padding: 10,
  },

  iconsCont : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  newTodoContainer: {
    marginTop: 30,
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
    // marginBottom: 5,
  },
  todosContainer: {
    flex: 1,
  },
});