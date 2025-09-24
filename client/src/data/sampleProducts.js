export const sampleProducts = [
  // New Arrivals (created in last 7 days)
  {
    _id: "new-1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-canceling wireless headphones with 30-hour battery life",
    price: 129.99,
    originalPrice: 159.99,
    quantity: 25,
    category: "Audio & video",
    brand: "SoundMaster",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: [
      { key: "Battery Life", value: "30 hours" },
      { key: "Connectivity", value: "Bluetooth 5.0" },
      { key: "Noise Cancellation", value: "Active" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    vendor: { _id: "vendor-1", username: "TechStore", email: "tech@example.com" }
  },
  {
    _id: "new-2",
    name: "Smart LED Light Bulb Pack",
    description: "WiFi-enabled smart bulbs with voice control and 16 million colors",
    price: 49.99,
    quantity: 50,
    category: "Smart home",
    brand: "Lumify",
    images: [
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: [
      { key: "Wattage", value: "9W" },
      { key: "Colors", value: "16 million" },
      { key: "Control", value: "Voice & App" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    vendor: { _id: "vendor-2", username: "SmartHome", email: "smart@example.com" }
  },
  {
    _id: "new-3",
    name: "Portable Bluetooth Speaker",
    description: "Waterproof portable speaker with 360-degree sound",
    price: 79.99,
    quantity: 30,
    category: "Audio & video",
    brand: "WaveSound",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: [
      { key: "Waterproof", value: "IPX7" },
      { key: "Battery", value: "20 hours" },
      { key: "Sound", value: "360°" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    vendor: { _id: "vendor-1", username: "TechStore", email: "tech@example.com" }
  },

  // Trending Products (higher prices)
  {
    _id: "trend-1",
    name: "4K Smart TV 55\"",
    description: "Ultra HD Smart TV with HDR and built-in streaming apps",
    price: 699.99,
    originalPrice: 899.99,
    quantity: 15,
    category: "Audio & video",
    brand: "VisionTech",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: [
      { key: "Resolution", value: "4K Ultra HD" },
      { key: "Screen Size", value: "55 inches" },
      { key: "HDR", value: "Yes" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-3", username: "ElectronicsHub", email: "electronics@example.com" }
  },
  {
    _id: "trend-2",
    name: "Gaming Laptop Pro",
    description: "High-performance gaming laptop with RTX graphics",
    price: 1499.99,
    quantity: 8,
    category: "PCs & laptop",
    brand: "GameTech",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: [
      { key: "Processor", value: "Intel i7-12700H" },
      { key: "Graphics", value: "RTX 3070" },
      { key: "RAM", value: "16GB DDR4" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-4", username: "GamingStore", email: "gaming@example.com" }
  },
  {
    _id: "trend-3",
    name: "Smartphone Pro Max",
    description: "Latest flagship smartphone with advanced camera system",
    price: 1199.99,
    quantity: 20,
    category: "Gadgets",
    brand: "PhoneTech",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Storage", value: "256GB" },
      { key: "Camera", value: "Triple 48MP" },
      { key: "Battery", value: "4500mAh" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-5", username: "MobileWorld", email: "mobile@example.com" }
  },

  // Electronics Section
  {
    _id: "elec-1",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation",
    price: 159.99,
    quantity: 40,
    category: "Audio & video",
    brand: "SoundPro",
    images: [
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Battery", value: "6 hours" },
      { key: "Case Battery", value: "24 hours" },
      { key: "Waterproof", value: "IPX4" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-1", username: "TechStore", email: "tech@example.com" }
  },
  {
    _id: "elec-2",
    name: "Smart Watch Series 5",
    description: "Advanced fitness tracking smartwatch with health monitoring",
    price: 299.99,
    quantity: 35,
    category: "Gadgets",
    brand: "WatchTech",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Display", value: "1.4\" AMOLED" },
      { key: "Battery", value: "7 days" },
      { key: "Waterproof", value: "5ATM" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-6", username: "WearableTech", email: "wearable@example.com" }
  },
  {
    _id: "elec-3",
    name: "Smart Security Camera",
    description: "1080p wireless security camera with night vision",
    price: 89.99,
    quantity: 60,
    category: "Smart home",
    brand: "SecureHome",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Resolution", value: "1080p" },
      { key: "Night Vision", value: "Yes" },
      { key: "Storage", value: "Cloud + SD" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-2", username: "SmartHome", email: "smart@example.com" }
  },

  // Kitchen Appliances
  {
    _id: "kitchen-1",
    name: "Stand Mixer Professional",
    description: "Professional stand mixer with 10-speed settings",
    price: 399.99,
    quantity: 12,
    category: "Kitchen appliances",
    brand: "MixMaster",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Power", value: "1000W" },
      { key: "Speeds", value: "10 speeds" },
      { key: "Bowl Capacity", value: "5.5L" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-7", username: "KitchenPro", email: "kitchen@example.com" }
  },
  {
    _id: "kitchen-2",
    name: "Coffee Maker Deluxe",
    description: "Programmable coffee maker with built-in grinder",
    price: 199.99,
    quantity: 25,
    category: "Kitchen appliances",
    brand: "BrewMaster",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Capacity", value: "12 cups" },
      { key: "Grinder", value: "Built-in" },
      { key: "Timer", value: "24-hour" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-7", username: "KitchenPro", email: "kitchen@example.com" }
  },

  // Air Conditioner
  {
    _id: "ac-1",
    name: "Split AC 1.5 Ton",
    description: "Energy-efficient split air conditioner with inverter technology",
    price: 599.99,
    quantity: 8,
    category: "Air conditioner",
    brand: "CoolTech",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Capacity", value: "1.5 Ton" },
      { key: "Type", value: "Split AC" },
      { key: "Energy Rating", value: "5 Star" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-8", username: "ClimateControl", email: "climate@example.com" }
  },

  // Refrigerator
  {
    _id: "fridge-1",
    name: "French Door Refrigerator",
    description: "Large capacity French door refrigerator with ice maker",
    price: 1299.99,
    quantity: 5,
    category: "Refrigerator",
    brand: "CoolMaster",
    images: [
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Capacity", value: "25 cu ft" },
      { key: "Doors", value: "French Door" },
      { key: "Ice Maker", value: "Built-in" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-9", username: "ApplianceWorld", email: "appliance@example.com" }
  },

  // Home Appliances
  {
    _id: "home-1",
    name: "Robot Vacuum Cleaner",
    description: "Smart robot vacuum with mapping and app control",
    price: 299.99,
    quantity: 20,
    category: "Home appliances",
    brand: "CleanBot",
    images: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Battery", value: "120 min" },
      { key: "Mapping", value: "LIDAR" },
      { key: "Control", value: "App + Voice" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-10", username: "SmartClean", email: "clean@example.com" }
  },
  {
    _id: "home-2",
    name: "Washing Machine Front Load",
    description: "Energy-efficient front load washing machine",
    price: 799.99,
    quantity: 15,
    category: "Home appliances",
    brand: "WashPro",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
    ],
    specifications: [
      { key: "Capacity", value: "9kg" },
      { key: "Type", value: "Front Load" },
      { key: "Energy Rating", value: "A+++" }
    ],
    status: "active",
    createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
    vendor: { _id: "vendor-9", username: "ApplianceWorld", email: "appliance@example.com" }
  }
]; 