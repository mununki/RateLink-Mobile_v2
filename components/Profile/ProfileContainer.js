import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { Query } from "react-apollo";
import { ME } from "../../queries/sharedQueries";

class ProfileContainer extends React.Component {
  static navigationOptions = {
    title: "Home"
  };
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Profile Screen</Text>
        <Query query={ME}>
          {({ loading, error, data }) => {
            if (loading) return <Text>Loading...</Text>;
            if (error) return <Text>Error :(</Text>;

            return (
              <Text>{JSON.stringify(data.me.data.profile.profile_name)}</Text>
            );
          }}
        </Query>
      </View>
    );
  }
}

export default ProfileContainer;
