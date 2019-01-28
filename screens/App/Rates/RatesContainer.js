import React from "react";
import { View, Text, Button } from "react-native";
import { Query, Mutation, withApollo } from "react-apollo";
import RatesPresenter from "./RatesPresenter";
import { GET_RATES } from "./RatesQueries";
import { GET_QUERYPARAMS } from "../../../lib/clientQueries";

class RatesContainer extends React.Component {
  static navigationOptions = {
    title: "운임"
  };
  render() {
    return (
      <Query query={GET_QUERYPARAMS}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <View>
                <Text>Loading...</Text>
              </View>
            );
          if (error)
            return (
              <View>
                <Text>Error :(</Text>
              </View>
            );

          const queryParams = data.queryParams;
          console.log(JSON.stringify(queryParams));
          return (
            <Query
              query={GET_RATES}
              variables={{
                first: 20,
                queryParams: JSON.stringify(queryParams),
                after: null
              }}
            >
              {({ loading, error, data, fetchMore }) => {
                if (loading)
                  return (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Text>Loading...</Text>
                    </View>
                  );
                if (error) return <Text>Error :(</Text>;

                if (data && data.getRates.ok) {
                  const rates = data.getRates.data;

                  return <RatesPresenter rates={rates} fetchMore={fetchMore} />;
                } else {
                  return <Text>Error :(</Text>;
                }
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(RatesContainer);
