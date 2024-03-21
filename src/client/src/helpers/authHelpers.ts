import { useRouter } from "next/router";
import axios from "axios";
import { File } from "buffer";
import { TripPost } from "@/types/types";
import process from 'node:process'
import { TripPost } from "@/types/types";

axios.defaults.baseURL = process.env.NODE_ENV == 'production' ? "/api" : "https://localhost:7174/api";
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

export async function changeUser(credentials: {
  registryName: string;
  displayName: string;
  password: string;
  email: string;
  description: string;
  origin: string;
  favDestination: string;
}) {
  try {
    const response = await axios.put("/user/change", credentials);

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

export async function uploadPicture(credentials: { profile: any }) {
  try {
    const response = await axios.put("/user/addImages", credentials, {
      headers: { "Content-Type": "multipart/form-data" },
    });

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

export async function uploadBanner(credentials: { banner: any }) {
  try {
    const response = await axios.put("/user/addImages", credentials, {
      headers: { "Content-Type": "multipart/form-data" },
    });

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

export async function createPost(post: any) {
  try {
    const response = await axios.post("/post/add", post, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (err) {
    return err;
  }
}
