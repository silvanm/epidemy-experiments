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
        return {};
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
