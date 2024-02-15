// Login.jsx

import { useState } from 'react';

export function Login({ onSubmit }) {
    const [username, setUsername] = useState('');
    return (
        <>
            <h1>Hello</h1>
            <label>Enter your username</label>
            <form onSubmit={e => {
                e.preventDefault();
                onSubmit(username);
            }}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

