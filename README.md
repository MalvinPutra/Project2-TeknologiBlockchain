# Laporan Project 2

## Deskripsi Project
Project ini adalah implementasi smart contract untuk sistem pemungutan suara (Voting System) on-chain menggunakan bahasa Solidity dan framework Hardhat. Kontrak ini mengatur pendaftaran kandidat, validasi hak suara wallet, batas waktu voting, hingga penentuan pemenang berdasarkan kuorum.

## Anggota Kelompok
- Malvin Putra Rismahardian (NRP: 5027231048)
---

## Pembuktian Pemenuhan Requirement Tugas

Smart contract ini telah memenuhi dan melampaui seluruh spesifikasi teknis minimum yang ditetapkan dalam panduan tugas:

### 1. Komponen Smart Contract (contracts/SimpleVoting.sol)
* **State Variables (Tersedia 5, Minimum 3):** `owner`, `proposals`, `votingDeadline`, `minQuorum`, dan `totalVotes`.
* **Mappings (Tersedia 2, Minimum 1):** `hasVoted` (pelacakan status vote) dan `voterWeight` (bobot suara).
* **Events (Tersedia 2, Minimum 2):** `ProposalAdded` dan `Voted`.
* **Modifiers (Tersedia 3, Minimum 1):** `onlyOwner`, `beforeDeadline`, dan `afterDeadline`.
* **Functions (Tersedia 6, Minimum 4):** `setVoterWeight()`, `addProposal()`, `vote()`, `getProposalCount()`, `isQuorumReached()`, dan `getWinner()`.

### 2. Fitur Tambahan 
* **Voting Deadline:** Transaksi voting otomatis ditolak jika melewati batas waktu yang ditentukan saat deploy.
* **Minimum Quorum:** Hasil pemenang tidak dapat dihitung atau dianggap tidak sah jika total suara masuk belum memenuhi batas kuorum minimum.
* **Weighted Voting:** Pemilik kontrak memiliki hak untuk memberikan bobot suara yang berbeda pada address tertentu.

### 3. Pemenuhan Cakupan Testing (test/SimpleVoting.test.js)
Telah dibuat 10 test case (minimum tugas 8) yang mencakup seluruh kategori wajib:
* **Deployment:** Memvalidasi inisialisasi owner dan proposal.
* **Access Control:** Memvalidasi hak akses fungsi khusus owner.
* **Positive Scenario:** Menguji alur vote yang valid dan perubahan jumlah suara.
* **Negative Scenario:** Menguji penolakan double-voting dan pengisian ID proposal yang tidak valid.
* **Events:** Memastikan event log terpicu saat ada proposal baru atau vote masuk.

---

## Panduan Menjalankan dan Pengujian Program

### Langkah Eksekusi

1. **Instalasi Dependencies**
   Unduh semua pustaka dan framework yang dibutuhkan:
```bash
npm install

```

2. **Kompilasi Smart Contract**
Lakukan kompilasi file Solidity untuk memastikan tidak ada error sintaks:
```bash
npx hardhat compile

```


3. **Menjalankan Unit Testing**
Eksekusi script pengujian otomatis untuk melihat status keberhasilan 10 test case:
```bash
npx hardhat test

```


4. **Menjalankan Node Blockchain Lokal**
Nyalakan simulator jaringan blockchain lokal (pastikan terminal ini tetap terbuka):
```bash
npx hardhat node

```


5. **Deployment Kontrak**
Buka terminal baru, lalu unggah kontrak pintar ke jaringan lokal yang sudah aktif:
```bash
npx hardhat run scripts/deploy.js --network localhost

```


6. **Interaksi Kontrak (Simulasi Transaksi & State)**
Jalankan script interaksi untuk memicu minimal 2 transaksi berbeda dan melihat perubahan data secara langsung:
```bash
npx hardhat run scripts/interact.js --network localhost

```



---

## Alamat Kontrak Terdeploy (Localhost Network)
<img width="617" height="597" alt="image" src="https://github.com/user-attachments/assets/fb653aab-d55e-48cb-bb09-3bae9dedbc16" />

`0x5FbDB2315678afecb367f032d93F642f64180aa3`

---

## Dokumentasi dan Screenshot Bukti Eksekusi

### 1. Bukti Kompilasi Sukses

Menampilkan hasil terminal dari perintah `npx hardhat compile` yang menunjukkan file Solidity berhasil dikompilasi tanpa error.


<img width="609" height="84" alt="image" src="https://github.com/user-attachments/assets/8c380f2a-ce06-498b-a8f6-b8e0fa1da331" />



### 2. Bukti Pengujian (Unit Testing) Passing

Menampilkan output hijau dari 10 test case yang berhasil dilewati setelah menjalankan perintah `npx hardhat test`.


<img width="616" height="483" alt="image" src="https://github.com/user-attachments/assets/408cdefb-b78d-4763-b1ac-a16146f3f053" />



### 3. Bukti Jaringan Node Lokal Aktif

Menampilkan daftar akun dummy dan private key yang dihasilkan saat menjalankan perintah `npx hardhat node`.


<img width="620" height="715" alt="image" src="https://github.com/user-attachments/assets/fb47535e-8e98-40f4-b578-eebd00735031" />



### 4. Bukti Deployment Kontrak Berhasil

Menampilkan teks konfirmasi sukses deployment beserta output Alamat Kontrak di terminal.


<img width="605" height="163" alt="image" src="https://github.com/user-attachments/assets/15e3ae11-d43a-4b14-8e51-e649618bbf34" />



### 5. Bukti Interaksi Transaksi dan Perubahan State Data

Menampilkan eksekusi dua transaksi berbeda (tambah proposal dan voting) serta perubahan nilai data jumlah suara dari 0 menjadi 1 pada terminal.


<img width="609" height="318" alt="image" src="https://github.com/user-attachments/assets/6e75003e-796c-4d58-a9fb-a64bc4b13b29" />



```
