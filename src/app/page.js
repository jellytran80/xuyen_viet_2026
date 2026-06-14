"use client";
import { useEffect, useState } from 'react';
import { fetchRunnerData } from '../utils/dataFetcher';
import { MapPin, Trophy, Navigation } from 'lucide-react';

export default function Home() {
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchRunnerData();
      setRunners(data);
      setLoading(false);
    }
    loadData();
    // Tự động làm mới dữ liệu sau mỗi 5 phút
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-xl font-medium animate-pulse">Đang tải bản đồ xuyên Việt...</p>
      </div>
    );
  }

  return (
    <main className="flex h-screen flex-col md:flex-row bg-gray-900 text-gray-100 font-sans">
      
      {/* CỘT TRÁI: BẢNG XẾP HẠNG & TIẾN ĐỘ THEO TỈNH */}
      <div className="w-full md:w-1/3 border-r border-gray-800 p-4 overflow-y-auto flex flex-col h-1/2 md:h-full">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="text-yellow-500 h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider">Hành Trình 1.500KM</h1>
            <p className="text-xs text-gray-400">Cập nhật tự động từ Ban Tổ Chức</p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {runners.map((runner, index) => (
            <div key={index} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${index === 0 ? 'bg-yellow-500 text-black' : index === 1 ? 'bg-gray-400 text-black' : index === 2 ? 'bg-amber-600 text-white' : 'bg-gray-700'}`}>
                    #{index + 1}
                  </span>
                  <h3 className="font-semibold text-lg">{runner.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-blue-400 font-mono font-bold text-lg">{runner.totalKm}</span>
                  <span className="text-xs text-gray-400 ml-1">km</span>
                </div>
              </div>

              {/* Thanh tiến độ chặng hiện tại */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-red-400" /> {runner.currentStage}</span>
                  <span>Còn {runner.kmRemaining} km đổi tỉnh</span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-500" style={{ width: `${runner.percentComplete}%` }}></div>
                </div>
                <p className="text-[11px] text-gray-500 italic text-right">Mốc: {runner.landmark}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: BẢN ĐỒ VIỆT NAM (LEAFLET) */}
      <div className="w-full md:w-2/3 h-1/2 md:h-full bg-gray-950 flex items-center justify-center relative">
        {/* Để làm bản đồ thật, bạn nạp component Leaflet Map vào đây. 
            Dưới đây là khung chứa chuẩn để bạn tích hợp Map-View */}
        <div className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
          <Navigation className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-sm text-gray-400 max-w-sm">
            [Bản đồ mã nguồn mở Leaflet.js hiển thị tuyến đường QL1A và 30 Markers vị trí thực tế của Runner sẽ hiển thị tại khu vực này].
          </p>
          <div className="mt-4 text-xs bg-gray-900 border border-gray-800 p-2 rounded text-left font-mono">
            Vị trí đầu bảng hiện tại: <span className="text-yellow-400">{runners[0]?.name}</span> đang ở chặng <span className="text-emerald-400">{runners[0]?.currentStage}</span>
          </div>
        </div>
      </div>

    </main>
  );
}