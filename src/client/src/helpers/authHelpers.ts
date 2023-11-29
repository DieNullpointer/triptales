import { useRouter } from "next/router";
import axios from "axios";

axios.defaults.baseURL = "https://localhost:7174/api";
axios.defaults.withCredentials = true;

export function getCookie() {
  return true;
}

export function isLayoutLessPage() {
  const router = useRouter();
  return (
    router.pathname.includes("/landingpage") &&
    !router.pathname.includes("/user")
  );
}

export async function login(credentials: {
  registryName: string;
  password: string;
}) {
  try {
    const response = await axios.post("/user/login", credentials);

    const resObj = {
      status: response.status,
      success: response.status === 200,
      data: response.data,
    };
    return resObj;
  } catch (error: any) {
    return { sucess: false, error: error.response?.data };
  }
}
