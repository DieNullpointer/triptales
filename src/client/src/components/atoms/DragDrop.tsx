import Button from "./Button";
import React, {useRef,useState} from "react";

interface Image {
    name: string;
    url: string;
}

function DragDropImageUploader(){
    const [images,setImages] = useState<Image[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null);

    function selectFiles(){
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    function onFileSelect(event: { target: { files: any; }; }){
        const files = event?.target.files;
        if(files.length === 0) return;
        for(let i = 0; i < files.length; i++){
            if(files[i].type.split("/")[0] !== "image") continue;
            if(!images.some((e)=> e.name === files[i].name)){
                setImages((prevImages)=> [
                    ...prevImages, 
                    {
                        name: files[i].name,
                        url: URL.createObjectURL(files[i]),
                    },
                ]);
            }
        }
    }

    function deleteImage(index: number){
        setImages((prevImages) => prevImages.filter((_, i) => i != index));
    }

    function onDragOver(event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }){
        event.preventDefault();
        setIsDragging(true)
        event.dataTransfer.dropEffect = "copy"

    }

    function onDragLeave(event: { preventDefault: () => void; }){
        event.preventDefault();
        setIsDragging(false)
    }

    function onDrop(event: { preventDefault: () => void; dataTransfer: { files: any; }; }){
        event.preventDefault();
        setIsDragging(false)
        const files = event.dataTransfer.files;
    }

    function uploadImage(){
        console.log("index :", images)
    }

    return(
        <div className="card">
            <div className="top">
                <p>Drag & Drop Image uploading</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mt-4" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {isDragging ? (
                    <span className="select">
                        Drop Images here
                    </span>
                ) : (
                    <>
                    Drag & Drop Image here or (" ")
                    <span className="select cursor-pointer" role="button" onClick={selectFiles}>
                        Browse
                    </span>
                    </>
                )}
                <input name="file" type="file" className="file" multiple ref={fileInputRef} onChange={onFileSelect}></input>
            </div>
            <div className="container mt-4">
                {images.map((images,index) => (
                    <div className="image" key={index}>
                        <span className="delete cursor-pointer" onClick={() => deleteImage(index)}>&times;</span>
                    <img src={images.url} alt={images.name} />
                    </div>
                ))}
            </div>
            <Button type="button" onClick={uploadImage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                Upload
            </Button>
        </div>
    )
}


export default DragDropImageUploader;