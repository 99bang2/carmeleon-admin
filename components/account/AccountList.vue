<template>
	<div>
		<ScCard>
			<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
				<div class="uk-flex-1">
					<ScCardTitle>
						<slot><i class="mdi mdi-account-search"/> 계정목록</slot>
					</ScCardTitle>
				</div>
				<div class="uk-text-nowrap">
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-account-plus"
					   style="display: inline-block" @click.prevent="openNewForm" data-uk-tooltip="계정생성"/>
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline"
					   style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="계정삭제"/>
				</div>
			</ScCardHeader>
			<ScCardBody>
				<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
					<div class="uk-width-2-5@s">
						<div class="uk-grid-small uk-grid" data-uk-grid>
							<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline"
							   style="height:40px;" @click.prevent="refreshFilter">
								<i class="mdi mdi-refresh"></i>
							</a>
							<div class="uk-width-1-3@s">
								<label>
									<select v-model="searchGrade" class="uk-select">
										<option value="">
											모든 등급
										</option>
										<option v-for="grade in gradeOptions" :key="grade.id" :value="grade.id">
											{{ grade.text }}
										</option>
									</select>
								</label>
							</div>
							<div class="uk-width-1-3@s">
								<label>
									<select v-model="searchActive" class="uk-select">
										<option value="">
											활성상태
										</option>
										<option value="true">
											활성
										</option>
										<option value="false">비활성</option>
									</select>
								</label>
							</div>
						</div>
					</div>
					<div class="uk-width-2-5@s">
					</div>
					<div class="uk-width-1-5@s">
						<ScInput v-model="searchKeyword" placeholder="아이디 검색">
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
				searchActive: '',
				searchGrade: ''
			}
		},
		computed: {
			gradeOptions() {
				let opts = []
				opts.push({id: 0, text: "최고 관리자"})
				opts.push({id: 1, text: "일반 관리자"})
				return opts
			},
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
						headerName: '아이디',
						field: 'id',
						suppressSizeToFit: false,
					},
					{
						headerName: '등급',
						field: 'grade',
						width: 160,
						cellRenderer: (obj) => {
							return obj.data.grade === 0 ?'최고 관리자': '일반 관리자'
						}
					},
					{
						headerName: '이름',
						field: 'name',
						width: 160
					},
					{
						headerName: '활성',
						field: 'isActive',
						width: 60,
						cellRenderer: (obj) => {
							return obj.value ? '<i class="mdi mdi-check-circle" style="font-size:8px;"></i>' : ''
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
			'searchGrade': function (newValue) {
				let filterComponent = this.gridOptions.api.getFilterInstance('grade')
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
		},
		created() {
			let vm = this
			this.$nuxt.$on('reset-account-list', () => {
				vm.resetSelection()
			})
			this.$nuxt.$on('fetch-account-list', (uid) => {
				vm.fetchData(uid)
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('reset-account-list')
			this.$nuxt.$off('fetch-account-list')
		},
		async mounted() {
			await this.fetchData()
		},
		methods: {
			refreshFilter(){
				this.searchGrade = ""
				this.searchActive = ""
				this.fetchData()
			},
			openNewForm() {
				this.resetSelection()
				this.$nuxt.$emit('open-account-form')
			},
			onRowClicked(props) {
				this.$nuxt.$emit('open-account-form', props)
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
				let res = await this.$axios.$get(this.config.apiUrl +'/accounts')
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
						this.$axios.$post(this.config.apiUrl + '/accounts/bulkDelete', {
							uids: selectedUids
						}).then(res => {
							this.callNotification('삭제하였습니다.')
							this.$nuxt.$emit('close-account-form')
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

