import Image from "../atoms/Image";

export interface Props {
    images: [{image: string}];
    className?: string;
}

const ImageCollection: React.FC<Props> = ({images, className}) => {
    return <div className="flex flex-row">
        {
            images.map((image) => <Image src={image.image} className="h-48 w-auto" />)
        }
    </div>;
}

export default ImageCollection;