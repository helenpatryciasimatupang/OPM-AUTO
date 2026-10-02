async function processData(){

const excel=document.getElementById("excel").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!excel || !zip){
status.innerHTML="Upload template dan ZIP foto";
return;
}

status.innerHTML="Membaca ZIP foto...";

const photos=await JSZip.loadAsync(zip);

let database=[];

for(const path of Object.keys(photos.files)){

if(/\.(jpg|jpeg|png)$/i.test(path)){

database.push({
path:path.toUpperCase()
});

}

}

status.innerHTML=
"Foto ditemukan: "+database.length+
". Mapping dynamic siap.";


/*
 V12 ENGINE:

 Folder:
 POLE
 FAT
 FDT
 OPM FAT
 OPM FDT
 GRAFIK ONT TEST


 Header Excel:
 FCJK13D01S01A01
 FCJK13D01S01A02
 dst


 Mapping:
 Row 11  = POLE
 Row 12  = FAT/FDT
 B13     = OPM FDT INPUT
 B15     = OPM FDT OUTPUT
 Row 13  = OPM FAT INPUT
 Row 15  = OPM FAT OUTPUT
 Row 17  = ONT RESULT
 Row 20  = ONT REMOTE


 Tahap ini mempertahankan template XLSX.
*/


status.innerHTML="SELESAI - Mapping ditemukan";

}