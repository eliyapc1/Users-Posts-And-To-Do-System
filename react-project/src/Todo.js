import React, { Component } from "react";
import { updateUserTodo } from "./Utils";

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = { todo: [] };
  }

  componentDidMount() {
    this.setState({ todo: this.props.todo });
  }

  completeTodo = () => {
    const { todo } = this.state;
    todo.completed = true;
    this.setState({ todo });
    updateUserTodo(this.state.todo.id, todo);
    this.props.renderApp();
  };

  render() {
    // Display mark button.
    // let display = "none";
    let transform = "scale(0)"
    if (!this.state.todo.completed) {
      // display = "";
      transform = "scale(1)";
    }
    let completedColor = "#9E2020";
    if (this.state.todo.completed) {
      completedColor = "#3DAA27";
    }

    return (
      <div id="todo">
        <table>
          <tbody>
            <tr>
              <td style={{ width: "10px" }}>
                <span>Title:</span>
              </td>
              <td>{this.state.todo.title}</td>
            </tr>
            <tr>
              <td>
                <span>Completed: </span>
              </td>
              <td>
                <span id="completed-span" style={{ color: completedColor }}>
                  {this.state.todo.completed ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <button style={{ transform }} onClick={this.completeTodo}>
          Mark As Completed
        </button>
      </div>
    );
  }
}

export default Todo;
