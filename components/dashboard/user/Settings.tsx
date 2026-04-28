import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

interface SettingsProps {
  user: any;
  showToast: (type: 'success' | 'error', msg: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, showToast }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, we would gather form data here. 
    // For this demo, we'll just simulate a success save.
    setTimeout(() => {
        showToast('success', 'Profile updated successfully!');
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        
        <form onSubmit={handleUpdateProfile} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500 border-4 border-white shadow-sm">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                            <p className="text-gray-500 text-sm">{user.type} • ID: #ECO-8821</p>
                            <button type="button" className="text-eco-green text-sm font-bold hover:underline mt-1">Change Avatar</button>
                        </div>
                    </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" defaultValue={user.name} />
                    <Input label="Email Address" defaultValue={user.email} disabled className="bg-gray-50 opacity-70" />
                    <Input label="Phone Number" defaultValue={user.phone} />
                    <Input label="Company Name" defaultValue={user.company} />
                    <div className="md:col-span-2">
                    <Input label="Registered Address" defaultValue={user.address} />
                    </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <Button type="submit" className="w-auto px-6" isLoading={isLoading}>Save Changes</Button>
            </div>
        </form>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield size={20} className="text-gray-400" /> Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <div className="hidden md:block"></div>
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
            </div>
            <div className="mt-6 flex justify-end">
                <Button variant="outline" className="w-auto px-6">Update Password</Button>
            </div>
        </div>
    </div>
  );
};

export default Settings;