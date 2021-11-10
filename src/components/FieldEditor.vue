<template>
  <div>
    <div>
      <label>Partition</label>
      <select v-model="selectedOption" @change="updatePartitions">
        <option v-for="option in options" :value="option.id" :key="option.id">
          {{ option.label }}
        </option>
      </select>
      <FillerPicker
        v-if="value.partitionType === 'plain'"
        v-model="value.plain.filler"
        @select="select"
      >
      </FillerPicker>
    </div>
    <div class="flex-container" v-if="value.partitionType === 'plain'">
      <label>Border</label>
      <input type="checkbox" v-model="value.plain.border.present" />
      <FillerPicker
        v-model="value.plain.border.filler"
        @select="select"
        v-show="value.plain.border.present"
      ></FillerPicker>
    </div>
    <MultiChargePicker
      v-if="value.partitionType === 'plain'"
      v-model="value.plain.charges"
      @input="update"
      @select="select"
    ></MultiChargePicker>
    <template v-if="value.partitionType !== 'plain'">
      <div
        v-for="partition in value.partitions"
        :key="partition.number"
        class="flex-container"
      >
        <p>{{ partition.number + 1 }}</p>
        <FieldEditor
          v-model="partition.model"
          @input="$emit('input', value)"
          @select="select"
        >
        </FieldEditor>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FieldEditorModel } from "./FieldEditorModel";
import { FillerPickerSelectedEvent } from "./FillerPickerSelected";
import {
  getPartitionOptions,
  getFieldCountInPartition,
} from "../service/PartitionService";
import { initialFieldEditorValue } from "./EditorTool";
import FillerPicker from "./FillerPicker.vue";
import MultiChargePicker from "./MultiChargePicker.vue";

@Component({
  components: {
    FillerPicker,
    MultiChargePicker,
  },
})
export default class FieldEditor extends Vue {
  @Prop() value!: FieldEditorModel;

  private options = getPartitionOptions();
  private selectedOption = this.value.partitionType;

  async updatePartitions(): Promise<void> {
    const expectedPartitionCount = getFieldCountInPartition(
      this.selectedOption
    );
    const array = this.value.partitions;

    const countDelta = array.length - expectedPartitionCount;
    if (countDelta < 0) {
      // Not enough partitions, add element
      const newPartitions = await this.generatePartitions(
        -countDelta,
        array.length
      );
      array.push(...newPartitions);
    } else if (countDelta > 0) {
      // To much partitions, remove last elements
      array.splice(-countDelta, countDelta);
    }

    this.value.partitionType = this.selectedOption;
    this.$emit("input", this.value);
  }

  private async generatePartitions(
    count: number,
    startIndex: number
  ): Promise<{ number: number; model: FieldEditorModel }[]> {
    const newPartitions = [];
    for (let i = 0; i < count; i++) {
      newPartitions.push({
        number: startIndex + i,
        model: await initialFieldEditorValue(),
      });
    }
    return newPartitions;
  }

  update(): void {
    this.$emit("input", this.value);
  }

  select(event: FillerPickerSelectedEvent): void {
    this.$emit("select", event);
  }
}
</script>

<style scoped></style>
