import Input from "@/components/atoms/Input";
import Image from "@/components/atoms/Image";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import { changeUser, uploadPicture, uploadBanner } from "@/helpers/authHelpers";
import { useEffect, useState, createRef, cache } from "react";
import Loading from "@/components/static/Loading";
import { getSelf, getUserByRegistry } from "@/middleware/middleware";
import defaultBanner from "@/resources/default_bannerpic.jpg";

import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Spacing from "@/components/atoms/Spacing";

export default function Settings() {
  const { data, error, isLoading } = getSelf();

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
    await changeUser({
      registryName: data.username,
      displayName: displayname,
      password: data.password,
      email: email,
      description: description,
      origin: origin,
      favDestination: favDestination,
    });
  };

  const file2Base64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || "");
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

  // the modal for cropper
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (open) setUploaded(null);
    setOpen(!open);
  };

  const onFileInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      file2Base64(file).then((base64) => {
        setUploaded(base64);
        handleOpen();
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
      banner: bannerRef.current?.files?.item(0),
    });
  };

  const changePicture = async () => {
    const response = await uploadPicture({
      profile: pictureRef.current?.files?.item(0),
    });
  };

  return data ? (
    <div className="w-full">
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Crop Avatar</DialogHeader>
        <DialogBody>
          <div className="space-y-2">
            <Cropper
              src={uploaded!}
              style={{ height: 400, width: 400 }}
              autoCropArea={1}
              aspectRatio={1}
              viewMode={3}
              guides={false}
              ref={cropperRef}
            />
            <div className="flex space-x-4">
              <Button onClick={onCrop}>Crop Avatar</Button>
              <Button onClick={() => {}}>Upload</Button>
            </div>
            {cropped && (
              <Image
                className="rounded-full h-32 w-32"
                src={cropped}
                alt="Cropped Image"
              />
            )}
          </div>
        </DialogBody>
      </Dialog>
      <Spacing />
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
      <Spacing />
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
          Save Account Info
        </Button>

        {/**
 *         <input
          type="file"
          accept="image/png,image/jpeg,image/gif"
          onChange={changePicture}
          ref={pictureRef}
        />
 */}
        <input
          type="file"
          className="hidden"
          ref={pictureRef}
          onChange={onFileInputChange}
          accept="image/png,image/jpeg,image/gif"
        />
        <input
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/gif"
          onChange={changeBanner}
          ref={bannerRef}
        />
        <div className="flex space-x-4">
          <Button onClick={() => pictureRef.current?.click()}>
            Upload Avatar
          </Button>
          <Button onClick={() => bannerRef.current?.click()}>
            Upload Banner
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
