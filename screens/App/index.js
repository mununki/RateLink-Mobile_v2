import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import RatesScreen from "./Rates";
import ProfileScreen from "./Profile";
import SearchScreen from "./Search";

const RateStack = createStackNavigator({
  Rates: {
    screen: RatesScreen
  },
  Search: {
    screen: SearchScreen
  }
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen
  }
});

const AppDrawer = createDrawerNavigator({
  Home: {
    screen: RateStack
  },
  Profile: {
    screen: ProfileStack
  }
});

export default AppDrawer;
