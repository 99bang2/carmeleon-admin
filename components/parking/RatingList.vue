<template>
	<ag-grid-vue
		style="width: 100%;"
		class="ag-theme-material"
		:dom-layout="'autoHeight'"
		:default-col-def="defaultColDef"
		:column-defs="columnDefs"
		:grid-options="gridOptions"
		:pagination="true"
		:pagination-page-size="10"
		:row-model-type="'normal'"
		:cache-overflow-size="10"
		:cache-block-size="10"
		:max-concurrent-datasource-requests="1"
		:max-blocks-in-cache="10"
		:framework-components="frameworkComponents"
	>
	</ag-grid-vue>
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
					localeText: {noRowsToShow: '등록된 리뷰가 없습니다.'},
					suppressRowClickSelection: true,
					suppressMenuHide: true,
					rowSelection: 'multiple',
					onGridReady: this.onGridReady,
					onFirstDataRendered: this.onFirstDataRendered,
					onCellClicked: this.onRowClicked,
					rowHeight: 45,
					getRowStyle: this.getRowStyle,
				},
			}
		},
		computed: {
			columnDefs() {
				return [
					{
						headerName: '구분',
						field: 'rateType',
						width: 50,
						cellRenderer: (obj) => {
							return obj.value ? '<span uk-icon="icon: happy"></span>' : '<span uk-icon="icon: ban"></span>'
						}
					},
					{
						headerName: '리뷰',
						field: 'review',
						width: 320,
					},
					{
						headerName: '평점',
						field: 'rate',
						suppressSizeToFit: false,
						cellRenderer: (obj) => {
							if (obj.data) {
								let label = ''
								let star =''
								switch (obj.value) {
									case 5:
										star = '★★★★★'
										break;
									case 4:
										star = '★★★★'
										break;
									case 3:
										star = '★★★'
										label = 'uk-label-success'
										break;
									case 2:
										star = '★★'
										label = 'uk-label-warning'
										break;
									case 1:
										star = '★'
										label = 'uk-label-danger'
										break;
								}
								return `<div style="text-align:right"><span class="uk-label ${label}">${star}&nbsp;&nbsp;${obj.value}</span></div>`
							}
						}
					}
				]
			}
		},
		methods: {
			async fetchData(siteUid) {
				let res = await this.$axios.$get(this.config.apiUrl + '/api/rates/site/' + siteUid)
				this.gridOptions.api.setRowData(res.data)
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-rate-list', (uid) => {
				vm.fetchData(uid)
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-rate-list')
		},
	}
</script>

<style scoped>

</style>
