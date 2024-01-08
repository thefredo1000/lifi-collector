import { useEffect, useState } from "react";
import { FeeBalance, Token, TokenBalance } from "../utils/types";
import { Flex, Checkbox } from "@chakra-ui/react";

export function AddressSelector({
  chainId,
  feeBalances,
  selectedAddresses,
  setSelectedAddresses,
}: {
  chainId: number | undefined;
  feeBalances: FeeBalance[];
  selectedAddresses: Token[];
  setSelectedAddresses: React.Dispatch<React.SetStateAction<Token[]>>;
}) {
  const [addressess, setAddresses] = useState<TokenBalance[]>([]);
  useEffect(() => {
    setSelectedAddresses([]);
    if (chainId) {
      setAddresses(
        feeBalances
          .find((feeBalance) => feeBalance.chainId === chainId)
          ?.tokenBalances.map((tokenBalance) => tokenBalance) ?? []
      );
    } else {
      setAddresses([]);
    }
  }, [chainId, feeBalances, setSelectedAddresses]);
  if (!chainId) {
    return null;
  }
  return (
    <Flex
      overflowY="auto"
      maxHeight="200px"
      direction="column"
      borderRadius="xl"
      border="2px"
      borderColor="#414345"
      p="1rem"
    >
      {addressess.map((val, index) => (
        <Checkbox
          colorScheme="pink"
          key={index}
          isChecked={selectedAddresses.some(
            (token) => token.address === val.token.address
          )}
          onChange={(e) => {
            setSelectedAddresses((prev) => {
              if (e.target.checked) {
                return [...prev, val.token];
              } else {
                return prev.filter(
                  (token) => token.address !== val.token.address
                );
              }
            });
          }}
        >
          {val.token.name} - ${val.amountUsd} USD
        </Checkbox>
      ))}
    </Flex>
  );
}
