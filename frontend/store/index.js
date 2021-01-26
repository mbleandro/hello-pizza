import Vuex from 'vuex'

const store = () => new Vuex.Store({

  state: {
    logged_user: undefined,
    pedido: [],
    total_price: 0,
    snack: {}
  },
  mutations: {
    SET_LOGGED_USER(state, logged_user) {
      console.log('set logged user: '+JSON.stringify(logged_user))
      state.logged_user = logged_user
    },
    SET_SNACK_STATE(state, newstate) {
      state.snack = newstate
    },
    ADD_TO_ORDER(state, item) {
      state.pedido.push(item)
      state.total_price += item.price
      console.log('PEDIDO = ', state.pedido)
    },
    REMOVE_FROM_ORDER(state, item) {
      state.pedido.splice(state.pedido.indexOf(item), 1)
      state.total_price -= item.price
      console.log('PEDIDO = ', state.pedido)
      console.log('Item removido = ', item)
    },
    SET_PEDIDO(state, _pedido) {
      state.pedido = _pedido
      let total = 0
      _pedido.forEach(element => {
        total += element.price
      });
      state.total_price = total
    }
  },
  getters: {
    logged_user(state) {
      return state.logged_user
    },
    snack (state) {
      return state.snack
    },
    pedido (state) {
      return state.pedido
    },
    total_price (state) {
      return state.total_price
    }
  }
})

export default store