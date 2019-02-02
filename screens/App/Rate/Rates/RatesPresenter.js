import React from "react";
import RateCard from "../../../../components/RateCard";
import { ScrollView, RefreshControl } from "react-native";
import { Button, Icon, Text, View, Overlay, Spinner } from "@shoutem/ui";
import { withNavigation } from "react-navigation";
import { withApollo } from "react-apollo";
import { SET_MODE, GET_QUERYPARAMS } from "../../../../lib/clientQueries";
import { GET_RATES } from "./RatesQueries";
import RateReadMore from "../../../../components/RateReadMore";

class RatesPresenter extends React.Component {
  state = {
    currentlyOverlayed: null,
    currentlyOverlayedResolveMethod: null,
    isGetMoreRates: false,
    refreshing: false
  };

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
        console.log("refreshed!");
      });
  };

  render() {
    const { rates, fetchMore } = this.props;
    const {
      currentlyOverlayed,
      currentlyOverlayedResolveMethod,
      isGetMoreRates,
      refreshing
    } = this.state;

    return (
      <View styleName="flexible" style={{ backgroundColor: "#eee" }}>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (currentlyOverlayed) {
              currentlyOverlayedResolveMethod(false);
            }
            // ====================================================
            // Infinite Scroll
            // ====================================================
            // const endOfScrollY = nativeEvent.contentSize.height;
            // const scrollOffsetY =
            //   nativeEvent.layoutMeasurement.height +
            //   nativeEvent.contentOffset.y;
            // if (endOfScrollY === scrollOffsetY) {
            //   this._getMoreRates();
            //   this.setState({ isGetMoreRates: true });
            // }
          }}
          scrollEventThrottle={320}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {rates.edges.map(edge => (
            <RateCard
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
