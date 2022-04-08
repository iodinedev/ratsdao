interface Nft {
  id: string,
  name: string,
  tags: string[],
  quantity: number,
  projectsId: number,
  url: string
}

interface Project {
  id: number,
  name: string,
  nfts: Nft[]
}