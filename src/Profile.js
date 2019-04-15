import React, { Component } from "react";

class Profile extends Component {
  state = {
    profile: null,
    error: ""
  };
  componentDidMount() {
    this.loadUserProfile();
  }
  loadUserProfile() {
    this.props.auth.getProfile((profile, error) =>
      this.setState({ profile, error })
    );
  }
  render() {
    const { profile } = this.state;
    if (!profile) return null;
    return (
      <>
        <h1> profile page</h1>
        <p>{profile.nickname}</p>
        <img
          style={{ maxwidth: 30, maxHeight: 30 }}
          src={profile.picture}
          alt="profilepic"
        />
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </>
    );
  }
}

export default Profile;
