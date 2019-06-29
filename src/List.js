import React from "react";
import { List, Icon } from "antd";
import EditItem from './EditItem'

const actions = {
  todo: ['update','complete','archive'],
  completed: ['update','complete', 'archive'],
  archived: ['update','archive', 'delete']
}
const iconMap = {
  archive: 'inbox',
  complete: 'check',
  delete: 'close-circle',
  update: 'edit',
}
const GapList = ({ title, items, type, cb }) => (
  <div>
    {title}
    <List
      className="List"
      size="large"
      bordered
      dataSource={items}
      renderItem={item => (
        <List.Item className="List-item">
          <EditItem value={item.content} onChange={()=>{}} onSubmit={cb.update}/>
          {/* {item.content} */}
          <div>
            {actions[type].map((action) => {
              return <Icon
                key={action}
                onClick={evt => cb[action](item)}
                className="List-item-icon"
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
