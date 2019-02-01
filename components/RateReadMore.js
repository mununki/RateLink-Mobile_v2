import React from "react";
import { Button, Spinner, Text } from "@shoutem/ui";
import { withApollo } from "react-apollo";
import { GET_RATES } from "../screens/App/Rate/Rates/RatesQueries";
import { GET_QUERYPARAMS } from "../lib/clientQueries";

class RateReadMore extends React.Component {
  state = {
    isGetMoreRates: false
  };

  _getMoreRates = async () => {
    const { rates } = this.props;
    const { queryParams } = await this.props.client.readQuery({
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

  render() {
    const { isGetMoreRates } = this.state;
    return (
      <Button
        onPress={() => {
          this.setState({ isGetMoreRates: true });
          this._getMoreRates();
        }}
        styleName="secondary md-gutter-vertical"
        style={{ paddingTop: 5, paddingBottom: 5 }}
      >
        {isGetMoreRates ? (
          <Spinner style={{ color: "#fff", marginTop: 10, marginBottom: 10 }} />
        ) : (
          <Text>Read More</Text>
        )}
      </Button>
    );
  }
}

export default withApollo(RateReadMore);
