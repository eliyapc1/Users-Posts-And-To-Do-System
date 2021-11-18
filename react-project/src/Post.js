import React, { Component } from 'react';

class Post extends Component {
    render() {
        return (
            <div id="post">
                <table>
                    <tbody>
                        <tr>
                            <td><span>Title:</span></td>
                            <td>{this.props.title}</td>
                        </tr>
                        <tr>
                            <td><span>Body: </span></td>
                            <td>{this.props.body}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Post;