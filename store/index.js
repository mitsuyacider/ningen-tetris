import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
			score: 0,
			level: "BEGINNER",
			isCameraMode: false
    }),
    mutations: {
      setScore (state, val) {
        state.score = val
			},
			setIsCameraMode(state, flag) {
				state.isCameraMode = flag;
			}
		},
		actions: {
			setScore (context, val) {
				context.commit('setScore', val)
			},
			setIsCameraMode(context, flag) {
				context.commit('setIsCameraMode', flag)
			}
		},
		getters: {
			score (state) {
				return state.score
			},
			level (state) {
				return state.level
			},
			isCameraMode (state) {
				return state.isCameraMode
			}
		}
  })
}

export default createStore