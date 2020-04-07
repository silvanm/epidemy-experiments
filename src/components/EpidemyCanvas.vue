import { HealthState } from '@/Person';
<!--suppress JSUnfilteredForInLoop -->
<template>
  <div>
    <div id="container">
      <canvas ref="canvas" :width="width" :height="height"></canvas>
      <div class="small">
        <div class="linechart-container">
          <line-chart
            :key="linechartKey"
            :chart-data="datacollection"
            :options="chartOptions()"
            :width="linechartWidth()"
            :height="linechartHeight()"
          ></line-chart>
        </div>
        <div class="keyfigures-container">
          <keyfigures></keyfigures>
        </div>
      </div>
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
import { HealthState, Person } from "@/Person";
import EventBus from "@/event-bus";
import Keyfigures from "@/components/Keyfigures.vue";
import {
  borderPosXRelative,
  borderWidth,
  drawCirclesForAppTracking,
  healthStateConfig
} from "@/config/config";
import { StoreState } from "@/store";
import { ScenarioItemStep } from "@/config/scenarios";
import VueSlider from "vue-slider-component";

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

  noChangeSince: number | null = null;

  // see https://michaelnthiessen.com/force-re-render/
  linechartKey = 0;

  constructor() {
    super();
    this.datacollection = {};
  }
  mounted(): void {
    this.canvas = this.$refs["canvas"] as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.country = new Country(this.width, this.height, [], this.$store);
    this.init();

    EventBus.$on("start", () => {
      this.start();
    });

    this.$store.watch(
      (state: StoreState) => {
        return state.population;
      },
      (s: number) => {
        // add people
        if (s > this.country.people.length) {
          this.country.createPeople(
            s - this.country.people.length,
            this.radius,
            this.durationOfIllness,
            this.$store.state.deathRate,
            this.socialDistancingRate,
            this.$store
          );
        } else {
          this.country.people.splice(0, this.country.people.length - s);
        }
      }
    );
  }

  updateStats() {
    this.$store.commit("addStatEntry", this.country.getStats());
    const datasets: ChartDataSets[] = [];
    this.labels = [];
    for (
      let i = 0;
      i < Math.max(100, this.$store.state.statEntries.length);
      i++
    ) {
      this.labels.push(i);
    }
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
    this.init();
    this.linechartKey++;
    this.isRunning = true;
    this.noChangeSince = null;
    this.draw();
    this.updateStats();
    if (this.statTimer) {
      window.clearTimeout(this.statTimer);
    }
    this.statTimer = window.setInterval(() => {
      this.updateStats();
    }, 500);
    this.$store.commit("start");
  }

  stop() {
    this.isRunning = false;
    if (this.statTimer) window.clearTimeout(this.statTimer);
    this.noChangeSince = null;
    this.$emit("stopped");
    this.$store.commit("stop");
  }

  linechartWidth(): number {
    return Math.min(window.innerWidth - 20, 390);
  }

  linechartHeight(): number {
    return Math.min(window.innerWidth * 0.4, 270);
  }

  private drawBorder(): void {
    const ctx = this.context;
    const borderHeight = Math.floor(
      ((this.height * this.$store.state.borderClosingRate) / 100) * 0.5
    );
    ctx.beginPath();
    ctx.fillStyle = "#118ab2";
    ctx.rect(
      Math.floor(this.width * borderPosXRelative),
      0,
      borderWidth,
      borderHeight
    );
    ctx.rect(
      Math.floor(this.width * borderPosXRelative),
      this.height - borderHeight,
      borderWidth,
      borderHeight
    );
    ctx.fill();
  }

  draw(): void {
    const ctx = this.context;
    this.country.updatePosition(this.socialDistancingRate);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.country.people.forEach(person => {
      person.contactee.forEach((contact: Person) => {
        if (person.contactee && person.hasAppTracking) {
          ctx.beginPath();
          ctx.lineTo(person.position.x, person.position.y);
          ctx.lineTo(contact.position.x, contact.position.y);
          ctx.strokeStyle = "#eee";
          ctx.stroke();
        }
      });

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

      if (person.hasAppTracking && drawCirclesForAppTracking) {
        ctx.beginPath();
        ctx.arc(
          Math.floor(person.position.x),
          Math.floor(person.position.y),
          person.radius * 2,
          0,
          2 * Math.PI
        );
        ctx.strokeStyle = healthStateConfig[person.state].color;
        ctx.stroke();
      }
    });

    this.drawBorder();

    if (this.shouldWeStop()) {
      this.stop();
    }

    if (this.isRunning) {
      window.requestAnimationFrame(() => {
        this.draw();
      });
    }
  }

  private shouldWeStop() {
    if (!this.$store.state.statEntries) return false;

    if (this.$store.state.statEntries.length < 10) return false;

    const lastEntry: StatEntry = this.$store.state.statEntries[
      this.$store.state.statEntries.length - 2
    ];
    const currentEntry: StatEntry = this.$store.state.statEntries[
      this.$store.state.statEntries.length - 1
    ];

    if (
      lastEntry.populations[HealthState.Healed] +
        lastEntry.populations[HealthState.Infected] ==
      currentEntry.populations[HealthState.Healed] +
        currentEntry.populations[HealthState.Infected]
    ) {
      if (this.noChangeSince === null) this.noChangeSince = Date.now();
    } else {
      this.noChangeSince = null;
    }

    if (this.noChangeSince === null) {
      return false;
    } else {
      return (
        Date.now() - this.noChangeSince > 10000 &&
        this.$store.state.statEntries.length >= 100
      );
    }
  }

  chartOptions() {
    return {
      responsive: false,
      annotation: {
        drawTime: "afterDatasetsDraw",
        annotations: [
          {
            type: "line",
            mode: "horizontal",
            scaleID: "y-axis-0",
            value: this.$store.state.hospitalCapacity,
            borderColor: "#992E47",
            borderWidth: 2,
            label: {
              content: "Max available hospital beds",
              enabled: true,
              backgroundColor: "#992E47",
              fontColor: "white"
            }
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
              suggestedMax: this.$store.state.population,
              min: 0,
              display: false
            },
            gridLines: {
              display: false
            }
          }
        ]
      }
    };
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
  border: 1px solid #ccc;
}
.linechart-container {
  padding-left: 5px;
}

.keyfigures-container {
  border-bottom: 1px solid #ccc;
  padding: 10px;
}

@media only screen and (max-width: 500px) {
  #container {
    width: 100vw;
  }

  .linechart-container {
    padding-left: 0;
    margin-left: -6px;
  }

  .keyfigures-container {
    border-bottom: 0;
    padding: 0;
  }
}
</style>
