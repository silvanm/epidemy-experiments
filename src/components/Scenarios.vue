<template>
  <div class="scenarios">
    <h2 v-if="currentScenario">Current Scenario: {{ currentScenario.name }}</h2>
    <div class="button"
      v-for="scenario in scenarios"
      :key="scenario.name"
      @click="run(scenario)"
    >
      {{ scenario.name }}
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { scenarios, ScenarioItem, ScenarioItemStep } from "@/config/scenarios";

@Component
export default class Scenarios extends Vue {
  scenarios = scenarios;
  currentScenario: ScenarioItem | null = null;
  timers: number[] = [];

  clearTimers() {
    this.timers.forEach(t => {
      window.clearTimeout(t);
    });
  }

  run(scenario: ScenarioItem) {
    this.clearTimers();
    this.currentScenario = scenario;
    scenario.steps.forEach((s: ScenarioItemStep) => {
      const t = window.setTimeout(() => {
        this.$emit("scenario-item-step", s);
      }, s.after * 1000);
      this.timers.push(t);
    });
    this.$emit("start");
  }
}
</script>
<style lang="scss">
  div.button {

    &:hover {
      background-color: #073B4C;
    }

    background-color: #118AB2;
    font-weight: bold;
    color:white;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
  }
</style>
