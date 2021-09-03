export class Ipfs {
  constructor(cid) {
    this.cid = cid;
  }
  metadataUrl = function () {
    const BASE_URL = "https://ipfs.io/ipfs";
    return `${BASE_URL}/${this.cid}/metadata.json`;
  };
  fetchMetadata = async function () {
    const metadataUrl = this.metadataUrl();
    const resp = await fetch(metadataUrl);
    const data = await resp.json();
    return data;
  };
}

export function ipfsToHttps(ipfs) {
  const BASE_URL = "https://ipfs.io/ipfs";
  return `${BASE_URL}/${ipfs.substr("ipfs://".length, ipfs.length)}`;
}
