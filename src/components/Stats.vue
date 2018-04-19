<template>
  <section>
    <div class="charts tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="title has-text-dark">Price Over Years</p>
          <div class="content">
            <scatter-chart :chart-data="chartData.price" :height="300"/>
          </div>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="title has-text-dark">Mileage Over Years</p>
          <div class="content">
            <scatter-chart :chart-data="chartData.mileage" :height="300"/>
          </div>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="content">
            <models-table :data="groupedData" :list="data"/>
          </div>
        </article>
      </div>
    </div>
  </section>
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
        data[item.model].priceOverYears.push({x: item.year, y: item.price});
        data[item.model].mileageOverYears.push({x: item.year, y: item.mileage});
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
