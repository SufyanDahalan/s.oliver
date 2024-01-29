import { defineStore } from 'pinia'

export const useProductStore = defineStore('products', {
  state: (): { products: Array<IProduct> } => {
    return {
      products: seedProducts
    }
  },
  actions: {
    async getProduct(): Promise<void> {}
  }
})

const seedProducts: Array<IProduct> = [
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
    new: false
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
    new: false
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
    new: true
  }
]
