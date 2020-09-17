import React, { useReducer } from 'react';
import { List, Button } from 'antd';
import { BookOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { v4 as uuid } from 'uuid';
import './App.css';

const initialState = {
  notes: [
    {
      id: uuid(),
      title: 'note a',
      text: 'text of the note a',
      editMode: false,
    },
    {
      id: uuid(),
      title: 'note b',
      text: 'text of the note b',
      editMode: false,
    },
    {
      id: uuid(),
      title: 'note c',
      text: 'text of the note c',
      editMode: false,
    },
    {
      id: uuid(),
      title: 'note d',
      text: 'text of the note d',
      editMode: false,
    },
  ]
}

function reducer(state, action) {
  switch(action.type) {
    case 'EDIT_MODE': {
      const { notes } = state;
      let noteIndex = notes.findIndex(n => n.id === action.id);
      return {
        ...state,
        notes: [
          ...notes.slice(0, noteIndex),
          {
            ...notes[noteIndex],
            editMode: true,
          },
          ...notes.slice(noteIndex + 1)
        ],
      }
    }
    case 'DELETE_NOTE': {
      const notes = [...state.notes];
      const noteIndex = state.notes.findIndex(n => n.id === action.id);
      return {
        ...state,
        notes: [
          ...notes.slice(0, noteIndex),
          ...notes.slice(noteIndex + 1)
        ]
      }
    }
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function deleteNote(item) {
    dispatch({type: 'DELETE_NOTE', id: item.id});
  }

  function toggleEditMode(item) {
    dispatch({ type: 'EDIT_MODE', id: item.id });
  }

  function renderItem(item) {
    return(
      <List.Item
        key={item.id}
        actions={[
          <Button
            onClick={() => toggleEditMode(item)}
            type="dashed" 
            shape="circle" 
            icon={<EditOutlined />} 
          />,
          <Button 
            onClick={() => deleteNote(item)}
            type="danger" 
            shape="circle" 
            icon={<DeleteOutlined />} 
          />,
        ]}
      >
        <List.Item.Meta 
          avatar={<BookOutlined/>}
          title={item.editMode ? `${item.title}[EDIT MODE]`: item.title}
        />
        {item.text}
      </List.Item>
    )
  }

  return (
    <div className="App">
      <List
        itemLayout='horizontal'
        dataSource={state.notes}
        size="large"
        renderItem={renderItem}
      />
    </div>
  );
}

export default App;
