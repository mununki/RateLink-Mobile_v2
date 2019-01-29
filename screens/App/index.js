import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import RateStack from "./Rate";
import ProfileScreen from "./Profile";

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
