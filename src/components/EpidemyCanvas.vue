<!--suppress JSUnfilteredForInLoop -->
<template>
  <div>
    <div id="container">
      <canvas ref="canvas" :width="width" :height="height"></canvas>
      <div class="small">
        <line-chart :chart-data="datacollection"></line-chart>
      </div>
      <keyfigures></keyfigures>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Country } from "@/Country";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { StatEntry } from "@/Stats";
import LineChart from "./LineChart.vue";
import { ChartData, ChartDataSets } from "chart.js";
import { HealthState } from "@/Person";
import EventBus from "@/event-bus";
import Keyfigures from "@/components/Keyfigures.vue";

interface HealthStateConfig {
  [k: number]: { color: string; displayInGraph: boolean; label: string };
}

const healthStateConfig: HealthStateConfig = {
  [HealthState.Healthy]: {
    color: "lightgreen",
    displayInGraph: false,
    label: "Healthy"
  },
  [HealthState.Infected]: {
    color: "orange",
    displayInGraph: true,
    label: "Infected"
  },
  [HealthState.Healed]: {
    color: "darkgreen",
    displayInGraph: true,
    label: "Healed"
  },
  [HealthState.Dead]: { color: "black", displayInGraph: true, label: "Dead" }
};

@Component({
  components: {
    Keyfigures,
    LineChart
  }
})
export default class EpidemyCanvas extends Vue {
  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  country!: Country;

  @Prop({ default: 800 })
  width!: number;

  @Prop({ default: 600 })
  height!: number;

  @Prop()
  population!: number;

  @Prop()
  radius!: number;

  @Prop()
  durationOfIllness!: number;

  @Prop()
  socialDistancingRate!: number;

  datacollection!: ChartData;

  statTimer: number | undefined;

  labels: number[] = [];

  isRunning = false;

  constructor() {
    super();
    this.datacollection = {};
  }
  mounted(): void {
    this.canvas = this.$refs["canvas"] as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.country = new Country(this.width, this.height);
    this.init();

    for (let i = 0; i < 100; i++) {
      this.labels.push(i);
    }

    EventBus.$on("start", () => {
      this.start();
    });

    EventBus.$on("restart", () => {
      this.init();
    });
  }

  updateStats() {
    this.$store.commit("addStatEntry", this.country.getStats());
    const datasets: ChartDataSets[] = [];
    // Prepare datasets
    for (const healthState in HealthState) {
      if (isNaN(Number(healthState))) continue;
      if (!healthStateConfig[healthState].displayInGraph) continue;
      const dataset: ChartDataSets = {
        backgroundColor: healthStateConfig[healthState].color,
        label: healthStateConfig[healthState].label,
        data: []
      };
      this.$store.state.statEntries.forEach((e: StatEntry) => {
        if (dataset.data) {
          dataset.data.push(e.populations[healthState]);
        }
      });
      datasets.push(dataset);
    }

    this.datacollection = {
      labels: this.labels,
      datasets: datasets
    };
  }

  init(): void {
    this.country.people = [];
    this.$store.commit("clearStats");
    this.country.createPeople(
      this.population,
      this.radius,
      this.durationOfIllness,
      this.$store.state.deathRate,
      this.socialDistancingRate,
      this.$store
    );
    this.country.infectPeople(1);
  }

  start() {
    this.isRunning = true;
    this.draw();
    this.updateStats();
    if (this.statTimer) {
      window.clearTimeout(this.statTimer);
    }
    this.statTimer = window.setInterval(() => {
      this.updateStats();
    }, 500);
  }

  restart() {
    this.init();
    this.start();
  }

  draw(): void {
    const ctx = this.context;
    this.country.updatePosition(this.socialDistancingRate);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.country.people.forEach(person => {
      ctx.beginPath();
      ctx.arc(
        Math.floor(person.position.x),
        Math.floor(person.position.y),
        person.radius,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = healthStateConfig[person.state].color;
      ctx.fill();
    });
    if (this.isRunning) {
      window.requestAnimationFrame(() => {
        this.draw();
      });
    }
  }
}
</script>

<style scoped lang="scss">
#container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
canvas {
  border: 1px solid gray;
}
.small {
  max-width: 400px;
}
</style>
