import React from "react";
import LogInPresenter from "./LoginPresenter";
import { withApollo } from "react-apollo";
import { LOGIN } from "./LoginQueries";
import {
  saveTokenToAsyncStorage,
  removeTokenFromAsyncStorage
} from "../../../utils/handleAsyncStorage";

class LogInContainer extends React.Component {
  state = {
    email: "",
    password: ""
  };
  _handleChange = (text, target) => {
    this.setState({
      [target]: text
    });
  };
  _handleSubmit = async () => {
    const { email, password } = this.state;
    let res;
    try {
      res = await this.props.client.mutate({
        mutation: LOGIN,
        variables: {
          email,
          password
        }
      });
    } catch (err) {
      console.log(err);
    }
    if (res && res.data.login.ok) {
      await saveTokenToAsyncStorage(res.data.login.data.token);
      this.props.navigation.navigate("App");
    } else {
      alert("Email과 비밀번호를 확인하세요");
    }
  };

  render() {
    return (
      <LogInPresenter
        handleChange={this._handleChange}
        handleSubmit={this._handleSubmit}
        logOut={this._logOut}
      />
    );
  }
}

export default withApollo(LogInContainer);
