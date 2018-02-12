<script>
  import {Scatter, mixins} from 'vue-chartjs'

  export default {
    name: 'scatterChart',
    extends: Scatter,
    mixins: [mixins.reactiveProp],
    mounted() {
      this.renderChart(this.chartData, {
        maintainAspectRatio: false,
        responsive: true,
      })
    },
  }
</script>
