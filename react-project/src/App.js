import React, { Component } from "react";
import Users from "./Users";
import Todo from "./Todo";
import Post from "./Post";
import {
  getUserTodos,
  getUserPosts,
  addTodo,
  addPost,
  addUser,
  validInput,
} from "./Utils";
let count = 1;
let count2 = 1;
let ids = [0, 0];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      posts: [],
      clickedId: null,
      ids: [0, 0],
      isTodosAndPostsOpen: false,
      transforms: [
        // todos-posts-window
        { transform: "scale(0)" },
        // todos-content
        { transform: "scale(1)" },
        // add-todo-window
        { transform: "scale(0)" },
        // posts-content
        { transform: "scale(1)" },
        // add-post-window
        { transform: "scale(0)" },
        // add-user-window
        { transform: "scale(0)" },
      ],
      isNewUser: false,
      fieldVal: "",
      // reqFieldDisplay: { display: "none" },
    };
  }

  getClickedIdFromUsersComp = async (clickedId) => {
    let { transforms, isTodosAndPostsOpen } = this.state;
    transforms[0] = { transform: "scale(1)" };
    isTodosAndPostsOpen = true;
    // Remembers the last two clicked ids.
    ids.push(clickedId);
    ids.shift();
    // In case of multiply clicks on the same id, open and close
    // todos & post window alternately, when count2 is an odd number.
    count2++;
    // Resets count2 to an odd number on a different id click.
    if (ids[0] !== ids[1]) count2 = 1;
    else if (count2 % 2 === 0) {
      transforms[0] = { transform: "scale(0)" };
      isTodosAndPostsOpen = false;
    }
    // In case the add-new-user" window has already been displayed,
    // shuts "Add New User" window and open todos & posts window.
    if (transforms[5].transform === "scale(1)") {
      transforms[5] = { transform: "scale(0)" };
      transforms[0] = { transform: "scale(1)" };
      isTodosAndPostsOpen = true;
      // resets count
      count2 = 1;
    }

    this.setState({
      todos: getUserTodos(clickedId),
      posts: getUserPosts(clickedId),
      transforms,
      clickedId,
      isTodosAndPostsOpen,
    });
  };

  addNewTodo = (e) => {
    const { clickedId, todoTitle } = this.state;
    if (!todoTitle) {
      this.setState({ todoTitle: "Required field" });
    } else if (todoTitle && todoTitle !== "Required field") {
      this.manageTransforms(e);
      addTodo(clickedId, todoTitle);
      this.setState({ todos: getUserTodos(clickedId) });
    }
  };

  addNewPost = (e) => {
    const { clickedId, postTitle, postBody } = this.state;
    const post = {
      title: postTitle,
      body: postBody,
    };
    const [check, validPost] = validInput(post);
    // this.setState({ user: validPost });
    if (check) {
      this.manageTransforms(e);
      addPost(clickedId, postTitle, postBody);
      this.setState({ posts: getUserPosts(clickedId) });
    } else {
      this.setState({
        postTitle: validPost.title,
        postBody: validPost.body,
      });
    }
  };

  addNewUser = (e) => {
    const { newUserName, newUserEmail } = this.state;
    const user = {
      name: newUserName,
      email: newUserEmail,
    };
    const [check, validPost] = validInput(user);

    if (check) {
      this.manageTransforms(e);
      addUser(newUserName, newUserEmail);
      this.setState({ isNewUser: true });
    } else {
      this.setState({
        newUserName: validPost.name,
        newUserEmail: validPost.email,
      });
    }
  };

  manageTransforms = (e) => {
    const { transforms } = this.state;
    const { name } = e.target;
    // Shuts Add-New-Todo window and displays all Todos content.
    if (name === "add-todo-btn" || name === "cancel-todo-btn") {
      [transforms[1], transforms[2]] = [transforms[2], transforms[1]];
      // Shuts Add-New-Post window and displays all Posts content.
    } else if (name === "add-post-btn" || name === "cancel-post-btn") {
      [transforms[3], transforms[4]] = [transforms[4], transforms[3]];
    } else if (name === "add-user-btn") {
      transforms[5] = { transform: "scale(1)" };
      count++;
      // Shuts Add-New-User window on every second click.
      if (count % 2 !== 0) transforms[5] = { transform: "scale(0)" };

      if (transforms[0].transform === "scale(1)") {
        // [displays[5], displays[0]] = [displays[0], displays[5]];
        transforms[0] = { transform: "scale(0)" };
        transforms[5] = { transform: "scale(1)" };
        this.setState({ isTodosAndPostsOpen: false });
        count = 0;
        count2 = 1;
      }
    }
    if (name === "cancel-user-btn" || name === "user-added-btn") {
      transforms[5] = { transform: "scale(0)" };
      count = 1;
    }
    this.setState({ transforms });
  };

  renderApp = () => {
    this.forceUpdate();
  };

  stopRender = () => {
    this.setState({ isNewUser: false });
  };

  render() {
    let todoCount = 0;
    const todos = this.state.todos.map((todo, index) => {
      todoCount++;
      return (
        <div key={todo.id}>
          <div id="todo-post-number">
            <span>{todoCount}</span>
          </div>
          <Todo todo={todo} renderApp={this.renderApp} />
        </div>
      );
    });

    let postCount = 0;
    const posts = this.state.posts.map((post, index) => {
      postCount++;
      return (
        <div key={post.id}>
          <div id="todo-post-number">
            <span>{postCount}</span>
          </div>
          <Post title={post.title} body={post.body} />
        </div>
      );
    });

    let usersComp = (
      <Users
        sendClickedIdToApp={this.getClickedIdFromUsersComp}
        addUserClicked={this.manageTransforms}
        isTodosAndPostsOpen={this.state.isTodosAndPostsOpen}
        // Forces Users-Comp to re-render when a new user has been added,
        // in order to update the page without refreshing it.
        // 'renderIfNewUser' is a flag. when true, it triggers a condition
        // on Users-Comp (locate on "componentDidUpdate"), and renders all users.
        // then invokes the "stopRender" callback which sets 'isNewUser'
        // state variable of App-Comp to false.
        renderIfNewUser={this.state.isNewUser}
        stopRender={this.stopRender}
      />
    );

    const displayTodosPostsWin = this.state.transforms[0];
    const displayTodosContent = this.state.transforms[1];
    const displayAddTodo = this.state.transforms[2];
    const displayPostsContent = this.state.transforms[3];
    const displayAddPost = this.state.transforms[4];
    const displayAddNewUser = this.state.transforms[5];

    return (
      <div id="app-container">
        {usersComp}
        <div id="todos-posts-window" style={displayTodosPostsWin}>
          <div id="todos-container">
            <div className="todo-post-title" id="todo-header">
              <span>Todos - User {this.state.clickedId}</span>
              <button
                name="add-todo-btn"
                onClick={this.manageTransforms}
                style={{ float: "right" }}
              >
                Add New Todo
              </button>
            </div>

            <div
              className="add-todo-post-user-win"
              id="add-todo-window"
              style={displayAddTodo}
            >
              <table>
                <tbody>
                  <tr>
                    <td>
                      <span>Title: </span>
                    </td>
                    <td>
                      <input
                        value={this.state.todoTitle}
                        onClick={(e) => {
                          if (e.target.value === "Required field") {
                            this.setState({ todoTitle: "" });
                          }
                        }}
                        onChange={(e) =>
                          this.setState({
                            todoTitle: e.target.value,
                          })
                        }
                        type="text"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div>
                <button
                  name="add-todo-btn"
                  onClick={(e) => {
                    this.addNewTodo(e);
                  }}
                >
                  Add
                </button>
                <button
                  name="cancel-todo-btn"
                  onClick={(e) => {
                    this.manageTransforms(e);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            <div id="todos-content" style={displayTodosContent}>
              {todos}
            </div>
          </div>

          <div id="posts-container">
            <div className="todo-post-title" id="posts-header">
              <span>Posts - User {this.state.clickedId}</span>
              <button
                name="add-post-btn"
                onClick={this.manageTransforms}
                style={{ float: "right" }}
              >
                Add New Post
              </button>
            </div>

            <div
              className="add-todo-post-user-win"
              id="add-post-window"
              style={displayAddPost}
            >
              <table style={{ backgroundColor: "#FAEBD7" }}>
                <tbody>
                  <tr>
                    <td>
                      <span>Title: </span>
                    </td>
                    <td>
                      <input
                        style={{ backgroundColor: "#F0F8FF" }}
                        value={this.state.postTitle}
                        onClick={(e) => {
                          if (e.target.value === "Required field") {
                            this.setState({ postTitle: "" });
                          }
                        }}
                        onChange={(e) =>
                          this.setState({
                            postTitle: e.target.value,
                          })
                        }
                        type="text"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Body: </span>
                    </td>
                    <td>
                      <input
                        style={{ backgroundColor: "#F0F8FF" }}
                        value={this.state.postBody}
                        onClick={(e) => {
                          if (e.target.value === "Required field") {
                            this.setState({ postBody: "" });
                          }
                        }}
                        onChange={(e) =>
                          this.setState({
                            postBody: e.target.value,
                          })
                        }
                        type="text"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div>
                <button
                  name="add-post-btn"
                  onClick={(e) => {
                    this.addNewPost(e);
                  }}
                >
                  Add
                </button>
                <button
                  name="cancel-post-btn"
                  onClick={(e) => {
                    this.manageTransforms(e);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            <div id="posts-content" style={displayPostsContent}>
              {posts}
            </div>
          </div>
        </div>

        <div
          className="add-todo-post-user-win"
          style={displayAddNewUser}
          id="add-user-window"
        >
          <table>
            <tbody>
              <tr>
                <td>
                  <span>Name: </span>
                </td>
                <td>
                  <input
                    value={this.state.newUserName}
                    onClick={(e) => {
                      if (e.target.value === "Required field") {
                        this.setState({ newUserName: "" });
                      }
                    }}
                    onChange={(e) =>
                      this.setState({
                        newUserName: e.target.value,
                      })
                    }
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span>Email: </span>
                </td>
                <td>
                  <input
                    value={this.state.newUserEmail}
                    onClick={(e) => {
                      if (e.target.value === "Required field") {
                        this.setState({ newUserEmail: "" });
                      }
                    }}
                    onChange={(e) =>
                      this.setState({
                        newUserEmail: e.target.value,
                      })
                    }
                    type="text"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div>
            <button
              name="user-added-btn"
              onClick={(e) => {
                this.addNewUser(e);
              }}
            >
              Add
            </button>
            <button
              name="cancel-user-btn"
              onClick={(e) => {
                this.manageTransforms(e);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
