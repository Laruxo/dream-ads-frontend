<script>
import {Scatter, mixins} from 'vue-chartjs';

export default {
  extends: Scatter,
  // props: ['title'],
  mixins: [mixins.reactiveProp],
  data() {
    return {
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            ticks: {
              stepSize: 1,
            },
          }],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
