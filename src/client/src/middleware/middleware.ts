import { User } from "@/types/types";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

export function getPost(guid: string) {
  const { data, error, isLoading } = useSWR(
    `https://localhost:7174/api/Post/${guid}`,
    fetcher
  );
  return { post: data, error, isLoading };
}

export function getNextPost(start:number, iteration: number) {
  const { data, error, isLoading } = useSWR(
    `https://localhost:7174/api/Post/random?start=${start}&itemNr=${iteration}`,
    fetcher
  );
  return { post: data, error, isLoading };
}