<template>
  <div id="app" class="flex-container">
    <template v-if="editorModel === 'loading'">
      <h2>Loading...</h2>
    </template>
    <template v-if="editorModel !== 'loading'">
      <div class="column50">
        <h1>Coat of Arm Generator</h1>
        <div>
          <h2>Definition</h2>
          <RootEditor v-model="editorModel" @input="updateModel"></RootEditor>
        </div>
      </div>

      <div class="column50">
        <div>
          <h2>Blazon</h2>
          <div>{{ textual }}</div>
        </div>

        <div>
          <h2>Visual</h2>
          <div class="flex-container">
            <VisualConf v-model="visualConf" @input="updateVisual"></VisualConf>
            <div v-html="visual"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VisualConf from "./components/VisualConf.vue";
import { VisualConfModel } from "./generator/visual/VisualConfModel";
import { defaultVisualConf } from "./service/ConfigurationService";
import { FieldEditorModel } from "./components/FieldEditorModel";
import { initialFieldEditorValue, fieldToModel } from "./components/EditorTool";
import { generateVisual } from "./generator/visual/VisualGenerator";
import { generateTextual } from "./generator/textual/TextualGenerator";
import RootEditor from "./components/RootEditor.vue";
import { FieldModel } from "./generator/model.type";

@Component({
  components: {
    VisualConf,
    RootEditor,
  },
})
export default class App extends Vue {
  visualConf: VisualConfModel = defaultVisualConf();
  editorModel: FieldEditorModel | "loading" = "loading";
  textual = "Loading...";
  visual = "<p>Loading...</p>";

  async mounted(): Promise<void> {
    this.editorModel = await initialFieldEditorValue();
    this.updateModel();
  }

  async updateModel(): Promise<void> {
    if (this.editorModel != "loading") {
      const model: FieldModel = fieldToModel(this.editorModel);
      const textual = await generateTextual(model);
      const visual = await generateVisual(model, this.visualConf);

      this.textual = textual;
      this.visual = visual;
    }
  }

  async updateVisual(): Promise<void> {
    if (this.editorModel != "loading") {
      const model: FieldModel = fieldToModel(this.editorModel);
      this.visual = await generateVisual(model, this.visualConf);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  color: navy;
  margin-left: 20px;
}

h2 {
  text-align: center;
}

.flex-container {
  display: flex;
  flex-direction: row;
}

.column50 {
  float: left;
  width: 50%;
}
</style>
