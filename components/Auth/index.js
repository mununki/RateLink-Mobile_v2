import { createStackNavigator } from "react-navigation";
import LogInScreen from "./LogIn";
import SignUpScreen from "./SignUp";

const AuthStack = createStackNavigator({
  LogIn: { screen: LogInScreen },
  SignUp: { screen: SignUpScreen }
});

export default AuthStack;
