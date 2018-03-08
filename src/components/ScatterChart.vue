<script>
  import {Scatter, mixins} from 'vue-chartjs'

  export default {
    name: 'scatterChart',
    extends: Scatter,
    // props: ['title'],
    mixins: [mixins.reactiveProp],
    mounted() {
      this.renderChart(this.chartData, this.options)
    },
    data() {
      return {
        options: {
          maintainAspectRatio: false,
          responsive: true,
        },
      }
    }
  }
</script>
