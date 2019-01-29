import React from "react";
import AddPresenter from "./AddPresenter";
import { Query } from "react-apollo";
import { GET_MODE } from "../../../../lib/clientQueries";

class AddContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "추가"
    };
  };
  render() {
    return (
      <Query query={GET_MODE}>
        {({ loading, error, data }) => {
          if (loading) return <Text>..</Text>;
          if (error) return <Text>Error</Text>;

          return <AddPresenter />;
        }}
      </Query>
    );
  }
}
export default AddContainer;
