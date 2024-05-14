import ImageCollection from "../molecules/ImageCollection";
import Button from "./Button";
import React, { useRef, useState } from "react";
import { Flowtext } from "./Text";
import { buildFiletoBase64 } from "@/helpers/stringHelpers";

interface Image {
  name: string;
  url: string;
  base64: string;
}

export interface Props {
  onChange: (images: Image[]) => void;
}

const DragDropImageUploader: React.FC<Props> = ({ onChange }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  function selectFiles() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  async function addFiles(files: any) {
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!images.some((e) => e.name === files[i].name)) {
        await buildFiletoBase64(files[i])
          .then((base64) => {
            setImages((prevImages) => {
              const changed = [
                ...prevImages,
                {
                  name: files[i].name,
                  url: URL.createObjectURL(files[i]),
                  base64: base64 as string,
                },
              ];
              onChange(changed);
              return changed;
            });
          })
          .catch((err) => setError("Error uploading image"));
      }
    }
  }

  function onFileSelect(event: { target: { files: any } }) {
    addFiles(event.target.files);
  }

  function deleteImage(url: string) {
    setImages((prevImages) => prevImages.filter((img) => img.url != url));
    console.log("test");
  }

  function onDragOver(event: {
    preventDefault: () => void;
    dataTransfer: { dropEffect: string };
  }) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event: { preventDefault: () => void }) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event: {
    preventDefault: () => void;
    dataTransfer: { files: any };
  }) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  return (
    <div className="bg-slate-100 p-1 rounded">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className="m-1 space-y-2"
      >
        <Button type="button" onClick={selectFiles}>
          Browse Files
        </Button>
        <Flowtext italic light>
          {isDragging ? "Drop Files Here!" : "...or Drag and Drop Files"}{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 inline -mt-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
            />
          </svg>
        </Flowtext>
        <input
          name="file"
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={onFileSelect}
          className="hidden"
        ></input>
        <div className="border-2 border-dashed rounded p-2 border-primaryHover">
          {images.length ? (
            <ImageCollection
              images={images.map((img) => img.url)}
              onRemoved={(url) => deleteImage(url)}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          )}
        </div>
      </div>
      {error && (
        <Flowtext className="!text-red-500 !text-sm" italic>
          {error}
        </Flowtext>
      )}
    </div>
  );
};

export default DragDropImageUploader;
