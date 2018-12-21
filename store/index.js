import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
			score: 0,
			level: "BEGINNER",
			isCameraPreview: false,
			gameMode: 'ningen'
    }),
    mutations: {
      setScore (state, val) {
        state.score = val
			},
			setIsCameraPreview(state, flag) {
				state.isCameraPreview = flag;
			},
			setGameMode(state, mode) {
				state.gameMode = mode;
			}
		},
		actions: {
			setScore (context, val) {
				context.commit('setScore', val)
			},
			setIsCameraPreview(context, flag) {
				context.commit('setIsCameraPreview', flag)
			},
			setGameMode(context, mode) {
				context.commit('setGameMode', mode)
			}
		},
		getters: {
			score (state) {
				return state.score
			},
			level (state) {
				return state.level
			},
			isCameraPreview (state) {
				return state.isCameraPreview
			},
			gameMode (state) {
				return state.gameMode
			}
		}
  })
}

export default createStore