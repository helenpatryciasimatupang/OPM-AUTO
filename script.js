async function generate(){

const excel=document.getElementById("excel").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!excel || !zip){
status.innerHTML="Upload template dan ZIP";
return;
}

status.innerHTML="Membaca struktur XLSX...";

const template=await JSZip.loadAsync(excel);
const photos=await JSZip.loadAsync(zip);

let count=0;

for(const name of Object.keys(photos.files)){
 if(/\.(jpg|jpeg|png)$/i.test(name)){
   count++;
 }
}

status.innerHTML="Template terbaca. Foto ditemukan: "+count;

/*
 V9 XML ENGINE:
 - menjaga file XLSX sebagai ZIP
 - tidak memakai ExcelJS load
 - mempertahankan struktur template
*/

const output=await template.generateAsync({
type:"blob"
});

const link=document.getElementById("download");
link.href=URL.createObjectURL(output);
link.download="OPM_RESULT_V9.xlsx";
link.innerHTML="DOWNLOAD RESULT";
link.style.display="block";

status.innerHTML="SELESAI";

}