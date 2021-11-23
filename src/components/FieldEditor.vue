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
      >
      </FillerPicker>
    </div>
    <div class="flex-container" v-if="value.partitionType === 'plain'">
      <label>Border</label>
      <input type="checkbox" v-model="value.plain.border.present" />
      <FillerPicker
        v-model="value.plain.border.filler"
        v-show="value.plain.border.present"
      ></FillerPicker>
    </div>
    <MultiChargePicker
      v-if="value.partitionType === 'plain'"
      v-model="value.plain.charges"
      @input="update"
    ></MultiChargePicker>
    <template v-if="value.partitionType !== 'plain'">
      <div
        v-for="partition in value.partitions"
        :key="partition.number"
        class="flex-container"
      >
        <img :src="partition.img" />
        <FieldEditor v-model="partition.model" @input="$emit('input', value)">
        </FieldEditor>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FieldEditorModel } from "./FieldEditorModel";
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
    if (this.selectedOption === "plain") {
      this.value.partitions.splice(1);
    } else {
      const expectedPartitionCount = getFieldCountInPartition(
        this.selectedOption
      );
      const array = this.value.partitions;

      const countDelta = array.length - expectedPartitionCount;
      if (countDelta < 0) {
        // Get imgUrl to update existing partition
        const newImgUrls = await this.getPartitionImgUrls(
          this.selectedOption,
          0,
          array.length
        );
        // Create new partition to complete
        const newPartitions = await this.generatePartitions(
          -countDelta,
          array.length,
          this.selectedOption
        );

        // update existing partitions
        for (let partIndex = 0; partIndex < array.length; partIndex++) {
          array[partIndex].img = newImgUrls[partIndex];
        }
        // add created partition
        array.push(...newPartitions);
      } else {
        // update existing partitions img
        const newImgUrls = await this.getPartitionImgUrls(
          this.selectedOption,
          0,
          expectedPartitionCount
        );

        for (let i = 0; i < expectedPartitionCount; i++) {
          array[i].img = newImgUrls[i];
        }
        if (countDelta > 0) {
          // To much partitions, remove last elements
          array.splice(-countDelta, countDelta);
        }
      }
    }

    this.value.partitionType = this.selectedOption;
    this.$emit("input", this.value);
  }

  private async generatePartitions(
    count: number,
    startIndex: number,
    partitionName: string
  ): Promise<{ number: number; img: string; model: FieldEditorModel }[]> {
    const newPartitions = [];

    for (let i = 0; i < count; i++) {
      const partIndex = startIndex + i;
      newPartitions.push({
        number: partIndex,
        img: await this.getPartitionImgUrl(partitionName, partIndex),
        model: await initialFieldEditorValue(),
      });
    }
    return newPartitions;
  }

  private async getPartitionImgUrls(
    partitionName: string,
    fromIndex: number,
    toIndex: number
  ): Promise<string[]> {
    const result: string[] = [];
    for (let partIndex = fromIndex; partIndex < toIndex; partIndex++) {
      const url = await this.getPartitionImgUrl(partitionName, partIndex);
      result.push(url);
    }
    return result;
  }

  private async getPartitionImgUrl(
    partitionName: string,
    partIndex: number
  ): Promise<string> {
    const filename = `${partitionName}_${partIndex + 1}.png`;
    return (await import("../assets/partition/" + filename)).default;
  }

  update(): void {
    this.$emit("input", this.value);
  }
}
</script>

<style scoped>
img {
  width: 40px;
  height: 40px;
}
</style>
