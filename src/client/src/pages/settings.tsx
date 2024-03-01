import Input from "@/components/atoms/Input";
import Image from "@/components/atoms/Image";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import { changeUser, uploadPicture, uploadBanner} from "@/helpers/authHelpers";
import { useEffect, useState, createRef, cache } from "react";
import Loading from "@/components/static/Loading";
import { getSelf, getUserByRegistry } from "@/middleware/middleware";
import defaultBanner from "@/resources/default_bannerpic.jpg";

import { Cropper, ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export default function Settings() {
  const {data, error, isLoading} = getSelf();
  
  const { user, profile, banner } = getUserByRegistry(data?.username);
  const [displayname, setDisplayname] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("");
  const [favDestination, setFavDestination] = useState("");

  
  
  useEffect(() => {
    setDisplayname(data?.displayName);
    setDescription(data?.description);
    setEmail(data?.email);
    setOrigin(data?.origin);
    setFavDestination(data?.favDestination);
  }, [data]);

  const handleSubmit = async () => {
    const response = await changeUser({
      registryName: data.username,
      displayName: displayname,
      password: data.password,
      email: email,
      description: description,
      origin: origin,
      favDestination: favDestination
    })
  };

  const file2Base64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = (error) => reject(error);
    });
  };

  const pictureRef = createRef<HTMLInputElement>();
  const bannerRef = createRef<HTMLInputElement>();

 // the selected image
 const [uploaded, setUploaded] = useState(null as string | null);

 // the resulting cropped image
 const [cropped, setCropped] = useState(null as string | null);

 // the reference of cropper element
 const cropperRef = createRef<ReactCropperElement>();

 const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  const file = e.target?.files?.[0];
  if (file) {
    file2Base64(file).then((base64) => {
      setUploaded(base64);
    });
  }
};

const onCrop = () => {
  const imageElement: any = cropperRef?.current;
  const cropper: any = imageElement?.cropper;
  setCropped(cropper.getCroppedCanvas().toDataURL());
};

  const changeBanner = async () => {
    const response = await uploadBanner({
    banner: bannerRef.current?.files?.item(0)
    })
  };




  const changePicture = async () => {
    const response = await uploadPicture({
    profile: pictureRef.current?.files?.item(0)
  })
  };


  return data ? (
    <div className="md:basis-1/4 w-full ">
      <div className="relative bottom-9">
        <Image
          src={banner || defaultBanner.src}
          alt=""
          className="w-full"
          wrapper="max-h-60 overflow-hidden items-center flex rounded-lg"
        />
        <Avatar
          profile={profile}
          size="large"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        />
      </div>
      <div className="m-4 space-y-4">
        <Input
          label="Username"
          value={displayname}
          onChange={(val) => setDisplayname(val)}
        />
        <Input
          label="Description"
          value={description}
          onChange={(val) => setDescription(val)}
        />
        <Input label="Email" value={email} onChange={(val) => setEmail(val)} />
        <Input
          label="Origin"
          value={origin}
          onChange={(val) => setOrigin(val)}
        />
        <Input
          label="Favorite Destination"
          value={favDestination}
          onChange={(val) => setFavDestination(val)}
        />
        <Button
          type="submit"
          className="text-white w-full"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>

        
        <input type="file" accept="image/png,image/jpeg,image/gif" onChange={changePicture} ref={pictureRef}/>
        <input type="file" accept="image/png,image/jpeg,image/gif" onChange={changeBanner} ref={bannerRef}/>

        {uploaded ? (
          <div>
            <Cropper
              src={uploaded}
              style={{ height: 400, width: 400 }}
              autoCropArea={1}
              aspectRatio={1}
              viewMode={3}
              guides={false}
              ref={cropperRef}
            />
            <button onClick={onCrop}>Crop</button>
            {cropped && <img src={cropped} alt="Cropped!" />}
          </div>
        ) : (
          <>
            <input
              type="file"
              style={{ display: 'none' }}
              ref={pictureRef}
              onChange={onFileInputChange}
              accept="image/png,image/jpeg,image/gif"
            />
            <button onClick={() => pictureRef.current?.click()}>
              Upload something!
            </button>
          </>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
}