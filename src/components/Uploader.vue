<template>
  <div class="uploader file is-boxed is-centered is-large">
    <label class="file-label" for="ads-json">
      <input class="file-input" id="ads-json" type="file" @change="handleFile">
      <span class="file-cta">
        <span class="file-icon"><span class="fa fa-upload"></span></span>
        <span class="file-label">Chose your ads json file...</span>
      </span>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'uploader',
    methods: {
      handleFile(e) {
        for (let file of e.target.files) {
          this.parseFileContents(file);
        }
      },
      parseFileContents(file) {
        const reader = new FileReader();
        reader.onload = event => {
          try {
            const result = JSON.parse(event.target.result);
            this.$emit('uploaded', result);
          } catch (exception) {
            console.error('Bad file provided.');
          }
        };
        reader.readAsText(file);
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import '../sass/variables';
</style>
