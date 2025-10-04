import React, { useEffect, useState } from 'react'
import EcommerceMetrics from './reusabaleCards/MetricCard'
import RecentOrders from './reusabaleCards/tableCard'
import axiosInstance from '../../utils/AxiosInstance';
import { toast } from 'sonner';
import MonthlySalesChart from './reusabaleCards/MonthlySales';
import MonthlyIncomeChart from './reusabaleCards/MonthlyIncome';

const LaundryHome = () => {
 
   const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
   
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/getlaundryorders", {
      });
      setOrders(res.data.items);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    fetchOrders()
  },[])
  console.log(orders)
  return (
    <div>
      <EcommerceMetrics data={orders}/>
      <div className=' mt-15 flex gap-5'>
         <MonthlySalesChart data={orders}/>
         <MonthlyIncomeChart data={orders} />
      </div>
      
    </div>
  )
}

export default LaundryHome
