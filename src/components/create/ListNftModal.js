import { OutlineBtn } from "../uiComponents/Buttons"

export default function ListNftModal({ mint, listAndMint }) {
    return (
        <div className="bg-brand-gray w-[491px] h-[321px] rounded-xl m-10 p-5 flex flex-col justify-center items-start space-y-4">
            <h1 className="text-4xl font-bold">This NFT will be listed in the marketplace</h1>
            <p className="text-md font-normal">Are you sure you want to proceed?</p>

            <div className="w-full flex justify-start items-center space-x-4">
                <OutlineBtn onClick={() => mint()} text="ENLIST LATER" />
                <OutlineBtn onClick={() => listAndMint()} text="LIST IN MARKETPLACE" style={{ backgroundColor: "#fff", color: "#000", padding: '10px', width: '50%' }} />
            </div>
        </div>
    )
}