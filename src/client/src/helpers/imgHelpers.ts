import axios, { AxiosResponse } from 'axios';

const accessKey = 'FhoYRHwY2LaJ4Xt24CtoQlzTkviimX_a7IJgG7CjouM';

interface UnsplashPhoto {
  urls: {
    regular: string;
  };
}

// Make a request to the Unsplash API to get a random photo
const url = `https://api.unsplash.com/photos/random?client_id=FhoYRHwY2LaJ4Xt24CtoQlzTkviimX_a7IJgG7CjouM`;

// Function to fetch a random Unsplash photo URL
export async function getRandomUnsplashPhoto(): Promise<string> {
  try {
    const response: AxiosResponse<UnsplashPhoto> = await axios.get(url);
    const photoUrl = response.data.urls.regular;
    console.log(response)
    return photoUrl;
  } catch (error : any) {
    console.error('Error fetching random Unsplash photo:', error.message);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    const randomPhotoUrl = await getRandomUnsplashPhoto();
    console.log('Random Unsplash Photo URL:', randomPhotoUrl);

    // Now you can use 'randomPhotoUrl' in your project
  } catch (error) {
    // Handle errors
  }
}

// Run the main function
main();
