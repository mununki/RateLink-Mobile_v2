import React from "react";
import { ScrollView } from "react-native";
import { Text, View, TouchableOpacity, Icon } from "@shoutem/ui";
import Tellers from "./Tellers";
import Readers from "./Readers";
import { withApollo } from "react-apollo";
import Search from "./Search";

class FriendsPresenter extends React.Component {
  state = {
    tellersOrReaders: "tellers",
    onlyTellers: []
  };

  componentDidMount() {
    this._getOnlyShowers();
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (
      prevProps.tellers !== this.props.tellers ||
      prevProps.readers !== this.props.readers
    ) {
      this._getOnlyShowers();
    }
  }

  _getOnlyShowers = () => {
    const { tellers, readers } = this.props;
    const onlyTellers = tellers.filter(
      teller => readers.filter(reader => reader.id === teller.id).length < 1
    );
    this.setState({ onlyTellers });
  };

  render() {
    const { tellers, readers } = this.props;
    const { tellersOrReaders, onlyTellers } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View
          styleName="horizontal"
          style={{ borderWidth: 1, borderColor: "#eee", marginTop: 3 }}
        >
          <TouchableOpacity
            style={{
              flex: 0.4,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: 1,
              borderRightColor: "#eee",
              borderBottomWidth: tellersOrReaders === "tellers" ? 5 : 0,
              borderBottomColor: "#6dbad8"
            }}
            onPress={() => this.setState({ tellersOrReaders: "tellers" })}
          >
            <Text>Tellers ({tellers.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.4,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: 1,
              borderRightColor: "#eee",
              borderBottomWidth: tellersOrReaders === "readers" ? 5 : 0,
              borderBottomColor: "#6dbad8"
            }}
            onPress={() => this.setState({ tellersOrReaders: "readers" })}
          >
            <Text>Readers ({readers.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.2,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderBottomWidth: tellersOrReaders === "find" ? 5 : 0,
              borderBottomColor: "#6dbad8"
            }}
            onPress={() => this.setState({ tellersOrReaders: "find" })}
          >
            <Icon name="search" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            {tellersOrReaders === "tellers" ? (
              <Tellers tellers={tellers} onlyTellers={onlyTellers} />
            ) : tellersOrReaders === "readers" ? (
              <Readers readers={readers} />
            ) : (
              <Search onlyTellers={onlyTellers} />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default withApollo(FriendsPresenter);
