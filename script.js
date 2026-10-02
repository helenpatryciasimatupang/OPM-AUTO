async function generate(){

const excel=document.getElementById("excel").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!excel||!zip){
status.innerHTML="Upload Excel dan ZIP";
return;
}

status.innerHTML="Membaca ZIP...";

const archive=await JSZip.loadAsync(zip);

let images=[];

for(const name of Object.keys(archive.files)){

if(
name.toUpperCase().includes("FAT") ||
name.toUpperCase().includes("FDT") ||
name.toUpperCase().includes("SPLITTER")
){

const buffer =
await archive.files[name].async("arraybuffer");

images.push({
name:name,
buffer:buffer
});

}

}

status.innerHTML="Gambar ditemukan: "+images.length;


const workbook=new ExcelJS.Workbook();

await workbook.xlsx.load(
await excel.arrayBuffer()
);


const sheet=
workbook.getWorksheet("OPM FDT  & FAT");


if(sheet){


let col=4;


for(const img of images){


const ext =
img.name.toLowerCase().includes(".png")
?"png":"jpeg";


const imageId =
workbook.addImage({

buffer:img.buffer,

extension:ext

});


sheet.addImage(

imageId,

{

tl:{
col:col-1,
row:11
},

ext:{
width:150,
height:100
}

}

);


col++;

}


sheet.getCell("B3").value=
zip.name.replace(".zip","");


}


status.innerHTML="Export Excel...";


const buffer =
await workbook.xlsx.writeBuffer();


const blob =
new Blob([buffer],{
type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
});


const link=document.getElementById("download");

link.href=URL.createObjectURL(blob);

link.download="OPM_RESULT_V3.xlsx";

link.innerHTML="DOWNLOAD RESULT";

link.style.display="block";


status.innerHTML="SELESAI";

}