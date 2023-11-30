import axios, { AxiosResponse } from "axios";

const accessKey = "FhoYRHwY2LaJ4Xt24CtoQlzTkviimX_a7IJgG7CjouM";
const url = `https://api.unsplash.com/photos/random?query=landscape;16:9&client_id=${accessKey}`;

export async function getRandom() {
  try {
    const response = await axios.get(url, { withCredentials: false, baseURL: "" });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching random Unsplash photo:", error.message);
    throw error;
  }
}
