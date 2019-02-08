import React from "react";
import FriendsPresenter from "./FriendsPresenter";
import { Query } from "react-apollo";
import { GET_SHOWERS, GET_READERS } from "./FriendsQueries";
import { Spinner, Text } from "@shoutem/ui";

class FriendsContainer extends React.Component {
  render() {
    return (
      <Query query={GET_SHOWERS}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <Text>Network Error :(</Text>;

          const tellers = data.getShowers;
          return (
            <Query query={GET_READERS}>
              {({ loading, error, data }) => {
                if (loading) return <Spinner />;
                if (error) return <Text>Network Error :(</Text>;

                const readers = data.getReaders;
                return <FriendsPresenter tellers={tellers} readers={readers} />;
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default FriendsContainer;
