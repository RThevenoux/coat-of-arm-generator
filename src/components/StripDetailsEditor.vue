<template>
  <div>
    <div>
      <input
        :id="uuid + '-straight'"
        type="radio"
        v-model="value.outlineType"
        @change="update"
        value="straight"
      />
      <label :for="uuid + '-straight'">Droit</label>
    </div>
    <div>
      <input
        :id="uuid + '-simple'"
        type="radio"
        v-model="value.outlineType"
        @change="update"
        value="simple"
      />
      <label :for="uuid + '-simple'">Single outline</label>
      <template v-if="value.outlineType === 'simple'">
        <OutlinePicker v-model="value.outline1" @input="update" key="outline1">
        </OutlinePicker>
        <input
          :id="uuid + '-shift-checkbox'"
          type="checkbox"
          v-model="value.shifted"
          @change="update"
        />
        <label :for="uuid + '-shift-checkbox'">"contre-"</label>
      </template>
    </div>
    <div>
      <input
        :id="uuid + '-double'"
        type="radio"
        v-model="value.outlineType"
        @change="update"
        value="double"
      />
      <label :for="uuid + '-double'">Double outline</label>
      <template v-if="value.outlineType === 'double'">
        <OutlinePicker v-model="value.outline1" @input="update" key="outline1">
        </OutlinePicker>
        <OutlinePicker v-model="value.outline2" @input="update" key="outline2">
        </OutlinePicker>
      </template>
    </div>
    <div v-if="value.size === 'gemel'">
      <input
        :id="uuid + '-gemel-potency'"
        type="radio"
        v-model="value.outlineType"
        @change="update"
        value="gemel-potency"
      />
      <label :for="uuid + '-gemel-potency'"
        >Gemel potency and counter-potency</label
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import OutlinePicker from "./OutlinePicker.vue";
import { v4 as uuidv4 } from "uuid";
import { StripEditorModel } from "./StripModel";

@Component({
  components: {
    OutlinePicker,
  },
})
export default class StripDetailsEditor extends Vue {
  @Prop() value!: StripEditorModel;

  uuid = uuidv4();

  update(): void {
    this.$emit("input", this.value);
  }
}
</script>
