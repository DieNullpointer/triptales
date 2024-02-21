import { useRouter } from "next/router";
import axios from "axios";

axios.defaults.baseURL = "https://localhost:7174/api";
axios.defaults.withCredentials = true;

export async function getAuthorized() {
  try {
    const response = await axios.get("/user/me");
    return response.data.username;
  } catch (error) {
    console.log("not logged in");
    return "";
  }
}

export async function getAuthorizedAll() {
  try {
    const response = await axios.get("/user/me");
    return response.data;
  } catch (error) {
    console.log("not logged in");
    return "";
  }
}

export async function follow(username: string) {
  try {
    const response = await axios.post(`/user/follow/${username}`);
    console.log(response);

    return true;
  } catch (error) {
    return false;
  }
}

export async function logout() {
  try {
    await axios.get("/user/logout");
    return true;
  } catch (error) {
    return false;
  }
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

export async function register(credentials: {
  registryName: string;
  password: string;
  email: string;
}) {
  try {
    const response = await axios.post("/user/register", credentials);

    const resObj = {
      status: response.status,
      success: response.status === 200,
      data: response.data,
    };
    return resObj;
  } catch (error: any) {
    return {
      success: false,
      error:
        typeof error.response?.data === "string"
          ? error.response?.data
          : // @ts-ignore
            Object.entries(error.response?.data?.errors)[0][1][0],
    };
  }
}

export async function getNotficiations() {
  try {
    const response = await axios.get("/user/notifications");
    return response.data;
  } catch (error) {
    return undefined; 
  }
}
