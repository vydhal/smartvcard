<template>
  <div>
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>Página Não Encontrada</h1>
    <NuxtLink to="/">Home page</NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'error',
  layout: 'empty', //OR layout:'default'
  props: {
    error: {
      type: Object,
    },
  },
};
</script>