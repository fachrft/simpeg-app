<script setup lang="ts">
defineProps<{
  employees: any[];
  searchQuery?: string;
  unitId?: number | null;
  currentPage: number;
  perPage: number;
}>();
</script>

<template>
  <div class="print-area hidden">
    <div class="print-header">
      <h1>LAPORAN DATA PEGAWAI</h1>
      <div class="print-meta">
        <p v-if="searchQuery">Pencarian: "{{ searchQuery }}"</p>
        <p v-if="unitId">Filter Unit Aktif</p>
        <p>Halaman: {{ currentPage }}</p>
        <p>Dicetak pada: {{ new Date().toLocaleString('id-ID') }}</p>
      </div>
    </div>

    <table class="print-table">
      <thead>
        <tr>
          <th>No</th>
          <th>NIP</th>
          <th>Nama</th>
          <th>L/P</th>
          <th>Tgl Lahir</th>
          <th>Tempat Lahir</th>
          <th>Agama</th>
          <th>Gol</th>
          <th>Eselon</th>
          <th>Jabatan</th>
          <th>Unit Kerja</th>
          <th>Tmt Tugas</th>
          <th>No. HP</th>
          <th>NPWP</th>
          <th>Alamat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(emp, index) in employees" :key="emp.id">
          <td class="text-center">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td>{{ emp.nip }}</td>
          <td class="font-bold">{{ emp.nama }}</td>
          <td class="text-center">{{ emp.jenis_kelamin }}</td>
          <td>{{ emp.tanggal_lahir }}</td>
          <td>{{ emp.tempat_lahir }}</td>
          <td>{{ emp.agama }}</td>
          <td>{{ emp.golongan?.nama_golongan ?? '-' }}</td>
          <td>{{ emp.eselon }}</td>
          <td>{{ emp.jabatan }}</td>
          <td>{{ emp.unit_kerja?.nama_unit ?? '-' }}</td>
          <td>{{ emp.tempat_tugas }}</td>
          <td>{{ emp.no_hp }}</td>
          <td>{{ emp.npwp }}</td>
          <td class="text-xs">{{ emp.alamat }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.print-area {
  display: none;
}

@media print {
  /* Hilangkan margin/padding bawaan browser & container */
  html, body {
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    background-color: #fff !important;
  }

  /* Sembunyikan elemen UI di luar komponen ini (global effect) */
  :global(.lg\:flex-row),
  :global(.flex-col.items-end),
  :global(.overflow-x-auto),
  :global(.border-t.border-gray-200),
  :global(nav),
  :global(aside),
  :global(button),
  :global(footer),
  :global(.UButton),
  :global(.UInput),
  :global(.sidebar-filter-unit-kerja) {
    display: none !important;
  }

  :global(.min-h-screen) {
    min-height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Tampilkan area cetak */
  .print-area {
    display: block !important;
    position: relative !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    color: #000 !important;
  }

  .print-header {
    text-align: center;
    margin-bottom: 10px;
    border-bottom: 2px solid #000;
    padding-bottom: 5px;
  }

  .print-header h1 {
    font-size: 16pt;
    font-weight: bold;
    margin: 0;
    color: #000 !important;
  }

  .print-meta {
    display: flex;
    justify-content: center;
    gap: 15px;
    font-size: 8pt;
    margin-top: 4px;
    color: #000 !important;
  }

  .print-table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin-top: 5px;
  }

  .print-table th,
  .print-table td {
    border: 0.5pt solid #000 !important;
    padding: 3px 4px !important;
    font-size: 7.5pt !important;
    line-height: 1.1;
    color: #000 !important;
    vertical-align: middle !important;
  }

  .print-table th {
    background-color: #f3f4f6 !important;
    font-weight: bold;
    -webkit-print-color-adjust: exact;
    color: #000 !important;
  }

  .print-table tr {
    page-break-inside: avoid;
  }

  .text-center { text-align: center !important; }
  .text-xs { font-size: 6.5pt !important; }
  .font-bold { font-weight: bold !important; }

  @page {
    size: landscape;
    margin: 0.5cm;
  }
}
</style>
