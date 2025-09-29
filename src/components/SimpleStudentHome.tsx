import React from 'react';

const SimpleStudentHome = () => {
  console.log('SimpleStudentHome rendering...');
  
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Simple Student Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Welcome to the Student Area!</h2>
          <p className="mb-4">This is a simplified student home page to test routing.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-teal-100 p-4 rounded">
              <h3 className="font-bold">Learning Modules</h3>
              <p>Disaster preparedness courses</p>
            </div>
            <div className="bg-orange-100 p-4 rounded">
              <h3 className="font-bold">Emergency Drills</h3>
              <p>Practice scenarios</p>
            </div>
            <div className="bg-red-100 p-4 rounded">
              <h3 className="font-bold">Emergency Contacts</h3>
              <p>Quick access contacts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStudentHome;