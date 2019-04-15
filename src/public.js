import React, { Component } from "react";

class Public extends Component {
  state = {
    message: ""
  };
  componentDidMount() {
    fetch("/public")
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("response was not ok");
      })
      .then(response => this.setState({ message: response.message }))
      .catch(response => this.setState({ message: response.Error }));
  }
  render() {
    return <div>{this.state.message}</div>;
  }
}

export default Public;
