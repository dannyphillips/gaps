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
      pendingItem: "",
      data: {
        todo: [],
        completed: [],
        archived: []
      },
      view: "todo"
    };
    this.addItem = this.addItem.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
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
      this.setState({ data: { todo, completed, archived } });
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
    if (!this.state.pendingItem) return;
    this.setState({ addingItem: true });
    await firestore.collection(COLLECTION_NAME).add({
      content: this.state.pendingItem,
      completed: false,
      archived: false,
      createdAt: new Date().toISOString()
    });
    this.setState({ addingItem: false, pendingItem: "" });
  }

  toggleView(view) {
    this.setState({ view: view });
  }

  render() {
    const cb = {
      complete: this.toggleComplete,
      archive: this.toggleArchive,
      delete: this.deleteItem
    };
    return (
      <Layout className="App">
        <Header className="App-header">
          <img src="logo.png" className="App-logo" alt="logo" />
          <h1>Gaps</h1>
        </Header>
        <Button.Group>
          <Button onClick={() => this.toggleView("todo")}>Todo</Button>
          <Button onClick={() => this.toggleView("completed")}>
            Completed
          </Button>
          <Button onClick={() => this.toggleView("archived")}>Archived</Button>
        </Button.Group>
        <Content className="App-content">
          <Input
            ref="add-todo-input"
            className="App-add-todo-input"
            size="large"
            placeholder="What don't you know?"
            disabled={this.state.addingItem}
            onChange={evt => this.setState({ pendingItem: evt.target.value })}
            value={this.state.pendingItem}
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
          {this.state.view === "todo" && (
            <List
              title="Todo"
              type="todo"
              items={this.state.data.todo}
              cb={cb}
            />
          )}
          {this.state.view === "completed" && (
            <List
              title="Completed"
              type="completed"
              items={this.state.data.completed}
              cb={cb}
            />
          )}
          {this.state.view === "archived" && (
            <List
              title="Archived"
              type="archived"
              items={this.state.data.archived}
              cb={cb}
            />
          )}
        </Content>
        <Footer className="App-footer">&copy; Danny Phillips. 2019</Footer>
      </Layout>
    );
  }
}

export default App;
