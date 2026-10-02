async function generate(){

const excel=document.getElementById("excel").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!excel||!zip){
status.innerHTML="Upload file terlebih dahulu";
return;
}

status.innerHTML="Scanning ZIP...";

const archive=await JSZip.loadAsync(zip);

let images={};

for(const path of Object.keys(archive.files)){

if(/\.(jpg|jpeg|png)$/i.test(path)){

let code=path.split("/").pop()
.replace(/\.(jpg|jpeg|png)$/i,"")
.toUpperCase();

images[code]={
path,
buffer:await archive.files[path].async("arraybuffer")
};

}

}

status.innerHTML="Reading Excel...";

const wb=new ExcelJS.Workbook();
await wb.xlsx.load(await excel.arrayBuffer());

const sheet=wb.getWorksheet("OPM FDT  & FAT");

if(sheet){

// Dynamic header reading row 10
for(let col=4; col<=sheet.columnCount+20; col++){

let header=String(sheet.getCell(10,col).value||"").toUpperCase();

if(!header) continue;

let data=images[header];

if(data){

sheet.getCell(11,col).value="POLE FOUND";
sheet.getCell(12,col).value="FAT/FDT FOUND";
sheet.getCell(13,col).value="OPM FAT INPUT";
sheet.getCell(15,col).value="OPM FAT OUTPUT";
sheet.getCell(17,col).value="ONT RESULT";
sheet.getCell(20,col).value="ONT REMOTE";

}

}

}

// FDT mapping
let fdt=String(sheet?.getCell("B4").value||"").toUpperCase();

if(fdt){

for(const key of Object.keys(images)){

if(key.includes(fdt)){

sheet.getCell("B13").value="OPM FDT INPUT";
sheet.getCell("B15").value="OPM FDT OUTPUT";
break;

}

}

}

status.innerHTML="Exporting...";

const out=await wb.xlsx.writeBuffer();

const blob=new Blob([out],{
type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
});

const a=document.getElementById("download");

a.href=URL.createObjectURL(blob);
a.download="OPM_RESULT_V8.xlsx";
a.innerHTML="DOWNLOAD RESULT";
a.style.display="block";

status.innerHTML="SELESAI";

}