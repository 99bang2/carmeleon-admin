<template>
	<div>
		<ScCard>
			<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
				<div class="uk-flex-1">
					<ScCardTitle>
						<slot><i class="mdi mdi-parking"/> 주차장 목록</slot>
					</ScCardTitle>
				</div>
				<div class="uk-text-nowrap">
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-plus" style="display: inline-block" @click.prevent="openNewForm" data-uk-tooltip="주차장추가"/>
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline" style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="주차장삭제"/>
				</div>
			</ScCardHeader>
			<ScCardBody>
				<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
					<div class="uk-width-4-5@s">
						<div class="uk-grid-small uk-grid" data-uk-grid>
							<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline" style="height:40px;" @click.prevent="refreshFilter">
								<i class="mdi mdi-refresh"></i>
							</a>
							<div class="uk-width-1-5@s">
								<select v-model="searchSiteType" class="uk-select" required="required">
									<option value="">주차장 유형</option>
									<option value="0">하이파킹</option>
									<option value="1">제휴</option>
									<option value="2">일반</option>
								</select>
							</div>
							<div class="uk-width-1-5@s">
								<select v-model="searchActive" class="uk-select" required="required">
									<option value="">활성 상태</option>
									<option value="true">운영중</option>
									<option value="false">미운영</option>
								</select>
							</div>
							<div style="width: 10px"></div>
							<div class="uk-width-1-5@s">
								<IonRangeSlider v-model="searchRating" :settings="{type: 'double',from:0, to:10, values:[0,1,2,3,4,5,6,7,8,9,10], prefix: 'rate '}"></IonRangeSlider>
							</div>
						</div>
					</div>
					<div class="uk-width-1-5@s">
						<ScInput v-model="searchKeyword" placeholder="주차장 이름, 태그">
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
	import {agGridMixin} from "@/plugins/ag-grid.mixin";
	import ScInput from '~/components/Input'
	import IonRangeSlider from "@/components/RangeSlider";

	export default {
		components: {
			IonRangeSlider,
			ScInput
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
					onCellClicked: this.onRowClicked,
					rowHeight: 45,
					getRowStyle: this.getRowStyle
				},
				searchSiteType: '',
				searchActive: '',
				searchRating: '',
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
						headerName: '주차장 유형',
						field: 'siteType',
						width: 150,
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
						field: 'name',
						suppressSizeToFit: false,
					},
					{
						headerName: '최대 가용대수',
						field: 'parkingLot',
						width: 120,
						cellRenderer: (obj) => {
							return obj.value + ' 대'
						}
					},
					{
						headerName: '운영상태',
						field: 'isActive',
						width: 120,
						cellRenderer: (obj) => {
							return obj.value ? '<span>운영중</span>' : '<span>미운영</span>'
						}
					},
					{
						headerName: '기준가격',
						field: 'price',
						width: 120,
						cellRenderer: (obj) => {
							return obj.value + ' 원'
						}
					},
					{
						headerName: '평점',
						field: 'rate',
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
					{
						headerName: '등록일시',
						field: 'createdAt',
						width: 160,
						valueFormatter: obj => {
							return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
						}
					},
					{
						headerName: '결제태그',
						field: 'paymentTagName',
						hide:true
					},
					{
						headerName: '상품태그',
						field: 'productTagName',
						hide:true
					},
					{
						headerName: '옵션태그',
						field: 'optionTagName',
						hide:true
					},
					{
						headerName: '제휴태그',
						field: 'brandTagName',
						hide:true
					},
					{
						headerName: '차량태그',
						field: 'carTagName',
						hide:true
					},
					{
						headerName: '주차장유형이름',
						field: 'siteTypeName',
						hide:true
					},
				]
			}
		},
		watch: {
			'searchSiteType': function (newValue) {
				let filterComponent = this.gridOptions.api.getFilterInstance('siteType')
				filterComponent.setModel({
					type: 'equals',
					filter: newValue
				})
				this.gridOptions.api.onFilterChanged()
			},
			'searchActive': function (newValue) {
				let filterComponent = this.gridOptions.api.getFilterInstance('isActive')
				filterComponent.setModel({
					type: 'equals',
					filter: newValue
				})
				this.gridOptions.api.onFilterChanged()
			},
			'searchRating': function (newValue) {
				let start = parseInt(newValue.split(";")[0])
				let end = parseInt(newValue.split(";")[1])
				console.log(start, end)
				console.log(typeof start, typeof end)
				let filterComponent = this.gridOptions.api.getFilterInstance('rate')
				filterComponent.setModel({
					operator: 'OR',
					condition1: {
						type: 'inRange',
						filter: start,
						filterTo: end
					},
					condition2: {
						type: 'equals',
						filter: start,
					},
					condition3: {
						type: 'equals',
						filter: end
					},

				})
				this.gridOptions.api.onFilterChanged()
			},
			'searchKeyword': function (newValue) {
				this.gridOptions.api.setQuickFilter(newValue)
			},
		},
		created() {
			let vm = this
			this.$nuxt.$on('reset-parking-list', () => {
				vm.resetSelection()
			})
			this.$nuxt.$on('fetch-parking-list', (uid) => {
				vm.fetchData(uid)
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('reset-parking-list')
			this.$nuxt.$off('fetch-parking-list')
		},
		async mounted() {
			await this.fetchData()
		},
		methods: {
			refreshFilter() {
				this.searchSiteType = ""
				this.searchActive = ""
				this.searchRating = "0;10"
				this.fetchData()
			},
			openNewForm() {
				this.resetSelection()
				this.$nuxt.$emit('open-parking-form')
			},
			onRowClicked(props) {
				this.$nuxt.$emit('open-parking-form', props)
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
				let res = await this.$axios.$get(this.config.apiUrl + '/parkings')
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
			},
			resetSelection() {
				this.gridOptions.api.forEachNode((node) => {
					node.detail = false
				})
				this.gridOptions.api.redrawRows()
			},
			deleteDatas() {
				let selected = this.gridOptions.api.getSelectedRows()
				let selectedUids = selected.map(({uid}) => uid)
				let seletedCnt = selectedUids.length
				if (seletedCnt) {
					UIkit.modal.confirm(`선택한 항목 : ${seletedCnt}<br/>정말 삭제하시겠습니까?`).then(() => {
						this.$axios.$post(this.config.apiUrl + '/parkings/bulkDelete', {
							uids: selectedUids
						}).then(res => {
							this.callNotification('삭제하였습니다.')
							this.$nuxt.$emit('close-parking-form')
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
