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
import CustomButton from './Button';
import Todo from './Todo';

interface TodoItem {
  id: number;
  text: string;
  isToggled: boolean;
}

const TodoList: React.FC = () => {
  
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currectId, setCurrentId] = useState(0); 
  const [currentText, setCurrentText] = useState('');

  const db = SQLite.openDatabase('todos.db');

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, isToggled INTEGER);'
      )
    })
  };

  useEffect(() => {
   createTable();    
  }, []);

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

const handleCancelEdit = () => {
  setNewTodo('');
  setIsEditing(false);
}

const handleSaveUpdate = async () => {
  console.log('id : ', currectId);
  console.log('text : ', currentText);
    let allTodos: TodoItem[] = [];
   db.transaction((tx) => {
    tx.executeSql('UPDATE todos SET text = ? WHERE id = ?', [currentText,currectId], (tx, result) => {
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
  setCurrentId(0); 
  setCurrentText(""); 
    setNewTodo('');
    setIsEditing(false);
  };

  const handleEditTodo = (index: number, text: string) => {
    setCurrentId(index); 
    setCurrentText(text); 
    console.log('edit id : ', currectId);
    console.log('edit text : ', currentText);
    setIsEditing(true);
  };

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
    setNewTodo('');
  }, [newTodo]);

  const handleToggleTodo = useCallback(async (index: number, isToggled: boolean) => {
    let allTodos: TodoItem[] = [];
    db.transaction((tx) => {
      tx.executeSql('UPDATE todos SET isToggled = ? WHERE id = ?', [isToggled == true ? 0 : 1,index], (tx, result) => {
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
  }, []);

  const handleDeleteTodo = useCallback(async (index: number) => {
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
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.newTodoContainer}>
      {isEditing ?<TextInput
          style={styles.newTodoInput} 
          value={currentText}
          onChangeText={(newText) => {
            console.log('newText : ', newText);
            setCurrentText(newText)}}
          // onChangeText={setCurrentText}
        /> : <TextInput
        style={styles.newTodoInput}
        value={newTodo}
        onChangeText={setNewTodo}
      />}
        {isEditing ? <View style={styles.editCancelButton}>    
        <CustomButton title='Cancel' style={styles.cancelButton} onPress={handleCancelEdit}/>
        <CustomButton title='Save' style={styles.SaveButton} onPress={handleSaveUpdate}/>
        </View> : <Button title="Create" onPress={handleCreateTodo} />}
      </View>

      <View style={styles.todosContainer}>
        {todos.map((todo, index) => (
          <TouchableOpacity
          style={styles.todo}
            key={String(index)}
          >
            <Todo
              key={String(index)}
              text={todo.text}
              isToggled={todo.isToggled}
            />
            <View style={styles.iconsCont}>
            <CheckBox
            checked={todo.isToggled}
            onPress={() => handleToggleTodo(todo.id, todo.isToggled)}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            checkedColor="green"
            />
            <FontAwesome
              name="edit"
              size={24}
              color="blue"
              style={{marginRight: 10}}
              onPress={() => handleEditTodo(todo.id, todo.text)}
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
  editCancelButton: { 
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: "red",
    width: '48%',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  SaveButton: {
    backgroundColor: "#009688",
    marginLeft: 10,
    width: '48%',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  iconsCont : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxContainer: {
    padding: 0, 
    margin: 0,
  },

  checkboxText: {
    marginRight: 0,
  },

  newTodoContainer: {
    marginTop: 30,
    marginBottom: 10,
  },

  newTodoInput: {
    height: 48,
    marginBottom: 10,
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