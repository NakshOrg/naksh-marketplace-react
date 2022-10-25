import { GradientBtn, OutlineBtn } from "../../components/uiComponents/Buttons";
import { HiOutlineCamera } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import useCollection from "../../hooks/useCollection";
import toast from "react-hot-toast";
import { useNFTs } from "../../hooks";
import { useAppContext } from "../../context/wallet";
import { HiPlusCircle } from "react-icons/hi";
import { ethers } from "ethers";
import factoryAbi from "../../interface/factoryAbi.json";
import { useHistory } from "react-router-dom";
import { HiTrash } from "react-icons/hi";
import { staticValues } from "../../constants";
import classes from "../profile/profile.module.css";

export default function CreateCollection(props) {
  const { evmWalletData, evmProvider } = useAppContext();
  const { createCollection } = useCollection();
  const { uploadMedia } = useNFTs();

  const [logoPreview, setLogoPreview] = useState("");
  const [logo, setLogo] = useState();

  const [coverPreview, setCoverPreview] = useState("");
  const [cover, setCover] = useState();

  const [selectedGradient, setSelectedGradient] = useState(
    staticValues.gradients[0]
  );

  const [isGradient, setIsGradient] = useState(false);
  const [gradient, setGradient] = useState("");
  const [description, setDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const [royalty, setRoyalty] = useState(1);
  const [royaltyPerc, setRoyaltyPerc] = useState(0);
  const [royalties, setRoyalties] = useState([{ wallet: "", percentage: "" }]);

  const ref = useRef(null);
  const coverRef = useRef(null);

  const history = useHistory();

  const clickRef = () => {
    ref.current.click();
  };

  const clickCoverRef = () => {
    coverRef.current.click();
  };

  const createCollectionWrapper = async () => {
    const toastId = toast.loading("Creating Collection");

    const logoUri = await uploadMedia(logo);

    try {
      let hash = "";
      const wallets = royalties.map((royalty) => royalty.wallet);
      const percentages = royalties.map((royalty) => royalty.percentage);
      if (!isGradient) {
        console.log(royalties);
        // return

        const coverUri = await uploadMedia(cover);
        const tx = await createCollection(
          name,
          symbol,
          { instagram, facebook, twitter, website },
          `https://${coverUri}.ipfs.nftstorage.link/`,
          isGradient,
          description,
          `https://${logoUri}.ipfs.nftstorage.link/`,
          evmWalletData.address,
          percentages,
          wallets
        );
        hash = tx.hash;
        await tx.wait();
      } else {
        const tx = await createCollection(
          name,
          symbol,
          { instagram, facebook, twitter, website },
          selectedGradient,
          isGradient,
          description,
          `https://${logoUri}.ipfs.nftstorage.link/`,
          evmWalletData.address,
          percentages,
          wallets
        );
        hash = tx.hash;
        await tx.wait();
      }

      const receipt = await evmProvider.getTransactionReceipt(hash);

      for (let i = 0; i < receipt.logs.length; i++) {
        const log = receipt.logs[i];
        if (
          log.topics.includes(
            "0x6974864ab24c795f57c207a650ae6763287c14a1c55fedc8506acb02796eb1a5"
          )
        ) {
          const decoder = ethers.utils.defaultAbiCoder;
          const decodedData = decoder.decode(
            ["address", "string", "string", "address"],
            log.data
          );

          toast.success(
            `Successfully created collection at ${decodedData[3]}`,
            {
              id: toastId,
            }
          );
          history.push(`/collection/${decodedData[3]}`);
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleGradient = (index) => {
    setSelectedGradient(staticValues.gradients[index]);
    setIsGradient(true);
  };

  const changeRoyalties = (index, values) => {
    setRoyalties((v) => {
      let a = [...v];

      if (index < a.length) {
        if (values.wallet) {
          a[index].wallet = values.wallet;
        }

        if (values.percentage) {
          a[index].percentage = values.percentage;
        }
      } else {
        for (let i = a.length; i <= index; i++) {
          if (i === index)
            a.push({ wallet: values.wallet, percentage: values.percentange });
          else a.push({ wallet: "", percentage: "" });
        }
      }

      return a;
    });
  };

  const incrementRoyalty = () => {
    if (royalty >= 6) return;

    let shallowV = [...royalties];
    shallowV.push({ wallet: "", percentage: "" });

    setRoyalties(shallowV);
    setRoyalty(() => royalty + 1);
  };

  const removeRoyalty = (value, idx) => {
    let shallowV = [...royalties];

    let anotherCopy = [];

    for (let i = 0; i < shallowV.length; i++) {
      if (i === idx) {
        console.log(shallowV[i], i, shallowV.length);
      } else {
        anotherCopy.push(shallowV[i]);
      }
    }
    console.log(anotherCopy, anotherCopy.length);
    setRoyalties(anotherCopy);
    setRoyalty(royalty - 1);
  };

  useEffect(() => {
    console.log(royalties);

    let perc = 0;

    for (let i = 0; i < royalties.length; i++) {
      perc += Number(royalties[i].percentage);
    }

    setRoyaltyPerc(perc / 100);
  }, [royalties]);

  useEffect(() => {
    if (cover) {
      const url = URL.createObjectURL(cover);
      console.log(url);
      setCoverPreview(url);
    }
  }, [cover]);

  useEffect(() => {
    if (logo) {
      const url = URL.createObjectURL(logo);

      setLogoPreview(url);
    }
  }, [logo]);

  return (
    <div className="w-full space-y-10 h-full md:mt-[105px] sm:mt-0 mt-20 md:px-[8%] sm:px-0 mb-20 px-10">
      <div className="w-full flex justify-around items-center">
        <div className="w-1/2 flex justify-start items-center space-x-4">
          <span className="text-xl font-bold">&larr;</span>
          <h1 className="text-xl md:text-3xl font-bold">Create Collection</h1>
        </div>
        <div className="w-1/2 flex justify-end items-center space-x-4">
          <GradientBtn
            onClick={() => createCollectionWrapper()}
            content="SAVE CHANGES"
            style={{ width: "187px" }}
          />
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-start space-y-4">
        <h1>Upload Picture</h1>
        <div className="w-full h-full flex flex-col md:flex-row justify-center md:justify-start items-center space-y-5 md:space-y-0 md:space-x-5">
          <div className="w-[150px] h-[150px] rounded-full bg-brand-gray flex justify-center items-center">
            {!logoPreview && <HiOutlineCamera className="text-5xl" />}
            {logoPreview && (
              <img src={logoPreview} className="w-full h-full rounded-full" />
            )}
          </div>
          <div className="flex flex-col justify-center items-center md:items-start space-y-4">
            <h1 className="text-xl">
              Upload a profile picture here. <br />
              Your picture will be public.
            </h1>
            <input
              ref={ref}
              onChange={(e) => setLogo(e.target.files[0])}
              className="w-full hidden h-full absolute bg-transparent z-50 cursor-pointer"
              type="file"
            />
            <div className="w-full h-full flex justify-center items-center space-x-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full p-3 text-white bg-brand-gray"
                placeholder="Name*"
              />
              <input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                type="text"
                className="w-full p-3 text-white bg-brand-gray"
                placeholder="Symbol*"
              />
            </div>
            <OutlineBtn onClick={() => clickRef()} text="UPLOAD FILE" />
          </div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-start space-y-4">
        <h1 className="font-bold">COVER PICTURE</h1>
        <div
          style={{ backgroundImage: `url("${coverPreview}")` }}
          className="relative w-full h-full p-5 flex bg-auto flex-col justify-center items-center text-center space-y-4 bg-brand-gray rounded-xl"
        >
          {/* {coverPreview && 
						<img src={coverPreview} className="absolute  z-0" />
					} */}
          <h1 className="text-xl z-50">
            Upload an optional cover picture for your profile here. <br />
            Your picture will be public.
          </h1>
          <input
            ref={coverRef}
            onChange={(e) => setCover(e.target.files[0])}
            className="w-full hidden h-full absolute bg-transparent z-50 cursor-pointer"
            type="file"
          />
          <OutlineBtn
            style={{ zIndex: "1000000" }}
            onClick={() => clickCoverRef()}
            text="UPLOAD FILE"
          />
        </div>
        <div style={{ position: "relative", width: "100%" }}>
          <div
            style={{ background: selectedGradient }}
            className={classes.gradientCover}
          >
            <div style={{ fontWeight: 500, fontSize: 16, marginRight: 10 }}>
              Or use our default gradients:
            </div>
            <div
              onClick={() => handleGradient(0)}
              style={{
                border:
                  selectedGradient == staticValues.gradients[0]
                    ? "2px solid"
                    : "2px solid transparent",
              }}
              className={classes.colorContainer1}
            >
              <div className={classes.color1} />
            </div>
            <div
              onClick={() => handleGradient(1)}
              style={{
                border:
                  selectedGradient == staticValues.gradients[1]
                    ? "2px solid"
                    : "2px solid transparent",
              }}
              className={classes.colorContainer2}
            >
              <div className={classes.color2} />
            </div>
            <div
              onClick={() => handleGradient(2)}
              style={{
                border:
                  selectedGradient == staticValues.gradients[2]
                    ? "2px solid"
                    : "2px solid transparent",
              }}
              className={classes.colorContainer3}
            >
              <div className={classes.color3} />
            </div>
          </div>
          {cover && (
            <div
              style={{
                background: "#000",
                opacity: 0.4,
                zIndex: 3,
                position: "absolute",
                margin: 0,
                top: 0,
                left: 0,
                cursor: "no-drop",
              }}
              className={classes.gradientCover}
            ></div>
          )}
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-start space-y-4">
        <h1 className="font-bold">ABOUT COLLECTION</h1>
        <div className="w-full space-y-3 flex flex-col justify-center items-end">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            id="desc"
            className="w-full bg-brand-gray p-3"
            placeholder="Tell us something about the collection!"
            rows={8}
          ></textarea>
          <p>0/300</p>
        </div>
      </div>
      <div
        className={
          " w-full  h-full space-y-4 flex flex-col justify-center items-start"
        }
      >
        <div className="w-full h-full flex justify-around items-center">
          <div className="w-1/2 h-full flex flex-col justify-center items-start">
            <h1 className="text-lg font-bold">FOREVER ROYALTIES</h1>
            <p className="text-gray-500">
              Forever Royalties are perpetual. You can add royalties up to 20%
              across 6 accounts
            </p>
          </div>
          <div className="w-1/2 h-full flex flex-col justify-center items-end">
            <HiPlusCircle
              onClick={() => incrementRoyalty()}
              className="text-5xl"
            />
          </div>
        </div>
        <div className="w-full h-full space-y-2 flex flex-col justify-center items-start">
          {Array(royalty)
            .fill(1)
            .map((i, idx) => (
              <div
                key={idx}
                className="w-full h-full space-x-3 flex justify-around items-center"
              >
                <div className="w-2/3 py-3 px-3 flex justify-center items-center bg-brand-gray">
                  <input
                    value={royalties[idx].wallet}
                    onChange={(e) =>
                      changeRoyalties(idx, { wallet: e.target.value })
                    }
                    type="text"
                    className="w-full p-0 text-white bg-brand-gray"
                    placeholder="Wallet Address*"
                  />
                  {royalties[idx] &&
                    royalties[idx].wallet &&
                    royalties[idx].wallet.length > 0 && (
                      <HiTrash
                        onClick={() => removeRoyalty(royalties[idx], idx)}
                        className="text-red-600 text-xl cursor-pointer"
                      />
                    )}
                </div>
                <div className="w-1/3 py-3 px-3 flex justify-center items-center bg-brand-gray">
                  <input
                    value={royalties[idx].percentage}
                    onChange={(e) =>
                      changeRoyalties(idx, { percentage: e.target.value })
                    }
                    type="text"
                    className="w-full p-0 text-white bg-brand-gray"
                    placeholder="Percentage*"
                  />
                  <p className="text-md p-0">%</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-start space-y-4">
        <h1 className="font-bold">SOCIAL MEDIA</h1>
        <div className="w-full h-full flex justify-center items-center space-x-4">
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            type="text"
            className="w-full p-3 text-white bg-brand-gray"
            placeholder="Instagram*"
          />
          <input
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            type="text"
            className="w-full p-3 text-white bg-brand-gray"
            placeholder="Twitter*"
          />
        </div>

        <div className="w-full h-full flex justify-center items-center space-x-4">
          <input
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            type="text"
            className="w-full p-3 text-white bg-brand-gray"
            placeholder="Facebook*"
          />
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            type="text"
            className="w-full p-3 text-white bg-brand-gray"
            placeholder="Website*"
          />
        </div>
      </div>
    </div>
  );
}
