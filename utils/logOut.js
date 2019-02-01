import { removeTokenFromAsyncStorage } from "./handleAsyncStorage";

export const logOut = navigation => async () => {
  let res;
  try {
    res = await removeTokenFromAsyncStorage();
  } catch (err) {
    console.warn(err);
    alert("로그아웃 실패");
  }
  if (res) {
    navigation.navigate("AuthChecking");
  }
};
