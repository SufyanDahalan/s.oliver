interface ICart {
  products: Array<ICartProduct>
}
interface ICartProduct extends IProduct {
  quantity: number
}
