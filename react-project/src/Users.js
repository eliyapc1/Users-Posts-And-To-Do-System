import React, { Component } from "react";
import { getAllUsers, searchUser, getUserTodos } from "./Utils";
import User from "./User";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [], keyword: "", usersFound: [], clickedId: null };
  }

  async componentDidMount() {
    const users = await getAllUsers();
    this.setState({ users });
  }
  // Using callback prop in order to retrieve updated users from children
  // and re-render it (in case of update and delete).
  getUpdatedUsersFromChild = (users) => {
    this.setState({ users });
  };

  // Drills 2 comps: App --> Users --> User
  getClickedIdFromChild = (clickedId) => {
    this.props.sendClickedIdToApp(clickedId);
    this.setState({ clickedId });
  };

  lookForUser = (e) => {
    const { value: keyword } = e.target;
    const usersFound = searchUser(keyword);
    this.setState({ usersFound, keyword });
  };

  setUserBorderAndBgColor = (id) => {
    let backgroundColor = { backgroundColor: "" };
    let borderColor = { borderColor: "#9e2020" };
    let fontColor = { color: "" };
    const completedArr = getUserTodos(id).filter((todo) => !todo.completed);
    // Assign two variables at once. x = y = 1
    if (!completedArr.length) borderColor = { borderColor: "#3daa27" };
    if (id === this.state.clickedId && this.props.isTodosAndPostsOpen) {
      backgroundColor = { backgroundColor: "#edbf0e" };
      fontColor = { color: "black" };
    }
    return [borderColor, backgroundColor, fontColor];
  };

  forceRenderUsers = async () => {
    const users = await getAllUsers();
    this.setState({ users });
  };

  componentDidUpdate() {
    if (this.props.renderIfNewUser) {
      this.forceRenderUsers();
      this.props.stopRender();
    }
  }

  render() {
    // prettier-ignore
    const users = !this.state.keyword ? this.state.users: this.state.usersFound;
    const usersRe = users.map((user, index) => {
      const [borderColor, backgroundColor, fontColor] =
        this.setUserBorderAndBgColor(user.id);
      return (
        <User
          key={user.id}
          user={user}
          updateCallback={this.getUpdatedUsersFromChild}
          sendClickedIdToUsers={this.getClickedIdFromChild}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          fontColor={fontColor}
        />
      );
    });
    return (
      <div id="users-comp">
        <div id="search-container">
          <span>Search: </span>
          <input type="text" onChange={this.lookForUser} />
          <button
            name="add-user-btn"
            onClick={(e) => this.props.addUserClicked(e)}
          >
            Add New User
          </button>
        </div>
        {usersRe}
        <div id="footer"></div>
      </div>
    );
  }
}

export default Users;
