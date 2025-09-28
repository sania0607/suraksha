import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Plus, Edit, Trash2, Shield, Hospital, Truck, Users, AlertTriangle } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  category: 'family' | 'medical' | 'fire' | 'police' | 'school' | 'other';
  relationship?: string;
  isDefault?: boolean;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    // Default emergency contacts
    { id: '1', name: 'Emergency Services', phone: '112', category: 'police', isDefault: true },
    { id: '2', name: 'Fire Department', phone: '101', category: 'fire', isDefault: true },
    { id: '3', name: 'Medical Emergency', phone: '108', category: 'medical', isDefault: true },
    { id: '4', name: 'Police', phone: '100', category: 'police', isDefault: true },
    // Sample personal contacts
    { id: '5', name: 'Mom', phone: '+91-9876543210', category: 'family', relationship: 'Mother' },
    { id: '6', name: 'Dad', phone: '+91-9876543211', category: 'family', relationship: 'Father' },
    { id: '7', name: 'School Office', phone: '+91-11-26001234', category: 'school', relationship: 'Administration' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: '',
    phone: '',
    category: 'family',
    relationship: ''
  });

  const categoryIcons = {
    family: Users,
    medical: Hospital,
    fire: Truck,
    police: Shield,
    school: Users,
    other: Phone
  };

  const categoryColors = {
    family: 'bg-blue-100 text-blue-800',
    medical: 'bg-red-100 text-red-800',
    fire: 'bg-orange-100 text-orange-800',
    police: 'bg-purple-100 text-purple-800',
    school: 'bg-green-100 text-green-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const handleCall = (phone: string, name: string) => {
    // In a real app, this would initiate a phone call
    alert(`Calling ${name} at ${phone}`);
    // window.location.href = `tel:${phone}`;
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone,
        category: newContact.category as EmergencyContact['category'],
        relationship: newContact.relationship,
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: '', phone: '', category: 'family', relationship: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const groupedContacts = contacts.reduce((groups, contact) => {
    const category = contact.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(contact);
    return groups;
  }, {} as Record<string, EmergencyContact[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Emergency Contacts</h1>
              <p className="text-red-100 mt-1">Quick access to emergency services and personal contacts</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-white text-red-600 hover:bg-red-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Quick Emergency Numbers */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-800 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Quick Emergency Numbers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contacts.filter(c => c.isDefault).map((contact) => {
              const IconComponent = categoryIcons[contact.category];
              return (
                <Button
                  key={contact.id}
                  onClick={() => handleCall(contact.phone, contact.name)}
                  className="h-20 flex-col bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  <IconComponent className="w-6 h-6 mb-2" />
                  <span className="font-semibold">{contact.name}</span>
                  <span className="text-xs opacity-90">{contact.phone}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Personal Contacts by Category */}
      {Object.entries(groupedContacts).map(([category, categoryContacts]) => {
        if (categoryContacts.every(c => c.isDefault)) return null;
        
        const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
        const personalContacts = categoryContacts.filter(c => !c.isDefault);
        
        if (personalContacts.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center capitalize">
                <IconComponent className="w-5 h-5 mr-2" />
                {category} Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {personalContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${categoryColors[contact.category]}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.phone}</div>
                      {contact.relationship && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {contact.relationship}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleCall(contact.phone, contact.name)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    {!contact.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Add Contact Form */}
      {showAddForm && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Add New Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={newContact.name || ''}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={newContact.phone || ''}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newContact.category || 'family'}
                  onChange={(e) => setNewContact({ ...newContact, category: e.target.value as EmergencyContact['category'] })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="family">Family</option>
                  <option value="medical">Medical</option>
                  <option value="fire">Fire Department</option>
                  <option value="police">Police</option>
                  <option value="school">School</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Relationship (Optional)</label>
                <Input
                  value={newContact.relationship || ''}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  placeholder="e.g., Mother, Doctor, Teacher"
                />
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button onClick={handleAddContact} className="bg-blue-600 hover:bg-blue-700">
                Add Contact
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewContact({ name: '', phone: '', category: 'family', relationship: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmergencyContacts;