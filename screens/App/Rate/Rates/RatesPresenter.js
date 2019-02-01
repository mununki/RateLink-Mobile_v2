import React from "react";
import RateCard from "../../../../components/RateCard";
import { ScrollView, RefreshControl } from "react-native";
import { Button, Icon, Text, View, Overlay, Spinner } from "@shoutem/ui";
import { withNavigation } from "react-navigation";
import { withApollo } from "react-apollo";
import { SET_MODE, GET_QUERYPARAMS } from "../../../../lib/clientQueries";
import { GET_RATES } from "./RatesQueries";

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

  _getMoreRates = () => {
    const { rates } = this.props;
    const { queryParams } = this.props.client.readQuery({
      query: GET_QUERYPARAMS
    });
    this.props
      .fetchMore({
        query: GET_RATES,
        variables: {
          first: 20,
          queryParams: JSON.stringify(queryParams),
          after: rates.pageInfo.endCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult.getRates.data.pageInfo.hasNextPage)
            console.log("마지막 페이지 입니다.");
          return fetchMoreResult.getRates.data.edges.length > 0
            ? {
                getRates: {
                  ok: true,
                  data: {
                    pageInfo: fetchMoreResult.getRates.data.pageInfo,
                    edges: [
                      ...previousResult.getRates.data.edges,
                      ...fetchMoreResult.getRates.data.edges
                    ],
                    __typename: "Rate_rateConnection"
                  },
                  error: null,
                  __typename: "RateResponse"
                }
              }
            : previousResult;
        }
      })
      .then(res => this.setState({ isGetMoreRates: false }));
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.client
      .query({
        query: GET_QUERYPARAMS
      })
      .then(res => {
        const { queryParams } = res;
        this.props.client
          .query({
            query: GET_RATES,
            variables: {
              first: 20,
              queryParams: JSON.stringify(queryParams),
              after: null
            }
          })
          .then(res => {
            this.setState({ refreshing: false });
            console.log("refreshed!");
          });
      });
  };

  render() {
    const { rates } = this.props;
    const {
      currentlyOverlayed,
      currentlyOverlayedResolveMethod,
      isGetMoreRates,
      refreshing
    } = this.state;
    return (
      <View style={{ backgroundColor: "#eee" }}>
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
          {isGetMoreRates ? (
            <Button styleName="secondary md-gutter-vertical">
              <Spinner
                style={{ color: "#fff", marginTop: 10, marginBottom: 10 }}
              />
            </Button>
          ) : (
            <Button
              onPress={() => {
                this.setState({ isGetMoreRates: true });
                this._getMoreRates();
              }}
              styleName="secondary md-gutter-vertical"
              style={{ paddingTop: 5, paddingBottom: 5 }}
            >
              <Text>Read More</Text>
            </Button>
          )}
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
