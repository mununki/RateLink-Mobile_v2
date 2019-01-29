import React from "react";
import RateCard from "../../../../components/RateCard";
import { ScrollView } from "react-native";
import { Button, Icon, Text, View } from "@shoutem/ui";
import { withNavigation } from "react-navigation";
import { withApollo } from "react-apollo";
import { SET_MODE } from "../../../../lib/clientQueries";

class RatesPresenter extends React.Component {
  render() {
    const { rates } = this.props;
    return (
      <View>
        <ScrollView>
          {rates.edges.map(edge => (
            <RateCard key={edge.node.id} rate={edge.node} />
          ))}
        </ScrollView>

        <Button
          styleName="secondary"
          style={{
            position: "absolute",
            right: 20,
            bottom: 50,
            paddingTop: 5,
            paddingBottom: 5
          }}
          onPress={() => {
            this.props.client
              .mutate({
                mutation: SET_MODE,
                variables: {
                  mode: {
                    isAdd: true,
                    isModify: false
                  }
                }
              })
              .then(res => this.props.navigation.navigate("Add"));
          }}
        >
          <Icon name="plus-button" />
        </Button>
      </View>
    );
  }
}

export default withNavigation(withApollo(RatesPresenter));
