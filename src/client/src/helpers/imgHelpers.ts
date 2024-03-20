import axios, { AxiosResponse } from "axios";

const accessKey = "FhoYRHwY2LaJ4Xt24CtoQlzTkviimX_a7IJgG7CjouM";
const url = `https://api.unsplash.com/photos/random?query=landscape;16:9&client_id=${accessKey}`;

export async function getRandom(): Promise<{
  urls: { full: string, regular: string };
  user: { name: string };
  links: { html: string };
}> {
  try {
    const response = await axios.get(url, {
      withCredentials: false,
      baseURL: "",
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching random Unsplash photo:", error.message);
    throw error;
  }
}

export function dataUrlToFile (dataurl: string, filename: string) {
  var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
};
