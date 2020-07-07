<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi mdi-account-card-details-outline"/>
								유저상세정보
							</ScCardTitle>
						</div>
						<ScCardActions>
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
							   @click.prevent="closeForm"/>
						</ScCardActions>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<div class="uk-accordion-content">
						<table class="uk-table uk-text-bold">
							<tbody>
								<tr>
									<td>
										<ScAvatar :avatar-id="5" size="lg"></ScAvatar>
									</td>
									<td>유저 닉네임</td>
								</tr>
								<tr>
									<td>email</td>
									<td>성별</td>
								</tr>
								<tr>
									<td>연령대</td>
									<td>생일</td>
								</tr>
								<tr>
									<td>푸시알림여부</td>
									<td>포인트</td>
								</tr>
								<tr>
									<td>차량등록여부</td>
									<td>카드등록여부</td>
								</tr>
							</tbody>
						</table>
					</div>
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import ScAvatar from '~/components/Avatar'

	export default {
		components: {
			ScAvatar
		},
		props: {
			mode: {
				type: String,
				default: 'list'
			}
		},
		data() {
			return{
				cardFormClosed: true,
				sendData:{},
				defaultForm: {
					uid: null,
					snsType: '',
					name: '',
					nickname: '',
					email: '',
					phone: '',
					profileImage: '',
					point: '',
					marketing: false,
					memo: '',
				}
			}
		},
		created(){
			let vm = this
			this.$nuxt.$on('open-user-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-user-form', () =>{
				vm.closeForm()
			})
			this.$nuxt.$on('close-all-list', () =>{
				vm.closeForm()
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-user-form')
			this.$nuxt.$off('close-user-form')
			this.$nuxt.$off('close-all-list')
		},
		methods: {
			settingForm(props) {
				if(props) {
					this.sendData = JSON.parse(JSON.stringify(props.data))
				}
				// else {
				// 	this.sendData = JSON.parse(JSON.stringify(this.defaultForm))
				// }
				this.cardFormClosed = true
				setTimeout(()=>{
					this.cardFormClosed = false
				}, 100)
			},
			closeForm(){
				this.cardFormClosed =true
				this.$nuxt.$emit('reset-user-list')
			}
		}
	}
</script>

<style scoped>
	td {
		vertical-align: middle;
	}
</style>
