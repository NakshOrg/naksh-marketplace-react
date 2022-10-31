import { useEffect, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { OutlineBtn } from "../uiComponents/Buttons"

export default function ListNftModal({ mint, listAndMint, setIsOpen, image, setImage, isVideo }) {
  const ref = useRef();

  const [preview, setPreview] = useState();

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
    }
  }, [image]);

  const uploadFile = (e) => {
    ref.current.click();
  };
  
  return (
    <div onClick={(e) => {e.stopPropagation()}} className="bg-brand-gray w-[491px] h-full rounded-xl m-10 p-5 flex flex-col justify-center items-center text-center space-y-4">
      <h1 className="text-4xl font-bold">
        This NFT will be listed in the marketplace
      </h1>
      <p className="text-md font-normal">Are you sure you want to proceed?</p>
      {isVideo && <h1 className="text-xl font-bold">Upload Cover Image for Video</h1>}
      {isVideo && 
        <div className="font-inter w-full h-full space-x-3 px-3 flex justify-center items-center">
            <div className="relative w-full h-full flex flex-col justify-center items-start">
            <input
                ref={ref}
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full hidden h-full absolute bg-transparent z-50 cursor-pointer"
                type="file"
            />
            <div
                onClick={(e) => uploadFile(e)}
                className="cursor-pointer w-full h-full flex flex-col justify-center items-center pt-3"
            >
                {image && (
                <div className="flex flex-col justify-center items-center space-y-4">
                    <img src={preview} className="w-1/2 border" />
                    <h3 className="text-xl font-bold">{image.name}</h3>
                    <div className="flex flex-col space-y-1 justify-center items-center">
                    <FiUploadCloud className="w-1/2 h-1/2" />
                    <h3 className="text-md font-bold">Change cover here</h3>
                    <p className="text-gray-500 text-sm text-center">
                        (Supports JPEG, .jpg, .png, .mp4 format)
                    </p>
                    </div>
                </div>
                )}
                {!image && (
                <>
                    <FiUploadCloud className="lg:w-1/3 justify-center items-center h-1/2" />
                    <h3 className="text-xl font-bold">Upload your NFT here</h3>
                    <p className="text-gray-500">
                    (Supports JPEG, .jpg, .png, .mp4 format)
                    </p>
                </>
                )}
            </div>
            </div>
        </div>
      }
      <div className="w-full flex justify-center items-center space-x-4">
        <OutlineBtn style={{
            cursor: image ? "default" : "not-allowed"
        }} onClick={() => mint()} text="ENLIST LATER" />
        <OutlineBtn
          onClick={() => listAndMint()}
          text="LIST IN MARKETPLACE"
          style={{
            cursor: image ? "default" : "not-allowed",
            backgroundColor: "#fff",
            color: "#000",
            padding: "10px",
            width: "50%",
          }}
        />
      </div>
    </div>
  );
}