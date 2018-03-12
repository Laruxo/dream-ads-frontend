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
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
