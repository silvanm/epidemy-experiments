<template>
  <div>
    <div class="sparkbar" :style="outerStyle">
      <div class="sparkbar-inner" :style="innerStyle"></div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class Sparkbar extends Vue {
  @Prop({ default: 0 })
  min = 0;
  @Prop({ default: 100 })
  max!: number;
  @Prop({ default: 200 })
  width!: number;
  @Prop({ default: 0 })
  value!: number;
  @Prop({ default: 20 })
  height!: number;
  @Prop({ default: "black" })
  color!: string;

  get outerStyle() {
    return {
      width: this.width.toString() + "px",
      height: this.height.toString() + "px"
    };
  }

  get innerStyle() {
    return {
      backgroundColor: this.color,
      width: Math.floor((this.value / this.max) * 100) + "%"
    };
  }
}
</script>
<style scoped lang="scss">
.sparkbar-inner {
  height: 100%;
}
</style>
