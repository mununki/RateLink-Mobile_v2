import React from "react";
import { View, Text, Button, TextInput, Subtitle, Spinner } from "@shoutem/ui";

class SignUpPresenter extends React.Component {
  render() {
    const { isSignup } = this.props;
    return (
      <View styleName="flexible vertical v-start" style={{ backgroundColor: "#eee" }}>
        <View styleName="md-gutter">
          <TextInput
            keyboardType="email-address"
            autoFocus={true}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect={false}
            styleName="sm-gutter"
            placeholder="Email"
            onChangeText={text => this.props.handleChange(text, "email")}
          />
          <TextInput
            secureTextEntry={true}
            styleName="sm-gutter"
            placeholder="Password"
            onChangeText={text => this.props.handleChange(text, "password")}
          />
          <TextInput
            secureTextEntry={true}
            styleName="sm-gutter"
            placeholder="Password Confirm"
            onChangeText={text => this.props.handleChange(text, "passwordConfirm")}
          />
          <TextInput
            styleName="sm-gutter"
            placeholder="Full Name"
            onChangeText={text => this.props.handleChange(text, "nickname")}
          />
        </View>
        <Button styleName="action sm-gutter secondary" onPress={() => this.props.handleSubmit()}>
          {isSignup ? <Spinner style={{ marginTop: 10, marginBottom: 10 }} /> : <Text>SIGN UP</Text>}
        </Button>
      </View>
    );
  }
}

export default SignUpPresenter;
