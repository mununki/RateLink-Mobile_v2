import React from "react";
import RateCard from "../../../../components/RateCard";
import { ScrollView, RefreshControl, BackHandler } from "react-native";
import { Button, Icon, Text, View, Overlay } from "@shoutem/ui";
import { withNavigation } from "react-navigation";
import { withApollo } from "react-apollo";
import { SET_MODE, GET_QUERYPARAMS } from "../../../../lib/clientQueries";
import { GET_RATES } from "./RatesQueries";
import RateReadMore from "../../../../components/RateReadMore";
import { NavigationEvents } from "react-navigation";
import Toast from "react-native-simple-toast";

class RatesPresenter extends React.Component {
  state = {
    currentlyOverlayed: null,
    currentlyOverlayedResolveMethod: null,
    refreshing: false
  };

  componentDidMount() {
    this.backHandlerListener = BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
  }

  _updateParentState = newState => {
    this.setState(newState);
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    const { queryParams } = await this.props.client.readQuery({
      query: GET_QUERYPARAMS
    });
    this.props.client
      .query({
        query: GET_RATES,
        variables: {
          first: 20,
          queryParams: JSON.stringify(queryParams),
          after: null
        },
        fetchPolicy: "network-only"
      })
      .then(res => {
        this.setState({ refreshing: false });
      });
  };

  counterAppExit = 0;

  _handleBackPress = () => {
    if (this.counterAppExit === 1) {
      return false;
    }
    this.counterAppExit = 1;
    Toast.show("Press back button twice to exit an app.", Toast.SHORT);
    setTimeout(() => {
      this.counterAppExit = 0;
    }, 1000);
    return true; // Do not exit app
  };

  render() {
    const { me, rates, fetchMore } = this.props;
    const { currentlyOverlayed, currentlyOverlayedResolveMethod, refreshing } = this.state;

    return (
      <View styleName="flexible" style={{ backgroundColor: "#eee" }}>
        <NavigationEvents
          onDidFocus={() => {
            this.backHandlerListener = BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
          }}
          onWillBlur={() => {
            this.backHandlerListener.remove();
          }}
        />
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (currentlyOverlayed) {
              currentlyOverlayedResolveMethod(false);
            }
          }}
          scrollEventThrottle={320}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />}
        >
          {rates.edges.map(edge => (
            <RateCard
              me={me}
              key={edge.node.id}
              rate={edge.node}
              currentlyOverlayed={currentlyOverlayed}
              currentlyOverlayedResolveMethod={currentlyOverlayedResolveMethod}
              _updateParentState={this._updateParentState}
            />
          ))}
          <RateReadMore rates={rates} fetchMore={fetchMore} />
        </ScrollView>

        <Button
          styleName="clear"
          style={{
            position: "absolute",
            right: 20,
            bottom: 20
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
