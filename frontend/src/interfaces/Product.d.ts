interface IProduct {
  imgUrl: string // https://images.pexels.com/photos/14024358/pexels-photo-14024358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
  brand: string
  name: string
  price: number
  color: string
  size: string
  id: number
  /**
   * discount in percentage.
   * @default 0
   */
  discount: number
  /**
   * @default false
   */
  sustainable: boolean
  /**
   * @default false
   */
  new: boolean
}
