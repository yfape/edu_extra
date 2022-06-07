<template>
<div>
    <q-file counter @update:model-value="uploadFileNow" :hint="hint" :loading="loading" dense color="blue-7" filled v-model="file" label="请上传原始数据文件">
        <template v-slot:prepend>
            <q-icon color="blue-7" name="o_cloud_upload" />
        </template>
    </q-file>
    <q-linear-progress v-if="loading" dark rounded indeterminate color="blue-7" class="q-mt-sm" />
    <div v-if="!loading && end" class="text-grey-6" style="font-size: 12px;padding:0 12px;margin:0;margin-top:5px;">
        <div>文理科类型：<span class="text-green-6">{{project}}</span></div>
        <div>学校：<span class="text-green-6">{{schoolnum}}</span> 所</div>
        <div>班级：<span class="text-green-6">{{classnum}}</span> 个</div>
        <div>学生：<span class="text-green-6">{{studentnum}}</span> 名</div>
    </div> 
    <q-stepper-navigation v-if="!loading && file">
        <q-btn @click="nextStep" color="primary" label="继续" />
        <q-btn flat @click="backStep" color="red-7" label="后退" class="q-ml-sm" />
    </q-stepper-navigation>
</div>
</template>
<script>
export default{
name: 'Step2',
props: ['hint','loading', 'end', 'schoolnum', 'classnum', 'studentnum', 'project'],
data(){return {
    file:null
}},
mounted(){},
methods:{
    uploadFileNow(){
        setTimeout(()=>{
            this.$emit('uploadFile', this.file)
        },20)
    },
    nextStep(){
        this.$emit('next')
    },
    backStep(){
        this.$emit('back')
    }
},
}
</script>
<style scoped>
</style>