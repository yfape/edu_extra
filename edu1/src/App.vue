<template>
<div id="app" class="bg-grey-2 row justify-center items-center">
    <div class="q-pa-md" style="width:800px">
        <q-stepper v-model="system.step" vertical color="primary" animated>
            <q-step :name="1" title="中学成绩分析程序" caption="功能简介" icon="o_settings">
                <Step1 @next="nextStep"/>
            </q-step>
            <q-step :name="2" title="上传文件" icon="o_description">
                <Step2 
                    :hint="fileblock.hint" :loading="system.loading" :end="system.end_step2" 
                    :schoolnum="source.schools.length" :classnum="source.classes.length" :studentnum="source.students.length" :project="source.project"
                    @uploadFile="uploadFile" @back="backStep" @next="nextStep"
                />
            </q-step>
            <q-step :name="3" title="填写自定义数据" caption="自定义数据" icon="o_code">
                <Step3 @update="UpdateOptions" @back="backStep" @runAnanly="runAnanly"/>
            </q-step>
            <q-step :name="4" title="分析结果" icon="o_leaderboard">
                <div v-if="system.end_step4"> 
                    <q-item class="bg-grey-2 q-mb-sm">
                        <q-item-section avatar>
                            <q-avatar icon="o_description" rounded color="primary" text-color="white" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label lines="1">{{source.project}}成绩分段统计表.xlsx</q-item-label>
                            <q-item-label caption>{{system.time}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn flat icon="o_download" color="primary" @click="exportFun1"/>
                        </q-item-section>
                    </q-item>
                    <q-item class="bg-grey-2 q-mb-sm">
                        <q-item-section avatar>
                            <q-avatar icon="o_description" rounded color="orange-6" text-color="white" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label lines="1">{{source.project}}有效分上线情况统计表.xlsx</q-item-label>
                            <q-item-label caption>{{system.time}}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn flat icon="o_download" color="orange-6" @click="exportFun2"/>
                        </q-item-section>
                    </q-item>
                </div>
                <div v-else class="row justify-center items-center">
                    <q-circular-progress indeterminate size="50px" color="primary" class="q-ma-md"/>
                    <div class="text-grey-6 text-caption text-center">数据分析中</div>
                </div>
                <q-stepper-navigation v-if="system.end_step4">
                    <q-btn flat @click="reset" color="red-7" icon="o_restart_alt" label="重置" class="q-ml-sm" />
                </q-stepper-navigation>
            </q-step>
        </q-stepper>
    </div>
</div>
</template>
<script>
import Step1 from './components/Step1.vue'
import Step2 from './components/Step2.vue'
import Step3 from './components/Step3.vue'
import XLSX from 'xlsx';
import { compares, constrats, headeroptions, projects} from './assets/js/compares.js'
import {importFile, sleep} from './assets/js/util.js'

export default {
name: "app",
components:{
    Step1: Step1,
    Step2: Step2,
    Step3: Step3
},
data(){return {
    system:{
        step:1,loading:false,end_step2:false,vir_load:1000,end_step4:false,time:'',
    },
    fileblock:{
        file:null, hint:'请点击上方输入框，选择相应学生成绩数据表格，等待程序分析。',
    },
    source:{
        students:[],schools:[],classes:[],project:'',cols:{name:''},student_startrow:0
    },
    options:{
        fun1:0,
        fun2:{
            like:{zongfen:0,yuwen:0,shuxue:0,yingyu:0,wuli:0,huaxue:0,shengwu:0},
            wenke:{zongfen:0,yuwen:0,shuxue:0,yingyu:0,zhengzhi:0,lishi:0,dili:0}
        }
    },
    result:{
        fun1:{}
    }
}},
methods: {
    //init
    initData(){
        this.fileblock = {file:'',hint:'请点击上方输入框，选择相应学生成绩数据表格，等待程序分析。'}
        this.source = Object.assign({},{},{students:[],schools:[],classes:[],project:''})
        this.system = Object.assign({},{},{step:this.system.step,loading:false,end_step2:false,vir_load:this.system.vir_load,end_step4:false,time:this.system.time})
        this.options = Object.assign({},{},{fun1:0,fun2:{like:{zongfen:0,yuwen:0,shuxue:0,yingyu:0,wuli:0,huaxue:0,shengwu:0},wenke:{zongfen:0,yuwen:0,shuxue:0,yingyu:0,zhengzhi:0,lishi:0,dili:0}}})
        this.result = Object.assign({},{},{fun1:{}})
    },
    errorToBack(msg){
        alert(msg)
        this.system.step = 1
        this.initData()
    },
    nextStep(){
        this.system.step += 1
    },
    backStep(){
        this.system.step -= 1
    },
    UpdateOptions(options){
        this.options = Object.assign({}, {}, options)
    },
    reset(){
        this.system.step = 1
        this.initData()
    },
    //main_controll
    uploadFile(file){
        this.initData()
        this.fileblock.file = file
        this.system.loading = true
        this.fileblock.hint = '数据加载完毕，准备分析'
        importFile(this.fileblock.file, async (data) => {
            this.fileblock.hint = "开始分析，请稍等"
            await sleep(this.system.vir_load)
            this.fileblock.hint = "确定各科目对应数据列"
            this.judgeHeaders(data)
            await sleep(this.system.vir_load)
            this.fileblock.hint = "确定学生对应起始行"
            this.judgeStudentStartRow(data)
            await sleep(this.system.vir_load)
            this.fileblock.hint = "加载学生对象信息"
            this.loadStudents(data)
            await sleep(this.system.vir_load)
            this.fileblock.hint = "判断文理科类型"
            this.judgeProject()
            await sleep(this.system.vir_load)
            this.fileblock.hint = "统计学校及班级数据"
            this.judgeSchools()
            await sleep(this.system.vir_load)
            this.fileblock.hint = "分析完毕"
            this.system.end_step2 = true
            this.system.loading = false
        })
    },
    judgeHeaders(data) {
        var tmp_col = {}
        for (let i = 0; i < headeroptions.length; i++) {
            if (typeof(data[headeroptions[i] + '1']) != "object") {
                break
            }
            let tmp_header = data[headeroptions[i] + '1'].v
            f2: for (let j = 0; j < compares.length; j++) {
                if (compares[j].comp.includes(tmp_header)) {
                    tmp_col[compares[j].name] = headeroptions[i]
                    break f2
                }
            }
        }
        this.source.cols = Object.assign({}, {}, tmp_col)
    },
    judgeStudentStartRow(data){
        for(let i=1;i<100;i++){
            let tmp_ = data[this.source.cols['shuxue']+i]
            if(typeof(tmp_) != "object"){
                continue
            }
            if(parseInt(tmp_.v) > 0) {
                this.source.student_startrow = i
                break
            }
        }
        if(!this.source.student_startrow) this.errorToBack('无法定位学生信息起始行，请审阅原始文件并重新上传')
    },
    loadStudents(data) {
        var stu_max = data['!ref'].split(':')[1].slice(1)
        for(let i=this.source.student_startrow; i<stu_max; i++){
            var stu = { name: '' }
            for (var key in this.source.cols) {
                if (typeof(data[this.source.cols[key] + i]) != "object") {break;}
                stu[key] = data[this.source.cols[key] + i].v
            }
            if (stu.name)  this.source.students.push(stu)
        }
    },
    judgeProject() {
        var p1 = 0
        var p2 = 0
        for (let i = 0; i < this.source.students.length; i++) {
            var stu = this.source.students[i]
            stu.wuli = (stu.wuli !== undefined) ? stu.wuli : 0
            stu.lishi = (stu.lishi !== undefined) ? stu.lishi : 0
            if (stu.wuli > stu.lishi) {
                p1 += 1
            } else {
                p2 += 1
            }
        }
        this.source.project = p1 > p2 ? "理科" : "文科"
    },
    judgeSchools() {
        var temp_schools = []
        var temp_classes = []
        for (let i = 0; i < this.source.students.length; i++) {
            let stu = this.source.students[i]
            if (temp_schools.indexOf(stu.school) == -1) {
                temp_schools.push(stu.school)
            }
            if (temp_classes.indexOf(stu.school + '-' + stu.classname) == -1) {
                temp_classes.push(stu.school + '-' + stu.classname)
            }
        }
        this.source.schools = Object.assign([], [], temp_schools)
        this.source.classes = Object.assign([], [], temp_classes)
    },
    runAnanly(){
        this.system.step = 4
        this.system.end_step4 = false
        setTimeout(()=>{
            this.result.fun1 = Object.assign({}, {}, this.runFun1())
            this.result.fun2 = Object.assign([], [], this.runFun2())
            this.system.end_step4 = true
        }, 1000)
    },
    runFun1(){
        //init res
        var res = {}
        //target cols
        var cur_cols = Object.assign([],[], this.source.project == "理科" ? projects.like : projects.wenke)
        cur_cols.forEach((col)=>{
            //sort by the col
            var students = this.sortByCol(col)
            res[col] = []
            //count baseline
            var baseline = parseInt(students.length / this.options.fun1)
            
            if (students.length % this.options.fun1 > 0) {
                baseline += 1
            }
            
            //init all row in table
            this.source.classes.forEach((classname)=>{
                var row = {"班级": classname}
                for (let i = 0; i < baseline; i++) {
                    let txt = (i * this.options.fun1 + 1) + '-' + (i + 1) * this.options.fun1
                    row[txt] = 0
                }
                res[col].push(row)
            })
            //count !!!
            for (let i = 0; i < baseline; i++) {
                var start = i * this.options.fun1
                var end = (i + 1) * this.options.fun1
                var maxlength = (end>students.length)?students.length:end
                for(let ii=start; ii<maxlength; ii++){
                    for(let iii=0; iii<res[col].length; iii++){
                        let cur_classname = students[ii].school + '-' + students[ii].classname
                        if(res[col][iii]["班级"] == cur_classname){
                            res[col][iii][(start+1)+'-'+end] += 1
                        }
                    }
                }
            }
        })
        return res
    },
    runFun2(){
        //init res
        var res = []
        //target cols
        var cur_cols = Object.assign([],[], this.source.project == "理科" ? projects.like : projects.wenke)
        //init table
        this.source.classes.forEach((classname)=>{
            var row = {classname: classname}
            cur_cols.forEach((col)=>{
                row[col+'_up'] = 0
                row[col+'_down'] = 0
            })
            res.push(row)
        })
        //format validgrade
        var baseline = Object.assign({},{}, this.source.project=="理科" ? this.options.fun2.like : this.options.fun2.wenke)
        //count !!!!
        this.source.students.forEach((student)=>{
            for(let i=0;i<res.length;i++){
                if(res[i].classname == student.school+'-'+student.classname){
                    cur_cols.forEach((col)=>{
                        if(student[col] >= baseline[col]){
                            res[i][col+'_up'] += 1
                        }else{
                            res[i][col+'_down'] += 1
                        }
                    })                   
                }
            }            
        })
        //format and return res
        return this.formatRes(res)
    },
    sortByCol(col) {
        var students = Object.assign([], [], this.source.students)
        for (let i = 0; i < students.length - 1; i++) {
            for (let j = i + 1; j < students.length; j++) {
                if (parseInt(students[i][col]) < parseInt(students[j][col])) {
                    var t = students[i]
                    students[i] = students[j]
                    students[j] = t
                }
            }
        }
        return students
    },
    exportFun1() {
        const wb = XLSX.utils.book_new()
        for (var key in this.result.fun1) {
            let ws = XLSX.utils.json_to_sheet(this.result.fun1[key])
            XLSX.utils.book_append_sheet(wb, ws, constrats[key])
        }
        XLSX.writeFile(wb, this.source.project + '成绩分段统计表.xlsx')
    },
    exportFun2() {
        const wb = XLSX.utils.book_new()
        let ws = XLSX.utils.json_to_sheet(this.result.fun2)
        XLSX.utils.book_append_sheet(wb, ws)
        XLSX.writeFile(wb, this.source.project + '有效分上线情况统计表.xlsx')
    },
    formatRes(res){
        var result = []
        res.forEach((item)=>{
            var row = {}
            for(var key in item){
                if(constrats[key] != undefined){
                    row[constrats[key]] = item[key]
                }else{
                    row[key] = item[key]
                }
            }
            result.push(row)
        })
        return result
    }
},
mounted() {
    var time = new Date();
    let year = time.getFullYear();
    let mouth = time.getMonth() + 1;
    let day = time.getDate();
    this.system.time = year + "年" + mouth +"月" + day + "日" 
}
}
</script>
<style>
    html,
    body {
        height: 100%;
        width: 100%;
    }
    
    #app {
        height: 100%;
    }
</style>