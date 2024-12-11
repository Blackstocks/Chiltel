import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";

const ProductList = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  // Product Data
  // Replace the productsData in your code with this:

  const productsData = {
    "air-conditioner": [
      {
        id: 1,
        name: "Daikin 1 Ton 3 Star Inverter Split AC",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-26%20211728_1701013802.png",
        originalPrice: "37000",
        discountedPrice: "37000",
        brand: "Daikin",
        rating: 4.3,
        reviews: 1245,
        specifications: {
          brand: "Daikin",
          capacity: "1 Tons",
          starRating: "3 Star Inverter",
          model: "MTKL35UV16",
          cooling: "12K BTU",
          ambientOperation: "High Ambient up to 52°C",
        },
        features: [
          "3 Star Inverter Technology",
          "1 Ton Cooling Capacity (12000 BTU)",
          "High Ambient Operation up to 52°C",
          "3D Airflow",
          "Dew Clean Technology",
          "PM 2.5 Filter",
        ],
      },
      {
        id: 2,
        name: "Daikin 1 Ton 5 Star Inverter Split AC",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-26%20211728_1701015266.png",
        originalPrice: "55000",
        discountedPrice: "41800",
        brand: "Daikin",
        rating: 4.5,
        reviews: 1876,
        specifications: {
          brand: "Daikin",
          capacity: "1 Tons",
          starRating: "5 Star Inverter",
          model: "MTKM35U",
          cooling: "12K BTU",
          ambientOperation: "High Ambient Operation",
        },
        features: [
          "5 Star Energy Rating",
          "Inverter Compressor",
          "Turbo Cooling",
          "3D Airflow",
          "Dew Clean Technology",
          "PM 2.5 Filter with Triple Display",
        ],
      },
      {
        id: 3,
        name: "Daikin 1 Ton 3 Star Fixed Speed Split AC",
        image:
          "https://www.chiltel.com/admin/product_image/Re_Screenshot%202023-11-26%20220747_1701016816.png",
        originalPrice: "35700",
        discountedPrice: "35700",
        brand: "Daikin",
        rating: 4.2,
        reviews: 958,
        specifications: {
          brand: "Daikin",
          capacity: "1 Tons",
          starRating: "3 Star Non-Inverter",
          model: "FTL35U",
          cooling: "3.35 Kilowatts",
          ambientOperation: "High Ambient up to 50°C",
        },
        features: [
          "3 Star Fixed Speed",
          "High Ambient Operation up to 50°C",
          "Good Sleep Off Timer",
          "PM 2.5 Filter",
          "Self-Diagnosis",
          "Dehumidifier & Fast Cooling",
        ],
      },
      {
        id: 4,
        name: "Daikin 1 Ton 5 Star Inverter Split AC",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-26%20211728_1701018953.png",
        originalPrice: "43508",
        discountedPrice: "43072",
        brand: "Daikin",
        rating: 4.6,
        reviews: 2145,
        specifications: {
          brand: "Daikin",
          capacity: "1 Tons",
          starRating: "5 Star Inverter",
          model: "FTL35U",
          cooling: "3.52 Kilowatts",
          ambientOperation: "High Ambient up to 54°C",
        },
        features: [
          "5 Star Rating (ISEER 5.2)",
          "Swing Inverter Compressor",
          "Copper Condenser Coil",
          "Dew Clean Technology",
          "54°C Ambient Operation",
          "R32 Eco-Friendly Refrigerant",
        ],
      },
      {
        id: 5,
        name: "Daikin 1 Ton 5 Star Inverter Split AC 2022 Model",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-26%20211728_1701018817.png",
        originalPrice: "45999",
        discountedPrice: "45539",
        brand: "Daikin",
        rating: 4.7,
        reviews: 1654,
        specifications: {
          brand: "Daikin",
          capacity: "1 Tons",
          starRating: "5 Star Inverter",
          model: "FTKR35U",
          cooling: "3.52 Kilowatts",
          ambientOperation: "54°C Ambient Operation",
        },
        features: [
          "5 Star Best-in-class Efficiency",
          "Dew Clean Technology",
          "10 Years Compressor Warranty",
          "Copper Condenser Coil",
          "R32 Eco-Friendly Refrigerant",
          "100% Cooling at 43°C",
        ],
      },
      {
        id: 6,
        name: "Daikin 1.5 Ton 3 Star Inverter Split AC",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-26%20211728_1701083298.png",
        originalPrice: "40490",
        discountedPrice: "39680",
        brand: "Daikin",
        rating: 4.4,
        reviews: 1567,
        specifications: {
          brand: "Daikin",
          capacity: "1.5 Tons",
          starRating: "3 Star Inverter",
          model: "MTKL50U",
          cooling: "17100 BTU",
          ambientOperation: "High Ambient up to 52°C",
        },
        features: [
          "3 Star Inverter Technology",
          "1.5 Ton Cooling Capacity",
          "High Ambient Operation up to 52°C",
          "3D Airflow",
          "Dew Clean Technology",
          "Triple Display with PM 2.5 Filter",
        ],
      },
      {
        id: 7,
        name: "Daikin 1.5 Ton 5 Star Inverter Split AC (2022 Model)",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-26%20211728_1701083964.png",
        originalPrice: "50490",
        discountedPrice: "48975",
        brand: "Daikin",
        rating: 4.8,
        reviews: 2341,
        specifications: {
          brand: "Daikin",
          capacity: "1.5 Tons",
          starRating: "5 Star Inverter",
          model: "MTKM50U",
          cooling: "17100 BTU",
          ambientOperation: "High Ambient up to 54°C",
        },
        features: [
          "5 Star Energy Efficiency",
          "1.5 Ton Cooling Power",
          "54°C Ambient Operation",
          "Dew Clean Technology",
          "Triple Display & PM 2.5 Filter",
          "R32 Eco-Friendly Refrigerant",
        ],
      },
      {
        id: 8,
        name: "Daikin 1.5 Ton 3 Star Inverter Split AC (Copper)",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-26%20211728_1701084562.png",
        originalPrice: "42000",
        discountedPrice: "41160",
        brand: "Daikin",
        rating: 4.3,
        reviews: 1123,
        specifications: {
          brand: "Daikin",
          capacity: "1.5 Tons",
          starRating: "3 Star Inverter",
          model: "FTKY50UV",
          cooling: "5 kw",
          ambientOperation: "High Ambient Operation",
        },
        features: [
          "3 Star Inverter Technology",
          "1.5 Ton with Copper Coil",
          "5 kW Cooling Capacity",
          "R32 Eco-Friendly Refrigerant",
          "10 Year Compressor Warranty",
          "High Ambient Operation",
        ],
      },
      {
        id: 9,
        name: "Daikin 1.5 Ton 3 Star Fixed Speed Split AC (Copper)",
        image:
          "https://www.chiltel.com/admin/product_image/Re_Screenshot%202023-11-26%20220747_1701085832.png",
        originalPrice: "42583",
        discountedPrice: "41731",
        brand: "Daikin",
        rating: 4.1,
        reviews: 876,
        specifications: {
          brand: "Daikin",
          capacity: "1.5 Tons",
          starRating: "3 Star Fixed Speed",
          model: "FTL50U",
          cooling: "5.05 kw",
          ambientOperation: "High Ambient Operation",
        },
        features: [
          "3 Star Fixed Speed",
          "1.5 Ton Cooling Capacity",
          "Copper Condenser",
          "R32 Eco-Friendly Refrigerant",
          "10 Year Compressor Warranty",
          "Non-inverter Compressor",
        ],
      },
      {
        id: 10,
        name: "Daikin 1.5 Ton 5 Star Inverter Split AC (Copper)",
        image:
          "https://www.chiltel.com/admin/product_image/Re_Screenshot%202023-11-26%20220747_1701086443.png",
        originalPrice: "48999",
        discountedPrice: "48019",
        brand: "Daikin",
        rating: 4.8,
        reviews: 2567,
        specifications: {
          brand: "Daikin",
          capacity: "1.5 Tons",
          starRating: "5 Star Inverter",
          model: "FTKM50U",
          cooling: "5.28 kw",
          ambientOperation: "High Ambient Operation",
        },
        features: [
          "5 Star Energy Rating",
          "1.5 Ton with Copper Coil",
          "5.28 kW Cooling Power",
          "R32 Eco-Friendly Refrigerant",
          "10 Year Warranty",
          "High Ambient Operation",
        ],
      },
      {
        id: 11,
        name: "Daikin 1.5 Ton 5 Star Inverter Split AC",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-26%20211728_1701087336.png",
        originalPrice: "48890",
        discountedPrice: "47912",
        brand: "Daikin",
        rating: 4.7,
        reviews: 1987,
        specifications: {
          brand: "Daikin",
          capacity: "1.5 Tons",
          starRating: "5 Star Inverter",
          model: "JTKJ50U",
          cooling: "5.28 kw",
          ambientOperation: "High Ambient Operation",
        },
        features: [
          "5 Star Energy Efficiency",
          "1.5 Ton Cooling Power",
          "5.28 kW Cooling Capacity",
          "Inverter Compressor",
          "Turbo Cooling",
          "Copper Condenser",
        ],
      },
      {
        id: 12,
        name: "Daikin 1.5 Ton 5 Star Inverter Split AC (PM 2.5 Filter, 2022)",
        image:
          "https://www.chiltel.com/admin/product_image/Re_Screenshot%202023-11-26%20220747_1701088290.png",
        originalPrice: "63350",
        discountedPrice: "61449",
        brand: "Daikin",
        rating: 4.9,
        reviews: 3241,
        specifications: {
          brand: "Daikin",
          capacity: "1.5 Tons",
          starRating: "5 Star Inverter",
          model: "FTKF50U",
          cooling: "5 Kilowatts",
          ambientOperation: "High Ambient Operation",
        },
        features: [
          "5 Star Premium Model",
          "1.5 Ton with PM 2.5 Filter",
          "Inverter Compressor",
          "Coanda & 3D Airflow",
          "Good Sleep Timer",
          "R32 Eco-Friendly Refrigerant",
        ],
      },
      {
        id: 13,
        name: "Daikin 1.5 Ton 3 Star Dust Filter Window AC",
        image:
          "https://www.chiltel.com/admin/product_image/1-5-ton-window-ac-frwf50-large-95457-165518-1593698011-1_1704026572.jpg",
        originalPrice: "32800",
        discountedPrice: "32472",
        brand: "Daikin",
        rating: 4.3,
        reviews: 845,
        specifications: {
          brand: "Daikin",
          capacity: "1.5 Tons",
          starRating: "3 Star",
          model: "FRWL50TV162",
          cooling: "17231 BTU",
          powerConsumption: "1570 Watts",
          refrigerant: "R32",
        },
        features: [
          "Copper Condenser",
          "Self-Diagnosis System",
          "Economy Mode",
          "Suitable for 170 sq. ft.",
          "1 Year Standard Warranty",
          "Dust Filter Technology",
        ],
      },
      {
        id: 14,
        name: "Daikin Window AC 5-Star 1.5 ton FRWF50 Series",
        image:
          "https://www.chiltel.com/admin/product_image/61Kn2QYI1aL._SX679__1701104679.jpg",
        originalPrice: "46000",
        discountedPrice: "43700",
        brand: "Daikin",
        rating: 4.6,
        reviews: 1245,
        specifications: {
          brand: "Daikin",
          capacity: "1.5 Tons",
          starRating: "5 Star",
          model: "FRWF50",
          cooling: "Power Chill",
          powerConsumption: "Advanced Efficiency",
          refrigerant: "R32",
        },
        features: [
          "5 Star Energy Rating",
          "Power Chill Technology",
          "4 Way Airflow",
          "Wide Angle Louver",
          "Temperature Display",
          "Good Sleep Off Timer",
        ],
      },
      {
        id: 15,
        name: "Blue Star 1.5 Ton 3 Star Window AC",
        image:
          "https://www.chiltel.com/admin/product_image/Bluie%20Star%20Window_1701105917.png",
        originalPrice: "40000",
        discountedPrice: "30800",
        brand: "Blue Star",
        rating: 4.2,
        reviews: 756,
        specifications: {
          brand: "Blue Star",
          capacity: "1.5 Tons",
          starRating: "3 Star",
          model: "3W18GA",
          cooling: "4900 Watt",
          powerConsumption: "Efficient",
          compressor: "Rotary",
        },
        features: [
          "3 Star BEE Rating 2020",
          "Copper Condenser",
          "4900W Cooling Capacity",
          "Rotary Compressor",
          "Energy Efficient",
          "Durable Build Quality",
        ],
      },
      {
        id: 16,
        name: "Lloyd 1.5 Ton 3 Star Window AC",
        image:
          "https://www.chiltel.com/admin/product_image/s08x8v2k%20(1)_1701110241.png",
        originalPrice: "30900",
        discountedPrice: "30282",
        brand: "Lloyd",
        rating: 4.1,
        reviews: 678,
        specifications: {
          brand: "Lloyd",
          capacity: "1.5 Tons",
          starRating: "3 Star",
          model: "GLW18C3YWSEW",
          cooling: "4800 W",
          compressor: "Rotary",
          refrigerant: "R32",
        },
        features: [
          "Copper Condenser Coil",
          "Remote Control",
          "Multiple Operating Modes",
          "4800W Cooling Capacity",
          "Fan, Cool, Turbo Modes",
          "Energy Efficient Operation",
        ],
      },
      {
        id: 17,
        name: "Lloyd Window AC 1.5 Ton 5 Star",
        image:
          "https://www.chiltel.com/admin/product_image/s08x8v2k%20(2)_1701110962.png",
        originalPrice: "54999",
        discountedPrice: "40699",
        brand: "Lloyd",
        rating: 4.5,
        reviews: 1124,
        specifications: {
          brand: "Lloyd",
          capacity: "1.5 Tons",
          starRating: "5 Star",
          model: "GLW18C5XWGMR",
          cooling: "4950 W",
          refrigerant: "R32",
          powerConsumption: "High Efficiency",
        },
        features: [
          "5 Star BEE Rating 2022",
          "4950W Cooling Capacity",
          "Copper Condenser Coil",
          "Multiple Operating Modes",
          "Sleep Mode Function",
          "Turbo Cooling Mode",
        ],
      },
      {
        id: 18,
        name: "Lloyd Window Inverter AC 1.5 Ton 3 Star",
        image:
          "https://www.chiltel.com/admin/product_image/a3ybyd0a_1701112901.png",
        originalPrice: "52990",
        discountedPrice: "31794",
        brand: "Lloyd",
        rating: 4.4,
        reviews: 892,
        specifications: {
          brand: "Lloyd",
          capacity: "1.5 Tons",
          starRating: "3 Star",
          model: "GLW18I3FWCEV",
          cooling: "4950 W",
          compressor: "Rotary",
          refrigerant: "R32",
        },
        features: [
          "Inverter Technology",
          "3 Star BEE Rating",
          "Copper Condenser Coil",
          "Remote Control Operation",
          "4950W Cooling Power",
          "Rotary Compressor",
        ],
      },
    ],
    geyser: [
      {
        id: 1,
        name: "Omnis RS Electric Storage Water Heater",
        image:
          "https://www.chiltel.com/admin/product_image/download%20(1)_1699974570.jpeg",
        originalPrice: "16999",
        discountedPrice: "16659",
        brand: "Racold",
        rating: 4.5,
        reviews: 1245,
        specifications: {
          brand: "Racold",
          capacity: "10L/15L/25L",
          starRating: "5 Star",
          model: "Omnis RS",
          powerConsumption: "2000W",
          waterproofRating: "IPX4",
        },
        features: [
          "5 Star Energy Rating",
          "Multiple Capacity Options (10L/15L/25L)",
          "Titanium Plus Technology",
          "Advanced Temperature Control",
          "Anti-Rust Coating",
          "8 Bar Pressure Rating",
        ],
      },
      {
        id: 2,
        name: "ALTRO i + Electric Storage Water Heater",
        image:
          "https://www.chiltel.com/admin/product_image/Geyser%20_RAcold_ALTRO-i_I+_1699972445.png",
        originalPrice: "6949",
        discountedPrice: "6810",
        brand: "Racold",
        rating: 4.3,
        reviews: 876,
        specifications: {
          brand: "Racold",
          capacity: "10L/15L/25L",
          starRating: "5 Star",
          model: "ALTRO i +",
          powerConsumption: "2000W",
          waterproofRating: "IPX4",
        },
        features: [
          "5 Star Energy Efficiency",
          "Flexible Capacity Options",
          "Smart LED Indicators",
          "PUF Insulation",
          "Temperature Control Knob",
          "Superior Safety System",
        ],
      },
      {
        id: 3,
        name: "OMNIS DG Electric Storage Water Heater",
        image:
          "https://www.chiltel.com/admin/product_image/Omni%20DG%20Racold_273236_v3m7v8_1699973189.png",
        originalPrice: "18999",
        discountedPrice: "18239",
        brand: "Racold",
        rating: 4.7,
        reviews: 1567,
        specifications: {
          brand: "Racold",
          capacity: "10L/15L/25L",
          starRating: "5 Star",
          model: "OMNIS DG",
          powerConsumption: "2000W",
          waterproofRating: "IPX4",
        },
        features: [
          "5 Star BEE Rating",
          "Multiple Capacity Variants",
          "Digital Display",
          "Smart Bath Logic",
          "Titanium Plus Technology",
          "High Pressure Resistance",
        ],
      },
    ],
    refrigerator: [
      {
        id: 1,
        name: "Whirlpool Vitamagic Pro 192L 3 Star Single Door",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-14%20131249_1704026429.png",
        originalPrice: "26500",
        discountedPrice: "18815",
        brand: "Whirlpool",
        rating: 4.3,
        reviews: 1245,
        specifications: {
          brand: "Whirlpool",
          capacity: "192 Litres",
          starRating: "3 Star",
          type: "Single Door",
          technology: "Direct-Cool",
          defrostType: "Auto Defrost",
          compressor: "Inverter",
        },
        features: [
          "Vitamagic Pro Inverter Technology",
          "40% Longer Vitamin Preservation",
          "Zeolite Technology",
          "12 Days Garden Freshness",
          "Auto Defrost System",
          "Intuitive Cooling Modes",
        ],
      },
      {
        id: 2,
        name: "Whirlpool Intellifresh 259L 2 Star Double Door",
        image:
          "https://www.chiltel.com/admin/product_image/2%20Door_1Screenshot%202023-11-14%20213556_1699978828.png",
        originalPrice: "37500",
        discountedPrice: "30000",
        brand: "Whirlpool",
        rating: 4.4,
        reviews: 987,
        specifications: {
          brand: "Whirlpool",
          capacity: "259 Litres",
          starRating: "2 Star",
          type: "Double Door",
          technology: "Frost Free",
          defrostType: "Automatic",
          compressor: "Intellisense Inverter",
        },
        features: [
          "15 Days Freshness Technology",
          "Intellisense Inverter System",
          "Freshflow Air Tower",
          "Flexi Vents System",
          "85 Minutes Ice Making",
          "Energy Efficient Operation",
        ],
      },
      {
        id: 3,
        name: "Whirlpool Protton 240L Three Door Refrigerator",
        image:
          "https://www.chiltel.com/admin/product_image/1_Screenshot%202023-11-14%20215407_1699979838.png",
        originalPrice: "35450",
        discountedPrice: "28360",
        brand: "Whirlpool",
        rating: 4.6,
        reviews: 756,
        specifications: {
          brand: "Whirlpool",
          capacity: "240 Litres",
          type: "Three Door",
          technology: "Frost Free",
          defrostType: "Automatic",
          compressor: "High Efficiency",
          powerConsumption: "Less than CFL",
        },
        features: [
          "Three Door Design",
          "6th Sense ActiveFresh Technology",
          "Zeolite Technology",
          "Super Energy Efficient",
          "Frost Free Operation",
          "Advanced Cooling System",
        ],
      },
    ],
    "air-cooler": [
      {
        id: 1,
        name: "Symphony 12 L Room/Personal Air Cooler (White, Diet 12T)",
        image:
          "https://www.chiltel.com/admin/product_image/Diet_Screenshot%202023-11-14%20160107_1704026688.png",
        originalPrice: "8000",
        discountedPrice: "7840",
        brand: "Symphony",
        rating: 4.3,
        reviews: 856,
        specifications: {
          brand: "Symphony",
          model: "Diet 12T",
          color: "White",
          tankCapacity: "12 L",
          coolingMedia: "Honeycomb",
          speeds: "3",
          type: "Blower",
        },
        features: [
          "12L Water Tank Capacity",
          "Honeycomb Cooling Pad",
          "3-Speed Control",
          "Powerful Air Throw",
          "High-Efficiency Blower",
          "Personal Cooling Solution",
        ],
      },
      {
        id: 2,
        name: "Symphony 20 L Tower Air Cooler (White, Diet 3D-20i)",
        image:
          "https://www.chiltel.com/admin/product_image/boya69nd%20(1)_1701115886.png",
        originalPrice: "9999",
        discountedPrice: "9499",
        brand: "Symphony",
        rating: 4.4,
        reviews: 745,
        specifications: {
          brand: "Symphony",
          model: "Diet 3D-20i",
          color: "White",
          type: "Tower",
          tankCapacity: "20 L",
          coolingMedia: "Honeycomb",
          speeds: "3",
          coverageArea: "1750 sq. ft",
        },
        features: [
          "20L Water Tank Capacity",
          "1750 sq. ft Coverage Area",
          "Honeycomb Cooling Media",
          "3-Speed Control",
          "Tower Design",
          "High-Efficiency Blower",
        ],
      },
      {
        id: 3,
        name: "Symphony 40 L Tower Air Cooler (Black, Diet 3D-40i)",
        image:
          "https://www.chiltel.com/admin/product_image/por89emi%20(1)_1701117239.png",
        originalPrice: "12499",
        discountedPrice: "11874",
        brand: "Symphony",
        rating: 4.5,
        reviews: 923,
        specifications: {
          brand: "Symphony",
          model: "Diet 3D-40i",
          color: "Black",
          tankCapacity: "40 L",
          coolingMedia: "Honeycomb",
          speeds: "3",
          coverageArea: "1750 sq. ft",
          airThrow: "30 ft",
        },
        features: [
          "40L Large Tank Capacity",
          "Remote Control Support",
          "30 ft Air Throw Distance",
          "Cooling & Swing Modes",
          "Honeycomb Cooling Pad",
          "1750 sq. ft Coverage",
        ],
      },
      {
        id: 4,
        name: "Symphony 70 L Desert Air Cooler (White, Siesta XL)",
        image:
          "https://www.chiltel.com/admin/product_image/fjk1v1ri%20(1)_1701118236.png",
        originalPrice: "13000",
        discountedPrice: "12610",
        brand: "Symphony",
        rating: 4.6,
        reviews: 634,
        specifications: {
          brand: "Symphony",
          model: "Siesta XL",
          color: "White",
          type: "Desert",
          tankCapacity: "70 L",
          coolingMedia: "Honeycomb",
          speeds: "3",
          fanType: "Fan",
        },
        features: [
          "70L Extra Large Tank",
          "Desert Cooling Technology",
          "Honeycomb Cooling Media",
          "3-Speed Control",
          "Powerful Air Throw",
          "High Capacity Cooling",
        ],
      },
      {
        id: 5,
        name: "Diet 22T Personal Air Cooler",
        image:
          "https://www.chiltel.com/admin/product_image/ia8zv6r1%20(1)_1701119359.png",
        originalPrice: "10000",
        discountedPrice: "10000",
        brand: "Symphony",
        rating: 4.2,
        reviews: 542,
        specifications: {
          brand: "Symphony",
          model: "Diet 22T",
          tankCapacity: "22 L",
          powerConsumption: "165 watts",
          coolingMedia: "Honeycomb",
          coverageArea: "150 sq.ft",
        },
        features: [
          "22L Water Tank Capacity",
          "i-Pure Technology",
          "165W Power Consumption",
          "150 sq.ft Coverage",
          "Powerful Air Throw",
          "Honeycomb Cooling Pad",
        ],
      },
      {
        id: 6,
        name: "Symphony 35 L Room Air Cooler (White, DIET 35T)",
        image:
          "https://www.chiltel.com/admin/product_image/temo3wwo%20(1)_1701199657.png",
        originalPrice: "11999",
        discountedPrice: "11399",
        brand: "Symphony",
        rating: 4.7,
        reviews: 876,
        specifications: {
          brand: "Symphony",
          model: "DIET 35T",
          color: "White",
          tankCapacity: "35 L",
          speeds: "3",
          motorSpeed: "1400 RPM",
          starRating: "5 Star",
          coverageArea: "1750 sq. ft",
        },
        features: [
          "35L Tank Capacity",
          "5 Star Rating",
          "1400 RPM Motor",
          "Cooling & Swing Modes",
          "2-Way Air Deflection",
          "1750 sq.ft Coverage",
        ],
      },
      {
        id: 7,
        name: "Symphony 55 L Tower Air Cooler (White, DIET 3D 55B)",
        image:
          "https://www.chiltel.com/admin/product_image/zy6egiaa%20(1)%20(1)_1701201967.png",
        originalPrice: "16499",
        discountedPrice: "15674",
        brand: "Symphony",
        rating: 4.8,
        reviews: 789,
        specifications: {
          brand: "Symphony",
          model: "Diet 3D 55B",
          color: "White",
          type: "Tower",
          tankCapacity: "55 L",
          speeds: "7",
          dimensions: "41 cm x 132 cm x 35 cm",
          fanType: "Blower",
        },
        features: [
          "55L Large Tank Capacity",
          "7-Speed Control",
          "Tower Design",
          "Premium Blower Fan",
          "Compact Dimensions",
          "High Cooling Efficiency",
        ],
      },
    ],
    microwave: [
      {
        id: 1,
        name: "WHIRLPOOL 29L CONVECTION MICROWAVE",
        image: "/assets/microwavepro.jpeg",
        originalPrice: "23150",
        discountedPrice: "16205",
        brand: "Whirlpool",
        rating: 5,
        reviews: 948,
        specifications: {
          brand: "Whirlpool",
          model: "Magicook Pro",
          type: "Convection",
          capacity: "29L",
          features: "Air-Fryer with Baking Plate & Rotisserie",
          powerOutput: "300 ACM",
        },
        features: [
          "Air fryer functionality",
          "Sanitization",
          "Zero waste & Immunity Booster menu",
          "300 ACM Power",
          "Motorized Rotisserie",
          "Daily function quick access buttons",
        ],
        availability: "In Stock",
        description:
          "Advanced convection microwave with multi-functionality including air-frying, baking, and rotisserie features for versatile cooking solutions.",
      },
    ],
    "cassette-ac": [
      {
        id: 1,
        name: "DAIKIN 1.5 TON INVERTER CASSETTE AC FCMF50ARV16",
        image: "/assets/cassette.png",
        originalPrice: "98800",
        discountedPrice: "80028",
        brand: "Daikin",
        rating: 5,
        reviews: 785,
        specifications: {
          brand: "Daikin",
          model: "FCMF50ARV16",
          type: "Cassette",
          capacity: "1.5 Ton",
          technology: "Inverter",
          installation: "Ceiling Mounted",
        },
        features: [
          "1.5 Ton Cooling Capacity",
          "Inverter Technology",
          "4-Way Air Flow",
          "Energy Efficient Operation",
          "Uniform Cooling Distribution",
          "Commercial Grade Performance",
        ],
        availability: "1 In Stock",
        description:
          "Professional-grade 1.5 Ton inverter cassette AC ideal for commercial spaces with uniform cooling distribution.",
      },
    ],
    "deep-freezer": [
      {
        id: 1,
        name: "EF 105 Hard Top",
        image:
          "https://www.chiltel.com/admin/product_image/1_png_1701090407.png",
        originalPrice: "18000",
        discountedPrice: "17640",
        brand: "Elanpro",
        rating: 4.3,
        reviews: 245,
        specifications: {
          brand: "Elanpro",
          model: "EF 105",
          type: "Hard Top",
          capacity: "100L",
          temperature: "8°C ~ -25°C",
          refrigerant: "R600a",
        },
        features: [
          "Convertible Freezer-Chiller",
          "100L Capacity",
          "Wide Temperature Range",
          "Eco-Friendly Refrigerant",
          "Hard Top Design",
          "Energy Efficient",
        ],
      },
      {
        id: 2,
        name: "EF 205 / EF 235",
        image:
          "https://www.chiltel.com/admin/product_image/1_png_1701091318.png",
        originalPrice: "22000",
        discountedPrice: "21560",
        brand: "Elanpro",
        rating: 4.4,
        reviews: 312,
        specifications: {
          brand: "Elanpro",
          model: "EF 205/235",
          type: "Convertible",
          capacity: "200L",
          temperature: "8°C ~ -25°C",
          refrigerant: "R600a",
        },
        features: [
          "Convertible Freezer-Chiller",
          "200L Large Capacity",
          "Versatile Temperature Range",
          "Eco-Friendly Cooling",
          "Energy Efficient Design",
          "Commercial Grade Performance",
        ],
      },
      {
        id: 3,
        name: "Bluestar 192 Litres Deep Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/192_Fromt_23121310_1700844843.jpg",
        originalPrice: "31350",
        discountedPrice: "23199",
        brand: "Blue Star",
        rating: 4.5,
        reviews: 567,
        specifications: {
          brand: "Blue Star",
          model: "CF4-225DSW",
          capacity: "192 Litres",
          temperature: "-24°C TO +8°C",
          starRating: "4 Star",
          refrigerant: "R600a",
          lids: "1",
        },
        features: [
          "4 Star Energy Rating",
          "Wide Temperature Range",
          "Eco-Friendly R600a Refrigerant",
          "Single Lid Design",
          "192L Storage Capacity",
          "Commercial Grade Build",
        ],
      },
      {
        id: 4,
        name: "Bluestar 141 Liters Deep Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/141_Side_23121304%20(1)_1700848016.jpg",
        originalPrice: "26950",
        discountedPrice: "20212",
        brand: "Blue Star",
        rating: 4.2,
        reviews: 423,
        specifications: {
          brand: "Blue Star",
          capacity: "141 Litres",
          starRating: "4 Star",
          warranty: "1 Year Manufacturer, 4 Year Compressor",
        },
        features: [
          "4 Star Energy Rating",
          "Eco Friendly Design",
          "Robust Construction",
          "Tropicalized for Harsh Summer",
          "BEE Star Labelling",
          "Extended Warranty Coverage",
        ],
      },
      {
        id: 5,
        name: "DAIKIN Deep Freezer 335 L",
        image:
          "https://www.chiltel.com/admin/product_image/1mpjyirg%20(1)_1701206211.png",
        originalPrice: "37800",
        discountedPrice: "27972",
        brand: "Daikin",
        rating: 4.6,
        reviews: 678,
        specifications: {
          brand: "Daikin",
          capacity: "335 Litres",
          insulation: "60 mm",
          doors: "Double Door",
          warranty: "1+4 years comprehensive",
        },
        features: [
          "Mega Cooling Capacity",
          "Environment Friendly Non-CFC",
          "60mm Thick Insulation",
          "PP Sheet Inner Liner",
          "Heavy Duty Castor Wheels",
          "Lock and Key System",
        ],
      },
      {
        id: 6,
        name: "EKG 435 Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/elanpro-ekg-405-a-double-door-flat-glass-top-fre%20(1)%20(1)_1704111859.png",
        originalPrice: "30000",
        discountedPrice: "29700",
        brand: "Elanpro",
        rating: 4.4,
        reviews: 324,
        specifications: {
          brand: "Elanpro",
          model: "EKG 435",
          type: "Flat Glass Top",
          capacity: "423 Litres",
          doors: "2",
          temperature: "-16°C ~ -24°C",
        },
        features: [
          "Flat Glass Top Design",
          "Double Door Configuration",
          "423L Large Capacity",
          "Commercial Grade Cooling",
          "Wide Temperature Range",
          "Professional Grade Build",
        ],
      },
      {
        id: 7,
        name: "Blue Star 285 Ltr. Deep Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/c0960625-4ea0-4b72-92b6-f32b7cbe3dd8_1700850381.jpg",
        originalPrice: "40200",
        discountedPrice: "29346",
        brand: "Blue Star",
        rating: 4.5,
        reviews: 456,
        specifications: {
          brand: "Blue Star",
          capacity: "285 Litres",
          type: "Double Door",
          warranty: "1 Year Manufacturer, 4 Year Compressor",
          features: "LED Lighting Interior",
        },
        features: [
          "Double Door Design",
          "LED Interior Lighting",
          "Compact Design",
          "Twin Door Configuration",
          "Mass Storage Capacity",
          "Extended Warranty",
        ],
      },
      {
        id: 8,
        name: "Bluestar 95 Ltrs. Deep Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/90d6f352-5d75-4f44-a389-18ce8fbe2d0622200641_1700852349.jpg",
        originalPrice: "28600",
        discountedPrice: "22308",
        brand: "Blue Star",
        rating: 4.2,
        reviews: 289,
        specifications: {
          brand: "Blue Star",
          model: "CFVSD100DHPW",
          capacity: "95 Litres",
          type: "Single Door",
          color: "White",
        },
        features: [
          "Robust Construction",
          "Corrosion Resistant Body",
          "Energy Efficient Compressor",
          "High Density PUF Insulation",
          "Eco Friendly Cyclopentane",
          "Extended Warranty Coverage",
        ],
      },
      {
        id: 9,
        name: "Bluestar 300 Liters Deep Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/eeb49f2a-754d-4e17-b472-9442f393800522051324_1700853362.jpg",
        originalPrice: "37100",
        discountedPrice: "28196",
        brand: "Blue Star",
        rating: 4.6,
        reviews: 534,
        specifications: {
          brand: "Blue Star",
          capacity: "300 Litres",
          doors: "2",
          color: "White",
          warranty: "1 Year Manufacturer, 4 Year Compressor",
        },
        features: [
          "High Density PUF Insulation",
          "Better Cooling Hold Time",
          "Trapezoid Door Design",
          "Double Door Configuration",
          "Professional Grade Build",
          "Extended Warranty",
        ],
      },
      {
        id: 10,
        name: "Blue Star 401 Ltrs. Deep Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-25%20010716_1700854783.png",
        originalPrice: "41350",
        discountedPrice: "29772",
        brand: "Blue Star",
        rating: 4.7,
        reviews: 678,
        specifications: {
          brand: "Blue Star",
          capacity: "401 Litres",
          type: "Convertible",
          doors: "Twin Door",
          warranty: "1 Year Manufacturer, 4 Year Compressor",
        },
        features: [
          "Convertible Series",
          "Corrosion-Resistant Body",
          "Eco-Friendly Refrigerant",
          "Heavy Duty Casters",
          "Tropicalized Design",
          "Twin Door Configuration",
        ],
      },
      {
        id: 11,
        name: "Blue Star 484 Ltrs Deep Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/400_1_182x182_1700855302.jpg",
        originalPrice: "44500",
        discountedPrice: "32930",
        brand: "Blue Star",
        rating: 4.8,
        reviews: 745,
        specifications: {
          brand: "Blue Star",
          capacity: "484 Litres",
          type: "Convertible",
          doors: "Twin Door",
          warranty: "1 Year Manufacturer, 4 Year Compressor",
        },
        features: [
          "Convertible Series",
          "Corrosion-Resistant Body",
          "Eco-Friendly Refrigerant",
          "Heavy Duty Casters",
          "Tropicalized Design",
          "Extended Warranty Coverage",
        ],
      },
      {
        id: 12,
        name: "DAIKIN Deep Freezer 446 liters",
        image:
          "https://www.chiltel.com/admin/product_image/1mpjyirg%20(1)_1701206879.png",
        originalPrice: "43990",
        discountedPrice: "30793",
        brand: "Daikin",
        rating: 4.7,
        reviews: 567,
        specifications: {
          brand: "Daikin",
          capacity: "446 Liters",
          type: "Double Door",
          insulation: "60 mm",
          warranty: "1+4 years comprehensive",
        },
        features: [
          "Mega Cooling Capacity",
          "Non-CFC Insulation",
          "PP Sheet Inner Liner",
          "Double Door with 2 Baskets",
          "Heavy Duty Castor Wheels",
          "Lock and Key System",
        ],
      },
      {
        id: 13,
        name: "EKG 205/335/435 Flat Glass Top Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/vi1aaokv%20(1)_1704030669.png",
        originalPrice: "10000",
        discountedPrice: "9900",
        brand: "Elanpro",
        rating: 4.3,
        reviews: 234,
        specifications: {
          brand: "Elanpro",
          model: "EKG 205/335/435",
          type: "Flat Glass Top",
          capacity: "200L",
          temperature: "-16°C ~ -24°C",
          maxAmbient: "40°",
          baskets: "3",
        },
        features: [
          "Flat Glass Top Design",
          "200L Storage Capacity",
          "Wide Temperature Range",
          "3 Baskets/Shelves",
          "40° Max Ambient Temperature",
          "Commercial Grade Performance",
        ],
      },
      {
        id: 14,
        name: "EF 335",
        image:
          "https://www.chiltel.com/admin/product_image/Screenshot%202023-11-14%20224716_1699982538.png",
        originalPrice: "2300",
        discountedPrice: "2070",
        brand: "Elanpro",
        rating: 4.2,
        reviews: 156,
        specifications: {
          brand: "Elanpro",
          model: "EF 335",
          type: "Hard Top",
          capacity: "335L",
        },
        features: [
          "335L Large Capacity",
          "Hard Top Design",
          "Commercial Grade Build",
          "Energy Efficient",
          "Durable Construction",
          "Professional Usage",
        ],
      },
      {
        id: 15,
        name: "EKG 435 Flat Glass Top Freezer",
        image:
          "https://www.chiltel.com/admin/product_image/elanpro-ekg-405-a-double-door-flat-glass-top-fre%20(1)%20(1)_1704111859.png",
        originalPrice: "30000",
        discountedPrice: "29700",
        brand: "Elanpro",
        rating: 4.4,
        reviews: 345,
        specifications: {
          brand: "Elanpro",
          model: "EKG 435",
          type: "Flat Glass Top",
          capacity: "423L",
          doors: "2",
          doorType: "Flat Glass",
        },
        features: [
          "423L Storage Capacity",
          "Double Door Configuration",
          "Flat Glass Top Design",
          "Temperature Control",
          "Commercial Grade",
          "Professional Usage",
        ],
      },
    ],
    "visi-cooler": [
      {
        id: 1,
        name: "ECG 306 Visi Cooler",
        image:
          "https://www.chiltel.com/admin/product_image/306L%20Visi%20Cooler_1Screenshot%202023-11-15%20194907_1700059169_1701092641.png",
        originalPrice: "38900",
        discountedPrice: "38122",
        brand: "Elanpro",
        rating: 4.4,
        reviews: 245,
        specifications: {
          brand: "Elanpro",
          model: "ECG 306",
          type: "Visi Cooler",
          capacity: "306L",
          doorType: "Double Vacuum Glass",
          mobility: "Castors Equipped",
        },
        features: [
          "Double Vacuum Glass Door",
          "Perfect Product Visibility",
          "Uniform Cooling",
          "Adjustable Shelves",
          "Lock & Castors",
          "Eco Friendly Refrigerant",
        ],
      },
      {
        id: 2,
        name: "ECG 406 Visi Cooler",
        image:
          "https://www.chiltel.com/admin/product_image/306L%20Visi%20Cooler_1Screenshot%202023-11-15%20194907_1700059169_1701092911.png",
        originalPrice: "39000",
        discountedPrice: "38610",
        brand: "Elanpro",
        rating: 4.5,
        reviews: 312,
        specifications: {
          brand: "Elanpro",
          model: "ECG 406",
          type: "Visi Cooler",
          capacity: "406L",
          doorType: "Double Vacuum Glass",
          mobility: "Castors Equipped",
        },
        features: [
          "Perfect Product Visibility",
          "Double Vacuum Glass Door",
          "Uniform Cooling",
          "Adjustable Shelves",
          "Lock & Castors",
          "Eco Friendly Refrigerant",
        ],
      },
      {
        id: 3,
        name: "Visi Cooler – 105L",
        image:
          "https://www.chiltel.com/admin/product_image/ECG-105_ccexpress_1701203938.png",
        originalPrice: "23000",
        discountedPrice: "22540",
        brand: "Elanpro",
        rating: 4.3,
        reviews: 178,
        specifications: {
          brand: "Elanpro",
          model: "ECG 105",
          type: "Visi Cooler",
          capacity: "105L",
          doorType: "Double Vacuum Glass",
          mobility: "Castors Equipped",
        },
        features: [
          "Low Power Consumption",
          "Adjustable Shelves",
          "Castors for Easy Mobility",
          "Double Vacuum Glass Door",
          "Compact Design",
          "Energy Efficient",
        ],
      },
    ],
    "water-dispenser": [
      {
        id: 1,
        name: "VOLTAS WATER DISPENSER",
        image: "/assets/waterdis.png", // Update path to match your asset location
        originalPrice: "10000",
        discountedPrice: "9900",
        brand: "Voltas",
        rating: 5,
        reviews: 245,
        specifications: {
          brand: "Voltas",
          coldStorage: "3.2 Ltrs",
          coolingCapacity: "3 Ltrs/Hr",
          waterOptions: "Hot, Normal & Cold",
          type: "Freestanding",
        },
        features: [
          "State-of-the-art Technology",
          "Hot, Normal & Cold Water Options",
          "3.2L Cold Water Storage",
          "3L/Hr Cooling Capacity",
          "Office & Home Compatible",
          "Smart Design Choice",
        ],
        description:
          "Presenting the new range of water dispensers with state-of-the-art technology. The new range does more than let you choose between Hot, Normal & Cold water. Water Dispensers are the smart choice for every office and home.",
        availability: "1 In Stock",
      },
    ],
    "water-cooler-cum-purifier": [
      {
        id: 1,
        name: "EUREKA FORBES 40 L/HR WATER PURIFIER AGCCP",
        image: "/assets/wccp.jpg", // Update path to match your asset
        originalPrice: "55900",
        discountedPrice: "54782",
        brand: "Eureka Forbes",
        rating: 5,
        reviews: 324,
        specifications: {
          brand: "Eureka Forbes",
          coolingCapacity: "40 L/Hr",
          uvLampPower: "8 Watts",
          powerConsumption: "750 W",
          type: "Water Purifier",
          application: "Water Purification",
        },
        features: [
          "40 L/Hr Cooling Capacity",
          "UV Purification Technology",
          "8W UV Lamp Power",
          "750W Power Consumption",
          "Commercial Grade Performance",
          "Dual Function: Cooling & Purification",
        ],
        description:
          "Commercial grade water cooler with built-in purification system, ideal for offices and public spaces.",
        availability: "0 In Stock",
      },
    ],
  };

  // Price range options
  const priceRanges = [
    { label: "Under ₹15,000", min: 0, max: 15000 },
    { label: "₹15,000 - ₹30,000", min: 15000, max: 30000 },
    { label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
    { label: "Above ₹50,000", min: 50000, max: Infinity },
  ];

  const data = type === "purchase" ? productsData : {};
  const items = data[category] || [];

  const [filteredItems, setFilteredItems] = useState(items);
  const [filters, setFilters] = useState({
    brand: [],
    priceRange: [],
    rating: null,
  });

  // Rating Stars Component
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <StarHalf className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        )}
        <span className="ml-2 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  // Apply filters
  useEffect(() => {
    let result = items;

    if (filters.brand.length > 0) {
      result = result.filter((item) => filters.brand.includes(item.brand));
    }

    if (filters.priceRange.length > 0) {
      result = result.filter((item) => {
        return filters.priceRange.some(
          (range) =>
            parseInt(item.discountedPrice) >= range.min &&
            parseInt(item.discountedPrice) <= range.max
        );
      });
    }

    if (filters.rating) {
      result = result.filter((item) => item.rating >= filters.rating);
    }

    setFilteredItems(result);
  }, [filters, items]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold capitalize">
          {category.replace(/-/g, " ")}{" "}
          {type === "purchase" ? "Products" : "Services"}
        </h1>
        <p className="mt-2 text-gray-600">
          Showing {filteredItems.length} results
        </p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters Section */}
        <aside className="col-span-12 md:col-span-3">
          <div className="sticky top-4">
            <div className="p-4 border rounded-lg">
              <h2 className="mb-4 text-lg font-semibold">Filters</h2>

              {type === "purchase" && (
                <>
                  <div className="mb-4">
                    <h3 className="mb-2 font-medium">Brand</h3>
                    <div className="space-y-2">
                      {Array.from(new Set(items.map((item) => item.brand))).map(
                        (brand) => (
                          <label key={brand} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.brand.includes(brand)}
                              onChange={(e) => {
                                setFilters((prev) => ({
                                  ...prev,
                                  brand: e.target.checked
                                    ? [...prev.brand, brand]
                                    : prev.brand.filter((b) => b !== brand),
                                }));
                              }}
                              className="mr-2"
                            />
                            <span>{brand}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="mb-2 font-medium">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range.label} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.priceRange.some(
                              (r) => r.label === range.label
                            )}
                            onChange={(e) => {
                              setFilters((prev) => ({
                                ...prev,
                                priceRange: e.target.checked
                                  ? [...prev.priceRange, range]
                                  : prev.priceRange.filter(
                                      (r) => r.label !== range.label
                                    ),
                              }));
                            }}
                            className="mr-2"
                          />
                          <span>{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="mb-4">
                <h3 className="mb-2 font-medium">Rating</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 4}
                      onChange={() =>
                        setFilters((prev) => ({ ...prev, rating: 4 }))
                      }
                      className="mr-2"
                    />
                    <span>4★ & above</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 3}
                      onChange={() =>
                        setFilters((prev) => ({ ...prev, rating: 3 }))
                      }
                      className="mr-2"
                    />
                    <span>3★ & above</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="col-span-12 md:col-span-9">
          <div className="grid gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md"
              >
                <div className="grid grid-cols-12 gap-6">
                  {/* Image Section */}
                  <div className="flex items-center justify-center col-span-12 md:col-span-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-contain w-full h-48 rounded"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="col-span-12 md:col-span-9">
                    {/* Title and Rating */}
                    <div className="mb-4">
                      <h2 className="mb-2 text-xl font-medium">{item.name}</h2>
                      <div className="flex items-center space-x-4">
                        <RatingStars rating={item.rating} />
                        <span className="text-sm text-gray-600">
                          ({item.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold">
                        ₹{parseInt(item.discountedPrice).toLocaleString()}
                      </span>
                      {parseInt(item.originalPrice) >
                        parseInt(item.discountedPrice) && (
                        <>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{parseInt(item.originalPrice).toLocaleString()}
                          </span>
                          <span className="ml-2 text-sm font-medium text-green-600">
                            {Math.round(
                              ((parseInt(item.originalPrice) -
                                parseInt(item.discountedPrice)) /
                                parseInt(item.originalPrice)) *
                                100
                            )}
                            % off
                          </span>
                        </>
                      )}
                    </div>

                    {/* Specifications Grid */}
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {Object.entries(item.specifications).map(
                          ([key, value], index) => (
                            <div key={index}>
                              <span className="text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="ml-2 font-medium">{value}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h3 className="mb-2 font-medium">Features:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {item.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <span className="w-2 h-2 mr-2 bg-gray-400 rounded-full"></span>
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button className="flex-1 px-6 py-2 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white">
                        Add to Cart
                      </button>
                      <button className="flex-1 px-6 py-2 text-black transition-all duration-300 bg-white border border-black rounded-md hover:bg-black hover:text-white">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;