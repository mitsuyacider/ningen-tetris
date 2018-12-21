<template>
	<!-- info container -->
	<div class="info-container col-md-6 mb-3">
		<!-- howto -->
		<div class="howto-container row">
			<div class="move-box col-md-6">
				<b-card border-variant="light"
								title="MOVE"
								:img-src=img.move
								img-alt="Image"
								img-top
								tag="article"
								style="max-width: 80%;"
								class="mb-2">
					<p class="card-text">
						If you move between left and right, falling tetris block will follow you.
					</p>
				</b-card>				
			</div>
			<div class="rotate-box col-md-6">
				<b-card title="ROTATE"
								:img-src=img.rotate
								img-alt="Image"
								img-top
								tag="article"
								style="max-width: 80%;"
								class="mb-2">
					<p class="card-text">
						Every time you jump, falling tetris block will rotate.
					</p>
				</b-card>						
			</div>
		</div><!-- /howto -->    
		<!-- score-container -->
		<div class="score-container row">
			<div class="score-box col-md-6">
				<b-card header="SCORE"
								:title=$store.getters.score.toString()
								tag="article"
								style="max-width: 80%;"
								class="mb-2">

				</b-card>					
			</div>          
			<div class="level-box col-md-6">
				<b-card header="LEVEL"
								:title=$store.getters.level.toString()
								tag="article"
								style="max-width: 80%;"
								class="mb-2">
				</b-card>					
			</div>          
		</div><!-- /score-container -->		
		<div class="paramerter-container">
			<div class="paramerter-container__show-video">
		    <b-button :pressed.sync="myToggle" variant="secondary">{{myToggle ? "Camera View" : "No Camera"}}</b-button>
			</div>
		</div>    
	</div><!-- /info container -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
		return {
			img: {
					move: require('@/assets/img/move.png'),
					rotate: require('@/assets/img/rotate.png')
			},
      myToggle: false,
      buttons: [
        { variant: 'outline-success', caption: 'カメラ表示', state: false }
      ]			
		}
	},
  computed: {
    // ゲッターを、スプレッド演算子（object spread operator）を使って computed に組み込む
    ...mapGetters([
			'score',
			'level'
    ])
	},
	watch: {
		myToggle(newVal, oldVal) {
			console.log(newVal + " ? " + this.myToggle)
			this.setIsCameraMode(newVal)
		}
	},
	methods: {
		 ...mapActions([
      'setIsCameraMode'
    ]),
	}
}
</script>

<style lang="scss" scoped>
.card {
	border: none;

	margin: 0;
	.card-title {
		color: #6C6A2C;
	}

	.card-body {
		background: #F7F1D5;
	}
}
.score-container {
	margin-top: 30px;
	.card-body {
		padding-top: 5px;
		padding-bottom: 5px;
	}

	.score-box {
		color: #D15A6E;

		.card-title {
			color: #D15A6E;
		}
	}
}

.howto-container {
  margin-top: 0px;
}

.paramerter-container {
	margin-top: 30px;
	color: #6C6A2C;
}
</style>