<template>
  <section class="ads__sorting">
    <div class="buttons has-addons">
      <button class="button is-white is-static">Sort By</button>
      <button class="button is-primary" @click="sortBy('price')">
        Price {{ sortedBy === 'price' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
      </button>
      <button class="button is-primary" @click="sortBy('year')">
        Year {{ sortedBy === 'year' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
      </button>
      <button class="button is-primary" @click="sortBy('mileage')">
        Mileage {{ sortedBy === 'mileage' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
      </button>
      <button class="button is-primary" @click="sortBy('date')">
        Updated {{ sortedBy === 'date' ? (isAscending ? '&darr;' : '&uarr;') : '' }}
      </button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isAscending: true,
      sortedBy: 'price',
    };
  },
  methods: {
    sortBy(field) {
      this.sortedBy = field;
      this.isAscending = !this.isAscending;
    },
  },
};
</script>
