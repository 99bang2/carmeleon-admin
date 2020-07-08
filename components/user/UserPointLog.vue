<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi mdi-coins"/>
								포인트히스토리
							</ScCardTitle>
						</div>
						<ScCardActions>
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
							   @click.prevent="closeForm"/>
						</ScCardActions>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<h4 class="uk-text-right">총 금액: {{this.sumPoint}}</h4>
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
				sumPoint: null,
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
			}
		},
		computed:{
			columnDefs(){
				return [
					{
						headerName: '포인트 기록',
						field: 'point',
						width: 100
					},
					{
						headerName: '이유',
						field: 'reason',
						width: 220,
					},
					{
						headerName: '등록일시',
						field: 'createdAt',
						width: 150,
						valueFormatter: obj => {
							return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
						}
					}
				]
			}
		},
		created(){
			let vm = this
			this.$nuxt.$on('open-pointLog-list', (props) => {
				vm.fetchData(props.data.uid)
			})
			this.$nuxt.$on('close-pointLog-list', () =>{
				vm.closeForm()
			})
			this.$nuxt.$on('close-all-list', () =>{
				vm.closeForm()
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-pointLog-list')
			this.$nuxt.$off('close-pointLog-list')
			this.$nuxt.$off('close-all-list')
		},
		methods:{
			async fetchData(data){
				this.cardFormClosed = false
				let res = await this.$axios.$get(this.config.apiUrl + '/api/userPointLogs/' + data)
				this.sumPoint =  res.data.sum
				this.gridOptions.api.setRowData(res.data.row)
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
