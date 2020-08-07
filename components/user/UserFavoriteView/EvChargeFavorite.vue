<template>
	<div>
		<ag-grid-vue
			style="width: 100%;"
			class="ag-theme-material"
			:dom-layout="'autoHeight'"
			:locale-text="localeText"
			:default-col-def="defaultColDef"
			:column-defs="columnDefs"
			:grid-options="gridOptions"
			:pagination="true"
			:pagination-page-size="10"
			:framework-components="frameworkComponents"
		></ag-grid-vue>
	</div>
</template>

<script>
	import {agGridMixin} from "~/plugins/ag-grid.mixin"

	export default {
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
					getRowStyle: this.getRowStyle,
					rowHeight: 45,
				},
				cardFormClosed: true,
			}
		},
		computed: {
			columnDefs() {
				return [
					{
						headerName: '전기차충전소명',
						field: 'evCharge.statNm',
						width: 170,
					}, {
						headerName: '충전기타입',
						field: 'evCharge.chgerType',
						width: 200,
						cellRenderer: (obj) => {
							if (obj.data) {
								let text = ''
								switch (obj.value) {
									case '01':
										text = 'DC 차데모'
										break
									case '02':
										text = 'AC 완속'
										break
									case '03':
										text = 'DC 차데모+AC 3상'
										break
									case '04':
										text = 'DC 콤보'
										break
									case '05':
										text = 'DC 차데모+DC 콤보'
										break
									case '06':
										text = 'DC 차데모+AC 3상\n' +
											'+DC 콤보'
										break
									case '07':
										text = 'AC 3상'
										break
								}
								return text
							}
						}
					}, {
						headerName: '충전기상태',
						field: 'evCharge.stat',
						width: 120,
						cellRenderer: (obj) => {
							if (obj.data) {
								let text = ''
								switch (obj.value) {
									case 1 :
										text = '통신이상'
										break
									case 2 :
										text = '충전대기'
										break
									case 3 :
										text = '충전중'
										break
									case 4 :
										text = '운영중지'
										break
									case 5:
										text = '점검중'
										break
									case 9:
										text = '상태미확인'
										break
								}
								return text
							}
						}
					}
				]
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-evCharge-favorite', (uid, type) => {
				vm.fetchData(uid, type)
			})
		},
		methods: {
			async fetchData(targetUid, targetType) {
				this.cardFormClosed = false
				let res = await this.$axios.$get(this.config.apiUrl + '/favorites/' + targetUid)
				let result = res.data.filter(data => data.targetType === targetType)
				this.gridOptions.api.setRowData(result)
			},
		}
	}
</script>

<style scoped>

</style>
