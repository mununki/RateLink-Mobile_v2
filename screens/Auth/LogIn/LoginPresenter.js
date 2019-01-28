import React from "react";
import { View, Text, Button, TextInput } from "react-native";
import { withNavigation } from "react-navigation";

class LogInPresenter extends React.Component {
  render() {
    return (
      <View>
        <Text>LogIn Screen</Text>
        <TextInput
          placeholder="Email"
          onChangeText={text => this.props.handleChange(text, "email")}
        />
        <TextInput
          placeholder="Password"
          onChangeText={text => this.props.handleChange(text, "password")}
        />
        <Button title="로그인" onPress={() => this.props.handleSubmit()} />
        <Button
          title="회원가입"
          onPress={() => this.props.navigation.navigate("SignUp")}
        />
      </View>
    );
  }
}

export default withNavigation(LogInPresenter);
