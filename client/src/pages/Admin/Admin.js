import { Tabs } from 'antd'
import React, { useEffect } from 'react'
import ProductsInfo from './ProductsInfo'
import Users from './Users'
import Broadcasts from './Broadcasts'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.users);

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/')
    }
  }, []);

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 2px 16px rgba(79,70,229,0.08)',
      border: '1px solid #EEF0FF'
    }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1F2937' }}>
          🛡️ Admin Dashboard
        </h1>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 13 }}>Manage products, users, and broadcasts</p>
      </div>
      <Tabs
        tabBarStyle={{ fontWeight: 600 }}
        items={[
          {
            key: '1',
            label: '📦 Products',
            children: <ProductsInfo />,
          },
          {
            key: '2',
            label: '👥 Users',
            children: <Users />,
          },
          {
            key: '3',
            label: '📢 Broadcasts',
            children: <Broadcasts />,
          },
        ]}
      />
    </div>
  )
}

export default Admin
