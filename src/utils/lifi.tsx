export async function fetchCollectedFees() {
  const url = encodeURI(
    "https://li.quest/v1/integrators/" + process.env.REACT_APP_LIFI_INTEGRATORS
  );
  console.log(url)

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-lifi-api-key": process.env.REACT_APP_LIFI_API_KEY || "",
    },
  };

  const response = await fetch(url, options);
  const json = await response.json();
  return json;
}

export async function getTxRequest(chainId = 1, tokenAddresses: string[] = []) {
  const tokenAddressesString =
    "?tokenAddresses=" + tokenAddresses.join("&tokenAddresses=");
  const url = `https://li.quest/v1/integrators/${process.env.REACT_APP_LIFI_INTEGRATORS}/withdraw/${chainId}${tokenAddressesString}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-lifi-api-key": process.env.REACT_APP_LIFI_API_KEY || "",
    },
  };

  const response = await fetch(url, options);
  const json = await response.json();
  return json;
}
