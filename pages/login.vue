<template>
	<div class="uk-flex uk-flex-center uk-flex-middle sc-login-page-wrapper">
		<div class="uk-width-2-3@s uk-width-1-2@m uk-width-1-3@l uk-width-1-4@xl uk-margin-auto-vertical">
			<ScCard>
				<ScCardBody>
					<div class="sc-login-page-logo">
						<img :src="appLogo" alt="">
						<p>CarmeleOn Admin</p>
					</div>
					<div id="sc-login-form" class="sc-toggle-login-register sc-toggle-login-password">
						<div class="sc-login-page-inner">
							<div class="uk-margin-medium">
								<ScInput v-model="loginData.id">
									<label>
										ID
									</label>
								</ScInput>
							</div>
							<div class="uk-margin-medium">
								<ScInput v-model="loginData.password" type="password" @keyUp="login">
									<label>
										Password
									</label>
								</ScInput>
							</div>
							<div class="uk-margin-large-top">
								<a href="javascript:void(0)" class="sc-button sc-button-large sc-button-block sc-button-primary" @click="login">
									로그인
								</a>
							</div>
						</div>
					</div>
				</ScCardBody>
			</ScCard>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/Input'

export default {
	layout: 'login_page',
	middleware: ['auth'],
	components: {
		ScInput
	},
	data: () => ({
		loginData: {
			id: '',
			password: ''
		},
	}),
	computed: {
		appLogo() {
			return require('~/assets/img/logo-symbol.png')
		}
	},
	methods: {
		login(e) {
			if(e.type === 'click' || e.keyCode === 13) {
				if (this.loginData.id === '' || this.loginData.id === null) {
					return false
				}
				if (this.loginData.password === '' || this.loginData.password === null) {
					return false
				}
				this.$auth.loginWith('local', {
					data: this.loginData
				}).then(() => {
					window.location = '/'
				})
			}
		}
	},
	head() {
		return {
			'title' : 'CarmeleOn Admin Login Page'
		}
	}

}
</script>
