import React from "react";
import AddPresenter from "./AddPresenter";
import { Query } from "react-apollo";
import { GET_MODE } from "../../../../lib/clientQueries";
import { Text, Spinner, View } from "@shoutem/ui";

class AddContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "추가",
      headerStyle: {
        backgroundColor: "#6dbad8"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };
  render() {
    const rate = this.props.navigation.getParam("rate", null);
    return (
      <Query query={GET_MODE}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Spinner />
              </View>
            );
          if (error) return <Text>Error</Text>;

          return <AddPresenter rate={rate} />;
        }}
      </Query>
    );
  }
}
export default AddContainer;
