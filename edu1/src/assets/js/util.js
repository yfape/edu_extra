/*
 * @Author: your name
 * @Date: 2021-10-26 18:25:08
 * @LastEditTime: 2021-10-26 21:51:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \edu1\src\assets\js\util.js
 */
import XLSX from 'xlsx';
export function importFile(e, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {
            type: 'binary'
        });
        var wsname = workbook.SheetNames[0]
        if (callback) callback(workbook.Sheets[wsname]);
    };
    reader.readAsBinaryString(e);
}

export function sleep(time){
    return new Promise( (resolve) => setTimeout(resolve, time));
}