import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useERC20Transfer } from '@/hooks/useERC20Transfer';
import { BigNumber } from 'alchemy-sdk';
import { useNotification } from "@/context/NotificationContextProvider";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useSimUO } from "@/hooks/useSimUO";

const SendModal = async ({ isOpen, onClose }) => {
    const [tokenAddress, setTokenAddress] = useState<string>('0xaf88d065e77c8cc2239327c5edb3a432268e5831');
    const [amount, setAmount] = useState<string>('1000000');
    const [recipient, setRecipient] = useState<string>('0x141571912eC34F9bE50a6b8DC805e71Df70fAdAD');
    const { showNotification } = useNotification();
    const [status, sendTransfer] = useERC20Transfer(tokenAddress, BigNumber.from(amount), recipient);
    const { sendUserOperations } = useUserOperations();
    const { simStatus, simTransfer } = useSimUO();

    const handleSend = async () => {
        if (
            tokenAddress === undefined ||
            amount === undefined ||
            recipient === undefined ||
            typeof sendTransfer !== "function"
        ) {
            showNotification({
                message: "Error sending tokens",
                type: "error",
            });
            return Promise.resolve();
        }
        const resultTx: any = await sendTransfer();

        await sendUserOperations(resultTx);
    };

    const handleSim = async () => {
        if (
            tokenAddress === undefined ||
            amount === undefined ||
            recipient === undefined ||
            typeof sendTransfer !== "function"
        ) {
            showNotification({
                message: "Error sending tokens",
                type: "error",
            });
            return Promise.resolve();
        }
        const resultTx: any = await sendTransfer();

        await simTransfer(resultTx);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="backdrop-blur-sm bg-opacity-30 bg-black fixed inset-0"></div>
                <div style={{
                    backgroundColor: '#FFFFFF',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    width: 'auto',
                    maxWidth: '90%',
                    margin: 'auto',
                    transition: 'all 0.3s ease',
                    background: '#FFF',
                    color: '#000'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#000',
                            fontSize: '16px'
                        }}
                    >
                        X
                    </button>
                    <div style={{ marginTop: '20px' }}>
                        <h2 style={{ marginBottom: '15px' }}>Send Tokens</h2>
                        <input
                            type="text"
                            placeholder="Token Address"
                            value={tokenAddress}
                            onChange={(e: any) => setTokenAddress(e.target.value)}
                            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px' , backgroundColor: '#f5f5f5', margin: '10px'}}
                        />
                        <input
                            type="text"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e: any) => setAmount(e.target.value)}
                            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', backgroundColor: '#f5f5f5', margin: '10px'}}
                        />
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipient}
                            onChange={(e: any) => setRecipient(e.target.value)}
                            style={{ marginBottom: '15px', padding: '10px', borderRadius: '5px', backgroundColor: '#f5f5f5', margin: '10px' }}
                        />
                        <button onClick={handleSend} style={{
                            padding: '10px 20px',
                            backgroundColor: '#2575fc',
                            border: 'none',
                            borderRadius: '5px',
                            transition: 'background-color 0.3s ease',
                            cursor: 'pointer'
                        }}>
                            Send
                        </button>
                        <button onClick={handleSim} >Simulate</button>
                        {simStatus && typeof simStatus !== 'function' && (
                            <p>
                                {simStatus.loading ? 'Loading...' : simStatus.error ? simStatus.error : simStatus.success}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default SendModal;
