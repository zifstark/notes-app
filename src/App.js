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
      text: 'text of the note a'
    },
    {
      id: uuid(),
      title: 'note b',
      text: 'text of the note b'
    },
    {
      id: uuid(),
      title: 'note c',
      text: 'text of the note c'
    },
    {
      id: uuid(),
      title: 'note d',
      text: 'text of the note d'
    },
  ]
}

function reducer(state, action) {
  switch(action.type) {
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function renderItem(item) {
    return(
      <List.Item
        key={item.id}
        actions={[
          <Button type="dashed" shape="circle" icon={<EditOutlined />} />,
          <Button type="danger" shape="circle" icon={<DeleteOutlined />} />,
        ]}
      >
        <List.Item.Meta 
          avatar={<BookOutlined/>}
          title={item.title}
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
