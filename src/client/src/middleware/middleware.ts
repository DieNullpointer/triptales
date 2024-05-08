import { User } from "@/types/types";
import axios from "axios";
import useSWR from "swr";

const baseUrl =
  process.env.NODE_ENV == "production" ? "/api" : "https://localhost:7174/api";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export function getUser(guid: string) {
  const { data, error, isLoading } = useSWR(`${baseUrl}/user/${guid}`, fetcher);

  return {
    user: data,
    error,
    isLoading,
  };
}

export async function searchUsers(query: string) {
  const response = await axios.get(`/user/search/${query}`);
  return response.data;
}

export function getUserByRegistry(registryName: string): {
  user: User;
  profile?: string;
  banner?: string;
  error: string;
  isLoading: boolean;
} {
  const { data, error, isLoading } = useSWR(
    `${baseUrl}/user/${registryName}`,
    fetcher
  );

  return {
    user: data?.user,
    profile: data?.profile ? data?.profile : undefined,
    banner: data?.banner ? "https://localhost:7174/" + data?.banner : undefined,
    error,
    isLoading,
  };
}

export function getSelf() {
  const { data, error, isLoading } = useSWR(`${baseUrl}/user/me`, fetcher);

  return {
    data,
    error,
    isLoading,
  };
}

export function getPost(guid: string) {
  const { data, error, isLoading } = useSWR(`${baseUrl}/post/${guid}`, fetcher);
  return { post: data, error, isLoading };
}

export async function getRandomPosts() {
  let data;
  let error;
  await axios
    .get(`/post/random`)
    .then((res) => {
      data = res.data;
    })
    .catch((error) => {
      error = error;
    });

  return { data, error };
}

export async function likePost(guid: string) {
  let data;
  await axios.put(`/post/like/${guid}`).then((res) => {
    data = res.data;
  });
  return data;
}

export async function forgotPassword(email: string) {
  let data;
  await axios.get(`/user/forgotPassword/${email}`).then((res) => {
    data = res;
  });
  return data;
}

export async function resetPassword(
  token: string | string[],
  password: string
) {
  let response;
  await axios
    .post(`/user/resetPassword`, { token, password })
    .then((res) => {
      response = res;
    })
    .catch((error) => {});
  return response;
}

export async function emailToken() {
  let data;
  await axios.post(`/user/emailToken`).then((res) => {
    data = res;
  });
  return data;
}

export async function changeEmail(
  token: string | string[],
  email: string
) {
  let response;
  await axios
    .post(`/user/changeEmail`, { token, email })
    .then((res) => {
      response = res;
    })
    .catch((error) => {});
  return response;
}


