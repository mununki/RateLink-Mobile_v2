import { createSwitchNavigator, createAppContainer } from "react-navigation";
import AuthCheckingScreen from "../components/AuthChecking";
import AuthStack from "../components/Auth";
import AppDrawer from "../components/App";

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
