import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Plus, Search, Filter, ChevronDown, MapPin, Phone, Mail, Star, Edit, Trash2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: '',
    comments: '',
    type: 'regular'
  });

  const doctors = [
    { id: 1, name: 'Dr. Hardik Sharma', specialty: 'Cardiologist', rating: 4.8, image: '/api/placeholder/40/40' },
    { id: 2, name: 'Dr. Sarah Johnson', specialty: 'Neurologist', rating: 4.9, image: '/api/placeholder/40/40' },
    { id: 3, name: 'Dr. Michael Chen', specialty: 'Dermatologist', rating: 4.7, image: '/api/placeholder/40/40' },
    { id: 4, name: 'Dr. Emily Davis', specialty: 'Pediatrician', rating: 4.8, image: '/api/placeholder/40/40' },
  ];

  // Appointments state (fetched from backend)
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Create appointment
  const createAppointment = async () => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowNewAppointment(false);
        setFormData({ doctor: '', date: '', time: '', reason: '', comments: '', type: 'regular' });
        fetchAppointments();
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  // Update appointment
  const updateAppointment = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  // Delete appointment
  const deleteAppointment = async (id) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'upcoming' && ['confirmed', 'pending'].includes(appointment.status)) ||
                      (activeTab === 'past' && ['completed', 'cancelled'].includes(appointment.status));
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleSubmit = () => {
    createAppointment();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for edit and cancel buttons (for demo, you can expand as needed)
  const handleEdit = (appointment) => {
    // Example: mark as completed
    updateAppointment(appointment.id, { status: 'completed' });
  };

  const handleCancel = (appointment) => {
    // Example: mark as cancelled
    updateAppointment(appointment.id, { status: 'cancelled' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-24 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Appointments</h1>
              <p className="text-blue-200">Manage your medical appointments</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              {['upcoming', 'past', 'all'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowNewAppointment(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-green-500/25"
            >
              <Plus className="w-4 h-4" />
              New Appointment
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{appointment.doctor}</h3>
                    <p className="text-blue-200 text-sm">{appointment.specialty}</p>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>{appointment.date ? new Date(appointment.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : ''}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{appointment.time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-300">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>{appointment.reason}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{appointment.location}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2" onClick={() => handleEdit(appointment)}>
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2" onClick={() => handleCancel(appointment)}>
                  <Trash2 className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No appointments found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* New Appointment Modal */}
        {showNewAppointment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">New Appointment</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Doctor</label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.name}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Appointment Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="regular">Regular Checkup</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Brief description of your appointment reason..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Additional Comments</label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Any additional notes or preferences..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all"
                  >
                    Book Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewAppointment(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;