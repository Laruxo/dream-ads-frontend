<script>
  import {Scatter, mixins} from 'vue-chartjs'

  export default {
    name: 'priceChart',
    extends: Scatter,
    mixins: [mixins.reactiveProp],
    props: ['chartData'],
    mounted() {
      this.renderChart({
        datasets: [
          {
            label: 'Price to Year',
            backgroundColor: '#f87979',
            data: this.chartData,
          }
        ],
      }, {
        maintainAspectRatio: false,
        responsive: true,
      })
    }
  }
</script>
