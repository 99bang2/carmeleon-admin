<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-key"/>키 목록</slot>
                    </ScCardTitle>
                </div>
                <div class="uk-text-nowrap">
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-shape-circle-plus" style="display: inline-block" @click.prevent="openNewForm" data-uk-tooltip="키생성"/>
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline" style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="키삭제"/>
                </div>
            </ScCardHeader>
            <ScCardBody>
                <div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
                    <div class="uk-width-3-5@s">
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
            addPoint: null,
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
                    headerName: "키",
                    field: "key",
                    width: 200,
                },
                {
                    headerName: "값",
                    field: "value",
                    width: 150,
                },
                {
                    headerName: '수정일시',
                    field: 'updatedAt',
                    width: 150,
                    valueFormatter: obj => {
                        return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
                    }
                },
                {
                    headerName: '등록일시',
                    field: 'createdAt',
                    width: 150,
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
        this.$nuxt.$on('reset-key-list', () => {
            vm.resetSelection()
        })
        this.$nuxt.$on('fetch-key-list', () => {
            vm.fetchData()
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('reset-key-list')
        this.$nuxt.$off('fetch-key-list')
    },
    async mounted() {
        await this.fetchData()
    },
    methods: {
        openNewForm() {
            this.resetSelection()
            this.$nuxt.$emit('open-key-form')
        },
        onRowClicked(props) {
            this.$nuxt.$emit('open-key-form', props)
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
            let res = await this.$axios.$get(this.config.apiUrl + '/keys')
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
            let selectedCnt = selectedUids.length
            if (selectedCnt) {
                UIkit.modal.confirm(`선택한 항목 : ${selectedCnt}<br/>정말 삭제하시겠습니까?`).then(() => {
                    this.$axios.$post(this.config.apiUrl + '/keys/bulkDelete', {
                        uids: selectedUids
                    }).then(res => {
                        this.callNotification('삭제하였습니다.')
                        this.$nuxt.$emit('close-key-form')
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
