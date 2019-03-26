import React from "react";
import { View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import { SIGNUP, CHECK_IF_EXIST } from "./SignUpQueries";
import SignUpPresenter from "./SignUpPresenter";
import { checkValidEmail, checkValidPassword } from "../../../utils/checkValidation";
import { withApollo } from "react-apollo";
import { saveTokenToAsyncStorage } from "../../../utils/handleAsyncStorage";

class SignUpContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "SIGN UP",
      headerStyle: {
        backgroundColor: "#6dbad8"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  state = {
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    isSignup: false
  };

  _checkIfExists = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { email } = this.state;
        const {
          data: { checkIfExist }
        } = await this.props.client.query({
          query: CHECK_IF_EXIST,
          variables: {
            email
          }
        });
        resolve(checkIfExist);
      } catch (e) {
        reject(e.message);
      }
    });
  };

  _handleChange = (text, target) => {
    this.setState({
      [target]: text
    });
  };

  _handleSubmit = async () => {
    this.setState({ isSignup: true });
    const { email, password, passwordConfirm, nickname } = this.state;

    const isExist = await this._checkIfExists();
    if (isExist) {
      alert("Already Signed up!");
      this.setState({ isSignup: false });
      return false;
    }

    const isEmailValid = checkValidEmail(email);
    if (!isEmailValid) {
      alert("Please check your e-mail again");
      this.setState({ isSignup: false });
      return false;
    }

    const isPasswordValid = checkValidPassword(password);
    if (!isPasswordValid) {
      alert("Password is required\nat least 6 characters\nlowercase, uppercase letter\nand number");
      this.setState({ isSignup: false });
      return false;
    }

    const isPasswordConfirmed = password === passwordConfirm;
    if (!isPasswordConfirmed) {
      alert("Please confirm the password");
      this.setState({ isSignup: false });
      return false;
    }

    let res;
    try {
      res = await this.props.client.mutate({
        mutation: SIGNUP,
        variables: {
          email,
          password,
          nickname
        }
      });
    } catch (err) {
      console.log(err);
    }

    if (res && res.data.signup.ok) {
      await saveTokenToAsyncStorage(res.data.signup.data.token);
      this.props.navigation.navigate("App");
    } else {
      alert("Please check required fields again");
      this.setState({ isSignup: false });
    }
  };

  render() {
    const { isSignup } = this.state;

    return <SignUpPresenter handleChange={this._handleChange} handleSubmit={this._handleSubmit} isSignup={isSignup} />;
  }
}

export default withApollo(withNavigation(SignUpContainer));
