import Vue from "vue";
import Vuex from "vuex";
import { StatEntry } from "@/Stats";
import { HealthState } from "@/Person";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    statEntries: [] as StatEntry[],
    hospitalCapacity: 25,
    deathRate: 5,
    deathRateWithoutTreatment: 20
  },
  getters: {
    lastState: state => {
      if (state.statEntries.length > 0) {
        return state.statEntries[state.statEntries.length - 1];
      } else {
        return null;
      }
    },
    hospitalBeds: state => {
      if (state.statEntries.length == 0) {
        return state.hospitalCapacity;
      }
      const lastStat = state.statEntries[state.statEntries.length - 1];
      return Math.max(
        state.hospitalCapacity - lastStat.populations[HealthState.Infected],
        0
      );
    }
  },
  mutations: {
    addStatEntry(state, entry: StatEntry) {
      state.statEntries.push(entry);
    },
    clearStats(state) {
      state.statEntries = [];
    },
    updateHospitalCapacity(state, value: number) {
      state.hospitalCapacity = value;
    },
    updateDeathRateWithoutTreatment(state, value: number) {
      state.deathRateWithoutTreatment = value;
    },
    updateDeathRate(state, value: number) {
      state.deathRate = value;
    }
  },
  actions: {},
  modules: {}
});
