import React, { Component } from "react";
import { Layout, Input, Button } from "antd";

// We import our firestore module
import firestore from "./firestore";
import List from "./List";

import "./App.css";

const { Header, Footer, Content } = Layout;

const COLLECTION_NAME = "gaps";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingItem: false,
      newItem: "",
      editingItem: false,
      editItem: "",
      data: {
        todo: [],
        completed: [],
        archived: []
      }
    };
    this.addItem = this.addItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleArchive = this.toggleArchive.bind(this);
    firestore.collection(COLLECTION_NAME).onSnapshot(snapshot => {
      let todo = [];
      let archived = [];
      let completed = [];
      snapshot.forEach(doc => {
        const item = doc.data();
        item.id = doc.id;
        if (item.archived) archived.push(item);
        else if (item.completed) completed.push(item);
        else todo.push(item);
      });
      todo.sort(function(a, b) {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      archived.sort(function(a, b) {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      completed.sort(function(a, b) {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      this.setState({ data: {todo, completed, archived }});
    });
  }

  async toggleComplete(item) {
    await firestore
      .collection(COLLECTION_NAME)
      .doc(item.id)
      .update({
        completed: !item.completed,
        completedAt: new Date().toISOString()
      });
  }

  async updateItem(item) {
    // if (!this.state.editingItem) return;
    debugger;
    this.setState({ editingItem: true });
    await firestore
      .collection(COLLECTION_NAME)
      .doc(item.id)
      .update({
        content: item,
        updatedAt: new Date().toISOString()
      });
    this.setState({ editingItem: false, editItem: "" });
  }
  async toggleArchive(item) {
    await firestore
      .collection(COLLECTION_NAME)
      .doc(item.id)
      .update({
        archived: !item.archived,
        archivedAt: new Date().toISOString()
      });
  }
  async deleteItem(item) {
    await firestore
      .collection(COLLECTION_NAME)
      .doc(item.id)
      .delete();
  }

  async addItem() {
    if (!this.state.newItem) return;
    this.setState({ addingItem: true });
    await firestore.collection(COLLECTION_NAME).add({
      content: this.state.newItem,
      completed: false,
      archived: false,
      createdAt: new Date().toISOString()
    });
    this.setState({ addingItem: false, newItem: "" });
  }

  render() {
    const cb = {
      complete: this.toggleComplete,
      archive: this.toggleArchive,
      update: this.updateItem,
      delete: this.deleteItem
    };
    return (
      <Layout className="App">
        <Header className="App-header">
          <h1>Gaps</h1>
        </Header>
        <Content className="App-content">
          <Input
            ref="add-todo-input"
            className="App-add-todo-input"
            size="large"
            placeholder="What don't you know?"
            disabled={this.state.addingItem}
            onChange={evt => this.setState({ newItem: evt.target.value })}
            value={this.state.newItem}
            onPressEnter={this.addItem}
            required
          />
          <Button
            className="App-add-todo-button"
            size="large"
            type="primary"
            onClick={this.addItem}
            loading={this.state.addingItem}
          >
            Add Item
          </Button>
          <br />
          <br />
          <List title="Todo" type="todo" items={this.state.data.todo} cb={cb} />
          <List
            title="Completed"
            type="completed"
            items={this.state.data.completed}
            cb={cb}
          />
          <List
            title="Archived"
            type="archived"
            items={this.state.data.archived}
            cb={cb}
          />
        </Content>
        <Footer className="App-footer">&copy; Danny Phillips. 2019</Footer>
      </Layout>
    );
  }
}

export default App;
