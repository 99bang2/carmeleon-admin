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
						<table class="uk-table uk-table-large uk-text-normal uk-table-middle">
							<tbody>
							<tr>
								<td>
									<div class="uk-display-inline-block">
										<img
											:src="this.sendData.profileImage"
											class="sc-avatar sc-avatar-initials-lg"
										>
									</div>
								</td>
								<td><span class="uk-text-bold">닉네임</span> {{this.sendData.nickname}}</td>
							</tr>
							<tr>
								<td><span class="uk-text-bold">이메일</span> {{this.sendData.email}}</td>
								<td><span class="uk-text-bold">폰번호</span> {{this.sendData.phone}}</td>
							</tr>
							<tr>
							</tr>
							<tr>
								<td><span class="uk-text-bold">푸시알림 동의</span> {{this.sendData.push}}</td>
								<td><span class="uk-text-bold">포인트</span> {{this.sendData.point}}</td>
							</tr>
							<tr>
								<td colspan="2"><span class="uk-text-bold">마케팅 수신동의</span> {{this.sendData.marketing}}
								</td>
							</tr>
							<tr>
								<td class="uk-table-expand" colspan="2">
									<div class="uk-text-bold">메모</div>
									{{this.sendData.memo}}
								</td>
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
	export default {
		props: {
			mode: {
				type: String,
				default: 'list'
			}
		},
		data() {
			return {
				cardFormClosed: true,
				sendData: {},
				defaultForm: {
					uid: null,
					snsType: '',
					name: '',
					nickname: '',
					email: '',
					phone: '',
					profileImage: '',
					point: '',
					push: false,
					marketing: false,
					memo: '',
				}
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-user-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-user-form', () => {
				vm.closeForm()
			})
			this.$nuxt.$on('close-all-list', () => {
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
				if (props) {
					this.sendData = JSON.parse(JSON.stringify(props.data))
				}
				this.cardFormClosed = true
				setTimeout(() => {
					this.cardFormClosed = false
				}, 100)
			},
			closeForm() {
				this.cardFormClosed = true
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
