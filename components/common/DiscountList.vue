<template>
	<div>
		<div class="uk-accordion-content">
			<h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
				상품 리스트
			</h5>
			<div class="uk-flex uk-flex-around">
				<button v-waves.button.light class="sc-button sc-button-outline sc-button-outline-danger uk-width-2-5"
						@click="setDiscount">
					<span class="mdi mdi-sale mdi-18px md-color-red-600 uk-margin-small-right"></span>
					<span>할인율 등록</span>
				</button>
				<button v-waves.button.light class="sc-button sc-button-outline sc-button-outline-success uk-width-2-5"
						@click="resetDiscount">
					<span class="mdi mdi-refresh mdi-18px md-color-green-600 uk-margin-small-right"></span>
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
			return {
				siteUid: null,
				discountPercent: null,
				gridOptions: {
					localeText: {noRowsToShow: '등록된 상품이 없습니다.'},
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
						//상품명
						headerName: '상품명',
						field: 'ticketTitle',
						width: 140,
					},
					{
						//원가격
						headerName: '상품가격',
						field: 'ticketPrice',
						width: 110,
						cellRenderer: obj => {
							return obj.value + '원'
						}

					},
					{
						//할인가격
						headerName: '할인된가격',
						field: 'ticketPriceDiscount',
						width: 110,
						cellRenderer: obj => {
							return obj.value ? (obj.data.ticketPrice - obj.value) + '원' : ''
						}
					},
					{
						//할인율
						headerName: '할인율',
						field: 'ticketPriceDiscountPercent',
						width: 110,
						cellRenderer: obj => {
							return obj.value ? obj.value + '%' : ''
						}
					}
				]
			}
		},

		created() {
			let vm = this
			this.$nuxt.$on('open-discount-list', (uid) => {
				vm.fetchData(uid)
				vm.siteUid = uid
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-discount-list')
		},
		methods: {
			async fetchData(siteUid) {
				this.productList = []
				let res = await this.$axios.$get(this.config.apiUrl + '/discountTickets', {
					params: {
						siteUid: siteUid
					}
				})
				if (this.gridOptions.api) {
					this.gridOptions.api.setRowData(res.data)
				}
			},
			setDiscount() {
				let selected = this.gridOptions.api.getSelectedRows()
				let selectedUids = selected.map(({uid}) => uid)
				let selectedCnt = selectedUids.length
				if (selectedCnt) {
					UIkit.modal.prompt(`적용할 추가포인트(%)를 입력해주세요`, this.discountPercent).then((discountPercent) => {
						this.$axios.$post(this.config.apiUrl + '/discountTickets/addDiscount', {
							discountPercent: discountPercent,
							uids: selectedUids
						}).then(res => {
							this.callNotification('적용했습니다.')
							this.fetchData(this.siteUid)
						})
					})
				} else {
					this.callAlertError('적용할 항목을 선택해주세요.')
				}
			},
			resetDiscount() {
				let selected = this.gridOptions.api.getSelectedRows()
				let selectedUids = selected.map(({uid}) => uid)
				let selectedCnt = selectedUids.length
				if (selectedCnt) {
					this.$axios.$post(this.config.apiUrl + '/discountTickets/addDiscount', {
						discountPercent: 0,
						uids: selectedUids
					}).then(res => {
						this.callNotification('적용했습니다.')
						this.fetchData(this.siteUid)
					})
				} else {
					this.callAlertError('적용할 항목을 선택해주세요.')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
