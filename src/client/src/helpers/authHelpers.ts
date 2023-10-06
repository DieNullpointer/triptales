import useLocalStorage from "uselocalstoragenextjs";

export function getBearerToken() {
    const { value } = useLocalStorage({ name: "bearerToken" });
    return value;
}
