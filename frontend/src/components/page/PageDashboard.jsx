import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import './PageDashboard.css'; // Import a CSS file for styling

// The dashboard component to visualize data about sales
const PageDashboard = () => {
    const [topMenuSales, setTopMenuSales] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];
    // Fetch top menu sales
    const fetchTopMenuSales = async () => {
        try {
            const response = await axios.get('http://localhost:8085/receipts/top-menu-sales');
            const formattedData = response.data.map(item => ({
                totalQuantity: item.total_quantity,
                totalPrice: item.total_price,
                combinedLabel: `${item.menu.name} (${item.menu.type})`,
            }));
            console.log(formattedData);
            setTopMenuSales(formattedData);
        } catch (error) {
            console.error('Error fetching top menu sales:', error);
        }
    };
    // Fetch daily sales data
    const fetchDailySales = async () => {
        try {
            const response = await axios.get('http://localhost:8085/receipts/daily-sales');
            const formattedData = response.data.map(item => ({
                menuName: item.menu.name,
                menuType: item.menu.type,
                combinedLabel: `${item.menu.name} (${item.menu.type})`,
                totalQuantity: item.total_quantity,
                totalPrice: item.total_price
            }));
            console.log(formattedData);
            setDailySales(formattedData);
        } catch (error) {
            console.error('Error fetching daily sales:', error);
        }
    };

    // Fetch monthly sales data
    const fetchMonthlySales = async () => {
        try {
            const response = await axios.get('http://localhost:8085/receipts/monthly-sales');
            const formattedData = response.data.map(item => ({
                menuName: item.menu.name,
                menuType: item.menu.type,
                combinedLabel: `${item.menu.name} (${item.menu.type})`,
                totalQuantity: item.total_quantity,
                totalPrice: item.total_price
            }));
            console.log(formattedData);
            setMonthlySales(formattedData);
        } catch (error) {
            console.error('Error fetching monthly sales:', error);
        }
    };

    useEffect(() => {
        fetchTopMenuSales();
        fetchDailySales();
        fetchMonthlySales();
    }, []);

    // Custom label for sales to display menu name, type, quantity, and total price
    const renderSalesLabel = ({ menuName, menuType, totalQuantity, totalPrice }) => {
        return `${menuName} (${menuType}) : ${totalQuantity} items (${totalPrice.toFixed(2)} THB)`;
    };

    return (
        <div className="dashboard-container">
            <Link to="/">
                <img className='back-icon' src="/src/assets/icon/arrow_back_icon.png" alt="back" />
            </Link>
            <h1>Dashboard</h1>

            {/* Top Menu Sales Bar Chart */}
            <div className="bar-container">
                <h2>Top Menu Sales</h2>
                <BarChart width={1000} height={300} data={topMenuSales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="combinedLabel" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalPrice" fill="#8884d8" />
                </BarChart>
            </div>

            {/* Daily Sales Pie Chart */}
            <div className="pie-container">
                <h2>Daily Sales</h2>
                { dailySales.length === 0 ? <h3 className="no-sale">No sale for today yet.</h3> :
                    <PieChart width={1000} height={300}>
                        <Pie
                            data={dailySales}
                            dataKey="totalQuantity"
                            nameKey="combinedLabel"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label={renderSalesLabel}
                        >
                            {dailySales.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                }
            </div>

            {/* Monthly Sales Pie Chart */}
            <div className="pie-container">
                <h2>Monthly Sales</h2>
                { monthlySales.length === 0 ? <h3 className="no-sale">No sale for this month yet.</h3> :
                    <PieChart width={1000} height={300}>
                        <Pie
                            data={monthlySales}
                            dataKey="totalQuantity"
                            nameKey="combinedLabel"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#82ca9d"
                            label={renderSalesLabel}
                        >
                            {monthlySales.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                }
            </div>
        </div>
    );
};

export default PageDashboard;
