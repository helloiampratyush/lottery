import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const [EntranceFee, setEntrance] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const LotteryAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    console.log(LotteryAddress)
    const {
        runContractFunction: enterLottery,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: LotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: EntranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: LotteryAddress,
        functionName: "getEntranceFee",
        params: {},
        //msgValue:
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: LotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
        //msgValue:
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: LotteryAddress,
        functionName: "getRecentWinner",
        params: {},
        //msgValue:
    })

    const dispatch = useNotification()
    async function updateui() {
        const EntranceFeefromcall = (await getEntranceFee()).toString()
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setNumberOfPlayers(numberOfPlayersFromCall)
        setEntrance(EntranceFeefromcall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateui()
        }
    }, [isWeb3Enabled])
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }
    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateui()
    }

    return (
        <div>
            {LotteryAddress ? (
                <div className="py-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isFetching || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter lottery"
                        )}
                    </button>

                    <p className="py-2 text-sky-700">
                        welcome to lottery you can read readme for mechanism
                    </p>
                    <p>Entrance fee is {ethers.utils.formatEther(EntranceFee).toString()} Eth</p>
                    <p>number of plyers is {numberOfPlayers}</p>
                    <p>recent winner was {recentWinner}</p>
                </div>
            ) : (
                <div>LotteryAddress is not detached</div>
            )}
        </div>
    )
}
