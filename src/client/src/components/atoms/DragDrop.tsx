import ImageCollection from "../molecules/ImageCollection";
import Button from "./Button";
import React, { useRef, useState } from "react";

interface Image {
  name: string;
  url: string;
}

function DragDropImageUploader() {
  const [images, setImages] = useState<Image[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function selectFiles() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function onFileSelect(event: { target: { files: any } }) {
    const files = event?.target.files;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split("/")[0] !== "image") continue;
      if (!images.some((e) => e.name === files[i].name)) {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          },
        ]);
      }
    }
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
    const files = event.dataTransfer.files;
  }

  return (
    <div>
      <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        {isDragging ? (
          <span>Drop Images here</span>
        ) : (
          <>
            Drag & Drop Image here or{" "}
            <span role="button" onClick={selectFiles}>
              Browse
            </span>{" "}
          </>
        )}
        <input
          name="file"
          type="file"
          multiple
          ref={fileInputRef}
          onChange={onFileSelect}
        ></input>
      </div>
      <ImageCollection
        images={images.map((img) => img.url)}
        onRemoved={(url) => deleteImage(url)}
      />
    </div>
  );
}

export default DragDropImageUploader;
