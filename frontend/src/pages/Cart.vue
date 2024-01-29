<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { storeToRefs } from 'pinia';
import Minus from '@/components/icons/Minus.vue';
import Plus from '@/components/icons/Plus.vue';
import Heart from '@/components/icons/Heart.vue';
import TrashBin from '@/components/icons/TrashBin.vue';

const cartStore = useCartStore()
const { products } = storeToRefs(cartStore)
console.log('.env.local stuff: ', import.meta.env.VITE_API_BASE_URL);
/**
 * # TODOs
 * 1. the item height is too much. prob switch out some margins for paddings instead.
 * 2. Responsive (mobile, mid laptop)
 * 
 */
</script>
<template>
  <div class="w-full grid grid-cols-1 lg:grid-cols-4">
    <div class="col-span-1 lg:col-span-3 bg-white lg:mr-4 px-2 lg:px-16 ">
      <h1 class="text-3xl my-6">
        Cart {{ products.length > 0 ? `(${products.length})` : '' }}
      </h1>
      <div v-for="(product, index) in products" :key="index" class="h-min">
        <div class="w-full flex flex-col lg:flex-row">
          <div class="lg:col-span-2 pr-6 lg:w-72 w-full">
            <img loading="lazy" :src="product.imgUrl" :alt="product.name" class="w-full h-auto object-cover">
          </div>

          <div class="w-full h-full pt-4 flex flex-col">

            <div class="row-span-1 grow w-full text-center lg:text-left">
              <span v-if="product.discount > 0" class="bg-red-600 text-white font-bold px-1.5 py-0.5 mr-2 select-none">
                -{{ product.discount }}%
              </span>

              <span v-if="product.sustainable" class="bg-green-800 text-white font-bold px-1.5 py-0.5 mr-2 select-none">
                SUSTAINABLE
              </span>
              <span v-if="product.new" class="bg-gray-300 text-black font-bold px-1.5 py-0.5 mr-2 select-none">NEW</span>
            </div>

            <div class="row-span-1">
              <p class="text-gray-400 font-bold my-2 text-center lg:text-left"> {{ product.brand }} </p>
            </div>

            <div class="row-span-1 text-center lg:text-left">
              <p class="my-2"> {{ product.name }}</p>
            </div>

            <div class="row-span-1 text-center lg:text-left">
              <p class="my-2">{{ product.color }} | {{ product.size }}</p>
            </div>

            <div class="row-span-1 text-center lg:text-left">
              <p class="text-xs mb-4">
                Quantity
              </p>
              <div class="grid grid-flow-col w-fit mx-auto lg:mx-0">
                <button class="col-span-1 w-10  h-10 border-[1px] border-solid stroke-black text-black
                disabled:text-slate-200 disabled:stroke-slate-200" :disabled="product.quantity === 1">
                  <Minus class="m-auto p-1.5" />
                </button>
                <span class="flex items-center justify-center m-auto w-10 h-10 border-[1px] border-solid font-bold">
                  {{ product.quantity }}
                </span>
                <button
                  class="col-sspan-1 w-10 text-black stroke-black disabled:text-slate-200 disabled:stroke-slate-200 h-10 border-[1px] border-solid">
                  <Plus class="m-auto p-1.5" />
                </button>
              </div>
            </div>
            <div class="flex flex-col lg:flex-row w-full">
              <div class="flex gap-6 mt-4 float-left lg:w-1/2 w-full">
                <button class="ml-auto lg:ml-0">
                  <TrashBin class="w-6 inline-block mr-2" />
                  <p>
                    Remove item
                  </p>
                </button>
                <button class="mr-auto lg:mr-0">
                  <Heart class="w-6 text-white stroke-black inline-block mr-2" />
                  <p>
                    Add to wish list
                  </p>
                </button>
              </div>
              <div
                class="lg:float-right lg:w-1/2 w-full lg:text-right text-center">
                <span v-if="product.discount > 0" class="flex row-auto lg:float-right">
                  <p class="price mr-4 w-fit ml-auto lg:ml-0" old>{{ product.price }} &euro; </p>
                  <p class="font-semibold w-fit price mr-auto lg:mr-0" new>
                    {{ (Math.round(product.price * (1 - (product.discount / 100))) - 0.01).toFixed(2) }} &euro;
                  </p>
                </span>
                <span v-else class="price">
                  {{ product.price.toFixed(2) }} &euro;
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="index < products.length - 1" class="w-full border-gray-200 border-[1px] mt-2 mb-10">
        </div>
      </div>
    </div>
    <div class="lg:col-span-1 bg-white mt-4 lg:mt-0 py-6 px-4 lg:px-8 h-fit">
      <h1 class="text-2xl pb-6">
        Summary
      </h1>

      <div class="inline-block w-full pb-3">
        <p class="float-left">
          Subtotal
        </p>
        <p class="float-right">
          {{ cartStore.getTotalPrice.toFixed(2) }} &euro;
        </p>
      </div>

      <div class="w-full border-gray-200 border-[1px] mt-2 mb-10"></div>

      <div class="inline-block w-full pb-3">
        <span class="text-black w-min">
          <span class="grid float-left">
            <p class="font-bold uppercase float-left w-fit">
              total
            </p>
            <p class="w-fit float-left break-before-avoid"> incl. VAT</p>
          </span>
          <p class="float-right">
            {{ cartStore.getTotalPrice.toFixed(2) }} &euro;
          </p>
        </span>
      </div>
      <button class="bg-black text-white w-full p-3">
        <span class="float-left py-1">
          Checkout
        </span>
        <div class="float-right py-1">
          <div class="border-white border-solid border-[1px] w-3 m-1.5 rotate-45"></div>
          <div class="border-white border-solid border-[1px] w-3 m-1.5 -rotate-45"></div>
        </div>
      </button>
      <div class="mb-4 w-full mt-2 lg:mt-0">
        <p class="w-full text-[14px] leading-6">Your order from the international s.oliver online shop
          will be shipped by DHL Worldwide. Shipping costs are 4.95 &euro;.</p>
      </div>
      <div>
        <span class="text-red-600 uppercase float-left">
          You can save today
        </span>
        <span class="text-red-600 uppercase float-right">
          50.00 &euro;
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="pcss">
.price {
  @apply  align-bottom mt-5;
  &[old] {
    @apply line-through text-black;
  }
  &[new] {
    @apply text-red-600;
  }
  &:not([old]) {
    @apply font-semibold; 
  }
}
</style>