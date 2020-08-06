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
						headerName: '주유소명',
						field: 'gasStation.gasStationName',
						width: 110,
					}, {
						headerName: '브랜드',
						field: 'gasStation.brandCodeName',
						width: 120,
					}, {
						headerName: '업종구분',
						field: 'gasStation.gasStationTypeName',
						width: 120,
					}, {
						headerName: '평점',
						field: 'gasStation.rate',
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
					}
				]
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-gasStation-favorite', (uid, type) => {

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
