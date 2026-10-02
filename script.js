async function generate(){

const excel=document.getElementById("excel").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!excel||!zip){
status.innerHTML="Upload file terlebih dahulu";
return;
}

status.innerHTML="Reading ZIP";

const archive=await JSZip.loadAsync(zip);

let images=[];

for(const name of Object.keys(archive.files)){

if(/\.(jpg|jpeg|png)$/i.test(name)){

let buffer=await archive.files[name].async("arraybuffer");

images.push({
name:name.toUpperCase(),
buffer:buffer
});

}

}

images.sort((a,b)=>a.name.localeCompare(b.name));

status.innerHTML="Images: "+images.length;

const wb=new ExcelJS.Workbook();

await wb.xlsx.load(await excel.arrayBuffer());

const sheet=wb.getWorksheet("OPM FDT  & FAT");

if(sheet){

let col=4;

for(let i=0;i<images.length;i+=4){

let group=images.slice(i,i+4);

for(let r=0;r<group.length;r++){

let img=group[r];

let id=wb.addImage({
buffer:img.buffer,
extension:img.name.includes(".PNG")?"png":"jpeg"
});

sheet.addImage(id,{
tl:{
col:col-1,
row:10+r
},
ext:{
width:120,
height:90
}
});

}

col++;

}

}

status.innerHTML="Exporting";

let out=await wb.xlsx.writeBuffer();

let blob=new Blob([out],{
type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
});

let link=document.getElementById("download");

link.href=URL.createObjectURL(blob);
link.download="OPM_RESULT_V4.xlsx";
link.innerHTML="DOWNLOAD RESULT";
link.style.display="block";

status.innerHTML="SELESAI";

}