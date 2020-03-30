<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      default() {
        return {
          elements: {
            point: {
              radius: 0
            }
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  display: false
                },
                gridLines: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                stacked: true,
                ticks: {
                  suggestedMax: 100,
                  min: 0,
                }
              }
            ]
          }
        };
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
