import React from "react";
import { Input } from "antd";

const EditItem = ({ value, onChange, onSubmit }) => (
  <div>
    <Input value={value} onChange={onChange} onPressEnter={onSubmit} />
  </div>
);

export default EditItem;
