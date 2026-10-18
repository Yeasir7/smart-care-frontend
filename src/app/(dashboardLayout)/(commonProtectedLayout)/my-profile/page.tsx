import { getUserInfo } from "@/services/auth.services";
import { MyProfileClient } from "./MyProfileClient";

const MyProfilePage = async () => {
  const userInfo = await getUserInfo();

  return <MyProfileClient userInfo={userInfo} />;
};

export default MyProfilePage;