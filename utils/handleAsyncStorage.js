import { AsyncStorage } from "react-native";

const TOKEN_KEY = "token@ratelink";

export const getTokenFromAsyncStorage = () =>
  new Promise(async (resolve, reject) => {
    let token;
    try {
      token = await AsyncStorage.getItem(TOKEN_KEY);
    } catch (err) {
      console.log(err);
      reject(err);
    }
    resolve(token);
  });

export const saveTokenToAsyncStorage = token =>
  new Promise(async (resolve, reject) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (err) {
      console.log(err);
      reject(err);
    }
    resolve(true);
  });

export const removeTokenFromAsyncStorage = () =>
  new Promise(async (resolve, reject) => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (err) {
      console.log(err);
      reject(err);
    }
    resolve(true);
  });
