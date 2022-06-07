<!--
 * @Author: your name
 * @Date: 2021-10-26 23:09:51
 * @LastEditTime: 2021-10-27 00:09:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \edu1\src\components\Step3.vue
-->
<template>
<div>
    <div class="text-caption text-grey-6">功能一（请填写分段大小）</div>
    <q-input dense filled type="number" v-model="options.fun1" @update:model-value="updateData">
        <template v-slot:prepend>
            <q-icon size="16px" name="o_edit"/>
            <span class="text-caption">分段大小</span>
        </template>
    </q-input>
    <div class="text-caption text-grey-6 q-mt-sm">功能二（请填写各科目有效上线分）</div>
    <div class="row justify-around items-center">
        <div class="col-5">
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.like.zongfen" label="理科总分" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.like.yuwen" label="语文" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.like.shuxue" label="数学" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.like.yingyu" label="英语" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.like.wuli" label="物理" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.like.huaxue" label="化学" @update:model-value="updateData"/>
            <q-input filled dense v-model="options.fun2.like.shengwu" label="生物" @update:model-value="updateData"/>
        </div>
        <div class="col-5">
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.wenke.zongfen" label="文科总分" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.wenke.yuwen" label="语文" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.wenke.shuxue" label="数学" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.wenke.yingyu" label="英语" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.wenke.zhengzhi" label="政治" @update:model-value="updateData"/>
            <q-input class="q-mb-sm" filled dense v-model="options.fun2.wenke.lishi" label="历史" @update:model-value="updateData"/>
            <q-input filled dense v-model="options.fun2.wenke.dili" label="地理" @update:model-value="updateData"/>
        </div>
    </div>
    <q-stepper-navigation>
        <q-btn @click="runAnanly" color="primary" label="继续" />
        <q-btn flat @click="backStep" color="red-7" label="后退" class="q-ml-sm" />
    </q-stepper-navigation>
</div>
</template>
<script>
export default{
name: 'Step3',
props: [],
data(){return {
    options:{
        fun1:0,
        fun2:{
            like:{zongfen:0,yuwen:0,shuxue:0,yingyu:0,wuli:0,huaxue:0,shengwu:0},
            wenke:{zongfen:0,yuwen:0,shuxue:0,yingyu:0,zhengzhi:0,lishi:0,dili:0}
        }
    }
}},
mounted(){
    var options = localStorage.getItem('options')
    if (options) {
        this.options = JSON.parse(options)
    }
},
methods:{
    updateData(){
        localStorage.setItem('options', JSON.stringify(this.options))
        this.$emit('update', this.options)
    },
    runAnanly(){
        this.updateData()
        this.$emit('runAnanly')
    },
    backStep(){
        this.$emit('back')
    }
}
}
</script>
<style scoped>
</style>