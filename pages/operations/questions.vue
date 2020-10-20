<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <QuestionList/>
                </div>
                <div class="uk-width-1-3@l">
                    <QuestionDetail/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import QuestionList from "@/components/question/QuestionList";
    import QuestionDetail from "@/components/question/QuestionDetail";
    export default {
        middleware: ['auth'],
        components: {
            QuestionList,
            QuestionDetail
        }
    }
</script>