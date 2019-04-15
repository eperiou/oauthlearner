import React, { Component } from "react";

class Private extends Component {
  state = {
    message: ""
  };
  componentDidMount() {
    fetch("/private", {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("res was not ok");
      })
      .then(res => this.setState({ message: res.message }))
      .catch(res => this.setState({ message: res.Error }));
  }
  render() {
    return <div>{this.state.message}</div>;
  }
}

export default Private;
