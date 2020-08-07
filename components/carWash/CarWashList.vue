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
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-plus" style="display: inline-block"
                       @click.prevent="openNewForm" data-uk-tooltip="추가"/>
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline"
                       style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="삭제"/>
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
                                <select v-model="searchType" class="uk-select">
                                    <option value="">업종명 분류</option>
                                    <option value="세차">세차장</option>
                                    <option value="주유">주유소</option>
                                    <option value="정비">정비업소</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="uk-width-2-5@s">
                    </div>
                    <div class="uk-width-1-5@s">
                        <ScInput v-model="searchKeyword" placeholder="세차장명 검색">
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
                        :row-model-type="'infinite'"
                        :cache-overflow-size="10"
                        :cache-block-size="10"
                        :max-concurrent-datasource-requests="1"
                        :max-blocks-in-cache="10"
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
                searchType: '',
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
                        headerName: '세차장명',
                        field: 'carWashName',
                        width: 170,
                    }, {
                        headerName: '업종명',
                        field: 'carWashIndustry',
                        width: 130,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                if (obj.value.includes('세차')) {
                                    return "세차장"
                                } else if (obj.value.includes('주차')) {
                                    return "주차장"
                                } else if (obj.value.includes('정비')) {
                                    return "정비업소"
                                } else {
                                    return "기타"
                                }
                            }
                        }
                    }, {
                        headerName: '세차유형',
                        field: 'carWashType',
                        width: 100,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                if (obj.value) {
                                    return obj.value
                                } else {
                                    return '기타'
                                }
                            }
                        }
                    },
                    {
                        headerName: '휴무일',
                        field: 'closedDay',
                        width: 110,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                if (obj.value) {
                                    return obj.value
                                } else {
                                    return 'X'
                                }
                            }
                        }
                    }, {
                        headerName: '세차요금정보',
                        field: 'carWashChargeInfo',
                        width: 180,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                if (obj.value) {
                                    return obj.value
                                } else {
                                    return 'X'
                                }
                            }
                        }
                    }, {
                        headerName: '전화번호',
                        field: 'phoneNumber',
                        width: 110,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                if (obj.value) {
                                    return obj.value
                                } else {
                                    return 'X'
                                }
                            }
                        }
                    }, {
                        headerName: '등록일시',
                        field: 'createdAt',
                        width: 140,
                        valueFormatter: obj => {
                            return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
                        }
                    },
                ]
            }
        },
        watch: {
            'searchType': function (newValue) {
                this.fetchData()
            },
            'searchKeyword': function (newValue) {
                this.fetchData()
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('reset-carWash-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-carWash-list', (uid) => {
                vm.fetchData(uid)
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-carWash-list')
            this.$nuxt.$off('fetch-carWash-list')
        },
        async mounted() {
            await this.fetchData()
        },
        methods: {
            async onGridReady(params) {
                const updateData = async context => {
                    let dataSource = {
                        rowCount: null,
                        getRows: async (params) => {
                            let lastRow = -1
                            let order = []
                            for (let sort of params.sortModel) {
                                order.push([sort.colId, sort.sort])
                            }
                            let parameters = {
                                offset: params.startRow,
                                limit: params.endRow - params.startRow,
                                order: order
                            }
                            await context.$axios.$get(this.config.apiUrl + '/carWashes', {
                                params: {
                                    searchType: context.searchType,
                                    searchKeyword: context.searchKeyword,
                                    offset: parameters.offset,
                                    limit: parameters.limit,
                                    order: parameters.order,
                                }
                            }).then(response => {
                                let rowsThisPage = response.data.rows
                                lastRow = response.data.count
                                params.successCallback(rowsThisPage, lastRow)
                            })
                        }
                    }
                    params.api.setDatasource(dataSource)
                }
                updateData(this)
                let pageSize = params.api.gridOptionsWrapper.gridOptions.paginationPageSize
                let rowHeight = params.api.gridOptionsWrapper.gridOptions.rowHeight
                params.api.rowRenderer.rowContainers.body.eWrapper.style.minHeight = pageSize * rowHeight + 'px'
            },
            refreshFilter() {
                this.searchType = ""
                this.searchKeyword = ""
                this.fetchData()
            },
            openNewForm() {
                this.resetSelection()
                this.$nuxt.$emit('open-carWash-form')
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-carWash-form', props)
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
                this.gridOptions.api.onFilterChanged()
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
                        this.$axios.$post(this.config.apiUrl + '/carWashes/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-carWash-form')
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
