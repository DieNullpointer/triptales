import Input from "@/components/atoms/Input";
import Image from "@/components/atoms/Image";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import { changeUser, uploadPicture, uploadBanner } from "@/helpers/authHelpers";
import { useEffect, useState, createRef, cache } from "react";
import Loading from "@/components/static/Loading";
import {
  forgotPassword,
  getSelf,
  getUserByRegistry,
} from "@/middleware/middleware";
import defaultBanner from "@/resources/default_bannerpic.jpg";

import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Spacing from "@/components/atoms/Spacing";
import { Flowtext } from "@/components/atoms/Text";
import { useRouter } from "next/router";
import { log } from "console";
import { dataUrlToFile } from "@/helpers/imgHelpers";
import ProfileHeader from "@/components/molecules/ProfileHeader";

export default function Settings() {
  const { data, error, isLoading } = getSelf();

  const { user, profile, banner } = getUserByRegistry(data?.username);
  const [displayname, setDisplayname] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("");
  const [favDestination, setFavDestination] = useState("");

  const [updatedBanner, setUpdatedBanner] = useState<string>();
  const [updatedProfile, setUpdatedProfile] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    setDisplayname(data?.displayName);
    setDescription(data?.description);
    setEmail(data?.email);
    setOrigin(data?.origin);
    setFavDestination(data?.favDestination);
    setUpdatedBanner(banner);
    setUpdatedProfile(profile);
  }, [data]);

  const handleSubmit = async () => {
    // TODO open Dialog
    const response: any = await changeUser({
      registryName: data.username,
      displayName: displayname,
      password: data.password,
      email: email,
      description: description,
      origin: origin,
      favDestination: favDestination,
    });
    if (response.success) handleSuccessDialogOpen();
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
  const [mainDialogOpen, setMainDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleMainDialogOpen = () => {
    if (mainDialogOpen) setUploaded(null);
    setMainDialogOpen(!mainDialogOpen);
  };

  const handleSuccessDialogOpen = () => {
    setSuccessDialogOpen(!successDialogOpen);
  };

  const changeProfile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files?.[0];

    if (file) {
      file2Base64(file).then((base64) => {
        setUploaded(base64);
        handleMainDialogOpen();
      });
    }
  };

  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    setCropped(cropper.getCroppedCanvas().toDataURL());
  };

  const changeBanner = async () => {
    const response: any = await uploadBanner({
      banner: bannerRef.current?.files?.item(0),
    });
    if (response.success) {
      handleSuccessDialogOpen();
      file2Base64(bannerRef.current?.files?.item(0)!).then((base64) => {
        setUpdatedBanner(base64);
      });
    }
  };

  const changePicture = async () => {
    setMainDialogOpen(false);
    console.log(cropped);
    const file = dataUrlToFile(
      cropped!,
      `uploaded_${new Date().getTime()}.png`
    );
    console.log(file);

    const response: any = await uploadPicture({
      profile: file,
    });
    if (response.success) {
      setUpdatedProfile(cropped!);
      handleSuccessDialogOpen();
    }
  };

  const handleResetPassword = async () => {
    const response: any = await forgotPassword(email);
    router.push(`/recovery/password${response!}`);
  };

  return data ? (
    <div className="w-full">
      <Dialog open={mainDialogOpen} handler={handleMainDialogOpen}>
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
              <Button disabled={!cropped} onClick={changePicture}>
                Upload
              </Button>
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
      <Dialog open={successDialogOpen} handler={handleSuccessDialogOpen}>
        <DialogHeader>Changes Saved Successfully</DialogHeader>
        <DialogBody className="pt-0">
          <Flowtext>
            Your changes have been uploaded to the server and saved
            successfully. To view them, please refresh the profile page.
          </Flowtext>
        </DialogBody>
      </Dialog>
      <Spacing />
      <ProfileHeader banner={updatedBanner} profile={updatedProfile} />
      <Spacing space={updatedBanner? 14 : 6 } />
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
        <input
          id="avatarButton"
          type="file"
          className="hidden"
          ref={pictureRef}
          onChange={changeProfile}
          accept="image/png,image/jpeg,image/gif"
        />
        <input
          id="bannerButton"
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/gif"
          onChange={changeBanner}
          ref={bannerRef}
        />
        <Spacing />
        <div className="flex space-x-4">
          <Button onClick={() => pictureRef.current?.click()}>
            Upload Avatar
          </Button>
          <Button onClick={() => bannerRef.current?.click()}>
            Upload Banner
          </Button>
        </div>
        <Spacing />
        <Button onClick={handleResetPassword}>Reset Password</Button>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
