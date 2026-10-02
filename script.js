async function generate(){
const excel=document.getElementById('excel').files[0];
const zip=document.getElementById('zip').files[0];
const status=document.getElementById('status');

if(!excel||!zip){status.innerHTML='Upload file dulu';return;}

status.innerHTML='Membaca ZIP...';

const z=await JSZip.loadAsync(zip);
let fat=Object.keys(z.files).filter(x=>x.toUpperCase().includes('FAT'));

const wb=new ExcelJS.Workbook();
await wb.xlsx.load(await excel.arrayBuffer());

let sheet=wb.getWorksheet('OPM FDT  & FAT');

if(sheet){
sheet.getCell('B3').value=zip.name.replace('.zip','');
let c=4;
fat.forEach(f=>{
sheet.getCell(10,c).value=f.split('/').pop();
c++;
});
}

const buffer=await wb.xlsx.writeBuffer();
const blob=new Blob([buffer]);

let link=document.getElementById('download');
link.href=URL.createObjectURL(blob);
link.download='OPM_RESULT.xlsx';
link.style.display='block';
link.innerHTML='DOWNLOAD RESULT';

status.innerHTML='SELESAI';
}