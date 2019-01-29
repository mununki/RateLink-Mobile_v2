import React from "react";
import RateCard from "../../../../components/RateCard";
import { ScrollView } from "react-native";
import { Button, Icon, Text, View, Overlay } from "@shoutem/ui";
import { withNavigation } from "react-navigation";
import { withApollo } from "react-apollo";
import { SET_MODE } from "../../../../lib/clientQueries";

class RatesPresenter extends React.Component {
  state = {
    currentlyOverlayed: null
  };
  _updateParentState = newState => {
    this.setState(newState);
  };
  render() {
    const { rates } = this.props;
    const { currentlyOverlayed } = this.state;
    return (
      <View>
        <ScrollView
          onScroll={() => {
            if (currentlyOverlayed) {
              currentlyOverlayed(false);
            }
          }}
          scrollEventThrottle={16}
        >
          {rates.edges.map(edge => (
            <RateCard
              key={edge.node.id}
              rate={edge.node}
              currentlyOverlayed={currentlyOverlayed}
              _updateParentState={this._updateParentState}
            />
          ))}
        </ScrollView>

        <Button
          styleName="clear"
          style={{
            position: "absolute",
            right: 20,
            bottom: 50
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
          <Overlay styleName="rounded-small image-overlay">
            <Icon name="plus-button" />
          </Overlay>
        </Button>
      </View>
    );
  }
}

export default withNavigation(withApollo(RatesPresenter));
