import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

const geEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    
    return transactionContract;
};

export const TransactionProvider = ({ children }) => {
    const [currentdAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");
    
            const accounts = await ethereum.request({ method: 'eth_accounts' });
    
            if(accounts.length) {
                setCurrentAccount(accounts[0]);
    
                // getAllTransactions();
            } else {
                console.log("No accounts found!");
            }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.");
        }
    };

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.");
        }   
    };

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");

            // get the data from the form...
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = geEthereumContract();
            const parseAmount = ethers.utils.parseEther(amount)
            // send ethereum
            await ethereum.request({ 
                method: 'eth_sendTransaction', 
                params: [{
                    from: currentdAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI
                    value: parseAmount._hex, // 0.00001
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parseAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentdAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
};
