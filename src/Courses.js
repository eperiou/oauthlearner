import React, { Component } from "react";

class Courses extends Component {
  state = {
    courses: []
  };
  componentDidMount() {
    fetch("/courses", {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("res was not ok");
      })
      .then(res => this.setState({ courses: res.courses }))
      .catch(res => this.setState({ courses: res.Error }));

    fetch("/admin", {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("res was not ok");
      })
      .then(console.log)
      .catch(res => this.setState({ courses: res.Error }));
  }
  render() {
    return (
      <ul>
        {this.state.courses.map(course => (
          <li key={course.id}>{course.title} </li>
        ))}
      </ul>
    );
  }
}

export default Courses;
