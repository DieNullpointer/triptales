import useSWR from "swr";

export function getUser(guid: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
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

export function getUserByRegistry(registryName: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `https://localhost:7174/api/User/${registryName}`,
    fetcher
  );

  return {
    user: data,
    error,
    isLoading,
  };
}

export function getPost(guid: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `https://localhost:7174/api/Post/${guid}`,
    fetcher
  );
  return { post: data, error, isLoading };
}
