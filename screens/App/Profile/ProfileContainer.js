import React from "react";
import { View, Button, Text, Icon, Spinner } from "@shoutem/ui";
import { Query } from "react-apollo";
import { ME } from "../../../queries/sharedQueries";
import ProfilePresenter from "./ProfilePresenter";

class ProfileContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Profile",
      headerLeft: (
        <Button styleName="clear" onPress={() => navigation.toggleDrawer()}>
          <Icon name="sidebar" />
        </Button>
      ),
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
    return (
      <Query query={ME} fetchPolicy="network-only">
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
          if (error) return <Text>Error :(</Text>;

          return <ProfilePresenter me={data.me} />;
        }}
      </Query>
    );
  }
}

export default ProfileContainer;
