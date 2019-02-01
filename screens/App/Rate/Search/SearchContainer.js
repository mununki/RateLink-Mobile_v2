import React from "react";
import SearchPresenter from "./SearchPresenter";

class SearchContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "검색",
      headerStyle: {
        backgroundColor: "#6dbad8"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };
  render() {
    return <SearchPresenter />;
  }
}

export default SearchContainer;
