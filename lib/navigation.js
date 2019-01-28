import { createSwitchNavigator, createAppContainer } from "react-navigation";
import AuthCheckingScreen from "../screens/AuthChecking";
import AuthStack from "../screens/Auth";
import AppDrawer from "../screens/App";

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
