import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import RatesScreen from "./Rates";
import ProfileScreen from "./Profile";

const RateStack = createStackNavigator({
  Search: {
    screen: RatesScreen
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
