import React, { useState } from 'react';
import { UserPlus, Shield, MoreVertical, Mail, Check, X, ShieldAlert, ShieldCheck, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Executive' | 'Campaign Manager' | 'Task Owner' | 'Approver' | 'Project Owner';
    status: 'Active' | 'Pending' | 'Inactive';
}

interface TeamsPermissionsProps {
    users: User[];
    onUpdateUser: (id: string, updates: Partial<User>) => void;
    onAddUser: (user: Omit<User, 'id'>) => void;
    onRemoveUser: (id: string) => void;
}

const TeamsPermissions: React.FC<TeamsPermissionsProps> = ({ users, onUpdateUser, onAddUser, onRemoveUser }) => {
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
        name: '',
        email: '',
        role: 'Task Owner',
        status: 'Pending'
    });
    const [activeModal, setActiveModal] = useState<'access' | 'security' | null>(null);

    const roles: User['role'][] = ['Executive', 'Campaign Manager', 'Project Owner', 'Task Owner', 'Approver'];

    const handleAdd = () => {
        if (newUser.name && newUser.email) {
            onAddUser(newUser);
            setNewUser({ name: '', email: '', role: 'Task Owner', status: 'Pending' });
            setIsAddingUser(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px', color: 'white' }}>
                        Teams & <span className="serif" style={{ color: 'var(--omnicom-coral)' }}>Permissions</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Manage user access levels and workspace roles.</p>
                </div>
                <button
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setIsAddingUser(true)}
                >
                    <UserPlus size={18} /> Add User
                </button>
            </header>

            {isAddingUser && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass"
                    style={{ padding: '24px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}
                >
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Full Name</label>
                        <input
                            type="text"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: 'white'
                            }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Email Address</label>
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: 'white'
                            }}
                        />
                    </div>
                    <div style={{ width: '180px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.7)' }}>Role</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                color: 'white'
                            }}
                        >
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-primary" onClick={handleAdd} style={{ padding: '10px 20px' }}><Check size={18} /></button>
                        <button onClick={() => setIsAddingUser(false)} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}><X size={18} /></button>
                    </div>
                </motion.div>
            )}

            <div className="glass-dark" style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-subtle)' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Workspace Members</h3>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{users.length} Total Users</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {users.map((user) => (
                        <div
                            key={user.id}
                            style={{
                                padding: '16px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid rgba(0,0,0,0.03)',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: user.status === 'Active' ? 'var(--omnicom-blue)' : '#ddd',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 700
                                }}>
                                    {user.name.charAt(0)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 600, color: 'white' }}>{user.name}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{user.email}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                                <div style={{ width: '160px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)' }}>
                                        <Shield size={16} color="var(--omnicom-blue)" />
                                        <select
                                            value={user.role}
                                            onChange={(e) => onUpdateUser(user.id, { role: e.target.value as User['role'] })}
                                            style={{
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                fontSize: '0.9rem',
                                                fontWeight: 500,
                                                color: 'white',
                                                cursor: 'pointer',
                                                outline: 'none',
                                                fontFamily: 'var(--font-primary)'
                                            }}
                                        >
                                            {roles.map(r => <option key={r} value={r} style={{ backgroundColor: 'var(--omnicom-black)', color: 'white' }}>{r}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ width: '100px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: user.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: user.status === 'Active' ? '#059669' : '#d97706'
                                    }}>
                                        {user.status}
                                    </span>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                                        style={{ padding: '8px', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    <AnimatePresence>
                                        {activeMenu === user.id && (
                                            <>
                                                <div
                                                    style={{ position: 'fixed', inset: 0, zIndex: 60 }}
                                                    onClick={() => setActiveMenu(null)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    style={{
                                                        position: 'absolute',
                                                        right: 0,
                                                        top: '100%',
                                                        width: '180px',
                                                        backgroundColor: 'var(--bg-card)',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                                        zIndex: 70,
                                                        padding: '8px',
                                                        border: '1px solid var(--border-subtle)'
                                                    }}
                                                >
                                                    <button
                                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        onClick={() => { setActiveMenu(null); }}
                                                    >
                                                        <Edit size={16} /> Edit Details
                                                    </button>
                                                    <button
                                                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', color: '#ef4444', fontSize: '0.9rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        onClick={() => { setConfirmDelete(user.id); setActiveMenu(null); }}
                                                    >
                                                        <Trash2 size={16} /> Remove User
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {confirmDelete && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100
                        }}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ textAlign: 'center', padding: '32px', maxWidth: '400px' }}
                            >
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                    <Trash2 size={32} />
                                </div>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'white' }}>Remove user?</h4>
                                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: 1.5 }}>
                                    This will permanently remove <strong>{users.find(u => u.id === confirmDelete)?.name}</strong>'s access to this workspace.
                                </p>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ backgroundColor: '#ef4444', flex: 1 }}
                                        onClick={() => { onRemoveUser(confirmDelete); setConfirmDelete(null); }}
                                    >
                                        Confirm Removal
                                    </button>
                                    <button
                                        style={{ flex: 1, padding: '12px', borderRadius: '99px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                        onClick={() => setConfirmDelete(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <PermissionCard
                    title="Access Control"
                    icon={<ShieldCheck size={24} color="var(--omnicom-blue)" />}
                    description="Default permissions for each role. Executives have full access, while Task Owners can only edit assigned items."
                    onClick={() => setActiveModal('access')}
                />
                <PermissionCard
                    title="Security Policies"
                    icon={<ShieldAlert size={24} color="var(--omnicom-coral)" />}
                    description="Manage two-factor authentication requirements and session timeout policies for the workspace."
                    onClick={() => setActiveModal('security')}
                />
            </div>

            <AnimatePresence>
                {activeModal === 'access' && (
                    <AccessControlModal onClose={() => setActiveModal(null)} />
                )}
                {activeModal === 'security' && (
                    <SecurityPoliciesModal onClose={() => setActiveModal(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

const PermissionCard: React.FC<{ title: string, icon: React.ReactNode, description: string, onClick?: () => void }> = ({ title, icon, description, onClick }) => (
    <motion.div
        whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.02)' }}
        onClick={onClick}
        className="glass-dark"
        style={{ padding: '24px', borderRadius: '20px', display: 'flex', gap: '20px', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
    >
        <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', height: 'fit-content' }}>
            {icon}
        </div>
        <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'white' }}>{title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{description}</p>
        </div>
    </motion.div>
);

const AccessControlModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }} onClick={onClose}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />
        <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '100%', maxWidth: '800px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-subtle)', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}
        >
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(79, 127, 242, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--omnicom-blue)' }}>
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.3rem', color: 'white' }}>Access Control Matrix</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Define granular capability overrides for workspace roles.</p>
                    </div>
                </div>
                <button onClick={onClose} style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '32px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '12px 16px', fontWeight: 600 }}>Capability</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>Executive</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>Manager</th>
                            <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'center' }}>Task Owner</th>
                        </tr>
                    </thead>
                    <tbody style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                        {[
                            'Create Workflows', 'Delete Workflows', 'Approve Costs', 'Modify Users', 'View Financials'
                        ].map((cap, i) => (
                            <tr key={cap} style={{ borderBottom: i === 4 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px' }}>{cap}</td>
                                <td style={{ padding: '16px', textAlign: 'center' }}><CheckCircle active /></td>
                                <td style={{ padding: '16px', textAlign: 'center' }}><CheckCircle active={i !== 3 && i !== 4} /></td>
                                <td style={{ padding: '16px', textAlign: 'center' }}><CheckCircle active={i === 0} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button className="btn-secondary" onClick={onClose}>Reset to Default</button>
                    <button className="btn-primary" onClick={onClose}>Apply Changes</button>
                </div>
            </div>
        </motion.div>
    </div>
);

const SecurityPoliciesModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }} onClick={onClose}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />
        <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-subtle)', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}
        >
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255, 107, 107, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--omnicom-coral)' }}>
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.3rem', color: 'white' }}>Security Policies</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Enforce workspace security guidelines.</p>
                    </div>
                </div>
                <button onClick={onClose} style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SecurityToggle title="Two-Factor Authentication" description="Require 2FA for all members accessing the workspace." defaultChecked />
                <SecurityToggle title="Session Timeout" description="Automatically log users out after 4 hours of inactivity." defaultChecked />
                <SecurityToggle title="Device Management" description="Allow users to manage and revoke their active device sessions." />

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>Save Policy Updates</button>
                </div>
            </div>
        </motion.div>
    </div>
);

const CheckCircle: React.FC<{ active: boolean }> = ({ active }) => (
    <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: active ? 'none' : '2px solid rgba(255,255,255,0.1)',
        backgroundColor: active ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? '#10b981' : 'transparent'
    }}>
        {active && <Check size={12} strokeWidth={3} />}
    </div>
);

const SecurityToggle: React.FC<{ title: string, description: string, defaultChecked?: boolean }> = ({ title, description, defaultChecked }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
            <div style={{ flex: 1 }}>
                <h5 style={{ margin: '0 0 4px 0', color: 'white', fontWeight: 600 }}>{title}</h5>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>{description}</p>
            </div>
            <div
                onClick={() => setChecked(!checked)}
                style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: checked ? 'var(--omnicom-blue)' : 'rgba(255,255,255,0.1)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
            >
                <motion.div
                    animate={{ x: checked ? 22 : 2 }}
                    style={{ position: 'absolute', top: '2px', left: 0, width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                />
            </div>
        </div>
    );
};

export default TeamsPermissions;
