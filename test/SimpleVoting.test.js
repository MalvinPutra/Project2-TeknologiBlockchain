const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleVoting Smart Contract Testing", function () {
  let SimpleVoting, voting, owner, addr1, addr2, addr3;
  const duration = 10; // Setup durasi dummy 10 menit
  const quorum = 2;    // Setup batas minimal kuorum = 2 suara

  // Jalankan inisialisasi deploy ulang kontrak setiap sebelum memulai satu case test
  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners(); // Mengambil akun dummy dari Hardhat
    SimpleVoting = await ethers.getContractFactory("SimpleVoting");
    voting = await SimpleVoting.deploy(duration, quorum);
    await voting.waitForDeployment();
  });

  // Kategori 1: Pengujian Awal Deployment
  describe("Kategori: Deployment", function () {
    it("Harus menetapkan address Owner dengan benar", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("Harus memulai project dengan jumlah proposal nol", async function () {
      expect(await voting.getProposalCount()).to.equal(0);
    });
  });

  // Kategori 2: Pengujian Hak Akses (Access Control)
  describe("Kategori: Access Control", function () {
    it("Owner harus diizinkan menambahkan proposal/kandidat", async function () {
      await expect(voting.connect(owner).addProposal("Kandidat A"))
        .to.emit(voting, "ProposalAdded"); // Memastikan event ProposalAdded terpicu
    });

    it("User biasa (bukan owner) harus ditolak jika mencoba menambah proposal (Negative Test)", async function () {
      await expect(voting.connect(addr1).addProposal("Kandidat Palsu"))
        .to.be.revertedWith("Only owner can call this function"); // Harus melempar error require
    });
  });

  // Kategori 3: Pengujian Mekanisme Inti (Positive & Negative Test)
  describe("Kategori: Mekanisme Voting Utama", function () {
    beforeEach(async function () {
      // Daftarkan dua kandidat sebagai basis data sebelum mulai memilih
      await voting.connect(owner).addProposal("Kandidat A");
      await voting.connect(owner).addProposal("Kandidat B");
    });

    it("Harus menghitung suara masuk secara tepat dan memicu event Voted (Positive Test)", async function () {
      await expect(voting.connect(addr1).vote(0))
        .to.emit(voting, "Voted")
        .withArgs(addr1.address, 0, 1); // Cek parameter event log

      const proposal = await voting.proposals(0);
      expect(proposal.voteCount).to.equal(1); // Suara kandidat naik jadi 1
    });

    it("Harus menolak jika user mencoba memilih dua kali (Negative Test)", async function () {
      await voting.connect(addr1).vote(0); // Pilihan pertama sukses
      await expect(voting.connect(addr1).vote(1))
        .to.be.revertedWith("You have already voted"); // Pilihan kedua diblokir
    });

    it("Harus menolak jika memilih ID proposal yang tidak terdaftar (Negative Test)", async function () {
      await expect(voting.connect(addr1).vote(99))
        .to.be.revertedWith("Invalid proposal ID");
    });
  });

  // Kategori 4: Pengujian Fitur Tambahan (Bonus Features)
  describe("Kategori: Fitur Bonus (Weight & Quorum)", function () {
    it("Harus menerapkan perkalian bobot suara khusus dari Owner", async function () {
      await voting.connect(owner).addProposal("Kandidat A");
      await voting.connect(owner).setVoterWeight(addr1.address, 5); // Set bobot addr1 = 5 suara

      await voting.connect(addr1).vote(0);
      const proposal = await voting.proposals(0);
      expect(proposal.voteCount).to.equal(5); // Sekali klik langsung dapet 5 poin suara
    });

    it("Harus memvalidasi apakah kuorum minimal tercapai", async function () {
      await voting.connect(owner).addProposal("Kandidat A");
      expect(await voting.isQuorumReached()).to.equal(false); // Awalnya false karena belum ada suara

      await voting.connect(addr1).vote(0);
      await voting.connect(addr2).vote(0); // Total masuk 2 suara (Kuorum minimal terpenuhi)
      expect(await voting.isQuorumReached()).to.equal(true);
    });

    it("Harus menolak kalkulasi pemenang jika durasi voting belum habis", async function () {
      await voting.connect(owner).addProposal("Kandidat A");
      await expect(voting.getWinner()).to.be.revertedWith("Voting is still ongoing");
    });
  });
});