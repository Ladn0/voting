import React, { useState, useEffect } from "react";
import Web3 from "web3";

const VotingApp = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          const accounts = await web3Instance.eth.requestAccounts();
          setAccounts(accounts);

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

          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask not found");
      }
    }
    init();
  }, []);

  const handleVote = async () => {
    if (contract && selectedCandidate !== null) {
      try {
        await contract.methods.vote(selectedCandidate).send({
          from: accounts[0],
        });
      } catch (error) {
        console.error("Error voting:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Voting App</h1>
      {isLoggedIn ? (
        <>
          <h2>Candidates:</h2>
          <ul>
            {candidates.map((candidate) => (
              <li key={candidate.id}>
                {candidate.name} - Votes: {candidate.voteCount}
              </li>
            ))}
          </ul>
          <h2>Vote for a Candidate:</h2>
          <select onChange={(e) => setSelectedCandidate(e.target.value)}>
            <option value={null}>Select a Candidate</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
          <button onClick={handleVote}>Vote</button>
        </>
      ) : (
        <p>Please connect with MetaMask to use this app.</p>
      )}
    </div>
  );
};

export default VotingApp;
