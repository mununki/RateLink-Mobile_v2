import React from "react";
import { View, Text, Button } from "@shoutem/ui";
import { withNavigation } from "react-navigation";

export default withNavigation(props => (
  <View
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <View styleName="lg-gutter-bottom">
      <Text>Network Error</Text>
      <Text>Check the internet connection</Text>
    </View>
    <View>
      <Button styleName="secondary" onPress={() => props.navigation.navigate("AuthChecking")}>
        <Text>REFRESH</Text>
      </Button>
    </View>
  </View>
));
