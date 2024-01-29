import { defineStore } from 'pinia'
// Not used. Cane be used for a product feed view though.
const useProductStore = defineStore('products', {
  state: (): { products: Array<IProduct> } => {
    return {
      products: []
    }
  },
  actions: {
    async getProduct(): Promise<void> {}
  }
})

