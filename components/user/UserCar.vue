<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi mdi-car"/>
								{{ userName ? userName+'님의 차량정보': '차량정보' }}
							</ScCardTitle>
						</div>
						<ScCardActions>
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
							   @click.prevent="closeForm"/>
						</ScCardActions>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<ag-grid-vue
						style="width: 100%"
						class="ag-theme-material"
						:dom-layout="'autoHeight'"
						:locale-text="localeText"
						:default-col-def="defaultColDef"
						:column-defs="columnDefs"
						:grid-options="gridOptions"
						:pagination="true"
						:pagination-page-size="10"
					>
					</ag-grid-vue>
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import {agGridMixin} from "~/plugins/ag-grid.mixin"
	export default {
		props: {
			mode: {
				type: String,
				default: 'list'
			}
		},
		mixins: [
			agGridMixin
		],
		data() {
			return {
				gridOptions: {
					suppressRowClickSelection: true,
					suppressMenuHide: true,
					rowSelection: 'multiple',
					onGridReady: this.onGridReady,
					onFirstDataRendered: this.onFirstDataRendered,
					rowHeight: 45,
					getRowStyle: this.getRowStyle
				},
				cardFormClosed: true,
				userName:''
			}
		},
		computed:{
			columnDefs(){
				return [
					{
						headerName: '차종',
						field: 'carType',
						width: 120
					},
					{
						headerName: '모델명',
						field:'carModel',
						width: 120
					},
					{
						headerName: '차량번호',
						field:'carPlate',
						width: 120
					},
					{
						headerName: '주사용여부',
						field: 'isMain',
						width: 120,
						cellRenderer: (obj) => {
							return obj.value?<span>주사용차량</span>:''
						}
					}
				]
			}
		},
		created(){
			let vm = this
			this.$nuxt.$on('open-car-list', (props) => {
				vm.fetchData(props.data.uid)
				this.userName = props.data.nickname
			})
			this.$nuxt.$on('close-car-list', () =>{
				vm.closeForm()
			})
			this.$nuxt.$on('close-all-list', () =>{
				vm.closeForm()
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-car-list')
			this.$nuxt.$off('close-car-list')
			this.$nuxt.$off('close-all-list')
		},
		methods:{
			async fetchData(data){
				this.cardFormClosed = false
				let res = await this.$axios.$get(this.config.apiUrl + '/cars/' + data)
				this.gridOptions.api.setRowData(res.data)
			},
			closeForm(){
				this.cardFormClosed =true
				this.$nuxt.$emit('reset-user-list')
			}
		}
	}
</script>

<style scoped>

</style>
