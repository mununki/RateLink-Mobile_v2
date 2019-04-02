import React from "react";
import { Alert } from "react-native";
import { View, Subtitle, Button, Icon, Row, Image, Caption, Text } from "@shoutem/ui";
import { withApollo } from "react-apollo";
import { REMOVE_READERS, GET_READERS, ADD_READERS } from "./Friends/FriendsQueries";
import Toast from "react-native-simple-toast";
import { getAWSS3Url } from "../env.config";

const AWS_S3_ENDPOINT = getAWSS3Url();

class UserCard extends React.Component {
  _addReader = () => {
    const { user } = this.props;
    this.props.client
      .mutate({
        mutation: ADD_READERS,
        variables: { userId: user.id }
      })
      .then(res => {
        const readers = this.props.client.readQuery({
          query: GET_READERS
        });
        this.props.client.writeQuery({
          query: GET_READERS,
          data: {
            getReaders: [...readers.getReaders, res.data.addRateReader]
          }
        });
      })
      .then(() => Toast.show("Added!", Toast.SHORT))
      .catch(error => {
        console.warn(error);
        Toast.show("Please try again.", Toast.SHORT);
      });
  };

  _removeReader = () => {
    const { user } = this.props;
    this.props.client
      .mutate({
        mutation: REMOVE_READERS,
        variables: { userId: user.id }
      })
      .then(res => {
        const readers = this.props.client.readQuery({
          query: GET_READERS
        });
        const newReaders = readers.getReaders.filter(reader => reader.id !== res.data.removeRateReader.id);
        this.props.client.writeQuery({
          query: GET_READERS,
          data: {
            getReaders: newReaders
          }
        });
      })
      .then(() => Toast.show("Deleted!", Toast.SHORT))
      .catch(error => {
        console.warn(error);
        Toast.show("Please try again.", Toast.SHORT);
      });
  };

  render() {
    const { user, isTeller, isReader, onlyTellers } = this.props;
    return (
      <Row>
        <Image
          styleName="small-avatar top"
          source={
            user.profile.image
              ? {
                  uri: `${AWS_S3_ENDPOINT}${user.profile.image}`
                }
              : require("../assets/profile_images/dummy.png")
          }
        />
        <View styleName="vertical">
          <View styleName="horizontal">
            <Subtitle>{user.profile.profile_name}</Subtitle>
            <Caption styleName="md-gutter-left">{user.profile.company}</Caption>
          </View>
          <Text>{user.email}</Text>
        </View>
        {isReader ? (
          <Button
            onPress={() =>
              Alert.alert(
                "Confirm",
                "Please confirm to delete",
                [
                  {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel"
                  },
                  {
                    text: "Delete",
                    onPress: () => {
                      this._removeReader();
                    }
                  }
                ],
                { cancelable: false }
              )
            }
          >
            <Icon styleName="disclosure" name="close" />
          </Button>
        ) : null}
        {isTeller && onlyTellers.filter(onlyteller => onlyteller.id === user.id).length > 0 ? (
          <Button
            onPress={() =>
              Alert.alert(
                "Confirm",
                "Please confirm to add.",
                [
                  {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel"
                  },
                  {
                    text: "Add",
                    onPress: () => {
                      this._addReader();
                    }
                  }
                ],
                { cancelable: false }
              )
            }
          >
            <Icon name="plus-button" />
          </Button>
        ) : null}
      </Row>
    );
  }
}

export default withApollo(UserCard);
