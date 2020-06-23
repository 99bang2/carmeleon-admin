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
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-plus"
					   style="display: inline-block" @click.prevent="openNewForm" data-uk-tooltip="주차장추가"/>
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline"
					   style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="주차장삭제"/>
				</div>
			</ScCardHeader>
			<ScCardBody>
				<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
					<div class="uk-width-3-5@s">
						<div class="uk-grid-small uk-grid" data-uk-grid>
							<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline"
							   style="height:40px;" @click.prevent="fetchData">
								<i class="mdi mdi-refresh"></i>
							</a>
							<div class="uk-width-1-5@s">
								<select v-model="searchSiteType" class="uk-select" required="required">
									<option value="" disabled="disabled">주차장 유형</option>
									<option value="0">하이파킹</option>
									<option value="1">제휴</option>
									<option value="2">일반</option>
								</select>
							</div>
							<div class="uk-width-1-5@s">
								<select v-model="searchActive" class="uk-select" required="required">
									<option value="" disabled="disabled">활성 상태</option>
									<option value="true">운영중</option>
									<option value="false">미운영</option>
								</select>
							</div>
							<div class="uk-width-1-5@s">
								<select v-model="searchRating" class="uk-select" required="required">
									<option value="" disabled="disabled">평점</option>
									<option value="4">★★★★★ 5</option>
									<option value="3">★★★★ 4</option>
									<option value="2">★★★ 3</option>
									<option value="1">★★ 2</option>
									<option value="0">★ 1</option>
								</select>
							</div>
						</div>
					</div>
					<div class="uk-width-1-5@s">

					</div>
					<div class="uk-width-1-5@s">
						<ScInput v-model="searchKeyword" placeholder="주차장 이름">
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

	export default {
		components: {
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
										badge = 'md-bg-teal-600'
										typeName = '하이파킹'
										break
									case 1 :
										badge = 'md-bg-blue-600'
										typeName = '제휴'
										break
									case 2 :
										badge = 'md-bg-gray-600'
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
						field: 'rating',
						width: 120,
						cellRenderer: (obj) => {
							if (obj.data) {
								let temp = ''
								switch (obj.value) {
									case 0:
									case 1:
										temp = '★ 1'
										break;
									case 2:
									case 3:
										temp = '★★ 2'
										break;
									case 4:
									case 5:
										temp = '★★★ 3'
										break;
									case 6:
									case 7:
										temp = '★★★★ 4'
										break;
									case 8:
									case 9:
										temp = '★★★★★ 5'
										break;
								}
								return `<span>${temp}</span>`;
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
					}

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
				let filterComponent = this.gridOptions.api.getFilterInstance('rating')
				filterComponent.setModel({
					type: 'equals',
					filter: newValue
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
				let fakeData = [
					{
						uid: 1,
						siteType: 0,
						name: '제일좋은주차장',
						parkingLot: 100,
						isActive: true,
						price: 2000,
						rating: 5,
						createdAt: '2020-06-04 11:00:00'
					}
				]
				this.gridOptions.api.setRowData(fakeData)

				// API 연동
				// let res = await this.$axios.$get(this.config.apiUrl +'/api/parkings')
				// this.gridOptions.api.setRowData(res.data)
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
						this.$axios.$post(this.config.apiUrl + '/api/parkings/bulkDelete', {
							uids: selectedUids
						}).then(res => {
							this.callNotification('삭제하였습니다.')
							this.cardFormClosed = true
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
