import { useRouter } from "next/router";
import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV == "production" ? "/api" : "https://localhost:7174/api";
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

export async function createPost(post: any, images: File[]) {
  const formData = new FormData();
  Object.keys(post).forEach((key) => {
    if (key === "days" && Array.isArray(post[key])) {
      // Einzelne Tage separat hinzufügen
      post[key].forEach((day:any, index:number) => {
        formData.append(`days[${index}].date`, day.date);
        formData.append(`days[${index}].title`, day.title);
        formData.append(`days[${index}].text`, day.text);
      });
    } else {
      formData.append(key, post[key]);
    }
  });

  images.forEach((img) => {
    formData.append("images", img);
  });
  console.log("uploading ...");
  try {
    const response = await axios.post("/post/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      //timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function deletePost(guid: string) {
  try {
    const response = await axios.delete(`/post/delete/${guid}`);
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function createComment(credentials: {
  text: string;
  postGuid: string;
}) {
  try {
    const response = await axios.put("/Post/comment", credentials);

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
