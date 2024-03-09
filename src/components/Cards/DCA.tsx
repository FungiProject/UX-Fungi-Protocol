import React, { useState } from 'react';
import { useDCA } from '../../lib/gelato/useDCA';

export const DCA = ({ tokens }: { tokens: any[] }) => {
    const [amount, setAmount] = useState('');
    const [fromToken, setFromToken] = useState(tokens[0]?.address || '');
    const [toToken, setToToken] = useState(tokens[1]?.address || tokens[0]?.address || '');
    const [interval, setInterval] = useState('1'); // Default interval of 1 day
  
    const { setupDCA, stopDCA } = useDCA(); // Using the useDCA hook
  
    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value);
    };
  
    const handleFromTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFromToken(event.target.value);
    };
  
    const handleToTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setToToken(event.target.value);
    };
  
    const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInterval(event.target.value);
    };

  const handleSubmit = () => {
    // Submit logic for DCA
    console.log(`Submitting DCA Operation for ${amount} of ${fromToken} every ${interval} day(s) to ${toToken}`);
    
    // setupDCA({
    //     fromToken,
    //     toToken,
    //     amount,
    //     interval: parseInt(interval), // Assuming interval is in days for simplicity
    //   });
  };

  const handleStop = () => {
    // stopDCA(); // Call stopDCA when the stop button is clicked
    console.log("DCA operation stopped.");
  };

  const cardStyle = {
    width: '300px',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: 'rgba(10, 10, 10, 0.1)',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    fontSize: '20px',
    marginBottom: '10px',
  };

  const inputSelectStyle = {
    marginBottom: '10px',
    padding: '5px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: 'rgba(20, 20, 100)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
    };

    return (
        <div style={cardStyle}>
            <h3 style={headerStyle}>DCA Operation Setup</h3>
            <div style={containerStyle}>
                <input
                    style={inputSelectStyle}
                    type='number'
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder='Amount to DCA'
                />
                <label>From Token</label>
                <select value={fromToken} onChange={handleFromTokenChange}>
                    {tokens.map((token) => (
                        <option key={token.address} value={token.address}>
                            {token.symbol}
                        </option>
                    ))}
                </select>
                <label>To Token</label>
                <select value={toToken} onChange={handleToTokenChange}>
                    {tokens.map((token) => (
                        <option key={token.address} value={token.address}>
                            {token.symbol}
                        </option>
                    ))}
                </select>
                <label>Interval (Days)</label>
                <input
                    type='number'
                    value={interval}
                    onChange={handleIntervalChange}
                    placeholder='DCA Interval (Days)'
                />
                <button style={buttonStyle} onClick={handleSubmit}>Start DCA</button>
                <button style={{ ...buttonStyle, backgroundColor: 'rgba(100, 20, 20)' }} onClick={handleStop}>Stop DCA</button>
            </div>
        </div>
    );
};