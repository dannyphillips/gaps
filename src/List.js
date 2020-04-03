import React from "react";
import { List } from "antd";
import Icon from '@ant-design/icons'

const actions = {
  todo: ['complete','archive'],
  completed: ['complete', 'archive'],
  archived: ['archive', 'delete']
}
const iconMap = {
  complete: 'check',
  archive: 'inbox',
  delete: 'close-circle'
}
const GapList = ({ title, items, type, cb }) => (
  <div>
    {title}
    <List
      className="App-todos"
      size="large"
      bordered
      dataSource={items}
      renderItem={todo => (
        <List.Item className="App-todo">
          {todo.content}
          <div>
            {actions[type].map((action) => {
              return <Icon
                key={action}
                onClick={evt => cb[action](todo)}
                className="App-todo-icon"
                type={iconMap[action]}
              />;
            })}
          </div>
        </List.Item>
      )}
    />
  </div>
);

export default GapList;
