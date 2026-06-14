"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Sửa lỗi icon marker của Leaflet bị mất hình khi build
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapComponent({ runners }) {
  // Tọa độ trung tâm bản đồ (Ví dụ: Khúc miền Trung Quy Nhơn/Đà Nẵng để nhìn bao quát toàn bộ QL1A)
  const centerPosition = [16.047079, 108.206230]; 

  return (
    <MapContainer center={centerPosition} zoom={6} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Vòng lặp vẽ vị trí của 30 runner lên bản đồ ở đây dựa trên tọa độ */}
      {/* Hiện tại bạn có thể để trống hoặc test cắm tạm 1 điểm */}
    </MapContainer>
  );
}