async function generate(){

const master=document.getElementById("master").files[0];
const zip=document.getElementById("zip").files[0];
const status=document.getElementById("status");

if(!master || !zip){
status.innerHTML="Upload master Excel dan ZIP";
return;
}

status.innerHTML="Membaca master Excel...";

const xlsx=await JSZip.loadAsync(master);
const photos=await JSZip.loadAsync(zip);

let count=0;

for(const name of Object.keys(photos.files)){
    if(/\.(jpg|jpeg|png)$/i.test(name)){
        count++;
    }
}

status.innerHTML="Foto ditemukan: "+count+" | Master dipertahankan";

/*
V14 konsep:
- Master Excel hasil manual menjadi template utama
- Drawing XML tidak dibuat ulang
- Relationship gambar dipertahankan
- Tahap inject mengganti media berdasarkan mapping header
*/

const result=await xlsx.generateAsync({type:"blob"});

const a=document.getElementById("download");
a.href=URL.createObjectURL(result);
a.download="OPM_RESULT_V14.xlsx";
a.innerHTML="DOWNLOAD RESULT";
a.style.display="block";

status.innerHTML="SELESAI";

}