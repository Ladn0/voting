import React, { useState, useEffect } from "react";
import Web3 from "web3";

const ResultsPage = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          const accounts = await web3Instance.eth.requestAccounts();

          const networkId = await web3Instance.eth.net.getId();
          const contractAddress = process.env.REACT_APP_CONTRACT_URL;
          const contractInstance = new web3Instance.eth.Contract(
            process.env.REACT_APP_CONTRACT_ABI,
            contractAddress
          );
          setContract(contractInstance);

          const candidateCount = await contractInstance.methods
            .totalCandidates()
            .call();
          const candidates = [];
          for (let i = 0; i < candidateCount; i++) {
            const candidate = await contractInstance.methods
              .candidates(i)
              .call();
            candidates.push(candidate);
          }
          setCandidates(candidates);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask not found");
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchCandidates() {
      if (contract) {
        const candidateCount = await contract.methods.totalCandidates().call();
        const candidatesData = [];
        for (let i = 0; i < candidateCount; i++) {
          const candidate = await contract.methods.candidates(i).call();
          candidatesData.push(candidate);
        }
        setCandidates(candidatesData);
      }
    }

    fetchCandidates();
  }, [contract]);

  return (
    <div className="App">
      <h1>Results Page</h1>
      <h2>Vote Results:</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name} - Votes: {candidate.voteCount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsPage;
