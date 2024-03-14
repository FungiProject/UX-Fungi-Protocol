import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useERC20Transfer } from '@/hooks/useERC20Transfer';
import { BigNumber } from 'alchemy-sdk';
// Import Hex if you're going to use it for runtime validation or type assertions.

const SendModal = ({ isOpen, onClose }) => {
    const [tokenAddress, setTokenAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const { sendTransfer } = useERC20Transfer(
        `0x${tokenAddress}`,
        amount ? BigNumber.from(amount) : BigNumber.from(0), // Ensure amount is not empty
        `0x${recipient}`
    );

    const handleSend = async () => {
        // Ensure all fields are filled and amount is a valid number before sending
        if (!tokenAddress || amount === '' || BigNumber.from(amount).isZero() || !recipient) {
        alert('Please fill in all fields with valid information.');
        return;
        }
    
        // Convert amount to BigNumber and execute transfer safely
        try {
        await sendTransfer(); // Assuming sendTransfer handles the transaction
        } catch (error) {
        console.error("Transfer failed:", error);
        // Handle the error appropriately
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Modal content goes here */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                    <h2 style={{ marginBottom: '15px' }}>Send Tokens</h2>
                    <input
                        type="text"
                        placeholder="Token Address"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <input
                        type="text"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)} // Directly setting string value
                        style={{ marginBottom: '10px' }}
                    />
                    <input
                        type="text"
                        placeholder="Recipient Address"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        style={{ marginBottom: '15px' }}
                    />
                    <button onClick={handleSend} style={{ padding: '10px', backgroundColor: 'blue', color: 'white', borderRadius: '5px' }}>
                        Send
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default SendModal;
