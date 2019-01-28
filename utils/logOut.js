import { removeTokenFromAsyncStorage } from "../../../utils/handleAsyncStorage";

_logOut = navigation => async () => {
  let res;
  try {
    res = await removeTokenFromAsyncStorage();
  } catch (err) {
    console.log(err);
    alert("로그아웃 실패");
  }
  if (res) {
    navigation.navigate("AuthChecking");
  }
};
