import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      score: 0
    }),
    mutations: {
      setScore (state, val) {
        state.score = val
      }
		},
		actions: {
			setScore (context, val) {
				context.commit('setScore', val)
			}
		},
		getters: {
			getScore (state) {
				return state.score
			}
		}
  })
}

export default createStore