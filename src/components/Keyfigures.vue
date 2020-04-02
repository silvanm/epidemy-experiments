<template>
  <div>
    <table v-if="hasStats">
      <tr>
        <th>Healthy</th>
        <td>
          {{ lastEntry.populations[0] }}
        </td>
        <td>
          <sparkbar
            :value="lastEntry.populations[0]"
            :max="population"
            color="#ccc"
          ></sparkbar>
        </td>
      </tr>

      <tr>
        <th>Infected</th>
        <td>
          {{ lastEntry.populations[1] }}
        </td>
        <td>
          <sparkbar
            :value="lastEntry.populations[1]"
            :max="population"
            :color="healthSateConfig[1].color"
          ></sparkbar>
        </td>
      </tr>
      <tr>
        <th>Recovered</th>
        <td>
          {{ lastEntry.populations[2] }}
        </td>
        <td>
          <sparkbar
            :value="lastEntry.populations[2]"
            :max="population"
            :color="healthSateConfig[2].color"
          ></sparkbar>
        </td>
      </tr>
      <tr>
        <th>Dead</th>
        <td>{{ lastEntry.populations[3] }}</td>
        <td>
          <sparkbar
            :value="lastEntry.populations[3]"
            :max="population"
            :color="healthSateConfig[3].color"
          ></sparkbar>
        </td>
      </tr>
      <tr>
        <th>Available Hospital Beds</th>
        <td>
          <span v-if="hospitalBeds === 0" class="blink_me">⚠️</span
          >{{ hospitalBeds }}
        </td>
        <td>
          <sparkbar :value="hospitalBeds" :max="hospitalCapacity" color="#eee"></sparkbar>
        </td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { StatEntry } from "@/Stats";
import Sparkbar from "@/components/Sparkbar.vue";
import { HealthStateConfig, healthStateConfig } from "@/config/config";

@Component({
  components: { Sparkbar }
})
export default class Keyfigures extends Vue {
  get hasStats(): boolean {
    return this.$store.state && this.$store.state.statEntries.length > 0;
  }

  get lastEntry(): StatEntry | undefined {
    return this.$store.state.statEntries[
      this.$store.state.statEntries.length - 1
    ];
  }

  get population(): number {
    return this.$store.state.population;
  }

  get hospitalBeds(): number {
    return this.$store.getters.hospitalBeds;
  }

  get hospitalCapacity(): number {
    return this.$store.state.hospitalCapacity;
  }

  get healthSateConfig(): HealthStateConfig {
    return healthStateConfig;
  }
}
</script>
<style scoped lang="scss">
th {
  text-align: left;
}
td {
  text-align: right;
}
.blink_me {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
