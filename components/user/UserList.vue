<template>
	<div>
		<ScCard>
			<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
				<div class="uk-flex-1">
					<ScCardTitle>
						<slot><i class="mdi mdi-account-circle"/> 유저관리</slot>
					</ScCardTitle>
				</div>
				<div class="uk-text-nowrap">
					<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline"
					   style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="유저삭제"/>
				</div>
			</ScCardHeader>
			<ScCardBody>
				<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
					<div class="uk-width-4-5@s">
						<div class="uk-grid-small uk-grid" data-uk-grid>
							<div class="uk-width-1-5@s">
								<select v-model="searchSnsType" class="uk-select">
									<option value="">SNS 종류</option>
									<option value="kakao">카카오</option>
									<option value="naver">네이버</option>
								</select>
							</div>
						</div>
					</div>
					<div class="uk-width-1-5@s">
						<ScInput v-model="searchKeyword" placeholder="유저닉네임, 이메일">
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
				>
				</ag-grid-vue>
			</ScCardBody>
		</ScCard>
	</div>
</template>

<script>
	import {agGridMixin} from "@/plugins/ag-grid.mixin";
	import ScInput from '~/components/Input';

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
					onCellClicked: (props) => {
						this.onRowClicked(props, props.column.colId)
					},
					rowHeight: 45,
					getRowStyle: this.getRowStyle
				},
				searchKeyword: '',
				searchSnsType: '',
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
					}, {
						headerName: "닉네임",
						field: "nickname",
						width: 110,
						onCellClicked: this.onRowClicked,
					},
					{
						headerName: "SNS 유형",
						field: "snsType",
						width: 100,
						onCellClicked: this.onRowClicked,
						cellRenderer: (obj) => {
							let name = ''
							if (obj.value === 'kakao') {
								name = "카카오"
							} else if (obj.value === 'naver') {
								name = "네이버"
							}
							return `<span>${name}</span>`
						}
					},
					{
						headerName: "이메일",
						field: "email",
						width: 200,
						onCellClicked: this.onRowClicked,
					}, {
						headerName: "카드관리",
						field: "card",
						width: 90,
						cellRenderer: () => {
							return `<button class="uk-button uk-button-default uk-button-small uk-text-bold">카드관리</button>`
						}
					},
					{
						headerName: "차량관리",
						field: "car",
						width: 90,
						cellRenderer: () => {
							return `<button class="uk-button uk-button-default uk-button-small uk-text-bold">차량관리</button>`
						}
					}, {
						headerName: "포인트",
						field: "pointLog",
						width: 90,
						cellRenderer: () => {
							return `<button class="uk-button uk-button-default uk-button-small uk-text-bold">포인트</button>`
						}
					}, {
						headerName: "이용내역",
						field: "payLog",
						width: 90,
						cellRenderer: () => {
							return `<button class="uk-button uk-button-default uk-button-small uk-text-bold">이용내역</button>`
						}
					}, {
						headerName: "즐겨찾기",
						field: "favorite",
						width: 90,
						cellRenderer: () => {
							return `<button class="uk-button uk-button-default uk-button-small uk-text-bold">즐겨찾기</button>`
						}
					}, {
						headerName: "리뷰목록",
						field: "rating",
						width: 90,
						cellRenderer: () => {
							return this.btnTemplate('리뷰')
						}
					}
				];
			}
		},
		watch: {
			'searchSnsType': function (newValue) {
				let filterComponent = this.gridOptions.api.getFilterInstance('snsType')
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
			this.$nuxt.$on('reset-user-list', () => {
				vm.resetSelection()
			})
			this.$nuxt.$on('fetch-user-list', (uid) => {
				vm.fetchData(uid)
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('reset-user-list')
			this.$nuxt.$off('fetch-user-list')
		},
		async mounted() {
			await this.fetchData()
		},
		methods: {
			btnTemplate(name) {
				return `<button class="uk-button uk-button-default uk-button-small uk-text-bold">${name}</button>`
			},
			onRowClicked(props, type) {
				if (type !== undefined) {
					this.resetSelection()
					this.$nuxt.$emit('close-all-list', props)
					this.$nuxt.$emit(`open-${type}-list`, props)
				} else {
					this.resetSelection()
					this.$nuxt.$emit('close-all-list', props)
					this.$nuxt.$emit('open-user-form', props)
					props.node.detail = true
					this.gridOptions.api.redrawRows()
				}
			},
			async fetchData(selectUid) {
				// API 연동
				let res = await this.$axios.$get(this.config.apiUrl + '/users')
				if (this.gridOptions.api) {
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
			deleteDatas() {
				let selected = this.gridOptions.api.getSelectedRows()
				let selectedUids = selected.map(({uid}) => uid)
				let seletedCnt = selectedUids.length
				if (seletedCnt) {
					UIkit.modal.confirm(`선택한 항목 : ${seletedCnt}<br/>정말 삭제하시겠습니까?`).then(() => {
						this.$axios.$post(this.config.apiUrl + '/users/bulkDelete', {
							uids: selectedUids
						}).then(res => {
							this.callNotification('삭제하였습니다.')
							this.$nuxt.$emit('close-all-list')
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
