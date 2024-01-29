import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: (): ICart => {
    return {
      products: seedCartProducts
    }
  },
  actions: {},
  getters: {
    getTotalPrice(): number {
      const totalPrice = this.products.reduce(
        (accumulator: number, currentValue: IProduct) => accumulator + ((Math.round(currentValue.price * (1 - (currentValue.discount / 100))) - 0.01)), // TODO count discount in
        0
      )
      return totalPrice
    },
    getQuantity() {
      return (id: number): number => {
        const quantity = this.products.filter((product: ICartProduct) => product.id === id).length
        return quantity
      }
    }
  }
})

const seedCartProducts: Array<ICartProduct> = [
  {
    description: 'bruh i guess they need no description',
    brand: 'QS by s.Oliver',
    imgUrl: '/src/assets/strech-cotton.webp',
    name: 'Stetch cotton cargo trousers',
    price: 59.99,
    color: 'Dark Grey',
    size: '29/32',
    id: 0,
    discount: 43,
    sustainable: true,
    new: false,
    quantity: 1
  },
  {
    description: 'bruh i guess they need no description',
    brand: 'QS by s.Oliver',
    imgUrl: '/src/assets/regular-fit.webp',
    name: 'Regular fit: linen blend trousers',
    price: 49.99,
    color: 'Deep Blue',
    size: 'S',
    id: 1,
    discount: 48,
    sustainable: true,
    new: false,
    quantity: 1
  },
  {
    description: 'bruh i guess they need no description',
    brand: 's.Oliver',
    imgUrl: '/src/assets/t-shirt.webp',
    name: 's.Oliver print T-shirt',
    price: 15.99,
    color: 'Dark Blue',
    size: 'S',
    id: 2,
    discount: 0,
    sustainable: false,
    new: true,
    quantity: 1
  }
]
