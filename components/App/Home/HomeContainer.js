import React from "react";
import { View, Text, Button } from "react-native";
import { Query, Mutation, withApollo } from "react-apollo";
import { ME } from "../../../queries/sharedQueries";
import { removeTokenFromAsyncStorage } from "../../../utils/handleAsyncStorage";

class HomeContainer extends React.Component {
  static navigationOptions = {
    title: "운임"
  };
  _logOut = async () => {
    let res;
    try {
      res = await removeTokenFromAsyncStorage();
    } catch (err) {
      console.log(err);
      alert("로그아웃 실패");
    }
    if (res) {
      this.props.navigation.navigate("AuthChecking");
    }
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
        <Button title="로그아웃" onPress={() => this._logOut()} />
      </View>
    );
  }
}

export default withApollo(HomeContainer);
