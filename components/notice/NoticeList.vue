<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-alarm-light"/> 공지사항 목록</slot>
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
                                    <option value="">공지사항 분류</option>
                                    <option value="0">긴급</option>
                                    <option value="1">필수</option>
                                    <option value="2">일반</option>
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
    import ScInput from '~/components/Input'
    import {agGridMixin} from "~/plugins/ag-grid.mixin"

    export default {
        components: {
            ScInput,
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
                        headerName: '분류',
                        field: 'noticeType',
                        width: 80,
                        cellRenderer: (obj) => {
                            let typeName = ""
                            switch (obj.value) {
                                case 0:
                                    typeName = "긴급"
                                    break;
                                case 1:
                                    typeName = "필수"
                                    break;
                                case 2:
                                    typeName = "일반"
                                    break;
                            }
                            return typeName
                        }
                    },
                    {
                        headerName: '제목',
                        field: 'title',
                        suppressSizeToFit: false,
                    },
                    {
                        headerName: '작성자',
                        field: 'account.name',
                        width: 160
                    },
                    {
                        headerName: '활성',
                        field: 'isOpen',
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
            'searchType': function (newValue) {
                let filterComponent = this.gridOptions.api.getFilterInstance('noticeType')
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
            this.$nuxt.$on('reset-notice-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-notice-list', () => {
                vm.fetchData()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-notice-list')
            this.$nuxt.$off('fetch-notice-list')
        },
        async mounted() {
            await this.fetchData()
        },
        methods: {
            refreshFilter() {
                this.searchKeyword = ""
                this.searchType = ""
                this.fetchData()
            },
            openNewForm() {
                this.resetSelection()
                this.$nuxt.$emit('open-notice-form')
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-notice-form', props)
                this.resetSelection()
                props.node.detail = true
                this.gridOptions.api.redrawRows()
            },
            async fetchData(selectUid) {
                //API 연동
                let res = await this.$axios.$get(this.config.apiUrl + '/notices')
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
                        this.$axios.$post(this.config.apiUrl + '/notices/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-notice-form')
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
