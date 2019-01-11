Vue.component('filler-picker', {
  data: function () {
    return {
      type: 'none',
      plein: {
        color: 'azur'
      },
      pattern: {
        color1: 'azur',
        color2: 'or'
      },
      fusele: {
        angle: 'bande'
      },
      seme: {
        meuble: 'billette',
        fieldColor: 'azur',
        meubleColor: 'or'
      }
    }
  },
  computed: {
    value: {
      get: function () {
        switch (this.type) {
          case "plein": return {
            type: "plein",
            color: this.plein.color,
          }

          case "fusele": return {
            type: "pattern",
            patternName: "fusele",
            angle: this.fusele.angle,
            color1: this.pattern.color1,
            color2: this.pattern.color2
          }

          case "echiquete":
          case "losange":
          case "triangle":
          case "vair":
          case "contrevair":
          case "vair_en_pal":
          case "vair_en_pointe": return {
            type: "pattern",
            patternName: this.type,
            color1: this.pattern.color1,
            color2: this.pattern.color2
          }

          case "seme": {
            return {
              type: this.type,
              meuble: this.seme.meuble,
              fieldColor: this.seme.fieldColor,
              meubleColor: this.seme.meubleColor
            }
          }
          default: return {
            type: this.type
          }
        }
      },
      set: function (newValue) {

      }
    }
  },
  methods: {
    update: function (event) {
      this.$emit("input", this.value);
    }
  },
  template: `
    <div>
      <div>
        <input type="radio" v-model="type" value="plein" @change="update">
        <label>Plein</label>
        <color-picker v-model="plein.color" @input="update"></color-picker>
      </div>

      <div class="flex-container" style="background-color:#D8D8D8">
        <p>Pavage</p>
        <div>
          <div>
            <input type="radio" v-model="type" value="echiquete" @change="update">
            <label>Échiqueté</label>
          </div>
          <div>
            <input type="radio" v-model="type" value="losange" @change="update">
            <label>Losangé</label>
          </div>
          <div>
            <input type="radio" v-model="type" value="triangle" @change="update">
            <label>Trianglé</label>
          </div>
          <div>
            <input type="radio" v-model="type" value="fusele" @change="update">
            <label>Fuselé</label>
            <select v-model="fusele.angle" @change="update">
              <option value="defaut">défaut</option>
              <option value="bande">en bande</option>
              <option value="barre">en barre</option>
            </select>
          </div>
        </div>
        <div>
          <div>
            <input type="radio" v-model="type" value="vair" @change="update">
            <label>Vair</label>
          </div>
          <div>
            <input type="radio" v-model="type" value="contrevair" @change="update">
            <label>Contre-vair</label>
          </div>
          <div>
            <input type="radio" v-model="type" value="vair_en_pal" @change="update">
            <label>Vair en pal</label>
          </div>
          <div >
            <input type="radio" v-model="type" value="vair_en_pointe" @change="update">
            <label>Vair en pointe</label>
          </div>
        </div>
        <div>
          <div>
            <color-picker v-model="pattern.color1" @input="update"></color-picker>
          </div>
          <div>
            <color-picker v-model="pattern.color2" @input="update"></color-picker>
          </div>
        </div>
      </div>

      <div class="flex-container" style="background-color:#FFF">
        <p>Semé</p>
        
        <input type="radio" v-model="type" value="seme" @change="update">
        
        <select v-model="seme.meuble" @change="update">
          <option value="hermine">Hermine</option>
          <option value="lys">Lys</option>
          <option value="billette">Billettes</option>
          <option value="croisette">Croisettes</option>
        </select>
        
        <label>Couleur champs</label>
        <color-picker v-model="seme.fieldColor" @input="update"></color-picker>
       
        <label>Couleur meuble</label>
        <color-picker v-model="seme.meubleColor" @input="update"></color-picker>
         
      </div>
    </div>
    `
});