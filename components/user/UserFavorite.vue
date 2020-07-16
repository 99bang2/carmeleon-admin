<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi mdi-creation"/>
								{{ userName ? userName+'님의 즐겨찾기 목록': '즐겨찾기 목록' }}
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
						headerName: '주차장 유형',
						field: 'parkingSite.siteType',
						width: 90,
						cellRenderer: (obj) => {
							if (obj.data) {
								let badge = ''
								let typeName = ''
								switch (obj.value) {
									case 0 :
										badge = 'md-bg-green-500'
										typeName = '하이파킹'
										break
									case 1 :
										badge = 'md-bg-blue-500'
										typeName = '제휴'
										break
									case 2 :
										badge = 'md-bg-gray-500'
										typeName = '일반'
										break
								}
								return `<span class="uk-badge ${badge}">${typeName}</span>`
							}
						}
					},
					{
						headerName: '주차장 이름',
						field: 'parkingSite.name',
						width: 140
					},
					{
						headerName: '기준가격',
						field: 'parkingSite.price',
						width: 120,
						cellRenderer: (obj) => {
							return obj.value + ' 원'
						}
					},
					{
						headerName: '평점',
						field: 'parkingSite.rate',
						width: 120,
						filter: 'agNumberColumnFilter',
						cellRenderer: (obj) => {
							if (obj.value) {
								function roundToTwo(num) {
									return +(Math.round(num + "e+2") + "e-2");
								}
								let temp = ''
								if (obj.value > 8) {
									temp = '★★★★★'
								} else if (obj.value > 6 && obj.value <= 8) {
									temp = '★★★★'
								} else if (obj.value > 4 && obj.value <= 6) {
									temp = '★★★'
								} else if (obj.value > 2 && obj.value <= 4) {
									temp = '★★'
								} else {
									temp = '★'
								}
								return `<span>${temp} ${roundToTwo(obj.value)}</span>`;
							}
						}
					},
				]
			}
		},
		created(){
			let vm = this
			this.$nuxt.$on('open-favorite-list', (props) => {
				vm.fetchData(props.data.uid)
				this.userName = props.data.nickname
			})
			this.$nuxt.$on('close-favorite-list', () =>{
				vm.closeForm()
			})
			this.$nuxt.$on('close-all-list', () =>{
				vm.closeForm()
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-favorite-list')
			this.$nuxt.$off('close-favorite-list')
			this.$nuxt.$off('close-all-list')
		},
		methods:{
			async fetchData(data){
				this.cardFormClosed = false
				let res = await this.$axios.$get(this.config.apiUrl + '/favorites/' + data)
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
