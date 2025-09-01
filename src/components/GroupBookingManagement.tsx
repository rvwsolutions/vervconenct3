import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { useCurrency } from '../context/CurrencyContext';
import { useBranding } from '../context/BrandingContext';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Building,
  Plane,
  Car,
  Utensils,
  FileText,
  Globe,
  Heart,
  Shield,
  Eye,
  Download,
  Upload,
  Copy,
  Settings,
  Star,
  CreditCard,
  Receipt,
  Home
} from 'lucide-react';
import { GroupBooking } from '../types';

interface GroupBookingManagementProps {
  onClose: () => void;
}

export function GroupBookingManagement({ onClose }: GroupBookingManagementProps) {
  const { 
    groupBookings, 
    addGroupBooking, 
    updateGroupBooking, 
    deleteGroupBooking,
    allocateRoomsForGroup,
    confirmGroupBooking,
    rooms
  } = useHotel();
  const { formatCurrency, hotelSettings } = useCurrency();
  const { formatDate, formatDateTime } = useBranding();
  
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<GroupBooking | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<GroupBooking | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'allocation' | 'payments'>('overview');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showForm || showDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showForm, showDetails]);

  const getStatusColor = (status: GroupBooking['status']) => {
    switch (status) {
      case 'inquiry': return 'bg-gray-100 text-gray-800';
      case 'quoted': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case 'pilgrimage': return <Heart className="w-5 h-5" />;
      case 'corporate': return <Building className="w-5 h-5" />;
      case 'wedding': return <Users className="w-5 h-5" />;
      case 'conference': return <FileText className="w-5 h-5" />;
      case 'tour': return <Globe className="w-5 h-5" />;
      case 'family': return <Home className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const GroupBookingForm = () => {
    const [formData, setFormData] = useState({
      groupName: editingBooking?.groupName || '',
      contactPerson: editingBooking?.contactPerson || '',
      contactEmail: editingBooking?.contactEmail || '',
      contactPhone: editingBooking?.contactPhone || '',
      totalGuests: editingBooking?.totalGuests || 300,
      checkIn: editingBooking?.checkIn || '',
      checkOut: editingBooking?.checkOut || '',
      groupType: editingBooking?.groupType || 'pilgrimage',
      totalAmount: editingBooking?.totalAmount || 0,
      currency: editingBooking?.currency || hotelSettings.baseCurrency,
      depositAmount: editingBooking?.depositAmount || 0,
      blockCode: editingBooking?.blockCode || '',
      mealPlan: editingBooking?.mealPlan || 'none',
      specialServices: editingBooking?.specialServices || [],
      religiousRequirements: editingBooking?.religiousRequirements || [],
      languageSupport: editingBooking?.languageSupport || [],
      transportationDetails: editingBooking?.transportationDetails || {
        airportPickup: false,
        localTransport: false,
        specialArrangements: ''
      },
      groupLeader: editingBooking?.groupLeader || {
        name: '',
        email: '',
        phone: ''
      },
      emergencyContact: editingBooking?.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      contractTerms: editingBooking?.contractTerms || '',
      paymentTerms: editingBooking?.paymentTerms || '',
      cancellationPolicy: editingBooking?.cancellationPolicy || '',
      notes: editingBooking?.notes || ''
    });

    const [newService, setNewService] = useState('');
    const [newRequirement, setNewRequirement] = useState('');
    const [newLanguage, setNewLanguage] = useState('');

    const addService = () => {
      if (newService.trim()) {
        setFormData(prev => ({
          ...prev,
          specialServices: [...prev.specialServices, newService.trim()]
        }));
        setNewService('');
      }
    };

    const removeService = (index: number) => {
      setFormData(prev => ({
        ...prev,
        specialServices: prev.specialServices.filter((_, i) => i !== index)
      }));
    };

    const addRequirement = () => {
      if (newRequirement.trim()) {
        setFormData(prev => ({
          ...prev,
          religiousRequirements: [...prev.religiousRequirements, newRequirement.trim()]
        }));
        setNewRequirement('');
      }
    };

    const removeRequirement = (index: number) => {
      setFormData(prev => ({
        ...prev,
        religiousRequirements: prev.religiousRequirements.filter((_, i) => i !== index)
      }));
    };

    const addLanguage = () => {
      if (newLanguage.trim()) {
        setFormData(prev => ({
          ...prev,
          languageSupport: [...prev.languageSupport, newLanguage.trim()]
        }));
        setNewLanguage('');
      }
    };

    const removeLanguage = (index: number) => {
      setFormData(prev => ({
        ...prev,
        languageSupport: prev.languageSupport.filter((_, i) => i !== index)
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (editingBooking) {
        updateGroupBooking(editingBooking.id, formData);
      } else {
        const groupBookingId = addGroupBooking({
          ...formData,
          totalRooms: 0, // Will be calculated during allocation
          status: 'inquiry',
          roomsBlocked: [],
          roomsBooked: []
        });
        
        // Auto-allocate rooms for new bookings
        setTimeout(() => {
          allocateRoomsForGroup(groupBookingId);
        }, 100);
      }
      
      setShowForm(false);
      setEditingBooking(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingBooking ? 'Edit Group Booking' : 'New Group Booking'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingBooking(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                    <input
                      type="text"
                      value={formData.groupName}
                      onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Mecca Pilgrimage Group - Al-Noor Travel"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Group Type</label>
                    <select
                      value={formData.groupType}
                      onChange={(e) => setFormData({ ...formData, groupType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="pilgrimage">Pilgrimage</option>
                      <option value="corporate">Corporate</option>
                      <option value="wedding">Wedding</option>
                      <option value="conference">Conference</option>
                      <option value="tour">Tour Group</option>
                      <option value="family">Family Reunion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Guests</label>
                    <input
                      type="number"
                      value={formData.totalGuests}
                      onChange={(e) => setFormData({ ...formData, totalGuests: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Block Code</label>
                    <input
                      type="text"
                      value={formData.blockCode}
                      onChange={(e) => setFormData({ ...formData, blockCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., MECCA2024-001"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dates and Pricing */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Dates and Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Amount ({hotelSettings.baseCurrency})
                    </label>
                    <input
                      type="number"
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deposit Amount ({hotelSettings.baseCurrency})
                    </label>
                    <input
                      type="number"
                      value={formData.depositAmount}
                      onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Services and Requirements */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Services and Requirements</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Plan</label>
                    <select
                      value={formData.mealPlan}
                      onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="none">No Meals</option>
                      <option value="breakfast">Breakfast Only</option>
                      <option value="half-board">Half Board (Breakfast + Dinner)</option>
                      <option value="full-board">Full Board (All Meals)</option>
                      <option value="all-inclusive">All Inclusive</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.transportationDetails.airportPickup}
                        onChange={(e) => setFormData({
                          ...formData,
                          transportationDetails: {
                            ...formData.transportationDetails,
                            airportPickup: e.target.checked
                          }
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label className="text-sm font-medium text-gray-700">Airport Pickup</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.transportationDetails.localTransport}
                        onChange={(e) => setFormData({
                          ...formData,
                          transportationDetails: {
                            ...formData.transportationDetails,
                            localTransport: e.target.checked
                          }
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label className="text-sm font-medium text-gray-700">Local Transportation</label>
                    </div>
                  </div>
                </div>

                {/* Special Services */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Services</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Add special service"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={addService}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.specialServices.map((service, index) => (
                      <span key={index} className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        <span>{service}</span>
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Religious Requirements */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Religious Requirements</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add religious requirement"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.religiousRequirements.map((requirement, index) => (
                      <span key={index} className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        <span>{requirement}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Language Support */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language Support</label>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add language"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.languageSupport.map((language, index) => (
                      <span key={index} className="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        <span>{language}</span>
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency & Group Leader</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-md font-medium text-gray-900 mb-3">Group Leader</h5>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.groupLeader.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          groupLeader: { ...formData.groupLeader, name: e.target.value }
                        })}
                        placeholder="Group leader name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="email"
                        value={formData.groupLeader.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          groupLeader: { ...formData.groupLeader, email: e.target.value }
                        })}
                        placeholder="Group leader email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="tel"
                        value={formData.groupLeader.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          groupLeader: { ...formData.groupLeader, phone: e.target.value }
                        })}
                        placeholder="Group leader phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-md font-medium text-gray-900 mb-3">Emergency Contact</h5>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.emergencyContact.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                        })}
                        placeholder="Emergency contact name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="tel"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                        })}
                        placeholder="Emergency contact phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => setFormData({
                          ...formData,
                          emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                        })}
                        placeholder="Relationship (e.g., Group Medical Officer)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      placeholder="Any special requirements or notes for this group..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transportation Arrangements</label>
                    <textarea
                      value={formData.transportationDetails.specialArrangements}
                      onChange={(e) => setFormData({
                        ...formData,
                        transportationDetails: {
                          ...formData.transportationDetails,
                          specialArrangements: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      rows={2}
                      placeholder="Special transportation arrangements..."
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBooking(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingBooking ? 'Update Booking' : 'Create Booking'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const GroupBookingDetails = () => {
    if (!selectedBooking) return null;

    const handleAllocateRooms = () => {
      allocateRoomsForGroup(selectedBooking.id);
      // Refresh the selected booking to show updated allocation
      const updatedBooking = groupBookings.find(gb => gb.id === selectedBooking.id);
      if (updatedBooking) {
        setSelectedBooking(updatedBooking);
      }
    };

    const handleConfirmBooking = () => {
      if (selectedBooking.roomAllocation.length === 0) {
        alert('Please allocate rooms first before confirming the booking.');
        return;
      }
      confirmGroupBooking(selectedBooking.id);
      const updatedBooking = groupBookings.find(gb => gb.id === selectedBooking.id);
      if (updatedBooking) {
        setSelectedBooking(updatedBooking);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedBooking.groupName}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                  <span className="text-gray-600">{selectedBooking.totalGuests} guests</span>
                  <span className="text-gray-600">{selectedBooking.totalRooms} rooms needed</span>
                </div>
              </div>
              <div className="flex space-x-4">
                {selectedBooking.status === 'inquiry' && (
                  <button
                    onClick={handleAllocateRooms}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Allocate Rooms</span>
                  </button>
                )}
                {selectedBooking.status === 'quoted' && selectedBooking.roomAllocation.length > 0 && (
                  <button
                    onClick={handleConfirmBooking}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedBooking(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', name: 'Overview', icon: Eye },
                    { id: 'allocation', name: 'Room Allocation', icon: Home },
                    { id: 'payments', name: 'Payments', icon: CreditCard }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {getGroupTypeIcon(selectedBooking.groupType)}
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{selectedBooking.groupType} Group</p>
                        <p className="text-sm text-gray-600">{selectedBooking.blockCode}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-medium">{formatDate(selectedBooking.checkIn)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-medium">{formatDate(selectedBooking.checkOut)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-medium text-green-600">{formatCurrency(selectedBooking.totalAmount, selectedBooking.currency)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deposit</p>
                        <p className="font-medium">{formatCurrency(selectedBooking.depositAmount || 0, selectedBooking.currency)}</p>
                      </div>
                    </div>

                    {selectedBooking.specialServices && selectedBooking.specialServices.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Special Services</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBooking.specialServices.map((service, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedBooking.religiousRequirements && selectedBooking.religiousRequirements.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Religious Requirements</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBooking.religiousRequirements.map((requirement, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {requirement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedBooking.contactPerson}</p>
                        <p className="text-sm text-gray-600">Primary Contact</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedBooking.contactEmail}</p>
                        <p className="text-sm text-gray-600">Email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedBooking.contactPhone}</p>
                        <p className="text-sm text-gray-600">Phone</p>
                      </div>
                    </div>

                    {selectedBooking.emergencyContact && (
                      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                        <h4 className="font-medium text-red-900 mb-2">Emergency Contact</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-red-800">{selectedBooking.emergencyContact.name}</p>
                          <p className="text-red-700">{selectedBooking.emergencyContact.phone}</p>
                          <p className="text-red-600">{selectedBooking.emergencyContact.relationship}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Room Allocation Tab */}
            {activeTab === 'allocation' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Room Allocation</h3>
                  {selectedBooking.roomAllocation.length === 0 && (
                    <button
                      onClick={handleAllocateRooms}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Auto-Allocate Rooms</span>
                    </button>
                  )}
                </div>

                {selectedBooking.roomAllocation.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{selectedBooking.roomAllocation.length}</p>
                          <p className="text-sm text-blue-800">Rooms Allocated</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {selectedBooking.roomAllocation.reduce((sum, room) => sum + room.assignedGuests, 0)}
                          </p>
                          <p className="text-sm text-green-800">Guests Accommodated</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-600">
                            {selectedBooking.totalGuests - selectedBooking.roomAllocation.reduce((sum, room) => sum + room.assignedGuests, 0)}
                          </p>
                          <p className="text-sm text-orange-800">Remaining Guests</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">
                            {((selectedBooking.roomAllocation.reduce((sum, room) => sum + room.assignedGuests, 0) / selectedBooking.totalGuests) * 100).toFixed(1)}%
                          </p>
                          <p className="text-sm text-purple-800">Allocation Complete</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedBooking.roomAllocation.map((allocation) => (
                            <tr key={allocation.roomId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">Room {allocation.roomNumber}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                  {allocation.roomType}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {allocation.maxOccupancy} guests
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {allocation.assignedGuests} guests
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full" 
                                      style={{ width: `${(allocation.assignedGuests / allocation.maxOccupancy) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {Math.round((allocation.assignedGuests / allocation.maxOccupancy) * 100)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Room Allocation</h4>
                    <p className="text-gray-600 mb-6">Rooms have not been allocated for this group yet.</p>
                    <button
                      onClick={handleAllocateRooms}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Allocate Rooms Now</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Schedule</h3>
                
                {selectedBooking.paymentSchedule && selectedBooking.paymentSchedule.length > 0 ? (
                  <div className="space-y-4">
                    {selectedBooking.paymentSchedule.map((payment, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        payment.paid ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{payment.description}</p>
                            <p className="text-sm text-gray-600">Due: {formatDate(payment.dueDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(payment.amount, selectedBooking.currency)}
                            </p>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.paid ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Payment Schedule</h4>
                    <p className="text-gray-600">Payment schedule has not been set up for this booking.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Group Booking Management</h2>
              <p className="text-gray-600 mt-2">Manage large group bookings and room allocations</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Group Booking</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Group Bookings List */}
          <div className="space-y-6">
            {groupBookings.map((groupBooking) => (
              <div key={groupBooking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      {getGroupTypeIcon(groupBooking.groupType)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{groupBooking.groupName}</h3>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(groupBooking.status)}`}>
                          {groupBooking.status.charAt(0).toUpperCase() + groupBooking.status.slice(1)}
                        </span>
                        {groupBooking.groupType === 'pilgrimage' && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            Religious Group
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{groupBooking.totalGuests} guests</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{groupBooking.roomAllocation.length} rooms allocated</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(groupBooking.checkIn)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatCurrency(groupBooking.totalAmount, groupBooking.currency)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Contact: {groupBooking.contactPerson}</span>
                        <span>•</span>
                        <span>{groupBooking.contactPhone}</span>
                        <span>•</span>
                        <span className="capitalize">{groupBooking.groupType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedBooking(groupBooking);
                        setShowDetails(true);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingBooking(groupBooking);
                        setShowForm(true);
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this group booking?')) {
                          deleteGroupBooking(groupBooking.id);
                        }
                      }}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {groupBookings.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Group Bookings</h3>
                <p className="text-gray-600 text-center mb-6">Get started by creating your first group booking</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Group Booking</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && <GroupBookingForm />}
      {showDetails && <GroupBookingDetails />}
    </div>
  );
}