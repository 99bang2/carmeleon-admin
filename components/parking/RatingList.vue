<template>
	<div>
		<button v-waves.button.light class="sc-button sc-button-outline sc-button-outline-danger uk-width-1-1"
				@click="deleteDatas">
			<span data-uk-icon="icon: trash" class="md-color-red-600 uk-margin-small-right"></span>
			리뷰 삭제
		</button>
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
</template>

<script>
	import {agGridMixin} from "~/plugins/ag-grid.mixin"

	export default {
		mixins: [
			agGridMixin
		],
		data() {
			return {
				siteUid: null,
				gridOptions: {
					localeText: {noRowsToShow: '등록된 리뷰가 없습니다.'},
					suppressRowClickSelection: true,
					suppressMenuHide: true,
					rowSelection: 'multiple',
					onGridReady: this.onGridReady,
					onFirstDataRendered: this.onFirstDataRendered,
					getRowStyle: this.getRowStyle,
					getRowHeight: this.getRowHeight,
					rowData: this.rowData,
					rowHeight: 45,
				},
			}
		},
		computed: {
			columnDefs() {
				return [
					{
						headerName: "",
						field: "",
						width: 50,
						resizable: false,
						headerCheckboxSelection: true,
						headerCheckboxSelectionFilteredOnly: true,
						checkboxSelection: true,
						suppressMovable: false,
						onCellClicked: false,
						cellStyle: {
							'text-align': 'center',
						}
					},
					{
						headerName: '구분',
						field: 'rateType',
						width: 80,
						cellRenderer: (obj) => {
							return obj.value ? '<span uk-icon="icon: happy"></span>' : '<span uk-icon="icon: ban"></span>'
						}
					},
					{
						headerName: '리뷰',
						field: 'review',
						width: 280,
					},
					{
						headerName: '평점',
						field: 'rate',
						suppressSizeToFit: false,
						cellClass: 'ratestyle',
						cellRenderer: (obj) => {
							if (obj.data) {
								let label = ''
								let star = ''
								switch (obj.value) {
									case 10:
										star = '★★★★★'
										break;
									case 9:
										star = '★★★★☆'
										break;
									case 8:
										star = '★★★★'
										break;
									case 7:
										star = '★★★☆'
										break;
									case 6:
										star = '★★★'
										label = 'uk-label-success'
										break;
									case 5:
										star = '★★☆'
										label = 'uk-label-success'
										break;
									case 4:
										star = '★★'
										label = 'uk-label-warning'
										break;
									case 3:
										star = '★☆'
										label = 'uk-label-warning'
										break;
									case 2:
										star = '★'
										label = 'uk-label-danger'
										break;
									case 1:
										star = '★☆'
										label = 'uk-label-danger'
										break;
								}
								return `<div><span class="uk-label ${label}">${star}&nbsp;&nbsp;${obj.value / 2}</span></div>`
							}
						}
					},
				]
			}
		},
		methods: {
			async fetchData(siteUid) {
				let res = await this.$axios.$get(this.config.apiUrl + '/api/rates/site/' + siteUid)
				console.log(this.gridOptions.api)
				this.gridOptions.api.setRowData(res.data)
			},
			deleteDatas() {
				let selected = this.gridOptions.api.getSelectedRows()
				let selectedUids = selected.map(({uid}) => uid)
				let seletedCnt = selectedUids.length
				if (seletedCnt) {
					UIkit.modal.confirm(`선택한 항목 : ${seletedCnt}<br/>정말 삭제하시겠습니까?`).then(() => {
						this.$axios.$post(this.config.apiUrl + '/api/rates/bulkDelete', {
							uids: selectedUids
						}).then(res => {
							this.callNotification('삭제하였습니다.')
							this.fetchData(this.siteUid)
						})
					})
				} else {
					this.callAlertError('삭제할 항목을 선택해주세요.')
				}
			},
		},
		beforeMount() {
			this.defaultColDef = {
				cellClass: 'cell-wrap-text',
				autoHeight: true,
				resizable: true,
			};
			this.getRowHeight = params => {
				return (
					params.api.getSizesForCurrentTheme().rowHeight *
					Math.floor(params.data.review.length / 50)
				);
			};
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-rate-list', (uid) => {
				vm.fetchData(uid)
				vm.siteUid = uid
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-rate-list')
		},
	}
</script>

<style>
	.cell-wrap-text {
		white-space: normal !important;
	}

	.ag-row .ag-cell {
		display: flex;
		justify-content: left; /* align horizontal */
		align-items: center;
		line-height: 25px;
	}
</style>
