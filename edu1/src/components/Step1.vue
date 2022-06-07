<template>
<div>
    <div>功能一：自定义分段长度，分别统计各个班级每个科目在不同分段中的分布情况。</div>
    <div>功能二：各班各科有效上线和无效上线统计</div>
    <q-stepper-navigation>
        <q-btn @click="nextStep" color="primary" label="继续" />
    </q-stepper-navigation>
</div>
</template>
<script>
export default{
name: 'Step1',
data(){return {

}},
mounted(){},
methods:{
    nextStep(){
        this.$emit('next')
    }
},
}
</script>
<style scoped>
</style>