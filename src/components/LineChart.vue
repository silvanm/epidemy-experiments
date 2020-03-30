<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import chartjsPluginAnnotation from "chartjs-plugin-annotation";

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      default() {
        return {
          annotation: {
            drawTime: "afterDatasetsDraw", // (default)

            // Array of annotation configuration objects
            // See below for detailed descriptions of the annotation options
            annotations: [
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: 25,
                borderColor: "red",
                borderWidth: 2
              }
            ]
          },
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
                  min: 0
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
