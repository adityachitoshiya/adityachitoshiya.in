import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/portfolio');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error("Failed to fetch portfolio data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-accent font-heading text-2xl tracking-widest uppercase">Loading...</div>;
    }

    if (!data) {
        return <div className="min-h-screen bg-background text-white flex items-center justify-center">Error loading portfolio data.</div>;
    }

    return (
        <PortfolioContext.Provider value={{ portfolioData: data }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => useContext(PortfolioContext);
