// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleVoting {
    // Struktur data untuk menyimpan informasi setiap kandidat/proposal
    struct Proposal {
        string name;         // Nama kandidat/proposal
        uint256 voteCount;   // Jumlah suara yang diperoleh kandidat
    }

    // --- STATE VARIABLES (Min. 3 requirement dosen) ---
    address public owner;           // Menyimpan alamat wallet pembuat kontrak
    Proposal[] public proposals;    // Array/list untuk menampung semua kandidat
    uint256 public votingDeadline;  // Timestamp batas akhir waktu voting (Fitur Bonus)
    uint256 public minQuorum;       // Batas minimal total suara agar voting sah (Fitur Bonus)
    uint256 public totalVotes;      // Menghitung total seluruh suara yang sudah masuk

    // --- MAPPINGS (Min. 1 requirement dosen) ---
    // Mapping untuk mengecek apakah sebuah alamat wallet sudah memilih atau belum
    mapping(address => bool) public hasVoted;
    
    // Mapping untuk menyimpan bobot suara unik tiap wallet (Fitur Bonus: Weighted Voting)
    mapping(address => uint256) public voterWeight; 

    // --- EVENTS (Min. 2 requirement dosen) ---
    // Dipicu saat owner berhasil menambahkan kandidat baru
    event ProposalAdded(uint256 indexed proposalId, string name);
    
    // Dipicu setiap kali ada user yang berhasil melakukan vote
    event Voted(address indexed voter, uint256 indexed proposalId, uint256 weight);

    // --- MODIFIERS (Min. 1 requirement dosen) ---
    // Membatasi fungsi agar hanya bisa dieksekusi oleh Owner (Dosen/Admin)
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Memastikan transaksi terjadi SEBELUM deadline berakhir
    modifier beforeDeadline() {
        require(block.timestamp < votingDeadline, "Voting deadline has passed");
        _;
    }

    // Memastikan transaksi terjadi SETELAH deadline berakhir
    modifier afterDeadline() {
        require(block.timestamp >= votingDeadline, "Voting is still ongoing");
        _;
    }

    // --- CONSTRUCTOR ---
    // Dipanggil sekali pas pertama kali deploy untuk set durasi (menit) dan target kuorum
    constructor(uint256 _durationInMinutes, uint256 _minQuorum) {
        owner = msg.sender; // Wallet yang deploy otomatis jadi owner
        votingDeadline = block.timestamp + (_durationInMinutes * 1 minutes); // Set waktu selesai
        minQuorum = _minQuorum; // Set minimal suara masuk
    }

    // --- FUNCTIONS (Min. 4 requirement dosen) ---

    // 1. Fungsi khusus Owner untuk memberikan bobot suara lebih besar ke wallet tertentu (Weighted Voting)
    function setVoterWeight(address _voter, uint256 _weight) external onlyOwner {
        require(!hasVoted[_voter], "Voter has already voted");
        voterWeight[_voter] = _weight;
    }

    // 2. Fungsi khusus Owner untuk mendaftarkan kandidat baru sebelum masa tenggat
    function addProposal(string calldata _name) external onlyOwner beforeDeadline {
        proposals.push(Proposal({
            name: _name,
            voteCount: 0
        }));
        emit ProposalAdded(proposals.length - 1, _name); // Memicu event log
    }

    // 3. Fungsi publik agar user bisa memilih kandidat pilihan mereka
    function vote(uint256 _proposalId) external beforeDeadline {
        require(!hasVoted[msg.sender], "You have already voted"); // Validasi: ga boleh double vote
        require(_proposalId < proposals.length, "Invalid proposal ID"); // Validasi: id kandidat harus ada

        // Jika owner belum set bobot, otomatis default nilai suaranya = 1
        uint256 weight = voterWeight[msg.sender] == 0 ? 1 : voterWeight[msg.sender];

        hasVoted[msg.sender] = true; // Tandai wallet ini sudah memilih
        proposals[_proposalId].voteCount += weight; // Tambah suara ke kandidat
        totalVotes += weight; // Tambah total akumulasi suara masuk

        emit Voted(msg.sender, _proposalId, weight); // Memicu event transaksi vote
    }

    // 4. Fungsi view untuk mendapatkan jumlah total kandidat yang terdaftar
    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    // 5. Fungsi view untuk mengecek apakah kuorum minimal sudah terpenuhi atau belum
    function isQuorumReached() public view returns (bool) {
        return totalVotes >= minQuorum;
    }

    // 6. Fungsi view untuk melihat pemenang, hanya bisa dipanggil setelah voting selesai/tutup
    function getWinner() external view afterDeadline returns (string memory winnerName, uint256 winnerVoteCount) {
        require(totalVotes >= minQuorum, "Quorum not reached, voting invalid"); // Validasi kuorum
        require(proposals.length > 0, "No proposals available");

        uint256 winningVoteCount = 0;
        uint256 winningProposalId = 0;

        // Algoritma mencari suara terbanyak dari array proposal
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
        
        winnerName = proposals[winningProposalId].name;
        winnerVoteCount = winningVoteCount;
    }
}