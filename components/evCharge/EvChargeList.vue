<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-battery-charging"/> 전기차충전소 목록</slot>
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
                    <div class="uk-width-4-5@s">
                        <div class="uk-grid-small uk-grid" data-uk-grid>
                            <a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline"
                               style="height:40px;" @click.prevent="refreshFilter">
                                <i class="mdi mdi-refresh"></i>
                            </a>
                            <div class="uk-width-1-4@s">
                                <input id="switch-css-recommend" v-model="searchIsParking" type="checkbox"
                                       class="sc-switch-input">
                                <label for="switch-css-recommend" class="sc-switch-label" style="margin-top: 5px; margin-left: 10px;">
                                    <span class="sc-switch-toggle-on">전체</span>
                                    <span class="sc-switch-toggle-off">주차장정보 미포함</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="uk-width-1-5@s">
                        <ScInput v-model="searchKeyword" placeholder="충전소명 검색">
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
    import {agGridMixin} from "@/plugins/ag-grid.mixin"
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
                searchKeyword: '',
                searchIsParking: true,
                resUid: 0
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
                        headerName: 'UID',
                        field: 'uid',
                        width: 100,
                    },
                    {
                        headerName: '전기차충전소명',
                        field: 'statNm',
                        width: 250,
                    }, {
                        headerName: '위치정보',
                        field: 'addr',
                        suppressSizeToFit: false,
                    }, {
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
            'searchKeyword': function (newValue) {
                this.fetchData()
            },
            'searchIsParking': function(newValue) {
                this.fetchData()
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('reset-evCharge-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-evCharge-list', (uid) => {
                this.resUid = uid
                vm.fetchData()
            })
            this.defaultColDef.sortable = false
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-evCharge-list')
            this.$nuxt.$off('fetch-evCharge-list')
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

                            let searchData = {
                                params: {
                                    searchKeyword: context.searchKeyword,
                                    searchIsParking: context.searchIsParking ? 1 : 0,
                                    offset: parameters.offset,
                                    limit: parameters.limit,
                                    order: parameters.order
                                }
                            }
                            await context.$axios.$get(this.config.apiUrl + '/evChargeStations',searchData ).then(response => {
                                let rowsThisPage = response.data.rows
                                lastRow = response.data.count
                                params.successCallback(rowsThisPage, lastRow)
                                if(context.resUid) {
                                    context.gridOptions.api.forEachNode((node) => {
                                        if(node.data.uid === context.resUid) {
                                            context.openNewForm({
                                                node: node,
                                                data: node.data
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                    params.api.setDatasource(dataSource)
                }
                await updateData(this)
                let pageSize = params.api.gridOptionsWrapper.gridOptions.paginationPageSize
                let rowHeight = params.api.gridOptionsWrapper.gridOptions.rowHeight
                params.api.rowRenderer.rowContainers.body.eWrapper.style.minHeight = pageSize * rowHeight + 'px'
            },
            refreshFilter() {
                this.searchKeyword = ""
                this.searchIsParking = true
                this.fetchData()
            },
            openNewForm() {
                this.resetSelection()
                this.$nuxt.$emit('open-evCharge-form')
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-evCharge-form', props)
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
            async fetchData() {
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
                        this.$axios.$post(this.config.apiUrl + '/evChargeStations/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-evCharge-form')
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
