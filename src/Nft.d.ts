interface Nft {
  id: string,
  name: string,
  tags: string[],
  quantity: number,
  projectsId: number,
  fingerprint: string,
  url: string
}

interface Project {
  id: number,
  name: string,
  nfts: Nft[],
  value: number
}