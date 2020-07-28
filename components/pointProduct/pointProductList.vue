<template>
	<div>
		<ScCard>
			<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
				<div class="uk-flex-1">
					<ScCardTitle>
						<slot><i class="mdi mdi-coin"/>포인트상품목록</slot>
					</ScCardTitle>
				</div>
				<div class="uk-text-nowrap">
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-tag-plus"
					   style="display: inline-block" @click.prevent="addPoints" data-uk-tooltip="추가포인트적용"/>
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-shape-circle-plus"
					   style="display: inline-block" @click.prevent="openNewForm" data-uk-tooltip="포인트상품생성"/>
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline"
					   style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="포인트상품삭제"/>
				</div>
			</ScCardHeader>
			<ScCardBody>
				<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
					<div class="uk-width-3-5@s">
					</div>
					<div class="uk-width-2-5@s">
						<ScInput v-model="searchKeyword" placeholder="검색">
							<span slot="icon" class="uk-form-icon" data-uk-icon="search"/>
						</ScInput>
					</div>
				</div>
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
				>
				</ag-grid-vue>
			</ScCardBody>
		</ScCard>
	</div>
</template>

<script>
	import ScInput from '~/components/Input'
	import {agGridMixin} from "@/plugins/ag-grid.mixin";

	export default {
		components: {
			ScInput
		},
		mixins: [
			agGridMixin
		],
		data() {
			return {
				addPoint: null,
				gridOptions: {
					suppressRowClickSelection: true,
					suppressMenuHide: true,
					rowSelection: 'multiple',
					onGridReady: this.onGridReady,
					onFirstDataRendered: this.onFirstDataRendered,
					onCellClicked: this.onRowClicked,
					rowHeight: 45,
					getRowStyle: this.getRowStyle
				},
				searchKeyword: '',
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
						suppressMovable: true,
						onCellClicked: false,
						cellStyle: {
							'text-align': 'center'
						}
					},
					{
						headerName: "포인트",
						field: "point",
						width: 200,
						cellRenderer: (obj) => {
							return obj.value + ' Point'
						}
					},
					{
						headerName: "가격",
						field: "price",
						width: 200,
						cellRenderer: (obj) => {
							return obj.value + ' 원'
						}
					},
					{
						headerName: "추가포인트",
						field: "addPoint",
						width: 210,
						cellRenderer: (obj) => {
							return obj.value ? '+' + obj.value : ''
						}
					},
					{
						headerName: "추가포인트 퍼센트(%)",
						field: "addPointPercent",
						width: 210,
						cellRenderer: (obj) => {
							return obj.value ? obj.value + '%' :''
						}
					},
					{
						headerName: '등록일시',
						field: 'createdAt',
						width: 160,
						valueFormatter: obj => {
							return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
						}
					}
				]
			}
		},
		watch: {
			'searchKeyword': function (newValue) {
				this.gridOptions.api.setQuickFilter(newValue)
			},
		},
		created() {
			let vm = this
			this.$nuxt.$on('reset-pointProduct-list', () => {
				vm.resetSelection()
			})
			this.$nuxt.$on('fetch-pointProduct-list', (uid) => {
				vm.fetchData(uid)
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('reset-pointProduct-list')
			this.$nuxt.$off('fetch-pointProduct-list')
		},
		async mounted() {
			await this.fetchData()
		},
		methods: {
			openNewForm() {
				this.resetSelection()
				this.$nuxt.$emit('open-pointProduct-form')
			},
			onRowClicked(props) {
				this.$nuxt.$emit('open-pointProduct-form', props)
				this.resetSelection()
				props.node.detail = true
				this.gridOptions.api.redrawRows()
			},
			closeForm() {
				this.gridOptions.api.forEachNode((node) => {
					node.detail = false
				})
				this.cardFormClosed = true
				this.gridOptions.api.redrawRows()
			},
			async fetchData(selectUid) {
				// API 연동
				let res = await this.$axios.$get(this.config.apiUrl + '/pointProducts')
				if(this.gridOptions.api) {
					this.gridOptions.api.setRowData(res.data)
					if (selectUid) {
						this.gridOptions.api.forEachNode((node) => {
							if (node.data.uid === selectUid) {
								this.onRowClicked({
									node: node,
									data: node.data
								})
							}
						})
					}
				}
			},
			resetSelection() {
				this.gridOptions.api.forEachNode((node) => {
					node.detail = false
				})
				this.gridOptions.api.redrawRows()
			},
			addPoints() {
				let selected = this.gridOptions.api.getSelectedRows()
				let selectedUids = selected.map(({uid}) => uid)
				let seletedCnt = selectedUids.length
				if (seletedCnt) {
					UIkit.modal.prompt(`적용할 추가포인트(%)를 입력해주세요`, this.addPoint).then((pointPercent) => {
						this.$axios.$post(this.config.apiUrl + '/pointProducts/addPoint', {
							addPoint: pointPercent,
							uids: selectedUids
						}).then(res => {
							this.callNotification('적용했습니다.')
							this.$nuxt.$emit('close-pointProduct-form')
							this.fetchData()
						})
					})
				} else {
					this.callAlertError('적용할 항목을 선택해주세요.')
				}
			},
			deleteDatas() {
				let selected = this.gridOptions.api.getSelectedRows()
				let selectedUids = selected.map(({uid}) => uid)
				let seletedCnt = selectedUids.length
				if (seletedCnt) {
					UIkit.modal.confirm(`선택한 항목 : ${seletedCnt}<br/>정말 삭제하시겠습니까?`).then(() => {
						this.$axios.$post(this.config.apiUrl + '/pointProducts/bulkDelete', {
							uids: selectedUids
						}).then(res => {
							this.callNotification('삭제하였습니다.')
							this.$nuxt.$emit('close-pointProduct-form')
							this.fetchData()
						})
					})
				} else {
					this.callAlertError('삭제할 항목을 선택해주세요.')
				}
			},
		}
	}
</script>

<style scoped>

</style>
