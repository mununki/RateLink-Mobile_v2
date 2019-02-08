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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthCheckingContainer;
