import { YellowBox } from "react-native";
import React from "react";
import AppNavigator from "./lib/navigation";
import withApollo from "./lib/withApollo";
import { AppLoading, Font } from "expo";

YellowBox.ignoreWarnings(["Require cycle"]);

class App extends React.Component {
  state = {
    isFontLoadingComplete: false,
    isLoadingComplete: false
  };
  async componentWillMount() {
    await Font.loadAsync({
      "Rubik-Black": require("./node_modules/@shoutem/ui/fonts/Rubik-Black.ttf"),
      "Rubik-BlackItalic": require("./node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf"),
      "Rubik-Bold": require("./node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf"),
      "Rubik-BoldItalic": require("./node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf"),
      "Rubik-Italic": require("./node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf"),
      "Rubik-Light": require("./node_modules/@shoutem/ui/fonts/Rubik-Light.ttf"),
      "Rubik-LightItalic": require("./node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf"),
      "Rubik-Medium": require("./node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf"),
      "Rubik-MediumItalic": require("./node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf"),
      "Rubik-Regular": require("./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf"),
      "rubicon-icon-font": require("./node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf")
    });
    this.setState({ isFontLoadingComplete: true });
  }
  _loadResourcesAsync = () => {
    return Promise.all(true);
  };
  render() {
    const { isFontLoadingComplete, isLoadingComplete } = this.state;
    if (isLoadingComplete && isFontLoadingComplete) {
      return <AppNavigator />;
    } else {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onFinish={() => this.setState({ isLoadingComplete: true })}
          onError={() => console.log("Error")}
        />
      );
    }
  }
}

export default withApollo(App);
