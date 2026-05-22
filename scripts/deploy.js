const { ethers } = require("hardhat");

async function main() {
  const durationInMinutes = 60; // Mengatur durasi voting aktif selama 1 jam
  const minQuorum = 2;          // Mengatur syarat minimal kuorum adalah 2 suara masuk

  console.log("Memulai proses deployment kontrak SimpleVoting...");

  // Mengambil blueprint kompilasi dari kontrak SimpleVoting
  const SimpleVoting = await ethers.getContractFactory("SimpleVoting");
  
  // Memulai transaksi deployment dengan memasukkan parameter constructor
  const voting = await SimpleVoting.deploy(durationInMinutes, minQuorum);

  // Menunggu hingga blok transaksi berhasil tervalidasi di jaringan blockchain lokal
  await voting.waitForDeployment();

  console.log("Kontrak SimpleVoting berhasil dideploy!");
  // Menampilkan alamat hash contract sebagai bukti utama pengerjaan tugas
  console.log("Alamat Kontrak Anda:", await voting.getAddress());
}

// Menjalankan fungsi main dan menangani jika terjadi error sistem
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });