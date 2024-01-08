import { Select, Text } from "@chakra-ui/react";

export default function ChainSelector({
  chains,
  setSelectedChain,
}: {
  chains: number[];
  setSelectedChain: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
  return (
    <>
      <Text fontSize="lg" fontWeight={600}>
        Chain
      </Text>
      <Select
        placeholder="Select chain"
        my="1rem"
        onChange={(e) => {
          setSelectedChain(parseInt(e.target.value));
        }}
      >
        {chains.map((chain) => (
          <option key={chain} value={chain}>
            {chain}
          </option>
        ))}
      </Select>
    </>
  );
}
