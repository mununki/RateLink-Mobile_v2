import {
  createStackNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import HomeScreen from "../components/Home";
import ProfileScreen from "../components/Profile";
import AuthCheckingScreen from "../components/AuthChecking";
import LogInScreen from "../components/LogIn";
import SignUpScreen from "../components/SignUp";

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

const AuthStack = createStackNavigator({
  LogIn: { screen: LogInScreen },
  SignUp: { screen: SignUpScreen }
});

const AppNavigator = createSwitchNavigator(
  {
    AuthChecking: AuthCheckingScreen,
    App: { screen: AppDrawer },
    Auth: { screen: AuthStack }
  },
  {
    initialRouteName: "AuthChecking"
  }
);

export default createAppContainer(AppNavigator);
