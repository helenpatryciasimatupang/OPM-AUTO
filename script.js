const statusEl = document.getElementById('status');
const downloadEl = document.getElementById('download');

document.getElementById('btn').addEventListener('click', processZip);

async function processZip(){
  const zipFile = document.getElementById('zip').files[0];
  if(!zipFile){
    statusEl.textContent = 'Upload ZIP area dulu';
    return;
  }

  downloadEl.style.display='none';
  statusEl.textContent = 'Membaca ZIP area...';

  try{
    const archive = await JSZip.loadAsync(zipFile);
    const entries = Object.keys(archive.files).filter(n => !archive.files[n].dir);

    const excelInside = entries.find(n => /\.xlsx$/i.test(n));
    if(!excelInside){
      statusEl.textContent = 'Tidak ditemukan file .xlsx di dalam ZIP. Mode cepat tidak bisa dipakai.';
      return;
    }

    statusEl.textContent = 'File Excel ditemukan di dalam ZIP. Menyiapkan download...';
    const blob = await archive.files[excelInside].async('blob');
    const fileName = excelInside.split('/').pop();

    downloadEl.href = URL.createObjectURL(blob);
    downloadEl.download = fileName || 'OPM_RESULT.xlsx';
    downloadEl.textContent = 'DOWNLOAD RESULT';
    downloadEl.style.display = 'inline-block';

    statusEl.textContent = 'SELESAI';
  }catch(err){
    console.error(err);
    statusEl.textContent = 'Gagal membaca ZIP: ' + (err?.message || err);
  }
}
