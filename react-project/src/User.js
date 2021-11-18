import React, { Component } from "react";
import { updateUsers, deleteUser, validInput } from "./Utils";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      todos: [],
      posts: [],
      displayOtherData: { display: "none" },
    };
  }

  validAndUpdate = () => {
    const { user } = this.state;
    const [check, validUser] = validInput(user);
    this.setState({ user: validUser });
    console.log(validUser);
    if (check) {
      const updatedUsers = updateUsers(this.state.user.id, this.state.user);
      this.props.updateCallback(updatedUsers);
    }
  };

  deleteUser = () => {
    const updatedUsersAfterDelete = deleteUser(this.state.user.id);
    this.props.updateCallback(updatedUsersAfterDelete);
  };

  render() {
    return (
      <div id="user-container" style={this.props.borderColor}>
        <table style={this.props.backgroundColor}>
          <tbody>
            <tr>
              <td>
                <span
                  id="id-click"
                  style={this.props.fontColor}
                  onClick={() => {
                    this.props.sendClickedIdToUsers(this.state.user.id);
                  }}
                >
                  ID: {this.state.user.id}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span style={this.props.fontColor}>Name: </span>
              </td>
              <td>
                <input
                  name="name"
                  type="text"
                  value={this.state.user.name}
                  onClick={(e) => {
                    if (e.target.value === "Required field") {
                      const { user } = this.state;
                      user.name = "";
                      this.setState({ user });
                    }
                  }}
                  onChange={(e) => {
                    const { user } = this.state;
                    user.name = e.target.value;
                    this.setState({ user });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <span style={this.props.fontColor}>Email: </span>
              </td>
              <td>
                <input
                  name="email"
                  type="text"
                  value={this.state.user.email}
                  onClick={(e) => {
                    if (e.target.value === "Required field") {
                      const { user } = this.state;
                      user.email = "";
                      this.setState({ user });
                    }
                  }}
                  onChange={(e) => {
                    const { user } = this.state;
                    user.email = e.target.value;
                    this.setState({ user });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <button
                  id="other-data-btn"
                  onClick={() =>
                    this.setState({ displayOtherData: { display: "none" } })
                  }
                  onMouseOver={() =>
                    this.setState({ displayOtherData: { display: "" } })
                  }
                >
                  Other Data
                </button>
              </td>
              <td></td>
            </tr>
            <tr style={this.state.displayOtherData}>
              <td style={{ width: "fit-content" }}>
                <span style={this.props.fontColor}>Street: </span>
              </td>
              <td>
                <input
                  name="street"
                  type="text"
                  value={this.state.user.address.street}
                  onClick={(e) => {
                    if (e.target.value === "Required field") {
                      const { user } = this.state;
                      user.address.street = "";
                      this.setState({ user });
                    }
                  }}
                  onChange={(e) => {
                    const { user } = this.state;
                    user.address.street = e.target.value;
                    this.setState({ user });
                  }}
                />
              </td>
            </tr>
            <tr style={this.state.displayOtherData}>
              <td>
                <span style={this.props.fontColor}>City: </span>
              </td>
              <td>
                <input
                  name="city"
                  type="text"
                  value={this.state.user.address.city}
                  onClick={(e) => {
                    if (e.target.value === "Required field") {
                      const { user } = this.state;
                      user.address.city = "";
                      this.setState({ user });
                    }
                  }}
                  onChange={(e) => {
                    const { user } = this.state;
                    user.address.city = e.target.value;
                    this.setState({ user });
                  }}
                />
              </td>
            </tr>
            <tr style={this.state.displayOtherData}>
              <td>
                <span style={this.props.fontColor}>Zip-Code: </span>
              </td>
              <td>
                <input
                  name="zipcode"
                  type="text"
                  value={this.state.user.address.zipcode}
                  onChange={(e) => {
                    const { user } = this.state;
                    user.address.zipcode = e.target.value;
                    this.setState({ user });
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div id="btn-div">
          <button onClick={this.validAndUpdate}>Update</button>
          <button style={{ marginLeft: "10px" }} onClick={this.deleteUser}>
            Delete
          </button>
        </div>
      </div>
    );
  }
}

export default User;
