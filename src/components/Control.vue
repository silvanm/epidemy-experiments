<template>
  <div class="control-row">
    <label>{{ label }}</label>
    <vue-slider
      ref="population"
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
  label!: string;

  @Prop({ default: "" })
  units!: string;

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
    background-color: #118AB2;
  }
  .vue-slider-dot-handle {
    border-color: #118AB2;
  }
}
</style>
