import { User } from "@/types/types";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export function getUser(guid: string) {
  const { data, error, isLoading } = useSWR(
    `https://localhost:7174/api/User/${guid}`,
    fetcher
  );

  return {
    user: data,
    error,
    isLoading,
  };
}

export async function searchUsers(query: string) {
  const response = await axios.get(
    `https://localhost:7174/api/User/search/${query}`
  );
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
    `https://localhost:7174/api/User/${registryName}`,
    fetcher
  );

  return {
    user: data?.user,
    profile: data?.profile
      ? "https://localhost:7174/" + data?.profile
      : undefined,
    banner: data?.banner ? "https://localhost:7174/" + data?.banner : undefined,
    error,
    isLoading,
  };
}

export function getSelf() {
  const { data, error, isLoading } = useSWR(
    `https://localhost:7174/api/User/me`,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function getPost(guid: string) {
  const { data, error, isLoading } = useSWR(
    `https://localhost:7174/api/Post/${guid}`,
    fetcher
  );
  return { post: data, error, isLoading };
}

export async function getNextPost(start: number, iteration: number) {
  let data;
  let error;
  await axios
    .get(
      `https://localhost:7174/api/Post/random?start=${start}&itemNr=${iteration}`
    )
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
  await axios
    .put(`https://localhost:7174/api/Post/like/${guid}`)
    .then((res) => {
      data = res.data;
    });
  return data;
}

export async function forgotPassword(email: string) {
  let data;
  await axios
    .get(`https://localhost:7174/api/User/forgotPassword/${email}`)
    .then((res) => {
      data = res.data;
    });
  return data;
}

export async function resetPassword(token: string | string[], password: string) {
  let data;
  await axios
    .post(`https://localhost:7174/api/User/resetPassword/${token}`, {password})
    .then((res) => {
      data = res.data;
    }).catch((error) => {});
  return data;
}
