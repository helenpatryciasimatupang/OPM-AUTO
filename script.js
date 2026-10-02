async function generate(){

const excel=document.getElementById("excel").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!excel||!zip){
status.innerHTML="Upload file dulu";
return;
}

status.innerHTML="Membaca file...";

const archive=await JSZip.loadAsync(zip);

let count=0;

Object.keys(archive.files).forEach(f=>{
 if(/\\.(jpg|jpeg|png)$/i.test(f)){
  count++;
 }
});

status.innerHTML="Foto ditemukan: "+count;

const wb=new ExcelJS.Workbook();

await wb.xlsx.load(await excel.arrayBuffer());

let sheet=wb.getWorksheet("OPM FDT  & FAT");

if(sheet){
 sheet.getCell("B3").value=zip.name.replace(".zip","");
 sheet.getCell("B4").value="V5 IMAGE EMBED PROCESS";
}

const buffer=await wb.xlsx.writeBuffer();

const blob=new Blob([buffer],{
 type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
});

const link=document.getElementById("download");

link.href=URL.createObjectURL(blob);
link.download="OPM_RESULT_V5.xlsx";
link.innerHTML="DOWNLOAD RESULT";
link.style.display="block";

status.innerHTML="SELESAI";

}