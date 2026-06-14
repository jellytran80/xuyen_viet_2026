import Papa from 'papaparse';
import { STAGES } from '../constants/stages';

export async function fetchRunnerData() {
  const url = process.env.NEXT_PUBLIC_SHEET_URL;
  
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    
    // Convert dữ liệu từ CSV sang JSON
    const parsedData = Papa.parse(csvText, { header: true }).data;
    
    // Xử lý logic tính chặng cho từng runner
    return parsedData.map((row, index) => {
      const totalKm = parseFloat(row['Tổng số KM']) || 0;
      const name = row['Tên Runner'] || `Runner ${index + 1}`;
      
      // Tìm chặng hiện tại dựa trên số KM
      let currentStage = STAGES.find(s => totalKm >= s.startKm && totalKm < s.endKm);
      
      // Nếu vượt quá mốc chặng cuối cùng (đã về đích)
      if (!currentStage && totalKm >= STAGES[STAGES.length - 1].endKm) {
        currentStage = STAGES[STAGES.length - 1];
      }

      const kmInStage = currentStage ? totalKm - currentStage.startKm : 0;
      const kmRemaining = currentStage ? currentStage.endKm - totalKm : 0;
      const percentComplete = currentStage ? Math.min(((totalKm - currentStage.startKm) / currentStage.length) * 100, 100) : 100;

      return {
        name,
        totalKm,
        currentStage: currentStage ? currentStage.name : "Đã về đích",
        landmark: currentStage ? currentStage.landmark : "Cột cờ Hà Nội",
        kmInStage: kmInStage.toFixed(1),
        kmRemaining: Math.max(0, kmRemaining).toFixed(1),
        percentComplete: percentComplete.toFixed(0)
      };
    }).sort((a, b) => b.totalKm - a.totalKm); // Sắp xếp ai chạy nhiều nhất lên đầu bảng
    
  } catch (error) {
    console.error("Lỗi lấy dữ liệu từ Google Sheets:", error);
    return [];
  }
}