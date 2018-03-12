<template>
  <section class="section">
    <div class="uploader file is-boxed is-centered is-large">
      <label class="file-label" for="ads-json">
        <input class="file-input" id="ads-json" type="file"
               @change="handleFile($event.target.files[0])"/>
        <span class="file-cta">
          <span class="file-icon"><span class="fa fa-upload"/></span>
          <span class="file-label">Chose your ads json file...</span>
          <span class="file-label" v-if="status">{{ status }}</span>
        </span>
      </label>
    </div>
    <ul v-if="logs">
      <li v-for="(index, log) in logs" :key="index">{{ log }}</li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      status: '',
      logs: [],
    };
  },
  methods: {
    async handleFile(file) {
      this.status = 'Loading';
      try {
        const content = await this.readFile(file);
        await this.handleItems(JSON.parse(content));
        this.status = 'Success';
      } catch (e) {
        console.error(e.message);
        this.status = 'Error';
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
    async handleItems(items) {
      for (const item of items) {
        const result = await this.$store.dispatch('addAd', item);
        this.logs.push(result);
      }
    },
  },
};
</script>
