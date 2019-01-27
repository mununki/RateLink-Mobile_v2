import React from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { getTokenFromAsyncStorage } from "../../utils/handleAsyncStorage";

class AuthCheckingContainer extends React.Component {
  constructor(props) {
    super(props);
    this._authChecking();
  }

  _authChecking = async () => {
    const token = await getTokenFromAsyncStorage();
    this.props.navigation.navigate(token ? "App" : "Auth");
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthCheckingContainer;
