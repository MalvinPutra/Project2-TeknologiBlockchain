require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Menentukan versi compiler Solidity yang digunakan
  solidity: "0.8.20", 
  networks: {
    // Pengaturan untuk menghubungkan ke local blockchain (npx hardhat node)
    localhost: {
      url: "http://127.0.0.1:8545" 
    }
  }
};