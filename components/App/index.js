import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import HomeScreen from "./Home";
import ProfileScreen from "./Profile";

const RateStack = createStackNavigator({
  Search: {
    screen: HomeScreen
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
