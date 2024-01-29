import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'

export const useCartStore = defineStore('cart', {
  state: (): ICart => {
    return {
      products: []
    }
  },
  actions: {
    async getCart() {
      let res = await api.get('/cart/products')
      this.products = []
      res.data.forEach((el: any) => {
        this.products.push({
          brand: el.product.brand,
          imgUrl: el.product.imgUrl,
          name: el.product.name,
          price: el.product.price,
          color: el.product.color,
          size: el.product.size,
          id: el.product.id,
          discount: el.product.discount,
          sustainable: el.product.sustainable,
          new: el.product.new,
          quantity: el.quantity
        })
      })
      this.products
    },
    async addRandomProduct() {
      let res = await api.get('/cart/products/addrandom') // add a random product
      let res1 = await this.getCart() // update products
    },
    async decreaseQuantity(productId: number) {
      let res = await api.post('/cart/products/decrease/', { productId: productId })
      let res1 = await this.getCart() // update products
    },
    async increaseQuantity(productId: number) {
      let res = await api.post('/cart/products/increase/', { productId: productId })
      let res1 = await this.getCart() // update products
    },
    async removeItem(productId: number) {
      let res = await api.post('/cart/products/delete/', { productId: productId })
      let res1 = await this.getCart() // update products
    }
  },
  getters: {
    getTotalPrice(): number {
      const totalPrice = this.products.reduce(
        (accumulator: number, currentValue: ICartProduct) =>
          accumulator +
          (Math.round(
            currentValue.price * (1 - currentValue.discount / 100) * currentValue.quantity
          ) -
            0.01),
        0
      )
      return totalPrice
    },
    getTotalSavings(): number {
      const totalPrice = this.products.reduce(
        (accumulator: number, currentValue: ICartProduct) =>
          accumulator +
          Math.round(currentValue.price * (currentValue.discount / 100) * currentValue.quantity),
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
