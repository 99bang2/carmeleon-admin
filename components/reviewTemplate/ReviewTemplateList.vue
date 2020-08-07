<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-file-find"/> 리뷰템플릿목록</slot>
                    </ScCardTitle>
                </div>
                <div class="uk-text-nowrap">
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-file-plus"
                       style="display: inline-block" @click.prevent="openNewForm" data-uk-tooltip="리뷰템플릿생성"/>
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline"
                       style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="리뷰템플릿삭제"/>
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
                                    <select v-model="searchReviewType" class="uk-select">
                                        <option value="">모든리뷰유형</option>
                                        <option value="0">아주좋은리뷰</option>
                                        <option value="1">좋은리뷰</option>
                                        <option value="2">나쁜리뷰</option>
                                        <option value="3">아주나쁜리뷰</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="uk-width-1-5@s">
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
                searchReviewType: '',
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
                        headerName: "리뷰유형",
                        field: "reviewType",
                        width: 150,
                        cellRenderer: (obj) => {
                            let tempData = ""
                            switch (obj.value) {
                                case 0:
                                    tempData = "아주좋은리뷰"
                                    break;
                                case 1:
                                    tempData = "좋은리뷰"
                                    break;
                                case 2:
                                    tempData = "나쁜리뷰"
                                    break;
                                case 3:
                                    tempData = "아주나쁜리뷰"
                                    break;
                            }
                            return tempData
                        }
                    },
                    {
                        headerName: "리뷰내용",
                        field: "review",
                        width: 650,
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
            'searchReviewType': function (newValue) {
                let filterComponent = this.gridOptions.api.getFilterInstance('reviewType')
                filterComponent.setModel({
                    type: 'equals',
                    filter: newValue
                })
                this.gridOptions.api.onFilterChanged()
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('reset-reviewTemplate-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-reviewTemplate-list', () => {
                vm.fetchData()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-reviewTemplate-list')
            this.$nuxt.$off('fetch-reviewTemplate-list')
        },
        async mounted() {
            await this.fetchData()
        },
        methods: {
            refreshFilter() {
                this.searchKeyword = ""
                this.searchReviewType = ""
                this.fetchData()
            },
            openNewForm() {
                this.resetSelection()
                this.$nuxt.$emit('open-reviewTemplate-form')
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-reviewTemplate-form', props)
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
                let res = await this.$axios.$get(this.config.apiUrl + '/reviewTemplates')
                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(res.data)
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
                        this.$axios.$post(this.config.apiUrl + '/reviewTemplates/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-reviewTemplate-form')
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
