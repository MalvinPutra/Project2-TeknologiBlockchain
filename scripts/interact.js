const { ethers } = require("hardhat");

async function main() {
  // Alamat contract yang baru saja kamu deploy
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log("Menghubungkan ke kontrak SimpleVoting...");
  const SimpleVoting = await ethers.getContractFactory("SimpleVoting");
  const voting = await SimpleVoting.attach(contractAddress);

  console.log("\n--- Transaksi 1: Owner Menambahkan Kandidat ---");
  const tx1 = await voting.addProposal("Kandidat Ketua Himpunan A");
  await tx1.wait();
  console.log("Sukses menambahkan Kandidat Ketua Himpunan A!");

  console.log("\n--- Transaksi 2: User Melakukan Voting ---");
  const tx2 = await voting.vote(0); // Memilih kandidat dengan ID 0
  await tx2.wait();
  console.log("Sukses melakukan voting untuk ID 0!");

  console.log("\n--- Cek Perubahan State Kontrak ---");
  const proposal = await voting.proposals(0);
  console.log(`Nama Kandidat: ${proposal.name}`);
  console.log(`Jumlah Suara Sekarang: ${proposal.voteCount.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });