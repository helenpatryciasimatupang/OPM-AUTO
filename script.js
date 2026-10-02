async function processFile(){

const excel=document.getElementById("excel").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!excel || !zip){
status.innerHTML="Upload file terlebih dahulu";
return;
}

status.innerHTML="Reading XLSX structure...";

const xlsx = await JSZip.loadAsync(excel);
const area = await JSZip.loadAsync(zip);

let media=[];
for(const name of Object.keys(area.files)){
    if(/\.(jpg|jpeg|png)$/i.test(name)){
        media.push(name);
    }
}

status.innerHTML="Template cloned. Foto ditemukan: "+media.length;

/*
 V10 base:
 - Tidak membuka workbook dengan ExcelJS
 - Mempertahankan template XLSX
 - Tahap berikutnya menghubungkan:
   sheet XML
   drawing XML
   relationship
   xl/media
*/

const result = await xlsx.generateAsync({
    type:"blob"
});

const link=document.getElementById("download");
link.href=URL.createObjectURL(result);
link.download="OPM_RESULT_V10.xlsx";
link.innerHTML="DOWNLOAD RESULT";
link.style.display="block";

status.innerHTML="SELESAI";

}