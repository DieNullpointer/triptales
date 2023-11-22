import useLocalStorage from "uselocalstoragenextjs";
import { useRouter } from "next/router";

export function getBearerToken() {
    const { value } = useLocalStorage({ name: "bearerToken" });
    return value;
}

export function isLayoutLessPage() {
    const router = useRouter()
    return router.pathname.includes('/landingpage') && !router.pathname.includes('/user') 
}