<template>
  <v-container class="fill-height" fluid style="z-index: 10; position: relative;">
    <v-card class="yuoooka-glass-card yuoooka-text-shadow mx-auto my-4 pa-4" width="100%" max-width="1200" style="min-height: 80vh;">
      <v-card-title class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" @click="$emit('back')" class="mr-4 text-white"></v-btn>
        <span class="text-h4 font-weight-bold">友链 (Links)</span>
      </v-card-title>
      <v-divider class="my-3 border-opacity-50" color="white"></v-divider>
      <v-card-text>
        <div class="text-center text-h5 mt-10 text-white" style="opacity: 0.8;">
          <v-icon size="64" class="mb-4" color="white">mdi-link-variant</v-icon>
          <p>友情链接即将上线...</p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'LinksPage',
  emits: ['back']
}
</script>
