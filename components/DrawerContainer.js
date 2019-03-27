import React from "react";
import { Image } from "react-native";
import { View, Text, TouchableOpacity, Spinner, Title } from "@shoutem/ui";
import { withApollo, Query } from "react-apollo";
import { ME } from "../queries/sharedQueries";
import { getAWSS3Url } from "../env.config";
import { logOut } from "../utils/logOut";

const AWS_S3_ENDPOINT = getAWSS3Url();

class DrawerContainer extends React.Component {
  render() {
    return (
      <View styleName="fill-parent">
        <View>
          <View style={{ paddingTop: 100, backgroundColor: "#444444" }}>
            <Query query={ME} fetchPolicy="network-only">
              {({ loading, error, data }) => {
                if (loading) return <Spinner />;
                if (error) return <Text>Error :(</Text>;

                if (data && data.me.ok) {
                  return (
                    <View styleName="horizontal">
                      <Image
                        source={
                          data.me.data.profile.image
                            ? {
                                uri: `${AWS_S3_ENDPOINT}${data.me.data.profile.image}`
                              }
                            : require("../assets/profile_images/dummy.png")
                        }
                        style={{
                          width: 70,
                          height: 70,
                          borderWidth: 1,
                          borderColor: "#fff",
                          borderRadius: 35,
                          marginLeft: 30,
                          marginBottom: -20
                        }}
                      />
                      <Text
                        style={{
                          marginLeft: 20,
                          marginBottom: 10,
                          color: "#fff"
                        }}
                      >
                        {data.me.data.profile.profile_name} 님
                      </Text>
                    </View>
                  );
                } else {
                  logOut(this.props.navigation)();
                  return <Text>Error :(</Text>;
                }
              }}
            </Query>
          </View>
          <View style={{ marginTop: 30, padding: 20 }}>
            <TouchableOpacity style={{ padding: 15 }} onPress={() => this.props.navigation.navigate("Home")}>
              <Title>내 운임</Title>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 15 }} onPress={() => this.props.navigation.navigate("Profile")}>
              <Title>내 프로필</Title>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 15 }} onPress={logOut(this.props.navigation)}>
              <Title>로그아웃</Title>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default withApollo(DrawerContainer);
