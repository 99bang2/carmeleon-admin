<template>
<div>
	<ScCard>
		<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
			<div class="uk-flex-1">
				<ScCardTitle>
					<slot><i class="mdi mdi-car-wash"/> 세차장 목록</slot>
				</ScCardTitle>
			</div>
			<div class="uk-text-nowrap">
				<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-plus" style="display: inline-block" @click.prevent="openNewForm" data-uk-tooltip="추가"/>
				<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline" style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="삭제"/>
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
							<select v-model="searchType" class="uk-select" required="required">
								<option value="">업종명 분류</option>
								<option value="0">세차장</option>
								<option value="1">주유소</option>
								<option value="2">정비업소</option>
							</select>
						</div>
					</div>
				</div>
				<div class="uk-width-2-5@s">
				</div>
				<div class="uk-width-1-5@s">
					<ScInput v-model="searchKeyword" placeholder="공지사항명 검색">
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
				]
			}
		},
    }
</script>

<style scoped>

</style>
