<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-calendar-check"/>이벤트 목록</slot>
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
                    </div>
                    <div class="uk-width-2-5@s">
                    </div>
                    <div class="uk-width-1-5@s">
                        <ScInput v-model="searchKeyword" placeholder="이벤트명 검색">
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
                        headerName: '제목',
                        field: 'title',
                        suppressSizeToFit: false,
                    },
                    {
                        headerName: '배너이미지',
                        field: 'bannerImage',
                        width: 100,
                        cellRenderer: (obj) => {
                            return obj.value ? '<i class="mdi mdi-checkbox-marked-circle-outline"></i>' : '<i class="mdi mdi-close-circle-outline"></i>'
                        }
                    },
                    {
                        headerName: '메인이미지',
                        field: 'mainImage',
                        width: 100,
                        cellRenderer: (obj) => {
                            return obj.value ? '<i class="mdi mdi-checkbox-marked-circle-outline"></i>' : '<i class="mdi mdi-close-circle-outline"></i>'
                        }
                    },
                    {
                        headerName: '작성자',
                        field: 'account.name',
                        width: 160
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
        },
        created() {
            let vm = this
            this.$nuxt.$on('reset-event-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-event-list', () => {
                vm.fetchData()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-event-list')
            this.$nuxt.$off('fetch-event-list')
        },
        async mounted() {
            await this.fetchData()
        },
        methods: {
            openNewForm() {
                this.resetSelection()
                this.$nuxt.$emit('open-event-form')
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-event-form', props)
                this.resetSelection()
                props.node.detail = true
                this.gridOptions.api.redrawRows()
            },
            async fetchData(selectUid) {
                //API 연동
                let res = await this.$axios.$get(this.config.apiUrl + '/events')
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
                        this.$axios.$post(this.config.apiUrl + '/events/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-event-form')
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
