
async function generate(){

const excel=document.getElementById("excel").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!excel||!zip){
status.innerHTML="Upload file dulu";
return;
}

status.innerHTML="Membaca XLSX dan ZIP...";

const xlsx=await JSZip.loadAsync(excel);
const photos=await JSZip.loadAsync(zip);

let index=1;

for(const name of Object.keys(photos.files)){

if(/\.(jpg|jpeg|png)$/i.test(name)){

let data=await photos.files[name].async("uint8array");

let ext=name.toLowerCase().endsWith(".png")?"png":"jpeg";

xlsx.file("xl/media/image"+index+"."+ext,data);

index++;

}

}

status.innerHTML="Menyimpan hasil...";

const blob=await xlsx.generateAsync({type:"blob"});

let a=document.getElementById("download");
a.href=URL.createObjectURL(blob);
a.download="OPM_RESULT_V6.xlsx";
a.style.display="block";
a.innerHTML="DOWNLOAD XLSX";

status.innerHTML="SELESAI";
}
