<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <CarWashList/>
                </div>
                <div class="uk-width-1-3@l">
                    <CarWashForm/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CarWashList from "@/components/carWash/CarWashList"
    import CarWashForm from "@/components/carWash/CarWashForm"

    export default {
        middleware: ['auth'],
        components: {
            CarWashList,
            CarWashForm
        }
    }
</script>

<style scoped>

</style>
