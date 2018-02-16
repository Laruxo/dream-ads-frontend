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
      async parseFileContents(file) {
        try {
          const content = await this.readFile(file);
          this.$emit('uploaded', JSON.parse(content));
        } catch (e) {
          console.error(e.message);
        }
      },
      readFile(file) {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
          reader.onerror = () => {
            reader.abort();
            reject(new DOMException('Problem parsing input file.'));
          };
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsText(file);
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../sass/variables';
</style>
