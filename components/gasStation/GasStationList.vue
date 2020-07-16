<template>
	<div>
		<ScCard>
			<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
				<div class="uk-flex-1">
					<ScCardTitle>
						<slot><i class="mdi mdi-gas-station"/> 주유소 목록</slot>
					</ScCardTitle>
				</div>
				<div class="uk-text-nowrap">
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-plus" style="display: inline-block" @click.prevent="openNewForm" data-uk-tooltip="추가"/>
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline" style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="삭제"/>
				</div>
			</ScCardHeader>
			<ScCardBody>
				<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
					<div class="uk-width-3-5@s">
						<div class="uk-grid-small uk-grid" data-uk-grid>
							<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline"
							   style="height:40px;" @click.prevent="refreshFilter">
								<i class="mdi mdi-refresh"></i>
							</a>
							<div class="uk-width-1-4@s">
								<select v-model="searchBrandCode" class="uk-select" required="required">
									<option value="">브랜드 분류</option>
									<option value="SKE">SK에너지</option>
									<option value="GSC">GS칼텍스</option>
									<option value="HDO">현대오일뱅크</option>
									<option value="SOL">S-OIL</option>
									<option value="RTO">자영알뜰</option>
									<option value="RTX">고속도로알뜰</option>
									<option value="NHO">농협알뜰</option>
									<option value="ETC">자가상표</option>
									<option value="E1G">E1</option>
									<option value="SKG">SK가스</option>
								</select>
							</div>
							<div class="uk-width-1-4@s">
								<select v-model="searchType" class="uk-select" required="required">
									<option value="">업종구분</option>
									<option value="N">주유소</option>
									<option value="Y">충전소</option>
									<option value="C">겸업</option>
								</select>
							</div>
							<div class="uk-width-1-4@s">
								<select v-model="searchKpetro" class="uk-select" required="required">
									<option value="">품질인증</option>
									<option value="true">인증</option>
									<option value="false">미인증</option>
								</select>
							</div>
						</div>
					</div>
					<div class="uk-width-1-5@s">
					</div>
					<div class="uk-width-1-5@s">
						<ScInput v-model="searchKeyword" placeholder="주유소명 검색">
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
				searchBrandCode:'',
				searchType: '',
				searchKpetro:'',
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
						headerName: '주유소명',
						field: 'gasStationName',
						width: 180,
					},{
						headerName: '브랜드',
						field: 'brandCodeName',
						width: 150,
					},{
						headerName: '업종구분',
						field: 'gasStationTypeName',
						width: 150,
					},{
						field: 'brandCode',
						hide:true
					},{
						field: 'gasStationType',
						hide:true
					}
					,{
						headerName: '품질인증여부',
						field: 'isKpetro',
						width: 150,
						cellRenderer: (obj) => {
							return obj.value ? '<span>인증</span>' : '<span>미인증</span>'
						}
					},{
						headerName: '전화번호',
						field: 'tel',
						width:170
					},{
						headerName: '등록일시',
						field: 'createdAt',
						width: 160,
						valueFormatter: obj => {
							return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
						}
					},
				]
			}
		},
		watch: {
			'searchType': function (newValue) {
				let filterComponent = this.gridOptions.api.getFilterInstance('gasStationType')
				filterComponent.setModel({
					type: 'equals',
					filter: newValue
				})
				this.gridOptions.api.onFilterChanged()
			},
			'searchBrandCode': function (newValue) {
				let filterComponent = this.gridOptions.api.getFilterInstance('brandCode')
				filterComponent.setModel({
					type: 'equals',
					filter: newValue
				})
				this.gridOptions.api.onFilterChanged()
			},
			'searchKpetro': function (newValue) {
				let filterComponent = this.gridOptions.api.getFilterInstance('isKpetro')
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
			this.$nuxt.$on('reset-gasStation-list', () => {
				vm.resetSelection()
			})
			this.$nuxt.$on('fetch-gasStation-list', (uid) => {
				vm.fetchData(uid)
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('reset-gasStation-list')
			this.$nuxt.$off('fetch-gasStation-list')
		},
		async mounted() {
			await this.fetchData()
		},
		methods:{
			refreshFilter() {
				this.searchType = ""
				this.searchBrandCode =""
				this.searchKpetro = ""
				this.fetchData()
			},
			openNewForm() {
				this.resetSelection()
				this.$nuxt.$emit('open-gasStation-form')
			},
			onRowClicked(props) {
				this.$nuxt.$emit('open-gasStation-form', props)
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
				let res = await this.$axios.$get(this.config.apiUrl + '/api/gasStations')
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
						this.$axios.$post(this.config.apiUrl + '/api/gasStations/bulkDelete', {
							uids: selectedUids
						}).then(res => {
							this.callNotification('삭제하였습니다.')
							this.$nuxt.$emit('close-gasStation-form')
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
