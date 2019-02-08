import React from "react";
import { View, Text, TextInput, Button, Icon } from "@shoutem/ui";
import { withApollo } from "react-apollo";
import { FIND_USERS } from "./FriendsQueries";
import Toast from "react-native-simple-toast";
import UserCard from "../UserCard";

const SearchFriendForm = ({ email, nickname, handleInput, handleSearch }) => {
  return (
    <View>
      <View styleName="horizontal sm-gutter">
        <TextInput
          placeholder="E-mail"
          styleName="sm-gutter"
          style={{ flex: 0.5, backgroundColor: "#eee" }}
          value={email}
          onChangeText={text => handleInput(text, "email")}
        />
        <TextInput
          placeholder="이름"
          styleName="sm-gutter"
          style={{ flex: 0.4, backgroundColor: "#eee" }}
          value={nickname}
          onChangeText={text => handleInput(text, "nickname")}
        />
        <Button
          styleName="secondary sm-gutter stretch"
          style={{ flex: 0.1 }}
          onPress={() => handleSearch()}
        >
          <Icon name="search" />
        </Button>
      </View>
    </View>
  );
};

const SearchResult = ({ foundUsers, onlyTellers }) => {
  return (
    <View>
      <Text styleName="md-gutter-left">
        {foundUsers.length}명을 찾았습니다.
      </Text>
      {foundUsers.map(user => (
        <UserCard
          key={user.id}
          user={user}
          isTeller={true}
          onlyTellers={onlyTellers}
        />
      ))}
    </View>
  );
};

class Search extends React.Component {
  state = {
    email: "",
    nickname: "",
    foundUsers: []
  };

  _handleInput = (text, target) => {
    this.setState({
      [target]: text
    });
  };

  _handleSearch = () => {
    const { email, nickname } = this.state;
    this.props.client
      .query({
        query: FIND_USERS,
        variables: {
          email,
          nickname
        }
      })
      .then(res => {
        this.setState({
          foundUsers: res.data.findUsers
        });
        Toast.show(`${res.data.findUsers.length}명을 찾았습니다`, Toast.SHORT);
      })
      .catch(error => Toast.show("다시 시도해주세요", Toast.SHORT));
  };

  render() {
    const { onlyTellers } = this.props;
    const { email, nickname, foundUsers } = this.state;
    return (
      <View>
        <SearchFriendForm
          email={email}
          nickname={nickname}
          handleInput={this._handleInput}
          handleSearch={this._handleSearch}
        />
        <SearchResult foundUsers={foundUsers} onlyTellers={onlyTellers} />
      </View>
    );
  }
}

export default withApollo(Search);
