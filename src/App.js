import React, { useReducer } from 'react';
import { 
  List, Button, 
  Input, Space 
} from 'antd';
import { 
  BookOutlined, EditOutlined, 
  DeleteOutlined, CloseOutlined,
} from '@ant-design/icons';
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
