import React from "react";
import { View, Text, Button } from "react-native";
import { Query, Mutation, withApollo } from "react-apollo";
import { ME } from "../../queries/sharedQueries";

class HomeContainer extends React.Component {
  static navigationOptions = {
    title: "운임"
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Query query={ME}>
          {({ loading, error, data }) => {
            if (loading) return <Text>Loading...</Text>;
            if (error) return <Text>Error :(</Text>;

            return <Text>{data.me.data.profile.profile_name}</Text>;
          }}
        </Query>
      </View>
    );
  }
}

export default withApollo(HomeContainer);
