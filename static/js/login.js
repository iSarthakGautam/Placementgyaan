 const { createApp, ref } = Vue

  createApp({
    setup() {
      const greet = ref('Hello vue!')
      return {
        greet
      }
    }
  }).mount('#app')