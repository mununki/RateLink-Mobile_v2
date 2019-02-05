import React from "react";
import { View, Text, Button, TextInput, Subtitle } from "@shoutem/ui";
import { withNavigation } from "react-navigation";

class LogInPresenter extends React.Component {
  render() {
    return (
      <View styleName="flexible vertical" style={{ backgroundColor: "#eee" }}>
        <View styleName="md-gutter" style={{ marginTop: 100 }}>
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
        </View>
        <Button
          styleName="action sm-gutter secondary"
          onPress={() => this.props.handleSubmit()}
        >
          <Text>로그인</Text>
        </Button>
        <Button
          styleName="action sm-gutter"
          onPress={() => this.props.navigation.navigate("SignUp")}
        >
          <Text>회원가입</Text>
        </Button>
      </View>
    );
  }
}

export default withNavigation(LogInPresenter);
