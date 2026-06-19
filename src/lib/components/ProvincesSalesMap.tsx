"use client"

import { useState, useMemo, useEffect } from "react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { ComposableMap, Geographies, Geography, Annotation } from "react-simple-maps";

interface CityData {
  id: number;
  name: string;
  amount: number;
  percentage: number;
  growth: number;
}

interface ProvinceData {
  name: string;
  totalAmount: number;
  growth: number;
  cities: CityData[];
}

const provincesData: Record<string, ProvinceData> = {
  اصفهان: {
    name: "اصفهان",
    totalAmount: 14000000,
    growth: 2.76,
    cities: [
      { id: 1, name: "اصفهان", amount: 12650000, percentage: 10, growth: 0.5 },
      { id: 2, name: "کاشان", amount: 8180000, percentage: 10, growth: 0.5 },
      { id: 3, name: "خمینی‌شهر", amount: 7920000, percentage: 10, growth: 0.5 },
      { id: 4, name: "نجف‌آباد", amount: 6850000, percentage: 10, growth: 0.5 },
      { id: 5, name: "شاهین‌شهر", amount: 6780000, percentage: 10, growth: 0.5 },
      { id: 6, name: "مبارکه", amount: 5340000, percentage: 10, growth: 0.5 },
      { id: 7, name: "زرین‌شهر", amount: 5210000, percentage: 10, growth: 0.5 },
      { id: 8, name: "آران و بیدگل", amount: 4980000, percentage: 10, growth: 0.5 },
      { id: 9, name: "فلاورجان", amount: 4650000, percentage: 10, growth: 0.5 },
    ],
  },
  تهران: {
    name: "تهران",
    totalAmount: 35000000,
    growth: 5.2,
    cities: [
      { id: 1, name: "تهران", amount: 25000000, percentage: 15, growth: 1.2 },
      { id: 2, name: "کرج", amount: 8000000, percentage: 8, growth: 0.8 },
      { id: 3, name: "ورامین", amount: 2000000, percentage: 5, growth: 0.5 },
    ],
  },
  خراسان_رضوی: {
    name: "خراسان رضوی",
    totalAmount: 18000000,
    growth: 3.5,
    cities: [
      { id: 1, name: "مشهد", amount: 15000000, percentage: 12, growth: 0.9 },
      { id: 2, name: "نیشابور", amount: 2000000, percentage: 6, growth: 0.4 },
      { id: 3, name: "سبزوار", amount: 1000000, percentage: 4, growth: 0.3 },
    ],
  },
  فارس: {
    name: "فارس",
    totalAmount: 16000000,
    growth: 4.1,
    cities: [
      { id: 1, name: "شیراز", amount: 13000000, percentage: 11, growth: 0.7 },
      { id: 2, name: "مرودشت", amount: 2000000, percentage: 5, growth: 0.3 },
      { id: 3, name: "کازرون", amount: 1000000, percentage: 3, growth: 0.2 },
    ],
  },
  آذربایجان_شرقی: {
    name: "آذربایجان شرقی",
    totalAmount: 14500000,
    growth: 2.8,
    cities: [
      { id: 1, name: "تبریز", amount: 12000000, percentage: 10, growth: 0.6 },
      { id: 2, name: "مراغه", amount: 1500000, percentage: 4, growth: 0.3 },
      { id: 3, name: "میانه", amount: 1000000, percentage: 3, growth: 0.2 },
    ],
  },
  خوزستان: {
    name: "خوزستان",
    totalAmount: 12500000,
    growth: 3.2,
    cities: [
      { id: 1, name: "اهواز", amount: 8000000, percentage: 12, growth: 1.1 },
      { id: 2, name: "آبادان", amount: 2500000, percentage: 7, growth: 0.6 },
      { id: 3, name: "دزفول", amount: 1200000, percentage: 5, growth: 0.4 },
      { id: 4, name: "خرمشهر", amount: 800000, percentage: 3, growth: 0.2 },
    ],
  },
  مازندران: {
    name: "مازندران",
    totalAmount: 11000000,
    growth: 4.5,
    cities: [
      { id: 1, name: "ساری", amount: 4500000, percentage: 9, growth: 1.2 },
      { id: 2, name: "بابل", amount: 3000000, percentage: 8, growth: 0.9 },
      { id: 3, name: "آمل", amount: 2000000, percentage: 6, growth: 0.7 },
      { id: 4, name: "قائم‌شهر", amount: 1500000, percentage: 5, growth: 0.5 },
    ],
  },
  گیلان: {
    name: "گیلان",
    totalAmount: 10500000,
    growth: 3.8,
    cities: [
      { id: 1, name: "رشت", amount: 7000000, percentage: 11, growth: 1.0 },
      { id: 2, name: "بندر انزلی", amount: 2000000, percentage: 6, growth: 0.5 },
      { id: 3, name: "لاهیجان", amount: 1500000, percentage: 4, growth: 0.3 },
    ],
  },
  آذربایجان_غربی: {
    name: "آذربایجان غربی",
    totalAmount: 9800000,
    growth: 2.5,
    cities: [
      { id: 1, name: "ارومیه", amount: 6500000, percentage: 10, growth: 0.8 },
      { id: 2, name: "خوی", amount: 2000000, percentage: 6, growth: 0.4 },
      { id: 3, name: "مهاباد", amount: 1300000, percentage: 4, growth: 0.3 },
    ],
  },
  کرمان: {
    name: "کرمان",
    totalAmount: 9200000,
    growth: 3.4,
    cities: [
      { id: 1, name: "کرمان", amount: 6000000, percentage: 9, growth: 0.9 },
      { id: 2, name: "رفسنجان", amount: 2000000, percentage: 6, growth: 0.5 },
      { id: 3, name: "سیرجان", amount: 1200000, percentage: 4, growth: 0.3 },
    ],
  },
  البرز: {
    name: "البرز",
    totalAmount: 13500000,
    growth: 4.8,
    cities: [
      { id: 1, name: "کرج", amount: 10000000, percentage: 13, growth: 1.3 },
      { id: 2, name: "ساوجبلاغ", amount: 2000000, percentage: 6, growth: 0.6 },
      { id: 3, name: "نظرآباد", amount: 1500000, percentage: 5, growth: 0.4 },
    ],
  },
  همدان: {
    name: "همدان",
    totalAmount: 7500000,
    growth: 2.9,
    cities: [
      { id: 1, name: "همدان", amount: 5000000, percentage: 8, growth: 0.7 },
      { id: 2, name: "ملایر", amount: 1500000, percentage: 5, growth: 0.4 },
      { id: 3, name: "نهاوند", amount: 1000000, percentage: 3, growth: 0.2 },
    ],
  },
  کرمانشاه: {
    name: "کرمانشاه",
    totalAmount: 8200000,
    growth: 3.1,
    cities: [
      { id: 1, name: "کرمانشاه", amount: 5500000, percentage: 9, growth: 0.8 },
      { id: 2, name: "اسلام‌آباد غرب", amount: 1500000, percentage: 5, growth: 0.4 },
      { id: 3, name: "سنقر", amount: 1200000, percentage: 4, growth: 0.3 },
    ],
  },
  هرمزگان: {
    name: "هرمزگان",
    totalAmount: 8800000,
    growth: 4.2,
    cities: [
      { id: 1, name: "بندرعباس", amount: 5000000, percentage: 10, growth: 1.0 },
      { id: 2, name: "قشم", amount: 2000000, percentage: 6, growth: 0.6 },
      { id: 3, name: "میناب", amount: 1000000, percentage: 4, growth: 0.4 },
      { id: 4, name: "کیش", amount: 800000, percentage: 3, growth: 0.3 },
    ],
  },
  قزوین: {
    name: "قزوین",
    totalAmount: 7200000,
    growth: 3.3,
    cities: [
      { id: 1, name: "قزوین", amount: 5000000, percentage: 8, growth: 0.7 },
      { id: 2, name: "تاکستان", amount: 1500000, percentage: 5, growth: 0.4 },
      { id: 3, name: "آبیک", amount: 700000, percentage: 3, growth: 0.2 },
    ],
  },
  یزد: {
    name: "یزد",
    totalAmount: 6800000,
    growth: 2.7,
    cities: [
      { id: 1, name: "یزد", amount: 4500000, percentage: 8, growth: 0.6 },
      { id: 2, name: "میبد", amount: 1300000, percentage: 4, growth: 0.3 },
      { id: 3, name: "اردکان", amount: 1000000, percentage: 3, growth: 0.2 },
    ],
  },
  قم: {
    name: "قم",
    totalAmount: 8500000,
    growth: 3.9,
    cities: [
      { id: 1, name: "قم", amount: 7500000, percentage: 11, growth: 1.0 },
      { id: 2, name: "جعفریه", amount: 1000000, percentage: 4, growth: 0.3 },
    ],
  },
  مرکزی: {
    name: "مرکزی",
    totalAmount: 6500000,
    growth: 2.8,
    cities: [
      { id: 1, name: "اراک", amount: 4000000, percentage: 7, growth: 0.6 },
      { id: 2, name: "ساوه", amount: 1500000, percentage: 5, growth: 0.4 },
      { id: 3, name: "خمین", amount: 1000000, percentage: 3, growth: 0.2 },
    ],
  },
  گلستان: {
    name: "گلستان",
    totalAmount: 7800000,
    growth: 3.6,
    cities: [
      { id: 1, name: "گرگان", amount: 4500000, percentage: 8, growth: 0.8 },
      { id: 2, name: "گنبد کاووس", amount: 2000000, percentage: 6, growth: 0.5 },
      { id: 3, name: "بندر ترکمن", amount: 1300000, percentage: 4, growth: 0.3 },
    ],
  },
  لرستان: {
    name: "لرستان",
    totalAmount: 6200000,
    growth: 2.6,
    cities: [
      { id: 1, name: "خرم‌آباد", amount: 3500000, percentage: 7, growth: 0.5 },
      { id: 2, name: "بروجرد", amount: 1800000, percentage: 5, growth: 0.4 },
      { id: 3, name: "دورود", amount: 900000, percentage: 3, growth: 0.2 },
    ],
  },
  سمنان: {
    name: "سمنان",
    totalAmount: 5800000,
    growth: 2.9,
    cities: [
      { id: 1, name: "سمنان", amount: 3000000, percentage: 6, growth: 0.5 },
      { id: 2, name: "شاهرود", amount: 1800000, percentage: 5, growth: 0.4 },
      { id: 3, name: "دامغان", amount: 1000000, percentage: 3, growth: 0.2 },
    ],
  },
  کردستان: {
    name: "کردستان",
    totalAmount: 5500000,
    growth: 2.4,
    cities: [
      { id: 1, name: "سنندج", amount: 3500000, percentage: 7, growth: 0.5 },
      { id: 2, name: "مریوان", amount: 1200000, percentage: 4, growth: 0.3 },
      { id: 3, name: "بانه", amount: 800000, percentage: 3, growth: 0.2 },
    ],
  },
  بوشهر: {
    name: "بوشهر",
    totalAmount: 6700000,
    growth: 3.7,
    cities: [
      { id: 1, name: "بوشهر", amount: 4000000, percentage: 8, growth: 0.7 },
      { id: 2, name: "برازجان", amount: 1500000, percentage: 5, growth: 0.4 },
      { id: 3, name: "گناوه", amount: 1200000, percentage: 4, growth: 0.3 },
    ],
  },
  زنجان: {
    name: "زنجان",
    totalAmount: 5200000,
    growth: 2.5,
    cities: [
      { id: 1, name: "زنجان", amount: 3500000, percentage: 7, growth: 0.5 },
      { id: 2, name: "ابهر", amount: 1000000, percentage: 3, growth: 0.3 },
      { id: 3, name: "خدابنده", amount: 700000, percentage: 2, growth: 0.2 },
    ],
  },
  اردبیل: {
    name: "اردبیل",
    totalAmount: 5600000,
    growth: 2.8,
    cities: [
      { id: 1, name: "اردبیل", amount: 3500000, percentage: 7, growth: 0.6 },
      { id: 2, name: "مشگین‌شهر", amount: 1200000, percentage: 4, growth: 0.3 },
      { id: 3, name: "پارس‌آباد", amount: 900000, percentage: 3, growth: 0.2 },
    ],
  },
  چهارمحال_و_بختیاری: {
    name: "چهارمحال و بختیاری",
    totalAmount: 4200000,
    growth: 2.1,
    cities: [
      { id: 1, name: "شهرکرد", amount: 2500000, percentage: 6, growth: 0.4 },
      { id: 2, name: "بروجن", amount: 1000000, percentage: 3, growth: 0.3 },
      { id: 3, name: "فارسان", amount: 700000, percentage: 2, growth: 0.2 },
    ],
  },
  کهگیلویه_و_بویراحمد: {
    name: "کهگیلویه و بویراحمد",
    totalAmount: 3800000,
    growth: 2.0,
    cities: [
      { id: 1, name: "یاسوج", amount: 2200000, percentage: 5, growth: 0.4 },
      { id: 2, name: "دوگنبدان", amount: 900000, percentage: 3, growth: 0.2 },
      { id: 3, name: "دهدشت", amount: 700000, percentage: 2, growth: 0.2 },
    ],
  },
  سیستان_و_بلوچستان: {
    name: "سیستان و بلوچستان",
    totalAmount: 4500000,
    growth: 1.8,
    cities: [
      { id: 1, name: "زاهدان", amount: 2500000, percentage: 6, growth: 0.4 },
      { id: 2, name: "زابل", amount: 1000000, percentage: 3, growth: 0.2 },
      { id: 3, name: "چابهار", amount: 1000000, percentage: 3, growth: 0.3 },
    ],
  },
  ایلام: {
    name: "ایلام",
    totalAmount: 3500000,
    growth: 1.9,
    cities: [
      { id: 1, name: "ایلام", amount: 2000000, percentage: 5, growth: 0.3 },
      { id: 2, name: "دهلران", amount: 900000, percentage: 3, growth: 0.2 },
      { id: 3, name: "مهران", amount: 600000, percentage: 2, growth: 0.2 },
    ],
  },
  خراسان_شمالی: {
    name: "خراسان شمالی",
    totalAmount: 4000000,
    growth: 2.2,
    cities: [
      { id: 1, name: "بجنورد", amount: 2500000, percentage: 5, growth: 0.4 },
      { id: 2, name: "شیروان", amount: 900000, percentage: 3, growth: 0.2 },
      { id: 3, name: "اسفراین", amount: 600000, percentage: 2, growth: 0.2 },
    ],
  },
  خراسان_جنوبی: {
    name: "خراسان جنوبی",
    totalAmount: 3900000,
    growth: 2.1,
    cities: [
      { id: 1, name: "بیرجند", amount: 2300000, percentage: 5, growth: 0.4 },
      { id: 2, name: "قائنات", amount: 1000000, percentage: 3, growth: 0.2 },
      { id: 3, name: "فردوس", amount: 600000, percentage: 2, growth: 0.2 },
    ],
  },
};

// نقشه نام‌های فارسی به نام‌های استان‌های GeoJSON
const provinceNameMapping: Record<string, string> = {
  "East Azarbaijan": "آذربایجان_شرقی",
  "West Azarbaijan": "آذربایجان_غربی",
  "Ardabil": "اردبیل",
  "Isfahan": "اصفهان",
  "Alborz": "البرز",
  "Ilam": "ایلام",
  "Bushehr": "بوشهر",
  "Tehran": "تهران",
  "Chahar Mahall and Bakhtiari": "چهارمحال_و_بختیاری",
  "South Khorasan": "خراسان_جنوبی",
  "Razavi Khorasan": "خراسان_رضوی",
  "North Khorasan": "خراسان_شمالی",
  "Khuzestan": "خوزستان",
  "Zanjan": "زنجان",
  "Semnan": "سمنان",
  "Sistan and Baluchestan": "سیستان_و_بلوچستان",
  "Fars": "فارس",
  "Qazvin": "قزوین",
  "Qom": "قم",
  "Kurdistan": "کردستان",
  "Kerman": "کرمان",
  "Kermanshah": "کرمانشاه",
  "Kohgiluyeh and Boyer-Ahmad": "کهگیلویه_و_بویراحمد",
  "Golestan": "گلستان",
  "Gilan": "گیلان",
  "Lorestan": "لرستان",
  "Mazandaran": "مازندران",
  "Markazi": "مرکزی",
  "Hormozgan": "هرمزگان",
  "Hamadan": "همدان",
  "Yazd": "یزد",
};

export function ProvincesSalesMap() {
  const colors = useCurrentColors();
  const [selectedProvince, setSelectedProvince] = useState<string>("اصفهان");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [geoData, setGeoData] = useState<any>(null);
  const [showLabels, setShowLabels] = useState(false);
  const [showProvinceNames, setShowProvinceNames] = useState(false);

  const provinceData = provincesData[selectedProvince] || {
    name: selectedProvince || "استان",
    totalAmount: 0,
    growth: 0,
    cities: [],
  };

  // بارگذاری GeoJSON
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/iran-provinces.geojson")
      .then(response => response.json())
      .then(data => setGeoData(data))
      .catch(error => console.error("Error loading GeoJSON:", error));
  }, []);

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    return provinceData.cities.filter((city) =>
      city.name.includes(searchQuery)
    );
  }, [provinceData.cities, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredCities.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredCities.slice(startIndex, endIndex);

  const formatNumber = (num: number) => {
    return num.toLocaleString("fa-IR");
  };

  // فرمت کوتاه برای نمایش روی نقشه
  const formatCompactNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // محاسبه رنگ بر اساس میزان فروش
  const getProvinceColor = (provinceName: string) => {
    const provinceKey = provinceNameMapping[provinceName];
    const provinceInfo = provincesData[provinceKey];
    
    // اگر استان انتخاب شده است
    if (selectedProvince === provinceKey || selectedProvince === provinceName) {
      return colors.primary;
    }
    
    if (!provinceInfo) {
      // استان‌های بدون داده - خاکستری روشن
      return colors.backgroundSecondary;
    }

    const maxAmount = Math.max(...Object.values(provincesData).map(p => p.totalAmount));
    const intensity = provinceInfo.totalAmount / maxAmount;

    // رنگ بر اساس میزان فروش (از روشن به تیره)
    const alpha = Math.max(0.2, intensity);
    return `${colors.primary}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
      }}
      dir="rtl"
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between flex-wrap gap-2"
        style={{ borderColor: colors.border }}
      >
        <h2
          className="text-lg md:text-xl font-semibold"
          style={{ color: colors.textPrimary }}
        >
          نقشه فروش استانی
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Map Section */}
        <div
          className="p-8 border-b lg:border-b-0 lg:border-l flex items-center justify-center"
          style={{ borderColor: colors.border, minHeight: "500px" }}
        >
          {geoData ? (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 2000,
                center: [53.5, 32.5],
              }}
              width={800}
              height={600}
              style={{ width: "100%", height: "auto", maxHeight: "450px" }}
            >
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo: any) => {
                    const provinceName = geo.properties.name;
                    const provinceKey = provinceNameMapping[provinceName];
                    const isSelected = selectedProvince === provinceKey || selectedProvince === provinceName;
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getProvinceColor(provinceName)}
                        stroke={isSelected ? "#FFD700" : colors.border}
                        strokeWidth={isSelected ? 2.5 : 0.5}
                        style={{
                          default: { 
                            outline: "none",
                            transition: "all 0.3s ease",
                            filter: isSelected ? "drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))" : "none",
                            cursor: "pointer"
                          },
                          hover: { 
                            fill: colors.primary,
                            outline: "none",
                            cursor: "pointer",
                            stroke: "#FFD700",
                            strokeWidth: 2,
                            filter: "drop-shadow(0 0 3px rgba(255, 215, 0, 0.4))"
                          },
                          pressed: { 
                            outline: "none",
                            fill: colors.primary
                          },
                        }}
                        onClick={(e) => {
                          // جلوگیری از propagation
                          e.stopPropagation();
                          
                          // همه استان‌ها قابل انتخاب هستند - حتی بدون داده
                          if (provinceKey) {
                            console.log("Province clicked:", provinceName, "->", provinceKey);
                            setSelectedProvince(provinceKey);
                            setCurrentPage(1);
                          } else {
                            // اگر mapping نداشت، از provinceName استفاده می‌کنیم
                            console.log("Province clicked (fallback):", provinceName);
                            setSelectedProvince(provinceName);
                            setCurrentPage(1);
                          }
                        }}
                      />
                    );
                  })
                }
              </Geographies>
              
              {/* نمایش labels روی نقشه */}
              {showLabels && geoData && geoData.features.map((feature: any) => {
                const provinceName = feature.properties.name;
                const provinceKey = provinceNameMapping[provinceName];
                const provinceInfo = provincesData[provinceKey];
                
                if (!provinceInfo) return null;
                
                // محاسبه مرکز استان (centroid)
                const centroid = feature.properties.centroid || feature.geometry.coordinates[0];
                
                return (
                  <Annotation
                    key={`label-${provinceName}`}
                    subject={centroid}
                    dx={0}
                    dy={showProvinceNames ? 5 : 0}
                    style={{ pointerEvents: "none" }}
                    connectorProps={{}}
                  >
                    <text
                      textAnchor="middle"
                      style={{
                        fill: selectedProvince === provinceKey ? "#ffffff" : colors.textPrimary,
                        fontSize: "10px",
                        fontWeight: "bold",
                        pointerEvents: "none",
                        textShadow: "0px 0px 3px rgba(0,0,0,0.5)",
                        userSelect: "none"
                      }}
                    >
                      {formatCompactNumber(provinceInfo.totalAmount)}
                    </text>
                  </Annotation>
                );
              })}
              
              {/* نمایش نام استان‌ها روی نقشه */}
              {showProvinceNames && geoData && geoData.features.map((feature: any) => {
                const provinceName = feature.properties.name;
                const provinceKey = provinceNameMapping[provinceName];
                const provinceInfo = provincesData[provinceKey];
                
                // محاسبه مرکز استان (centroid)
                const centroid = feature.properties.centroid || feature.geometry.coordinates[0];
                
                return (
                  <Annotation
                    key={`name-${provinceName}`}
                    subject={centroid}
                    dx={0}
                    dy={showLabels ? -6 : 0}
                    style={{ pointerEvents: "none" }}
                    connectorProps={{}}
                  >
                    <text
                      textAnchor="middle"
                      style={{
                        fill: selectedProvince === provinceKey ? "#ffffff" : colors.textSecondary,
                        fontSize: "9px",
                        fontWeight: provinceInfo ? "600" : "normal",
                        pointerEvents: "none",
                        textShadow: "0px 0px 3px rgba(0,0,0,0.5)",
                        opacity: provinceInfo ? 1 : 0.7,
                        userSelect: "none"
                      }}
                    >
                      {provinceInfo ? provinceInfo.name : provinceName}
                    </text>
                  </Annotation>
                );
              })}
            </ComposableMap>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p style={{ color: colors.textSecondary }}>در حال بارگذاری نقشه...</p>
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="flex flex-col">
          {/* Province Header */}
          <div className="p-6 border-b" style={{ borderColor: colors.border }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  فروش در استان {provinceData.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: provinceData.growth > 0 ? `${colors.success}22` : `${colors.error}22`,
                      color: provinceData.growth > 0 ? colors.success : colors.error,
                    }}
                  >
                    {provinceData.growth > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{formatNumber(Math.abs(provinceData.growth))}٪</span>
                  </div>
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    نرخ رشد فروش
                  </span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>
                  فروش کل
                </p>
                <p className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  {formatNumber(provinceData.totalAmount)}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  تومان
                </p>
              </div>
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}
            >
              <Search
                className="w-4 h-4"
                style={{ color: colors.textSecondary }}
              />
              <input
                type="text"
                placeholder="نام شهر یا استان ..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: colors.textPrimary }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Header */}
          <div
            className="grid grid-cols-4 gap-4 px-6 py-3 border-b text-sm font-medium"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.textSecondary,
            }}
          >
            <div className="text-right">نام شهر</div>
            <div className="text-right">مبلغ فروش</div>
            <div className="text-center">سهم فروش</div>
            <div className="text-center">نرخ رشد</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: "300px" }}>
            {provinceData.cities.length === 0 ? (
              <div
                className="p-8 text-center"
                style={{ color: colors.textSecondary }}
              >
                <p className="text-sm mb-2">فروشی در این استان ثبت نشده است</p>
                <p className="text-xs opacity-70">برای مشاهده جزئیات، استان دیگری را انتخاب کنید</p>
              </div>
            ) : filteredCities.length === 0 ? (
              <div
                className="p-8 text-center text-sm"
                style={{ color: colors.textSecondary }}
              >
                هیچ شهری یافت نشد
              </div>
            ) : (
              currentPageData.map((city) => (
                <div
                  key={city.id}
                  className="grid grid-cols-4 gap-4 px-6 py-3 border-b transition-colors"
                  style={{
                    borderColor: colors.border,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div
                    className="text-sm font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {city.name}
                  </div>
                  <div className="text-sm" style={{ color: colors.textPrimary }}>
                    {formatNumber(city.amount)} تومان
                  </div>
                  <div className="text-sm text-center" style={{ color: colors.textSecondary }}>
                    {formatNumber(city.percentage)}٪
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: city.growth > 0 ? `${colors.success}22` : `${colors.error}22`,
                        color: city.growth > 0 ? colors.success : colors.error,
                      }}
                    >
                      {city.growth > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{formatNumber(Math.abs(city.growth))}٪</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {filteredCities.length > 0 && (
            <div
              className="p-4 border-t flex items-center justify-between"
              style={{ borderColor: colors.border }}
            >
              <span className="text-xs" style={{ color: colors.textSecondary }}>
                برو به صفحه
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded disabled:opacity-30 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[32px] h-8 px-2 rounded text-sm transition-colors"
                    style={{
                      backgroundColor:
                        currentPage === page ? colors.primary : colors.cardBackground,
                      color: currentPage === page ? "#ffffff" : colors.textPrimary,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: currentPage === page ? colors.primary : colors.border,
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page) {
                        e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page) {
                        e.currentTarget.style.backgroundColor = colors.cardBackground;
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}

                {totalPages > 3 && (
                  <>
                    <span style={{ color: colors.textSecondary }}>...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="min-w-[32px] h-8 px-2 rounded text-sm transition-colors"
                      style={{
                        backgroundColor:
                          currentPage === totalPages ? colors.primary : colors.cardBackground,
                        color: currentPage === totalPages ? "#ffffff" : colors.textPrimary,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: currentPage === totalPages ? colors.primary : colors.border,
                      }}
                    >
                      {formatNumber(totalPages)}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded disabled:opacity-30 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}