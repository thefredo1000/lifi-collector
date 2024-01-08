import {
  Button,
  Center,
  CircularProgress,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ChainSelector from "./components/ChainSelector";
import { fetchCollectedFees, getTxRequest } from "./utils/lifi";
import { IntegratorData, Token } from "./utils/types";
import { AddressSelector } from "./components/AddressSelector";
import { ethers } from "ethers";
import { SuccessModal } from "./components/SuccessModal";

function App() {
  const [loading, setLoading] = React.useState<boolean>(true);

  const [chains, setChains] = React.useState<number[]>([]);
  const [integratorData, setIntegratorData] = React.useState<IntegratorData>();
  const [selectedChain, setSelectedChain] = React.useState<
    number | undefined
  >();

  const [isTxRequestLoading, setIsTxRequestLoading] = useState<
    "PENDING" | "LOADING" | "LOADED"
  >("PENDING");

  const [txHash, setTxHash] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [request, setRequest] = useState<{
    transactionRequest: {
      data: string;
      to: string;
    };
  }>();

  const [selectedAddresses, setSelectedAddresses] = useState<Token[]>([]);

  useEffect(() => {
    fetchCollectedFees().then((data: IntegratorData) => {
      setIntegratorData(data);
      console.log(data);
      const chainIds = data.feeBalances.map((chain) => {
        return chain.chainId;
      });
      setChains(chainIds);
      setLoading(false);
    });
  }, []);

  const handleTxRequest = async () => {
    setIsTxRequestLoading("LOADING");
    const tokenAddresses = selectedAddresses.map((token) => token.address);
    const txRequest = await getTxRequest(selectedChain, tokenAddresses);
    console.log(txRequest);
    setRequest(txRequest);
    setIsTxRequestLoading("LOADED");
  };

  const handleSignTx = async () => {
    const providerUrl = process.env.REACT_APP_PROVIDER_URL ?? "";
    const privateKey = process.env.REACT_APP_PRIVATE_KEY ?? "";
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const tx = await signer.sendTransaction({
      to: request?.transactionRequest.to,
      data: request?.transactionRequest.data,
    });

    setTxHash(tx.hash);
    onOpen();
  };

  return (
    <>
      <SuccessModal isOpen={isOpen} onClose={onClose} tx={txHash} />
      <Center
        w="100vw"
        h="100vh"
        bgGradient="linear(to-r, #232526 0%, #414345 66%)"
      >
        {loading ? (
          <Center w="xl" minH="xl" bgColor="#F4F4F9" borderRadius="xl" p="2rem">
            <CircularProgress isIndeterminate color="#FF3366" />
          </Center>
        ) : (
          <Flex
            w="xl"
            minH="xl"
            bgColor="#F4F4F9"
            borderRadius="xl"
            p="2rem"
            direction="column"
          >
            <ChainSelector
              setSelectedChain={setSelectedChain}
              chains={chains}
            />
            <AddressSelector
              chainId={selectedChain}
              feeBalances={integratorData?.feeBalances ?? []}
              setSelectedAddresses={setSelectedAddresses}
              selectedAddresses={selectedAddresses}
            />
            {selectedAddresses.length > 0 && (
              <Center w="100%" py="1rem">
                <Button
                  bgColor="#FF3366"
                  colorScheme="pink"
                  onClick={() => {
                    handleTxRequest();
                  }}
                >
                  Get transaction request
                </Button>
              </Center>
            )}
            {isTxRequestLoading === "PENDING" ? null : isTxRequestLoading ===
              "LOADING" ? (
              <Center w="100%" py="1rem">
                <CircularProgress isIndeterminate color="#FF3366" />
              </Center>
            ) : (
              <>
                <Flex direction="column">
                  <Text fontSize="lg" fontWeight={600}>
                    Transaction data
                  </Text>
                  <Text fontSize="sm" fontWeight={400} fontFamily="monospace">
                    {request?.transactionRequest.data}
                  </Text>
                  <Text fontSize="lg" fontWeight={600}>
                    To
                  </Text>
                  <Text fontSize="sm" fontWeight={400} fontFamily="monospace">
                    {request?.transactionRequest.to}
                  </Text>
                </Flex>
                <Center w="100%" py="1rem" flexDirection="column">
                  <Button
                    bgColor="#FF3366"
                    colorScheme="pink"
                    onClick={() => {
                      setIsTxRequestLoading("PENDING");
                      handleSignTx();
                    }}
                  >
                    Sign transaction
                  </Button>
                </Center>
              </>
            )}
          </Flex>
        )}
      </Center>
    </>
  );
}

export default App;
