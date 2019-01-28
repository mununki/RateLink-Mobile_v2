import React from "react";
import { View, Text } from "react-native";
import RateCard from "../../../components/RateCard";
import { ScrollView } from "react-native-gesture-handler";

class RatesPresenter extends React.Component {
  render() {
    const { rates } = this.props;
    return (
      <ScrollView>
        {rates.edges.map(edge => (
          <RateCard key={edge.node.id} rate={edge.node} />
        ))}
      </ScrollView>
    );
  }
}

export default RatesPresenter;
