import React from "react";
import AppNavigator from "./lib/navigation";
import withApollo from "./lib/withApollo";

class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}

export default withApollo(App);
