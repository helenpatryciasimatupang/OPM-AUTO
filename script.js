async function generate(){

const excel=document.getElementById("excel").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!excel||!zip){
status.innerHTML="Upload file dulu";
return;
}

status.innerHTML="Membaca ZIP...";

const archive=await JSZip.loadAsync(zip);

let files=[];

for(const name of Object.keys(archive.files)){

if(/\.(jpg|jpeg|png)$/i.test(name)){

files.push({
path:name.toUpperCase(),
buffer:await archive.files[name].async("arraybuffer")
});

}

}

status.innerHTML="Foto ditemukan: "+files.length;


const wb=new ExcelJS.Workbook();

await wb.xlsx.load(await excel.arrayBuffer());

const sheet=wb.getWorksheet("OPM FDT  & FAT");


function findImage(keyword, folder){

return files.find(x =>
x.path.includes(folder) &&
x.path.includes(keyword)
);

}


// membaca header FAT dari row 10
if(sheet){

for(let col=4; col<=sheet.columnCount; col++){

let header=String(sheet.getCell(10,col).value||"").toUpperCase();

if(header){

let pole=findImage(header,"POLE");

let fat=findImage(header,"FAT");

let opmFat=findImage(header,"OPM FAT");

let ont=findImage(header,"GRAFIK ONT TEST");


sheet.getCell(11,col).value=
pole ? "POLE IMAGE FOUND" : "";


sheet.getCell(12,col).value=
fat ? "FAT IMAGE FOUND" : "";


sheet.getCell(13,col).value=
opmFat ? "OPM FAT INPUT FOUND" : "";


sheet.getCell(15,col).value=
opmFat ? "OPM FAT OUTPUT FOUND" : "";


sheet.getCell(17,col).value=
sheet.getCell(15,col).value;


sheet.getCell(20,col).value=
ont ? "ONT REMOTE FOUND" : "";

}

}

}


status.innerHTML="Export...";

const out=await wb.xlsx.writeBuffer();

const blob=new Blob([out],{
type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
});

const a=document.getElementById("download");

a.href=URL.createObjectURL(blob);
a.download="OPM_RESULT_V7.xlsx";
a.innerHTML="DOWNLOAD RESULT";
a.style.display="block";

status.innerHTML="SELESAI";

}