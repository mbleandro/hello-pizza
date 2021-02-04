<template>
  <div class="flex-finish">
    <div>
      <div class="list-finish">
        <template class="flex-finish" v-for="item in pedido">
          <v-list-tile :key="item.title" avatar class="item-content-finish">
            <v-list-tile-avatar>
              <img v-if="!item.half" :src="item.photo">
              <img v-if="item.half" src="../assets/images/default.img.png">
            </v-list-tile-avatar>
            <v-list-tile-content class="item-content-finish" v-if="!item.half">
              <v-list-tile-title>{{item.name}}</v-list-tile-title>
              <v-list-tile-sub-title>{{item.description}}</v-list-tile-sub-title>
              <v-list-tile-sub-title v-if="item.edge && item.edge.id">Borda: {{item.edge.recheio}} + R$ {{item.edge.price | priceBR}}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{item.obs}}</v-list-tile-sub-title>
              <label>R$ {{item.price | priceBR}}<label v-if="item.quant > 1"><strong> (x{{item.quant}})</strong></label></label>
            </v-list-tile-content>
            <v-list-tile-content class="item-content-finish" v-if="item.half">
              <marquee behavior="alternate" style="font-size: 15px;">1: {{item[0].name}} / 2: {{item[1].name}}</marquee>
              <v-list-tile-sub-title>{{item[0].description}}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{item[1].description}}</v-list-tile-sub-title>
              <v-list-tile-sub-title v-if="item.edge && item.edge.id">Borda: {{item.edge.recheio}} + R$ {{item.edge.price | priceBR}}</v-list-tile-sub-title>
              <v-list-tile-sub-title v-if="item.obs">{{item.obs}}</v-list-tile-sub-title>
              <label>R$ {{item.price | priceBR}}<label v-if="item.quant > 1"><strong> (x{{item.quant}})</strong></label></label>
            </v-list-tile-content>
            <v-btn fab flat color="error" dark @click="remove(item)">
             <v-icon>delete</v-icon>
            </v-btn>
          </v-list-tile>
        </template>
      </div>
    </div>
    <p class="total-price-finish">Valor do Pedido: R$ {{ total_price }}</p>

    <h1>Informações de Entrega</h1>

    <form>
      <v-text-field
        v-model="name"
        :error-messages="errorsName"
        label="Nome"
        required
        @input="$v.name.$touch()"
        @blur="$v.name.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="city"
        label="Cidade"
        :error-messages="errorsCity"
        required
        readonly
        @input="$v.city.$touch()"
        @blur="$v.city.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="district"
        label="Bairro"
        :error-messages="errorsDistrict"
        required
        @input="$v.district.$touch()"
        @blur="$v.district.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="street"
        label="Rua"
        :error-messages="errorsStreet"
        required
        @input="$v.street.$touch()"
        @blur="$v.street.$touch()"
      ></v-text-field>
      <v-text-field
        v-model="number"
        label="Numero"
        :error-messages="errorsNumber"
        type="number"
        required
        @input="$v.number.$touch()"
        @blur="$v.number.$touch()"
      ></v-text-field>
      <div class="flex-finish">
        <v-btn class="conclude-order" color="success" @click="send_order()"
          ><v-icon dark left>local_shipping</v-icon> Finalizar Compra</v-btn
        >
      </div>
    </form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  data() {
    return {
      name: "",
      city: "Taubaté",
      district: "",
      street: "",
      number: null,
      apilink: "",
      text: "",
    };
  },
  validations: {
    name: { required, maxLength: maxLength(30) },
    city: { required },
    district: { required },
    street: { required },
    number: { required },
  },
  mounted() {
      if (this.pedido.length == 0) {
        this.$store.commit("SET_PEDIDO", JSON.parse(this.$cookies.get('pedido')))
      }
  },
  methods: {
    open() {
      this.visible = true;
      console.log("Open");
    },
    close() {
      this.visible = false;
      console.log("Close");
    },
    remove(item) {
      console.log("Remove : ", item);
      this.$store.commit("REMOVE_FROM_ORDER", item);
      this.$cookies.set("pedido", JSON.stringify(this.pedido))
    },
    send_order() {
      this.$v.$touch();
      if (
        this.errorsName.length == 0 &&
        this.errorsCity.length == 0 &&
        this.errorsDistrict.length == 0 &&
        this.errorsStreet.length == 0 &&
        this.errorsNumber.length == 0
      ) {
        this.text += `Bom dia / Boa tarde / Boa Noite \n`;
        this.pedido.forEach((item) => {
          if (item.half) {
            this.text += ` Quantidade: *x${item.quant}*\n`;
            this.text += `*- 1: Meia ${item[0].name} / 2: Meia ${item[1].name}* \n`
            this.text += ` --- 1: ${item[0].description} \n`;
            this.text += ` --- 2: ${item[1].description} \n`;
            if(item.edge && item.edge.id) {
              this.text += ` --- Borda: ${item.edge.recheio} + R$${item.edge.price.toFixed(2).replace(".", ",")}\n`;
            }
            this.text += ` ---------------- R$${item.price.toFixed(2).replace(".", ",")} \n `;
            if (item.obs) {
              this.text += `obs: ${item.obs} \n \n`
            }
          } else {
            this.text += ` Quantidade: *x${item.quant}*\n`;
            this.text += `*- ${item.name}* \n`;
            this.text += ` --- ${item.description} \n`
            if(item.edge && item.edge.id) {
              this.text += ` --- Borda: ${item.edge.recheio} + R$${item.edge.price.toFixed(2).replace(".", ",")}\n`;
            }
            this.text += ` ---------------- R$${item.price.toFixed(2).replace(".", ",")} \n `;
            if (item.obs) {
              this.text += `obs: ${item.obs} \n \n`
            }
          }
          this.text += `\n`;
        })
        this.text += `---- Total: R$${this.total_price} ---- \n \n`;
        this.text += `*Entregar para ${this.$v.name.$model} no endereço:*`;
        this.text += `-- ${this.$v.street.$model}, num. ${this.$v.number.$model} \n --- ${this.$v.district.$model}, ${this.$v.city.$model}`;
        this.apilink = "http://";
        this.apilink += this.isMobile() ? "api" : "web";
        this.apilink +=
          ".whatsapp.com/send?phone=" +
          this.config.phone +
          "&text=" +
          encodeURI(this.text);
        window.open(this.apilink);
        this.clear_pedido()
      } 
    },
    isMobile() {
      var check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    clear_pedido() {
      this.$store.commit('CREATE_PEDIDO')
      this.$cookies.set("pedido", JSON.stringify(this.pedido));
    }
  },
  computed: {
    pedido: function () {
      return this.$store.getters.pedido;
    },
    total_price: function () {
      return this.$store.getters.total_price.toFixed(2).replace(".", ",");
    },
    config: function () {
      let _config = this.$store.getters.config;
      return this.$store.getters.config;
    },
    errorsDistrict() {
      const errors = [];
      if (!this.$v.district.$dirty) return errors;
      !this.$v.district.required && errors.push("Campo obrigatório");
      return errors;
    },
    errorsCity() {
      const errors = [];
      if (!this.$v.city.$dirty) return errors;
      !this.$v.city.required && errors.push("Campo obrigatório");
      return errors;
    },
    errorsName() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Nome deve ter no máximo 15 caracteres");
      !this.$v.name.required && errors.push("Nome é obrigatório.");
      return errors;
    },
    errorsNumber() {
      const errors = [];
      if (!this.$v.number.$dirty) return errors;
      !this.$v.number.required && errors.push("Campo obrigatório");
      return errors;
    },
    errorsStreet() {
      const errors = [];
      if (!this.$v.street.$dirty) return errors;
      !this.$v.street.required && errors.push("Campo obrigatório");
      return errors;
    },
  },
};
</script>

<style >
.flex-finish {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.list-finish {
  width: 100%;
  justify-content: space-around;
  display: flex;
  flex-direction: column;
  height: auto;
}

.total-price-finish {
  align-self: flex-end;
  margin-right: 35px;
  font-weight: bold;
}

.item-content-finish {
  height: 110px;
}

</style>
