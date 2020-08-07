<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <GasStationList/>
                </div>
                <div class="uk-width-1-3@l">
                    <GasStationForm/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GasStationList from "@/components/gasStation/GasStationList";
    import GasStationForm from "@/components/gasStation/GasStationForm";

    export default {
        middleware: ['auth'],
        components: {
            GasStationForm,
            GasStationList,
        }
    }
</script>

<style scoped>

</style>
