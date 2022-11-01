export default interface Product {
  id: number,
  name: string,
  url: string,
  cost: number,
  lastModified: Date | null,
  purchasedDate: Date | null,
  sortOrder: number,
}
