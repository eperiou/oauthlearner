import React, { Component } from "react";

class Callback extends Component {
  componentDidMount() {
    console.log(this.props.location.hash);
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error("invalid callback url");
    }
  }
  render() {
    return <h1>loading</h1>;
  }
}

export default Callback;
