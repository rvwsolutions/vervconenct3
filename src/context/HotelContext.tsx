import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Room, Guest, Booking, BanquetHall, BanquetBooking, RestaurantTable, TableReservation, RoomCharge, RoomServiceOrder, BanquetAmenity, GroupBooking } from '../types';

interface HotelContextType {
  // Rooms
  rooms: Room[];
  updateRoomStatus: (roomId: string, status: Room['status']) => void;
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (roomId: string, room: Omit<Room, 'id' | 'status'>) => void;
  deleteRoom: (roomId: string) => void;
  
  // Guests
  guests: Guest[];
  addGuest: (guest: Omit<Guest, 'id' | 'bookingHistory' | 'totalStays'>) => void;
  updateGuest: (guestId: string, guest: Partial<Guest>) => void;
  
  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'charges'>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  addRoomCharge: (bookingId: string, charge: Omit<RoomCharge, 'id'>) => void;
  
  // Group Bookings
  groupBookings: GroupBooking[];
  addGroupBooking: (groupBooking: Omit<GroupBooking, 'id' | 'createdAt' | 'roomAllocation'>) => void;
  updateGroupBooking: (groupBookingId: string, updates: Partial<GroupBooking>) => void;
  deleteGroupBooking: (groupBookingId: string) => void;
  allocateRoomsForGroup: (groupBookingId: string) => void;
  confirmGroupBooking: (groupBookingId: string) => void;
  getUpcomingGroupBookings: (days?: number) => GroupBooking[];
  
  // Banquet
  banquetHalls: BanquetHall[];
  banquetBookings: BanquetBooking[];
  addBanquetBooking: (booking: Omit<BanquetBooking, 'id'>) => void;
  updateBanquetBooking: (bookingId: string, booking: Partial<BanquetBooking>) => void;
  deleteBanquetBooking: (bookingId: string) => void;
  addBanquetHall: (hall: Omit<BanquetHall, 'id'>) => void;
  updateBanquetHall: (hallId: string, hall: Omit<BanquetHall, 'id'>) => void;
  deleteBanquetHall: (hallId: string) => void;
  
  // Banquet Amenities
  banquetAmenities: BanquetAmenity[];
  addBanquetAmenity: (amenity: Omit<BanquetAmenity, 'id' | 'createdAt'>) => void;
  updateBanquetAmenity: (amenityId: string, amenity: Partial<BanquetAmenity>) => void;
  deleteBanquetAmenity: (amenityId: string) => void;
  toggleAmenityStatus: (amenityId: string) => void;
  
  // Restaurant
  restaurantTables: RestaurantTable[];
  tableReservations: TableReservation[];
  updateTableStatus: (tableId: string, status: RestaurantTable['status']) => void;
  addTableReservation: (reservation: Omit<TableReservation, 'id'>) => void;
  addRestaurantTable: (table: Omit<RestaurantTable, 'id'>) => void;
  updateRestaurantTable: (tableId: string, table: Omit<RestaurantTable, 'id' | 'status'>) => void;
  deleteRestaurantTable: (tableId: string) => void;
  
  // Room Service
  roomServiceOrders: RoomServiceOrder[];
  addRoomServiceOrder: (order: Omit<RoomServiceOrder, 'id'>) => void;
  updateRoomServiceOrderStatus: (orderId: string, status: RoomServiceOrder['status']) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Enhanced demo data with VIP rooms and guests
const DEMO_ROOMS: Room[] = [
  { 
    id: '101', 
    number: '101', 
    type: 'single', 
    status: 'clean', 
    rate: 120, 
    photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], 
    amenities: ['WiFi', 'AC', 'TV'],
    smokingAllowed: false,
    floor: 1,
    maxOccupancy: 2,
    size: 25,
    bedType: 'Queen',
    view: 'City'
  },
  { 
    id: '102', 
    number: '102', 
    type: 'double', 
    status: 'occupied', 
    rate: 150, 
    photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], 
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
    smokingAllowed: false,
    floor: 1,
    maxOccupancy: 4,
    size: 35,
    bedType: 'Two Queens',
    view: 'Garden'
  },
  { 
    id: '103', 
    number: '103', 
    type: 'suite', 
    status: 'dirty', 
    rate: 280, 
    photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], 
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'],
    smokingAllowed: false,
    floor: 1,
    maxOccupancy: 6,
    size: 65,
    bedType: 'King + Sofa Bed',
    view: 'Ocean'
  },
  { 
    id: '201', 
    number: '201', 
    type: 'deluxe', 
    status: 'clean', 
    rate: 200, 
    photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], 
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],
    smokingAllowed: true,
    floor: 2,
    maxOccupancy: 4,
    size: 45,
    bedType: 'King',
    view: 'Mountain'
  },
  { 
    id: '202', 
    number: '202', 
    type: 'single', 
    status: 'dirty', 
    rate: 120, 
    photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], 
    amenities: ['WiFi', 'AC', 'TV'],
    smokingAllowed: true,
    floor: 2,
    maxOccupancy: 2,
    size: 25,
    bedType: 'Queen',
    view: 'City'
  },
  { 
    id: '203', 
    number: '203', 
    type: 'double', 
    status: 'maintenance', 
    rate: 150, 
    photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], 
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
    smokingAllowed: false,
    floor: 2,
    maxOccupancy: 4,
    size: 35,
    bedType: 'Two Queens',
    view: 'Garden'
  },
  // VIP Rooms
  { 
    id: '301', 
    number: '301', 
    type: 'suite', 
    status: 'clean', 
    rate: 450, 
    photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], 
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Butler Service'],
    smokingAllowed: false,
    floor: 3,
    maxOccupancy: 6,
    size: 85,
    bedType: 'King + Sofa Bed',
    view: 'Ocean',
    isVipRoom: true,
    vipAmenities: ['Personal Butler', '24/7 Concierge', 'Premium Minibar', 'Champagne Welcome', 'Priority Housekeeping', 'Express Laundry'],
    vipRate: 400, // Special VIP rate (discounted)
    vipMinimumStay: 2,
    vipServices: ['Airport Transfer', 'Daily Newspaper', 'Turndown Service', 'Fresh Flowers']
  },
  { 
    id: '302', 
    number: '302', 
    type: 'deluxe', 
    status: 'clean', 
    rate: 350, 
    photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], 
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Premium Bedding'],
    smokingAllowed: false,
    floor: 3,
    maxOccupancy: 4,
    size: 55,
    bedType: 'King',
    view: 'Ocean',
    isVipRoom: true,
    vipAmenities: ['Personal Concierge', 'Premium Minibar', 'Welcome Amenities', 'Priority Services'],
    vipRate: 320, // Special VIP rate
    vipMinimumStay: 1,
    vipServices: ['Late Checkout', 'Complimentary Breakfast', 'Spa Discount']
  },
  { 
    id: '401', 
    number: '401', 
    type: 'suite', 
    status: 'clean', 
    rate: 650, 
    photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], 
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Private Terrace', 'Butler Service'],
    smokingAllowed: false,
    floor: 4,
    maxOccupancy: 8,
    size: 120,
    bedType: 'King + Queen + Sofa Bed',
    view: 'Panoramic Ocean',
    isVipRoom: true,
    vipAmenities: ['Dedicated Butler', '24/7 Concierge', 'Premium Everything', 'Champagne & Caviar Welcome', 'Private Chef Available', 'Helicopter Transfer'],
    vipRate: 550, // Special VIP rate
    vipMinimumStay: 3,
    vipServices: ['Private Dining', 'Spa Suite Access', 'Yacht Charter Discount', 'Personal Shopping']
  },
  
  // Floor 1 - Additional Standard Rooms
  { id: '104', number: '104', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 1, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '105', number: '105', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 1, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '106', number: '106', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 1, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '107', number: '107', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 1, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '108', number: '108', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 1, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '109', number: '109', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 1, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '110', number: '110', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 1, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },

  // Floor 2 - Additional Rooms
  { id: '204', number: '204', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 2, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '205', number: '205', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 2, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '206', number: '206', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 2, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '207', number: '207', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 2, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '208', number: '208', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 2, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '209', number: '209', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 2, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '210', number: '210', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 2, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },

  // Floor 3 - Mix of Standard and VIP Rooms
  { id: '303', number: '303', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 3, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '304', number: '304', type: 'suite', status: 'clean', rate: 450, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Butler Service'], smokingAllowed: false, floor: 3, maxOccupancy: 6, size: 85, bedType: 'King + Sofa Bed', view: 'Ocean', isVipRoom: true, vipAmenities: ['Personal Butler', '24/7 Concierge', 'Premium Minibar', 'Champagne Welcome'], vipRate: 400, vipMinimumStay: 2, vipServices: ['Airport Transfer', 'Daily Newspaper', 'Turndown Service'] },
  { id: '305', number: '305', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 3, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '306', number: '306', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 3, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '307', number: '307', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 3, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '308', number: '308', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 3, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '309', number: '309', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 3, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '310', number: '310', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 3, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },

  // Floor 4 - Premium and VIP Rooms
  { id: '402', number: '402', type: 'suite', status: 'clean', rate: 650, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Private Terrace', 'Butler Service'], smokingAllowed: false, floor: 4, maxOccupancy: 8, size: 120, bedType: 'King + Queen + Sofa Bed', view: 'Panoramic Ocean', isVipRoom: true, vipAmenities: ['Dedicated Butler', '24/7 Concierge', 'Premium Everything', 'Champagne & Caviar Welcome'], vipRate: 550, vipMinimumStay: 3, vipServices: ['Private Dining', 'Spa Suite Access', 'Yacht Charter Discount'] },
  { id: '403', number: '403', type: 'deluxe', status: 'clean', rate: 350, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Premium Bedding'], smokingAllowed: false, floor: 4, maxOccupancy: 4, size: 55, bedType: 'King', view: 'Ocean', isVipRoom: true, vipAmenities: ['Personal Concierge', 'Premium Minibar', 'Welcome Amenities'], vipRate: 320, vipMinimumStay: 1, vipServices: ['Late Checkout', 'Complimentary Breakfast'] },
  { id: '404', number: '404', type: 'suite', status: 'clean', rate: 450, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Butler Service'], smokingAllowed: false, floor: 4, maxOccupancy: 6, size: 85, bedType: 'King + Sofa Bed', view: 'Ocean', isVipRoom: true, vipAmenities: ['Personal Butler', '24/7 Concierge', 'Premium Minibar'], vipRate: 400, vipMinimumStay: 2, vipServices: ['Airport Transfer', 'Turndown Service'] },
  { id: '405', number: '405', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 4, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '406', number: '406', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 4, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '407', number: '407', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 4, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '408', number: '408', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 4, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '409', number: '409', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 4, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '410', number: '410', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 4, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },

  // Floor 5 - Standard Rooms
  { id: '501', number: '501', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 5, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '502', number: '502', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 5, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '503', number: '503', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 5, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '504', number: '504', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 5, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '505', number: '505', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 5, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '506', number: '506', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 5, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '507', number: '507', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 5, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '508', number: '508', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 5, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '509', number: '509', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 5, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '510', number: '510', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 5, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 6 - Standard Rooms
  { id: '601', number: '601', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 6, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '602', number: '602', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 6, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '603', number: '603', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 6, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '604', number: '604', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 6, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '605', number: '605', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 6, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '606', number: '606', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 6, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '607', number: '607', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 6, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '608', number: '608', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 6, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '609', number: '609', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 6, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '610', number: '610', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 6, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 7 - Standard Rooms
  { id: '701', number: '701', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 7, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '702', number: '702', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 7, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '703', number: '703', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 7, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '704', number: '704', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 7, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '705', number: '705', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 7, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '706', number: '706', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 7, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '707', number: '707', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 7, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '708', number: '708', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 7, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '709', number: '709', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 7, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '710', number: '710', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 7, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 8 - Standard Rooms
  { id: '801', number: '801', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 8, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '802', number: '802', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 8, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '803', number: '803', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 8, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '804', number: '804', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 8, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '805', number: '805', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 8, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '806', number: '806', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 8, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '807', number: '807', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 8, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '808', number: '808', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 8, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '809', number: '809', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 8, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '810', number: '810', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 8, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 9 - Standard Rooms
  { id: '901', number: '901', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 9, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '902', number: '902', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 9, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '903', number: '903', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 9, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '904', number: '904', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 9, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '905', number: '905', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 9, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '906', number: '906', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 9, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '907', number: '907', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 9, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '908', number: '908', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 9, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '909', number: '909', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 9, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '910', number: '910', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 9, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 10 - Standard Rooms
  { id: '1001', number: '1001', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 10, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1002', number: '1002', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 10, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1003', number: '1003', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 10, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1004', number: '1004', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 10, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1005', number: '1005', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 10, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1006', number: '1006', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 10, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1007', number: '1007', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 10, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1008', number: '1008', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 10, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1009', number: '1009', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 10, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1010', number: '1010', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 10, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 11 - Standard Rooms
  { id: '1101', number: '1101', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 11, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1102', number: '1102', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 11, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1103', number: '1103', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 11, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1104', number: '1104', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 11, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1105', number: '1105', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 11, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1106', number: '1106', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 11, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1107', number: '1107', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 11, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1108', number: '1108', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 11, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1109', number: '1109', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 11, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1110', number: '1110', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 11, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 12 - Standard Rooms
  { id: '1201', number: '1201', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 12, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1202', number: '1202', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 12, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1203', number: '1203', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 12, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1204', number: '1204', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 12, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1205', number: '1205', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 12, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1206', number: '1206', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 12, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1207', number: '1207', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 12, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1208', number: '1208', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 12, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1209', number: '1209', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 12, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1210', number: '1210', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 12, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 13 - Standard Rooms
  { id: '1301', number: '1301', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 13, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1302', number: '1302', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 13, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1303', number: '1303', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 13, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1304', number: '1304', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 13, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1305', number: '1305', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 13, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1306', number: '1306', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 13, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1307', number: '1307', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 13, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1308', number: '1308', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 13, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1309', number: '1309', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 13, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1310', number: '1310', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 13, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 14 - Standard Rooms
  { id: '1401', number: '1401', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 14, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1402', number: '1402', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 14, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1403', number: '1403', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 14, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1404', number: '1404', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 14, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1405', number: '1405', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 14, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1406', number: '1406', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 14, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1407', number: '1407', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 14, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1408', number: '1408', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 14, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1409', number: '1409', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 14, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1410', number: '1410', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 14, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 15 - Standard Rooms
  { id: '1501', number: '1501', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 15, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1502', number: '1502', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 15, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1503', number: '1503', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 15, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1504', number: '1504', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 15, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1505', number: '1505', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 15, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1506', number: '1506', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 15, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1507', number: '1507', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 15, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1508', number: '1508', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 15, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1509', number: '1509', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 15, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1510', number: '1510', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 15, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 16 - Standard Rooms
  { id: '1601', number: '1601', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 16, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1602', number: '1602', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 16, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1603', number: '1603', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 16, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1604', number: '1604', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 16, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1605', number: '1605', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 16, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1606', number: '1606', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 16, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1607', number: '1607', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 16, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1608', number: '1608', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 16, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1609', number: '1609', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 16, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1610', number: '1610', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 16, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 17 - Standard Rooms
  { id: '1701', number: '1701', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 17, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1702', number: '1702', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 17, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1703', number: '1703', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 17, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1704', number: '1704', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 17, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1705', number: '1705', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 17, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1706', number: '1706', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 17, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1707', number: '1707', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 17, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1708', number: '1708', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 17, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1709', number: '1709', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 17, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1710', number: '1710', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 17, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 18 - Standard Rooms
  { id: '1801', number: '1801', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 18, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1802', number: '1802', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 18, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1803', number: '1803', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 18, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1804', number: '1804', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 18, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1805', number: '1805', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 18, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1806', number: '1806', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 18, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1807', number: '1807', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 18, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1808', number: '1808', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 18, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1809', number: '1809', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 18, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1810', number: '1810', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 18, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 19 - Standard Rooms
  { id: '1901', number: '1901', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 19, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1902', number: '1902', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 19, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1903', number: '1903', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 19, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1904', number: '1904', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 19, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1905', number: '1905', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 19, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '1906', number: '1906', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 19, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '1907', number: '1907', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 19, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '1908', number: '1908', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 19, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '1909', number: '1909', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 19, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '1910', number: '1910', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 19, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },

  // Floor 20 - Standard Rooms
  { id: '2001', number: '2001', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 20, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '2002', number: '2002', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 20, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '2003', number: '2003', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 20, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '2004', number: '2004', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 20, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '2005', number: '2005', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 20, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Mountain' },
  { id: '2006', number: '2006', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 20, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' },
  { id: '2007', number: '2007', type: 'double', status: 'clean', rate: 150, photos: ['https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], smokingAllowed: false, floor: 20, maxOccupancy: 4, size: 35, bedType: 'Two Queens', view: 'Garden' },
  { id: '2008', number: '2008', type: 'single', status: 'clean', rate: 120, photos: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'], amenities: ['WiFi', 'AC', 'TV'], smokingAllowed: false, floor: 20, maxOccupancy: 2, size: 25, bedType: 'Queen', view: 'City' },
  { id: '2009', number: '2009', type: 'deluxe', status: 'clean', rate: 200, photos: ['https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], smokingAllowed: false, floor: 20, maxOccupancy: 4, size: 45, bedType: 'King', view: 'Ocean' },
  { id: '2010', number: '2010', type: 'suite', status: 'clean', rate: 280, photos: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg'], amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], smokingAllowed: false, floor: 20, maxOccupancy: 6, size: 65, bedType: 'King + Sofa Bed', view: 'Ocean' }
];

const DEMO_GUESTS: Guest[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@email.com', 
    phone: '+1-555-0101', 
    bookingHistory: [], 
    totalStays: 3, 
    lastStayDate: '2024-01-15', 
    preferredCurrency: 'USD',
    title: 'Mr.',
    company: 'Tech Solutions Inc.',
    nationality: 'American',
    address: '123 Main Street, New York, NY 10001, USA',
    dateOfBirth: '1985-06-15',
    vipStatus: false,
    loyaltyPoints: 1250,
    roomPreferences: {
      smokingRoom: false,
      floor: 'high',
      view: 'city',
      bedType: 'king'
    },
    identificationDetails: {
      type: 'passport',
      number: 'US123456789',
      issuingCountry: 'United States',
      expiryDate: '2028-06-15'
    },
    emergencyContactDetails: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1-555-0102',
      email: 'jane.doe@email.com'
    },
    specialRequests: ['Late checkout', 'Extra pillows'],
    dietaryRestrictions: ['Vegetarian'],
    idDocuments: [
      {
        id: '1',
        type: 'passport',
        documentName: 'Passport',
        fileUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
        fileType: 'image',
        fileName: 'passport.jpg',
        uploadedAt: '2024-01-15T10:30:00Z',
        uploadedBy: 'system',
        verified: true,
        verifiedBy: 'admin',
        verifiedAt: '2024-01-15T11:00:00Z',
        expiryDate: '2028-06-15'
      }
    ]
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane@email.com', 
    phone: '+1-555-0102', 
    bookingHistory: [], 
    totalStays: 1, 
    lastStayDate: '2024-01-20', 
    preferredCurrency: 'EUR',
    title: 'Dr.',
    company: 'Medical Associates',
    nationality: 'British',
    address: '456 Oak Avenue, London, UK',
    dateOfBirth: '1978-03-22',
    vipStatus: true,
    vipTier: 'platinum',
    vipSince: '2023-06-15',
    loyaltyPoints: 2800,
    roomPreferences: {
      smokingRoom: false,
      floor: 'any',
      view: 'ocean',
      bedType: 'queen'
    },
    identificationDetails: {
      type: 'passport',
      number: 'GB987654321',
      issuingCountry: 'United Kingdom',
      expiryDate: '2026-03-22'
    },
    emergencyContactDetails: {
      name: 'Robert Smith',
      relationship: 'Brother',
      phone: '+44-20-7946-0958',
      email: 'robert.smith@email.com'
    },
    specialRequests: ['Quiet room', 'High floor'],
    dietaryRestrictions: ['Gluten-free', 'No shellfish'],
    vipBenefits: ['Room Upgrades', 'Late Checkout', 'Complimentary Breakfast', 'Spa Discounts', 'Priority Reservations'],
    personalConcierge: 'concierge-001',
    vipPreferences: {
      preferredRoomType: 'suite',
      preferredFloor: 3,
      preferredAmenities: ['Ocean View', 'Jacuzzi', 'Butler Service'],
      specialServices: ['Airport Transfer', 'Personal Shopping', 'Restaurant Reservations'],
      dietaryRequirements: ['Gluten-free', 'Organic Options'],
      communicationPreference: 'email'
    },
    idDocuments: [
      {
        id: '2',
        type: 'passport',
        documentName: 'Passport',
        fileUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
        fileType: 'image',
        fileName: 'uk_passport.jpg',
        uploadedAt: '2024-01-20T09:15:00Z',
        uploadedBy: 'system',
        verified: true,
        verifiedBy: 'admin',
        verifiedAt: '2024-01-20T10:00:00Z',
        expiryDate: '2026-03-22'
      },
      {
        id: '3',
        type: 'visa',
        documentName: 'Visa Document',
        fileUrl: 'https://example.com/visa.pdf',
        fileType: 'pdf',
        fileName: 'visa_document.pdf',
        uploadedAt: '2024-01-20T09:20:00Z',
        uploadedBy: 'system',
        verified: true,
        verifiedBy: 'admin',
        verifiedAt: '2024-01-20T10:05:00Z',
        expiryDate: '2025-12-31'
      }
    ]
  },
  {
    id: '3',
    name: 'Carlos Rodriguez',
    email: 'carlos@email.com',
    phone: '+1-555-0103',
    bookingHistory: [],
    totalStays: 5,
    lastStayDate: '2024-01-10',
    preferredCurrency: 'USD',
    title: 'Mr.',
    company: 'Rodriguez Construction',
    nationality: 'Mexican',
    address: '789 Pine Street, Los Angeles, CA 90210, USA',
    dateOfBirth: '1982-11-08',
    vipStatus: false,
    loyaltyPoints: 890,
    roomPreferences: {
      smokingRoom: true,
      floor: 'low',
      view: 'garden',
      bedType: 'double'
    },
    identificationDetails: {
      type: 'drivers_license',
      number: 'CA-DL-123456789',
      issuingCountry: 'United States',
      expiryDate: '2027-11-08'
    },
    emergencyContactDetails: {
      name: 'Maria Rodriguez',
      relationship: 'Wife',
      phone: '+1-555-0104',
      email: 'maria.rodriguez@email.com'
    },
    specialRequests: ['Smoking room', 'Ground floor if possible'],
    dietaryRestrictions: []
  },
  // VIP Guests
  {
    id: '4',
    name: 'Alexander Blackwood',
    email: 'alex.blackwood@luxurygroup.com',
    phone: '+1-555-0201',
    bookingHistory: [],
    totalStays: 15,
    lastStayDate: '2024-01-05',
    preferredCurrency: 'USD',
    title: 'Mr.',
    company: 'Blackwood Luxury Group',
    nationality: 'American',
    address: '1 Park Avenue, New York, NY 10016, USA',
    dateOfBirth: '1975-09-12',
    vipStatus: true,
    vipTier: 'diamond',
    vipSince: '2022-01-01',
    loyaltyPoints: 8500,
    roomPreferences: {
      smokingRoom: false,
      floor: 'high',
      view: 'ocean',
      bedType: 'king'
    },
    identificationDetails: {
      type: 'passport',
      number: 'US987654321',
      issuingCountry: 'United States',
      expiryDate: '2029-09-12'
    },
    emergencyContactDetails: {
      name: 'Victoria Blackwood',
      relationship: 'Spouse',
      phone: '+1-555-0202',
      email: 'victoria.blackwood@email.com'
    },
    specialRequests: ['Presidential Suite Only', 'Private Butler', 'Helicopter Transfer'],
    dietaryRestrictions: ['Keto Diet'],
    vipBenefits: ['Presidential Suite Access', 'Private Butler', 'Helicopter Transfer', 'Michelin Star Chef', 'Yacht Charter', 'Private Jet Coordination'],
    personalConcierge: 'concierge-vip-001',
    vipPreferences: {
      preferredRoomType: 'suite',
      preferredFloor: 4,
      preferredAmenities: ['Panoramic Ocean View', 'Private Terrace', 'Butler Service', 'Jacuzzi'],
      specialServices: ['Helicopter Transfer', 'Private Chef', 'Yacht Charter', 'Personal Security'],
      dietaryRequirements: ['Keto-friendly', 'Organic', 'Premium Ingredients'],
      communicationPreference: 'phone'
    },
    idDocuments: [
      {
        id: '4',
        type: 'passport',
        documentName: 'Passport',
        fileUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
        fileType: 'image',
        fileName: 'vip_passport.jpg',
        uploadedAt: '2024-01-05T14:30:00Z',
        uploadedBy: 'concierge-vip-001',
        verified: true,
        verifiedBy: 'admin',
        verifiedAt: '2024-01-05T15:00:00Z',
        expiryDate: '2029-09-12'
      },
      {
        id: '5',
        type: 'other',
        documentName: 'Private Jet License',
        fileUrl: 'https://example.com/jet_license.pdf',
        fileType: 'pdf',
        fileName: 'private_jet_license.pdf',
        uploadedAt: '2024-01-05T14:35:00Z',
        uploadedBy: 'concierge-vip-001',
        verified: true,
        verifiedBy: 'admin',
        verifiedAt: '2024-01-05T15:05:00Z'
      }
    ]
  },
  {
    id: '5',
    name: 'Isabella Chen',
    email: 'isabella.chen@techventures.com',
    phone: '+1-555-0301',
    bookingHistory: [],
    totalStays: 8,
    lastStayDate: '2024-01-12',
    preferredCurrency: 'USD',
    title: 'Ms.',
    company: 'Chen Tech Ventures',
    nationality: 'Singaporean',
    address: '88 Marina Bay, Singapore 018956',
    dateOfBirth: '1988-04-25',
    vipStatus: true,
    vipTier: 'gold',
    vipSince: '2023-03-10',
    loyaltyPoints: 4200,
    roomPreferences: {
      smokingRoom: false,
      floor: 'high',
      view: 'ocean',
      bedType: 'king'
    },
    identificationDetails: {
      type: 'passport',
      number: 'SG123456789',
      issuingCountry: 'Singapore',
      expiryDate: '2028-04-25'
    },
    emergencyContactDetails: {
      name: 'David Chen',
      relationship: 'Brother',
      phone: '+65-9123-4567',
      email: 'david.chen@email.com'
    },
    specialRequests: ['High-speed internet', 'Business center access', 'Quiet environment'],
    dietaryRestrictions: ['Pescatarian'],
    vipBenefits: ['Suite Upgrades', 'Express Check-in/out', 'Complimentary Breakfast', 'Business Center Access', 'Spa Credits'],
    personalConcierge: 'concierge-002',
    vipPreferences: {
      preferredRoomType: 'deluxe',
      preferredFloor: 3,
      preferredAmenities: ['Ocean View', 'High-speed WiFi', 'Work Desk'],
      specialServices: ['Business Support', 'Tech Setup', 'Meeting Room Access'],
      dietaryRequirements: ['Pescatarian', 'Asian Cuisine Options'],
      communicationPreference: 'email'
    },
    idDocuments: [
      {
        id: '6',
        type: 'passport',
        documentName: 'Passport',
        fileUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
        fileType: 'image',
        fileName: 'singapore_passport.jpg',
        uploadedAt: '2024-01-12T11:45:00Z',
        uploadedBy: 'concierge-002',
        verified: true,
        verifiedBy: 'admin',
        verifiedAt: '2024-01-12T12:15:00Z',
        expiryDate: '2028-04-25'
      }
    ]
  }
];

const DEMO_BOOKINGS: Booking[] = [
  {
    id: '1',
    guestId: '1',
    roomId: '102',
    checkIn: '2024-01-22',
    checkOut: '2024-01-25',
    status: 'checked-in',
    totalAmount: 450,
    currency: 'USD',
    charges: [
      { id: '1', description: 'Room Rate (3 nights)', amount: 450, currency: 'USD', date: '2024-01-22', category: 'room' }
    ],
    adults: 2,
    children: 0,
    source: 'direct',
    paymentStatus: 'paid',
    createdAt: '2024-01-20T10:00:00Z',
    confirmationNumber: 'HM2024001'
  }
];

// Default banquet amenities
const DEMO_BANQUET_AMENITIES: BanquetAmenity[] = [
  {
    id: '1',
    name: 'Audio System',
    description: 'Professional sound system with microphones and speakers',
    category: 'audio-visual',
    icon: 'volume-2',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '2',
    name: 'Stage',
    description: 'Elevated platform for presentations and performances',
    category: 'staging',
    icon: 'square',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '3',
    name: 'Lighting',
    description: 'Professional lighting setup with dimming controls',
    category: 'lighting',
    icon: 'lightbulb',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '4',
    name: 'Dance Floor',
    description: 'Polished wooden dance floor area',
    category: 'furniture',
    icon: 'music',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '5',
    name: 'Catering',
    description: 'Full catering service with professional staff',
    category: 'catering',
    icon: 'utensils',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '6',
    name: 'Photography',
    description: 'Professional photography and videography services',
    category: 'service',
    icon: 'camera',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '7',
    name: 'Decorations',
    description: 'Event decoration and floral arrangements',
    category: 'decoration',
    icon: 'flower',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '8',
    name: 'Parking',
    description: 'Dedicated parking spaces for event guests',
    category: 'service',
    icon: 'car',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '9',
    name: 'Projector',
    description: 'High-definition projector with screen',
    category: 'audio-visual',
    icon: 'projector',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '10',
    name: 'Air Conditioning',
    description: 'Climate control system for guest comfort',
    category: 'technology',
    icon: 'wind',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '11',
    name: 'WiFi',
    description: 'High-speed wireless internet access',
    category: 'technology',
    icon: 'wifi',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  },
  {
    id: '12',
    name: 'Bar Setup',
    description: 'Professional bar service with bartender',
    category: 'catering',
    icon: 'wine',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'system'
  }
];

const DEMO_BANQUET_HALLS: BanquetHall[] = [
  { 
    id: '1', 
    name: 'Grand Ballroom', 
    capacity: 200, 
    rate: 50000, 
    photos: [
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg',
      'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg',
      'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg',
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'
    ], 
    amenities: ['Stage', 'Audio System', 'Lighting', 'Dance Floor', 'Catering', 'Photography', 'Decorations', 'Parking']
  },
  { 
    id: '2', 
    name: 'Garden Pavilion', 
    capacity: 100, 
    rate: 30000, 
    photos: [
      'https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg',
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg',
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg'
    ], 
    amenities: ['Decorations', 'Catering', 'Photography']
  },
  {
    id: '3',
    name: 'Crystal Conference Hall',
    capacity: 80,
    rate: 40000,
    photos: [
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg',
      'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg',
      'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg'
    ],
    amenities: ['Projector', 'Audio System', 'Air Conditioning', 'WiFi', 'Catering', 'Parking']
  },
  {
    id: '4',
    name: 'Rooftop Terrace',
    capacity: 150,
    rate: 45000,
    photos: [
      'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      'https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg',
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg'
    ],
    amenities: ['Bar Setup', 'Lighting', 'Catering', 'Photography']
  },
  {
    id: '5',
    name: 'Intimate Dining Room',
    capacity: 40,
    rate: 20000,
    photos: [
      'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg',
      'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg'
    ],
    amenities: ['Audio System', 'Catering']
  }
];

const DEMO_BANQUET_BOOKINGS: BanquetBooking[] = [
  {
    id: '1',
    hallId: '1',
    eventName: 'Johnson Wedding',
    clientName: 'Robert Johnson',
    clientEmail: 'robert@email.com',
    clientPhone: '+1-555-0201',
    date: '2024-02-14',
    startTime: '18:00',
    endTime: '23:00',
    attendees: 150,
    totalAmount: 250000,
    currency: 'INR',
    status: 'confirmed'
  },
  {
    id: '2',
    hallId: '3',
    eventName: 'Corporate Annual Meeting',
    clientName: 'Sarah Williams',
    clientEmail: 'sarah.williams@techcorp.com',
    clientPhone: '+1-555-0202',
    date: '2024-02-20',
    startTime: '09:00',
    endTime: '17:00',
    attendees: 75,
    totalAmount: 320000,
    currency: 'INR',
    status: 'confirmed'
  }
];

const DEMO_RESTAURANT_TABLES: RestaurantTable[] = [
  { id: '1', number: '1', seats: 2, status: 'available', position: { x: 50, y: 50 } },
  { id: '2', number: '2', seats: 4, status: 'occupied', position: { x: 150, y: 50 } },
  { id: '3', number: '3', seats: 6, status: 'reserved', position: { x: 250, y: 50 } },
  { id: '4', number: '4', seats: 2, status: 'available', position: { x: 50, y: 150 } },
  { id: '5', number: '5', seats: 4, status: 'available', position: { x: 150, y: 150 } },
  { id: '6', number: '6', seats: 8, status: 'cleaning', position: { x: 250, y: 150 } },
];

const DEMO_TABLE_RESERVATIONS: TableReservation[] = [
  {
    id: '1',
    tableId: '3',
    guestName: 'Emily Davis',
    guestPhone: '+1-555-0301',
    date: '2024-01-23',
    time: '19:30',
    partySize: 4,
    status: 'confirmed'
  }
];

// Demo Group Bookings
const DEMO_GROUP_BOOKINGS: GroupBooking[] = [
  {
    id: '1',
    groupName: 'Mecca Pilgrimage Group - Al-Noor Travel',
    contactPerson: 'Ahmed Al-Rashid',
    contactEmail: 'ahmed@alnoortravel.com',
    contactPhone: '+966-50-123-4567',
    totalRooms: 75,
    totalGuests: 300,
    checkIn: '2024-03-15',
    checkOut: '2024-03-25',
    status: 'confirmed',
    groupType: 'pilgrimage',
    totalAmount: 450000,
    currency: 'SAR',
    depositAmount: 135000,
    depositPaid: true,
    blockCode: 'MECCA2024-001',
    roomsBlocked: [],
    roomsBooked: [],
    roomAllocation: [],
    mealPlan: 'full-board',
    transportationDetails: {
      airportPickup: true,
      localTransport: true,
      specialArrangements: 'Bus transport to Haram, daily shuttle service'
    },
    groupLeader: {
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@alnoortravel.com',
      phone: '+966-50-123-4567'
    },
    emergencyContact: {
      name: 'Dr. Fatima Al-Zahra',
      phone: '+966-50-987-6543',
      relationship: 'Group Medical Officer'
    },
    specialServices: ['Prayer time notifications', 'Halal meals', 'Qibla direction in rooms', 'Islamic cultural guide'],
    religiousRequirements: ['Halal food only', 'Prayer facilities', 'Qibla direction', 'Separate prayer areas for men/women'],
    languageSupport: ['Arabic', 'English', 'Urdu'],
    documentsRequired: ['Passport', 'Visa', 'Vaccination certificate'],
    visaAssistance: true,
    paymentSchedule: [
      {
        dueDate: '2024-02-15',
        amount: 135000,
        description: 'Deposit (30%)',
        paid: true
      },
      {
        dueDate: '2024-03-01',
        amount: 225000,
        description: 'Second payment (50%)',
        paid: false
      },
      {
        dueDate: '2024-03-15',
        amount: 90000,
        description: 'Final payment (20%)',
        paid: false
      }
    ],
    contractTerms: 'Standard group booking terms with pilgrimage-specific clauses',
    paymentTerms: '30% deposit, 50% 14 days before arrival, 20% on arrival',
    cancellationPolicy: 'Free cancellation up to 30 days before arrival. 50% charge for 15-30 days, full charge for less than 15 days.',
    amenitiesIncluded: ['Prayer mats', 'Qibla compass', 'Islamic calendar', 'Halal minibar'],
    notes: 'Large pilgrimage group requiring special religious accommodations and services',
    createdAt: '2024-01-15T10:00:00Z',
    modifiedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    groupName: 'International Medical Conference 2024',
    contactPerson: 'Dr. Sarah Johnson',
    contactEmail: 'sarah.johnson@medconf2024.org',
    contactPhone: '+1-555-0199',
    totalRooms: 45,
    totalGuests: 120,
    checkIn: '2024-04-10',
    checkOut: '2024-04-14',
    status: 'confirmed',
    groupType: 'conference',
    totalAmount: 180000,
    currency: 'USD',
    depositAmount: 54000,
    depositPaid: true,
    blockCode: 'MEDCONF2024',
    roomsBlocked: [],
    roomsBooked: [],
    roomAllocation: [],
    mealPlan: 'breakfast',
    transportationDetails: {
      airportPickup: true,
      localTransport: false
    },
    groupLeader: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@medconf2024.org',
      phone: '+1-555-0199'
    },
    specialServices: ['Conference facilities', 'AV equipment', 'Business center access', 'High-speed internet'],
    languageSupport: ['English', 'Spanish', 'French'],
    documentsRequired: ['Passport', 'Conference registration'],
    paymentSchedule: [
      {
        dueDate: '2024-02-10',
        amount: 54000,
        description: 'Deposit (30%)',
        paid: true
      },
      {
        dueDate: '2024-04-01',
        amount: 126000,
        description: 'Final payment (70%)',
        paid: false
      }
    ],
    contractTerms: 'Corporate group booking with conference facilities',
    paymentTerms: '30% deposit, 70% 10 days before arrival',
    cancellationPolicy: 'Free cancellation up to 21 days before arrival',
    amenitiesIncluded: ['Business center access', 'Conference materials', 'Welcome reception'],
    notes: 'Medical conference requiring meeting rooms and AV equipment',
    createdAt: '2024-01-10T09:00:00Z'
  }
];

export function HotelProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(DEMO_ROOMS);
  const [guests, setGuests] = useState<Guest[]>(DEMO_GUESTS);
  const [bookings, setBookings] = useState<Booking[]>(DEMO_BOOKINGS);
  const [groupBookings, setGroupBookings] = useState<GroupBooking[]>(DEMO_GROUP_BOOKINGS);
  const [banquetHalls, setBanquetHalls] = useState<BanquetHall[]>(DEMO_BANQUET_HALLS);
  const [banquetBookings, setBanquetBookings] = useState<BanquetBooking[]>(DEMO_BANQUET_BOOKINGS);
  const [banquetAmenities, setBanquetAmenities] = useState<BanquetAmenity[]>(DEMO_BANQUET_AMENITIES);
  const [restaurantTables, setRestaurantTables] = useState<RestaurantTable[]>(DEMO_RESTAURANT_TABLES);
  const [tableReservations, setTableReservations] = useState<TableReservation[]>(DEMO_TABLE_RESERVATIONS);
  const [roomServiceOrders, setRoomServiceOrders] = useState<RoomServiceOrder[]>([]);

  const updateRoomStatus = (roomId: string, status: Room['status']) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, status } : room
    ));
  };

  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: Date.now().toString()
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (roomId: string, roomData: Omit<Room, 'id' | 'status'>) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, ...roomData } : room
    ));
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const addGuest = (guestData: Omit<Guest, 'id' | 'bookingHistory' | 'totalStays'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: Date.now().toString(),
      bookingHistory: [],
      totalStays: 0
    };
    setGuests(prev => [...prev, newGuest]);
  };

  const updateGuest = (guestId: string, guestData: Partial<Guest>) => {
    setGuests(prev => prev.map(guest => 
      guest.id === guestId ? { ...guest, ...guestData } : guest
    ));
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'charges'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      currency: bookingData.currency || 'USD',
      charges: []
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
  };

  // Group Booking Functions
  const addGroupBooking = (groupBookingData: Omit<GroupBooking, 'id' | 'createdAt' | 'roomAllocation'>) => {
    const newGroupBooking: GroupBooking = {
      ...groupBookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      roomAllocation: []
    };
    setGroupBookings(prev => [...prev, newGroupBooking]);
    return newGroupBooking.id;
  };

  const updateGroupBooking = (groupBookingId: string, updates: Partial<GroupBooking>) => {
    setGroupBookings(prev => prev.map(groupBooking => 
      groupBooking.id === groupBookingId 
        ? { ...groupBooking, ...updates, modifiedAt: new Date().toISOString() } 
        : groupBooking
    ));
  };

  const deleteGroupBooking = (groupBookingId: string) => {
    setGroupBookings(prev => prev.filter(groupBooking => groupBooking.id !== groupBookingId));
  };

  const allocateRoomsForGroup = (groupBookingId: string) => {
    const groupBooking = groupBookings.find(gb => gb.id === groupBookingId);
    if (!groupBooking) return;

    // Get available rooms for the booking period
    const availableRooms = rooms.filter(room => {
      // Check if room is available (not occupied, maintenance, or out-of-order)
      if (['occupied', 'maintenance', 'out-of-order'].includes(room.status)) return false;
      
      // Check if room is already booked for these dates
      const isBooked = bookings.some(booking => 
        booking.roomId === room.id &&
        booking.status !== 'cancelled' &&
        !(booking.checkOut <= groupBooking.checkIn || booking.checkIn >= groupBooking.checkOut)
      );
      
      return !isBooked;
    });

    // Sort rooms by capacity (largest first) for efficient allocation
    const sortedRooms = availableRooms.sort((a, b) => (b.maxOccupancy || 2) - (a.maxOccupancy || 2));
    
    let remainingGuests = groupBooking.totalGuests;
    const allocation: GroupBooking['roomAllocation'] = [];
    
    for (const room of sortedRooms) {
      if (remainingGuests <= 0) break;
      
      const roomCapacity = room.maxOccupancy || 2;
      const guestsToAssign = Math.min(remainingGuests, roomCapacity);
      
      allocation.push({
        roomId: room.id,
        roomNumber: room.number,
        roomType: room.type,
        maxOccupancy: roomCapacity,
        assignedGuests: guestsToAssign,
        guestNames: [] // Will be filled when individual guests are assigned
      });
      
      remainingGuests -= guestsToAssign;
    }
    
    // Update the group booking with room allocation
    updateGroupBooking(groupBookingId, {
      roomAllocation: allocation,
      totalRooms: allocation.length,
      roomsBlocked: allocation.map(a => a.roomId)
    });
    
    return allocation;
  };

  const confirmGroupBooking = (groupBookingId: string) => {
    const groupBooking = groupBookings.find(gb => gb.id === groupBookingId);
    if (!groupBooking || groupBooking.roomAllocation.length === 0) return;

    // Create individual bookings for each allocated room
    const newBookings: Booking[] = [];
    
    groupBooking.roomAllocation.forEach((allocation, index) => {
      const booking: Booking = {
        id: `${groupBookingId}-room-${index + 1}`,
        guestId: groupBooking.groupLeader?.name || groupBooking.contactPerson, // Temporary - should be actual guest IDs
        roomId: allocation.roomId,
        checkIn: groupBooking.checkIn,
        checkOut: groupBooking.checkOut,
        status: 'confirmed',
        totalAmount: (groupBooking.totalAmount / groupBooking.roomAllocation.length),
        currency: groupBooking.currency,
        charges: [],
        adults: allocation.assignedGuests,
        children: 0,
        source: 'group-booking',
        paymentStatus: groupBooking.depositPaid ? 'partial' : 'pending',
        createdAt: new Date().toISOString(),
        confirmationNumber: `${groupBooking.blockCode}-${allocation.roomNumber}`,
        groupBookingId: groupBookingId
      };
      newBookings.push(booking);
    });
    
    setBookings(prev => [...prev, ...newBookings]);
    updateGroupBooking(groupBookingId, { 
      status: 'confirmed',
      roomsBooked: groupBooking.roomAllocation.map(a => a.roomId)
    });
  };

  const getUpcomingGroupBookings = (days: number = 30) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    return groupBookings.filter(gb => {
      const checkInDate = new Date(gb.checkIn);
      return checkInDate >= today && checkInDate <= futureDate && gb.status !== 'cancelled';
    });
  };
  const addRoomCharge = (bookingId: string, chargeData: Omit<RoomCharge, 'id'>) => {
    const newCharge: RoomCharge = {
      ...chargeData,
      id: Date.now().toString()
    };
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, charges: [...booking.charges, newCharge] }
        : booking
    ));
  };

  const addBanquetBooking = (bookingData: Omit<BanquetBooking, 'id'>) => {
    const newBooking: BanquetBooking = {
      ...bookingData,
      id: Date.now().toString(),
      currency: bookingData.currency || 'INR'
    };
    setBanquetBookings(prev => [...prev, newBooking]);
  };

  const updateBanquetBooking = (bookingId: string, bookingData: Partial<BanquetBooking>) => {
    setBanquetBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, ...bookingData } : booking
    ));
  };

  const deleteBanquetBooking = (bookingId: string) => {
    setBanquetBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const addBanquetHall = (hallData: Omit<BanquetHall, 'id'>) => {
    const newHall: BanquetHall = {
      ...hallData,
      id: Date.now().toString()
    };
    setBanquetHalls(prev => [...prev, newHall]);
  };

  const updateBanquetHall = (hallId: string, hallData: Omit<BanquetHall, 'id'>) => {
    setBanquetHalls(prev => prev.map(hall => 
      hall.id === hallId ? { ...hall, ...hallData } : hall
    ));
  };

  const deleteBanquetHall = (hallId: string) => {
    setBanquetHalls(prev => prev.filter(hall => hall.id !== hallId));
  };

  // Banquet Amenities Management
  const addBanquetAmenity = (amenityData: Omit<BanquetAmenity, 'id' | 'createdAt'>) => {
    const newAmenity: BanquetAmenity = {
      ...amenityData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setBanquetAmenities(prev => [...prev, newAmenity]);
  };

  const updateBanquetAmenity = (amenityId: string, amenityData: Partial<BanquetAmenity>) => {
    setBanquetAmenities(prev => prev.map(amenity => 
      amenity.id === amenityId 
        ? { 
            ...amenity, 
            ...amenityData, 
            lastModified: new Date().toISOString(),
            modifiedBy: 'admin' // In a real app, this would be the current user
          } 
        : amenity
    ));
  };

  const deleteBanquetAmenity = (amenityId: string) => {
    setBanquetAmenities(prev => prev.filter(amenity => amenity.id !== amenityId));
  };

  const toggleAmenityStatus = (amenityId: string) => {
    setBanquetAmenities(prev => prev.map(amenity => 
      amenity.id === amenityId 
        ? { 
            ...amenity, 
            isActive: !amenity.isActive,
            lastModified: new Date().toISOString(),
            modifiedBy: 'admin'
          } 
        : amenity
    ));
  };

  const updateTableStatus = (tableId: string, status: RestaurantTable['status']) => {
    setRestaurantTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, status } : table
    ));
  };

  const addTableReservation = (reservationData: Omit<TableReservation, 'id'>) => {
    const newReservation: TableReservation = {
      ...reservationData,
      id: Date.now().toString()
    };
    setTableReservations(prev => [...prev, newReservation]);
  };

  const addRestaurantTable = (tableData: Omit<RestaurantTable, 'id'>) => {
    const newTable: RestaurantTable = {
      ...tableData,
      id: Date.now().toString()
    };
    setRestaurantTables(prev => [...prev, newTable]);
  };

  const updateRestaurantTable = (tableId: string, tableData: Omit<RestaurantTable, 'id' | 'status'>) => {
    setRestaurantTables(prev => prev.map(table => 
      table.id === tableId ? { ...table, ...tableData } : table
    ));
  };

  const deleteRestaurantTable = (tableId: string) => {
    setRestaurantTables(prev => prev.filter(table => table.id !== tableId));
  };

  const addRoomServiceOrder = (orderData: Omit<RoomServiceOrder, 'id'>) => {
    const newOrder: RoomServiceOrder = {
      ...orderData,
      id: Date.now().toString()
    };
    setRoomServiceOrders(prev => [...prev, newOrder]);
  };

  const updateRoomServiceOrderStatus = (orderId: string, status: RoomServiceOrder['status']) => {
    setRoomServiceOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  return (
    <HotelContext.Provider value={{
      rooms,
      updateRoomStatus,
      addRoom,
      updateRoom,
      deleteRoom,
      guests,
      addGuest,
      updateGuest,
      bookings,
      addBooking,
      updateBookingStatus,
      addRoomCharge,
      groupBookings,
      addGroupBooking,
      updateGroupBooking,
      deleteGroupBooking,
      allocateRoomsForGroup,
      confirmGroupBooking,
      getUpcomingGroupBookings,
      banquetHalls,
      banquetBookings,
      addBanquetBooking,
      updateBanquetBooking,
      deleteBanquetBooking,
      addBanquetHall,
      updateBanquetHall,
      deleteBanquetHall,
      banquetAmenities,
      addBanquetAmenity,
      updateBanquetAmenity,
      deleteBanquetAmenity,
      toggleAmenityStatus,
      restaurantTables,
      tableReservations,
      updateTableStatus,
      addTableReservation,
      addRestaurantTable,
      updateRestaurantTable,
      deleteRestaurantTable,
      roomServiceOrders,
      addRoomServiceOrder,
      updateRoomServiceOrderStatus
    }}>
      {children}
    </HotelContext.Provider>
  );
}

export function useHotel() {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
}