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
						If you move between left and right, falling tetris block will follow with you.
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
								:title=$store.getters.gameSpeed
								tag="article"
								style="max-width: 80%;"
								class="mb-2">
				</b-card>					
			</div>          
		</div><!-- /score-container -->		
		<!-- parameter-container -->
		<div class="paramerter-container row">
			<div class="level-box col-md-12">
				<b-card header="Other Settings"
								tag="article"
								style="max-width: 90%;"
								class="mb-2">

					<div class="paramerter-container__record d-flex">
						<div class="title col-md-2">
							<span>Camera</span>				
						</div>
						<div class="parameter col-md-10">
							<b-tabs pills card>
								<b-tab v-on:click="setIsCameraPreview(true)" title="PREVIEW"></b-tab>
								<b-tab v-on:click="setIsCameraPreview(false)" title="NO CAMERA" active></b-tab>
							</b-tabs>									
							<!-- <b-button :pressed.sync="myToggle" variant="secondary">{{myToggle ? "Camera View" : "No Camera"}}</b-button> -->
						</div>
					</div>
					<div class="paramerter-container__record d-flex">
						<div class="title col-md-2">
							<span>PlayStyle</span>				
						</div>
						<div class="parameter col-md-10">
							<b-tabs pills card>
								<b-tab v-on:click="setGameMode('ningen')" title="NINGEN"></b-tab>
								<b-tab v-on:click="setGameMode('normal')" title="NORMAL"></b-tab>
							</b-tabs>				
						</div>
					</div>
					<div class="paramerter-container__record d-flex">
						<div class="title col-md-2">
							<span>Speed</span>				
						</div>
						<div class="parameter col-md-10">
							<b-tabs pills card>
								<b-tab v-on:click="setGameSpeed('ULTRA BEGINNER')" title="SLOWEST"></b-tab>
								<b-tab v-on:click="setGameSpeed('BEGINNER')" title="SLOWER"></b-tab>
								<b-tab v-on:click="setGameSpeed('NORMAL')" title="NORMAL"></b-tab>
								<b-tab v-on:click="setGameSpeed('EXPERT')" title="FASTER"></b-tab>
								<b-tab v-on:click="setGameSpeed('GOD')" title="FASTEST"></b-tab>
							</b-tabs>				
						</div>
					</div>								
				</b-card>					
			</div> 			
		</div><!-- /parameter-container -->
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
			isNingenMode: true
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
		isNingenMode(newVal, oldVal) {
			console.log(newVal + " ? " + this.isNingenMode)
		}
	},
	methods: {
		 ...mapActions([
			'setIsCameraPreview',
			'setGameMode',
			'setGameSpeed'
		]),
		onClickGameMode(index) {
			console.log(index + " ? " + this.isNingenMode)
		}
	}
}
</script>

<style lang="scss" scoped>
.paramerter-container {
	margin-top: 30px;
	color: #6C6A2C;

	.card-body {
		padding: 10px;
	}
	&__record {
		.title {
			padding: 0 10px;;
		}
	}
}

.card {
	border: none;

	margin: 0;
	.card-title {
		color: #6C6A2C;
	}

	.card-body {
		background: #F7F1D5;
		padding: 10px;
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

.card-text, .card-title {
	padding: 0 10px;;
}

</style>