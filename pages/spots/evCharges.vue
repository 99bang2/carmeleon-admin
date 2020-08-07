<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <EvChargeList/>
                </div>
                <div class="uk-width-1-3@l">
                    <EvChargeForm/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EvChargeList from "@/components/evCharge/EvChargeList"
    import EvChargeForm from "@/components/evCharge/EvChargeForm"

    export default {
        middleware: ['auth'],
        components: {
            EvChargeList,
            EvChargeForm
        }
    }
</script>

<style scoped>

</style>
