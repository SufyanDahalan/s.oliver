<script setup lang="ts">
import router from '@/router';
import { type RouteLocationMatched, RouterLink } from 'vue-router'
import { computed } from 'vue';

interface IMatechedRoute {
    name: string;
    path: string
}

const matchedRoutes = computed<IMatechedRoute[]>((): IMatechedRoute[] => {
    return router.currentRoute.value.matched.map((route: RouteLocationMatched) => {
        return {
            name: route.name as string,
            path: route.path
        };
    }).filter((route: IMatechedRoute) => route.name !== undefined)
})
</script>

<template>
    <div class="w-full flex py-4 flex-row">
        <template v-for="(route, index) in matchedRoutes">
            <template v-if="index < matchedRoutes.length - 1">
                <p>
                    <RouterLink :title="`${route.name} Page`" aria-label="`Navigate to ${route.name} Page`" :to="route.path"
                        class="font-bold w-fit p-0 m-0 text-black text-sm text-center hover:underline">
                        {{ route.name }}
                    </RouterLink>
                </p>
                &nbsp;/&nbsp;
            </template>
            <p v-else aria-current="page" :title="`${route.name} Page`" aria-label="`Current Page"
                class="w-fit text-sm text-center">
                {{ route.name }}
            </p>
        </template>
    </div>
</template>