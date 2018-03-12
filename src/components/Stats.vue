<template>
  <div>
    <section class="charts">
      <div>
        <h4 class="title is-4 is-marginless">Price Over Years</h4>
        <scatter-chart :chart-data="chartData.price" :height="300"/>
      </div>
      <div>
        <h4 class="title is-4 is-marginless">Mileage Over Years</h4>
        <scatter-chart :chart-data="chartData.mileage" :height="300"/>
      </div>
    </section>
    <models-table :data="groupedData" :list="data"/>
  </div>
</template>

<script>
import ModelsTable from './ModelsTable';
import ScatterChart from './ScatterChart';

export default {
  components: {
    ScatterChart,
    ModelsTable,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  computed: {
    groupedData() {
      const data = {};
      for (const item of this.data) {
        if (!data[item.model]) {
          data[item.model] = {
            priceOverYears: [],
            mileageOverYears: [],
            items: [],
          };
        }
        data[item.model].items.push(item);
        data[item.model].priceOverYears.push({x: Number(item.year), y: item.price});
        data[item.model].mileageOverYears.push({x: Number(item.year), y: item.mileage});
      }

      return data;
    },
    chartData() {
      const priceData = [];
      const mileageData = [];
      for (const group in this.groupedData) {
        if (this.groupedData.hasOwnProperty(group)) {
          const color = '#' + Math.random().toString(16).slice(-6);
          priceData.push({
            label: group,
            backgroundColor: color,
            pointRadius: 5,
            data: this.groupedData[group].priceOverYears,
          });
          mileageData.push({
            label: group,
            backgroundColor: color,
            pointRadius: 5,
            data: this.groupedData[group].mileageOverYears,
          });
        }
      }
      return {
        price: {
          datasets: priceData,
        },
        mileage: {
          datasets: mileageData,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../sass/variables';

  .charts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: $gap/2;
    margin-bottom: $gap/2;
  }
</style>
