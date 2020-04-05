<template>
  <div class="control-row">
    <label>{{ label }}</label>
    <v-popover content="foo">
      <font-awesome-icon icon="info-circle"></font-awesome-icon>
      <template slot="popover">{{ description }}</template>
    </v-popover>
    <vue-slider
      ref="slider"
      v-model="value"
      :min="0"
      :max="max"
      width="200px"
      class="vue-slider"
    />
    <div class="units">{{ value }}{{ units }}</div>
  </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import VueSlider from "vue-slider-component";
import Vue from "vue";
import { StoreState } from "@/store";
import { ScenarioItemStep } from "@/config/scenarios";

@Component({
  components: {
    VueSlider
  }
})
export default class Control extends Vue {
  @Prop()
  max!: number;

  @Prop()
  id!: string;

  @Prop()
  parameter!: number;

  @Prop()
  description!: string;

  @Prop()
  label!: string;

  @Prop({ default: "" })
  units!: string;

  constructor() {
    super();
    this.$store.watch(
      (state: StoreState) => {
        return state.requestScenarioItemStep;
      },
      (s: ScenarioItemStep | null) => {
        if (s !== null && s?.param == this.id) {
          const slider = this.$refs["slider"] as VueSlider;
          slider.setValue(s.value);
          this.$store.commit("requestScenarioItemStep", null);
        }
      }
    );
  }

  get value(): number {
    return this.$store.state[this.id];
  }

  set value(val: number) {
    this.$store.commit(
      "update" + this.id.charAt(0).toUpperCase() + this.id.slice(1),
      val
    );
  }
}
</script>
<style lang="scss">
.control-row {
  display: flex;
  flex-direction: row;
  margin: 5px;

  label,
  div.units {
    padding: 0 10px;
  }

  label {
    text-align: right;
    width: 200px;
  }

  .vue-slider-process {
    background-color: #118ab2;
  }
  .vue-slider-dot-handle {
    border-color: #118ab2;
  }

  .vue-slider:hover {
    .vue-slider-process {
      background-color: #073b4c;
    }
    .vue-slider-dot-handle:hover {
      border-color: #073b4c;
    }
  }
}
</style>
