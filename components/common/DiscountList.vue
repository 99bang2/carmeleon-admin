<template>
	<div>
		<div class="uk-accordion-content">
			<h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
				상품 리스트
			</h5>
			<div class="uk-flex uk-flex-around">
				<button v-waves.button.light class="sc-button sc-button-outline sc-button-outline-danger uk-width-2-5" @click="setDiscount">
					<span class = "mdi mdi-sale mdi-18px md-color-red-600 uk-margin-small-right"></span>
					<span>할인율 등록</span>
				</button>
				<button v-waves.button.light class="sc-button sc-button-outline sc-button-outline-success uk-width-2-5" @click="resetDiscount">
					<span class = "mdi mdi-refresh mdi-18px md-color-green-600 uk-margin-small-right"></span>
					<span>할인율 초기화</span>
				</button>
			</div>
			<div style="height: 20px"></div>
			<div>
				<ag-grid-vue
					style="width: 100%;"
					class="ag-theme-material"
					:dom-layout="'autoHeight'"
					:default-col-def="defaultColDef"
					:column-defs="columnDefs"
					:grid-options="gridOptions"
					:pagination="true"
					:pagination-page-size="10"
					:framework-components="frameworkComponents"
				>
				</ag-grid-vue>
			</div>
		</div>
	</div>
</template>

<script>
	import {agGridMixin} from "~/plugins/ag-grid.mixin"
    export default {
		mixins: [
			agGridMixin
		],
		props: {
			mode: {
				type: String,
				default: 'list'
			}
		},
    	data() {
			return{
				submitStatus: null,
				siteUid:'',
				sendData: {},
				defaultForm:{
					uid: null,
					siteUid: null,
					ticketType: null,
					ticketDayType:null,
					ticketTime:null,
					ticketPrice:null,
					isActive: true,
				},
				ticketDayTypeOpts:[],
				ticketTypeOpts:[],
				productList:[]
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-product-list', (uid) => {
				vm.sendData = {}
				vm.siteUid = null
				vm.$v.$reset()
				vm.fetchData(uid)
				vm.sendData.siteUid = uid
			})
		},
		async beforeMount() {
			this.sendData = this.defaultForm
			let code = await this.$axios.$post(this.config.apiUrl + '/codes')
			this.ticketTypeOpts = this.convertSelectJson(code.data.ticketTypeOpts)
			this.ticketDayTypeOpts = this.convertSelectJson(code.data.ticketDayTypeOpts)
		},
		beforeDestroy() {
			this.$nuxt.$off('open-product-list')
		},
		methods:{
			async openInfo(selectUid){
				let res = await this.$axios.$get(this.config.apiUrl + '/discountTickets/'+selectUid)
				this.sendData = res.data
				this.sendData.ticketType = String(res.data.ticketType)
			},
			async fetchData(siteUid){
				this.productList = []
				let res = await this.$axios.$get(this.config.apiUrl + '/discountTickets', {
					params:{
						siteUid: siteUid
					}
				})
				for(let i of res.data){
					this.productList.push(i)
				}
			},
			submitForm(e) {
				e.preventDefault()
				this.$v.$touch()
				if (this.$v.$invalid) {
					this.submitStatus = 'ERROR'
				} else {
					this.submitStatus = 'PENDING'
					if (this.sendData.uid) {
						this.putForm()
					} else {
						this.postForm()
					}
				}
			},
			postForm() {
				this.$axios.$post(this.config.apiUrl + '/discountTickets', this.sendData).then(async res => {
					this.callNotification('상품을 생성했습니다.')
					this.$nuxt.$emit('open-product-list', this.sendData.siteUid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/discountTickets/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('open-product-list', this.sendData.siteUid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			deleteForm() {
				this.$axios.$delete(this.config.apiUrl + '/discountTickets/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('삭제하였습니다.')
					this.$nuxt.$emit('open-product-list', this.sendData.siteUid)
				}).finally(() => {
					this.deleteStatus = 'OK'
				})
			},
			convertSelectJson(json) {
				let dataArray = []
				Object.entries(json).map(function (obj) {
					let data = {}
					data.id = obj[0]
					data.text = obj[1]
					dataArray.push(data)
				})
				return dataArray
			}
		}
    }
</script>

<style lang="scss" scoped>

</style>
