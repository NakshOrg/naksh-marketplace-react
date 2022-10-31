import "./uiComponents.css";
import { useNFTs } from "../../hooks";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import polygon from "../../assets/svgs/white-polygon-logo.svg";
import { FiUploadCloud } from "react-icons/fi";

const UploadCoverImageNFTModal = ({ isOpen, setIsOpen, image, setImage, erc721 }) => {
    const { uploadMedia } = useNFTs()
    const ref = useRef()

    const [preview, setPreview] = useState()

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
    <div className="bg-[#12192B] space-y-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-1/2 lg:w-1/3 h-11/12 rounded-xl p-3 flex flex-col justify-center items-center">
      <h1
        className="text-5xl font-bold px-4 pt-4"
        style={{
          fontFamily: "Athelas-Bold",
        }}
      >
        Upload Cover Image
      </h1>
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
            className="cursor-pointer w-full h-full flex flex-col justify-center items-center pt-3 bg-brand-gray"
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
          <div className="w-full my-4 flex justify-center items-center">
            <div
              onClick={() => setIsOpen(false)}
              className={( !image ? "bg-gray-500 cursor-not-allowed " : "bg-white cursor-pointer " ) + "tracking-widest font-semibold w-1/2 h-full p-3 text-center text-xl  text-black text-bold rounded-xl"}
            >
              SUBMIT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCoverImageNFTModal;
