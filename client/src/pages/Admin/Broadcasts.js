import React, { useEffect, useState } from 'react';
import { message, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';

const typeConfig = {
  deal: { emoji: '🔥', label: 'Deal', bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  offer: { emoji: '🎁', label: 'Offer', bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  announcement: { emoji: '📢', label: 'Announcement', bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
  alert: { emoji: '⚠️', label: 'Alert', bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
};

const Broadcasts = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formRef] = Form.useForm();

  const fetchBroadcasts = async () => {
    try {
      const res = await axios.get('/api/broadcasts/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) setBroadcasts(res.data.data);
    } catch (err) {
      message.error('Failed to fetch broadcasts');
    }
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/broadcasts/create', values, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLoading(false);
      if (res.data.success) {
        message.success('📢 Broadcast sent to all users!');
        setShowModal(false);
        formRef.resetFields();
        fetchBroadcasts();
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      setLoading(false);
      message.error(err.message);
    }
  };

  const toggleActive = async (id) => {
    try {
      const res = await axios.put(`/api/broadcasts/toggle/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) {
        message.success('Status updated');
        fetchBroadcasts();
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const deleteBroadcast = async (id) => {
    try {
      const res = await axios.delete(`/api/broadcasts/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) {
        message.success('Deleted');
        fetchBroadcasts();
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => { fetchBroadcasts(); }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1F2937' }}>📢 Broadcasts</h2>
          <p style={{ margin: 0, color: '#6B7280', fontSize: 13 }}>
            Post deals, offers & announcements to all users
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79,70,229,0.3)'
          }}
        >
          + New Broadcast
        </button>
      </div>

      {/* Broadcasts list */}
      {broadcasts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: '#fff', borderRadius: 16,
          border: '1px dashed #E5E7EB'
        }}>
          <p style={{ fontSize: 40 }}>📭</p>
          <p style={{ color: '#9CA3AF', fontSize: 16, fontWeight: 500 }}>No broadcasts yet</p>
          <p style={{ color: '#D1D5DB', fontSize: 13 }}>Create your first broadcast to notify all users</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {broadcasts.map(b => {
            const cfg = typeConfig[b.type] || typeConfig.announcement;
            return (
              <div key={b._id} style={{
                background: '#fff',
                borderRadius: 14,
                border: `1px solid ${b.active ? cfg.border : '#E5E7EB'}`,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                opacity: b.active ? 1 : 0.6,
                boxShadow: b.active ? '0 2px 12px rgba(79,70,229,0.06)' : 'none',
              }}>
                {/* Type icon */}
                <div style={{
                  background: cfg.bg,
                  borderRadius: 10,
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0
                }}>
                  {cfg.emoji}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      background: cfg.bg, color: cfg.color,
                      fontSize: 11, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 20
                    }}>{cfg.label}</span>
                    {!b.active && (
                      <span style={{
                        background: '#F3F4F6', color: '#9CA3AF',
                        fontSize: 11, fontWeight: 700,
                        padding: '2px 8px', borderRadius: 20
                      }}>INACTIVE</span>
                    )}
                    <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' }}>
                      {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{b.title}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{b.message}</p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => toggleActive(b._id)}
                    style={{
                      background: b.active ? '#FEF2F2' : '#F0FDF4',
                      color: b.active ? '#EF4444' : '#16A34A',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {b.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteBroadcast(b._id)}
                    style={{
                      background: '#FEF2F2', color: '#EF4444',
                      border: 'none', borderRadius: 8,
                      padding: '6px 12px', fontSize: 12,
                      fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Broadcast Modal */}
      <Modal
        open={showModal}
        onCancel={() => { setShowModal(false); formRef.resetFields(); }}
        onOk={() => formRef.submit()}
        okText="📢 Send Broadcast"
        confirmLoading={loading}
        okButtonProps={{ style: { background: '#4F46E5', borderColor: '#4F46E5', fontWeight: 700 } }}
        title={<span style={{ fontSize: 18, fontWeight: 800, color: '#4F46E5' }}>📢 New Broadcast</span>}
        centered
      >
        <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 20 }}>
          This will be sent as a notification to <strong>all users</strong> on the platform.
        </p>
        <Form form={formRef} layout="vertical" onFinish={handleCreate}>
          <Form.Item label="Type" name="type" initialValue="announcement" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="announcement">📢 Announcement</Select.Option>
              <Select.Option value="deal">🔥 Deal</Select.Option>
              <Select.Option value="offer">🎁 Offer</Select.Option>
              <Select.Option value="alert">⚠️ Alert</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input placeholder="e.g. Weekend Sale — Up to 50% off!" maxLength={80} />
          </Form.Item>
          <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Message is required' }]}>
            <Input.TextArea rows={4} placeholder="Write your announcement here..." maxLength={500} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Broadcasts;
