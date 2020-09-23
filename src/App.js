import React, { useReducer, useEffect } from 'react';
import { 
  List, Button, 
  Input, Space 
} from 'antd';
import { 
  BookOutlined, EditOutlined, 
  DeleteOutlined, CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { v4 as uuid } from 'uuid';
import './App.css';

const initialState = {
  notes: [],
  newNote: {
    tile: '',
    text: '',
  }
}

function reducer(state, action) {
  switch(action.type) {
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.notes
      }
    case 'CLEAR_FORM':
      return {
        ...state,
        newNote: {
          title: '',
          text: '',
        }
      }
    case 'INPUT_CHANGE':
      return {
        ...state,
        newNote: {
          ...state.newNote,
          [action.name]: action.value,
        }
      }
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, { id: uuid(), ...state.newNote}]
      }
    case 'ON_EDIT': {
      const { notes } = state;
      let noteIndex = notes.findIndex(n => n.id === action.id);
      return {
        ...state,
        notes: [
          ...notes.slice(0, noteIndex),
          {
            ...notes[noteIndex],
            ...action.data,
          },
          ...notes.slice(noteIndex + 1)
        ],
      }
    }
    case 'TOGGLE_EDIT_MODE': {
      const { notes } = state;
      let noteIndex = notes.findIndex(n => n.id === action.id);
      return {
        ...state,
        notes: [
          ...notes.slice(0, noteIndex),
          {
            ...notes[noteIndex],
            editMode: !notes[noteIndex].editMode,
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
  const { title, text } = state.newNote;

  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    dispatch({ type: 'SET_NOTES', notes });
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(state.notes));
  }, [state.notes])

  function deleteNote(item) {
    dispatch({type: 'DELETE_NOTE', id: item.id});
  }

  function toggleEditMode(item) {
    dispatch({ type: 'TOGGLE_EDIT_MODE', id: item.id });
  }

  function onEdit(item, e) {
    dispatch({ 
      type: 'ON_EDIT', 
      id: item.id, 
      data: { [e.target.name]: e.target.value }
    });
  }

  function onFormInputChange(e) {
    dispatch({ 
      type: 'INPUT_CHANGE', 
      name: e.target.name, 
      value: e.target.value 
    });
  }

  function addNote() {
    dispatch({ type: 'ADD_NOTE' });
    dispatch({ type: 'CLEAR_FORM' });
  }

  function renderEditForm(item) {
    return(
      <div>
        <Space direction="vertical">
          <Input name="title" onChange={e => onEdit(item, e)} value={item.title} />
          <Input name="text" onChange={e => onEdit(item, e)} value={item.text} />
        </Space>
      </div>
    )
  }

  function renderItemContent(item) {
    return [
      <List.Item.Meta 
        avatar={<BookOutlined/>}
        title={item.title}
        key={uuid()}
      />,
      item.text
    ]
  }

  function renderItem(item) {
    return(
      <List.Item
        key={item.id}
        actions={[
          <Button
            onClick={() => toggleEditMode(item)}
            type={item.editMode ? "ghost" : "dashed"} 
            shape="circle" 
            icon={item.editMode ? <CloseOutlined /> : <EditOutlined />} 
          />,
          <Button 
            onClick={() => deleteNote(item)}
            type="danger" 
            shape="circle" 
            icon={<DeleteOutlined />} 
          />,
        ]}
      >
        {item.editMode ? renderEditForm(item) : renderItemContent(item)}
      </List.Item>
    )
  }

  return (
    <div className="App">
      <form className="CreationForm">
        <Space>
          <Input 
            onChange={onFormInputChange} 
            name="title" 
            placeholder="Title"
            value={state.newNote.title}
          />
          <Input 
            onChange={onFormInputChange} 
            name="text" 
            placeholder="Text"
            value={state.newNote.text} 
          />
          <Button 
            onClick={addNote} 
            type="primary" 
            shape="circle" 
            icon={<PlusOutlined/>}
            disabled={!(title && text)}
          />
        </Space>
      </form>
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
