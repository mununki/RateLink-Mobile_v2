import { createStackNavigator } from "react-navigation";
import RatesScreen from "./Rates";
import SearchScreen from "./Search";
import AddScreen from "./Add";

const RateStack = createStackNavigator({
  Rates: {
    screen: RatesScreen
  },
  Search: {
    screen: SearchScreen
  },
  Add: {
    screen: AddScreen
  }
});

export default RateStack;
