<template>
  <div>
    <table v-if="stats.length > 0">
      <tr>
        <th>Infected</th>
        <td>
          {{ lastEntry.populations[1] }}
        </td>
      </tr>
      <tr>
        <th>Recovered</th>
        <td>
          {{ lastEntry.populations[2] }}
        </td>
      </tr>
      <tr>
        <th>Dead</th>
        <td>
          {{ lastEntry.populations[3] }}
        </td>
      </tr>
    </table>
  </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";
import { StatEntry } from "@/Stats";

@Component
export default class Keyfigures extends Vue {
  @Prop()
  stats!: StatEntry[];

  get lastEntry(): StatEntry | undefined {
    return this.stats[this.stats.length - 1];
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
</style>
