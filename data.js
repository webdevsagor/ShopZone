/* ShopZone — product & category data */
const CATEGORIES = [
  { id: 'sneakers',    name: 'Sneakers',    icon: 'shoe',       desc: 'Lightweight runners, classic courts and everyday kicks.' },
  { id: 'headphones',  name: 'Headphones',  icon: 'headset',    desc: 'Wireless, noise-cancelling and studio-grade sound.' },
  { id: 'smartwatches',name: 'Smartwatches',icon: 'watch',      desc: 'Track fitness, notifications and sleep on your wrist.' },
  { id: 'backpacks',   name: 'Backpacks',   icon: 'bag',        desc: 'Commuter, travel and hiking packs built to last.' },
  { id: 'accessories', name: 'Accessories', icon: 'glasses',    desc: 'Sunglasses, wallets, belts and the little finishing touches.' },
  { id: 'fashion',     name: 'Fashion',     icon: 'shirt',      desc: 'Comfortable, modern clothing for every season.' }
];

const IMG_IDS = {
  sneakers:     ['photo-1542291026-7eec264c27ff','photo-1491553895911-0055eca6402d','photo-1460353581641-37baddab0fa2','photo-1595950653106-6c9ebd614d3a'],
  headphones:   ['photo-1505740420928-5e560c06d30e','photo-1583394838336-acd977736f90','photo-1484704849700-f032a568e944','photo-1546435770-a3e426bf472b'],
  smartwatches: ['photo-1523275335684-37898b6baf30','photo-1546868871-7041f2a55e12','photo-1579586337278-3befd40fd17a','photo-1508685096489-7aacd43bd3b1'],
  backpacks:    ['photo-1553062407-98eeb64c6a62','photo-1622560480605-d83c853bc5c3','photo-1581605405669-fcdf81165afa','photo-1491637639811-60e2756cc1c7'],
  accessories:  ['photo-1572635196237-14b3f281503f','photo-1511499767150-a48a237f0083','photo-1627123424574-724758594e93','photo-1584917865442-de89df76afd3'],
  fashion:      ['photo-1521572163474-6864f9cf17ab','photo-1576566588028-4147f3842f27','photo-1551028719-00167b16eac5','photo-1489987707025-afc232f7ea0f']
};

const unsplash = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const CAT_INFO = {
  sneakers:     { tags: ['Lightweight','Breathable','Stylish'], sizes: ['6','7','8','9','10','11'], features: ['Responsive cushioned midsole','Breathable engineered mesh upper','Durable high-traction outsole','Padded collar for all-day comfort'], specs: [['Material','Mesh & synthetic'],['Sole','Rubber / EVA'],['Fit','True to size'],['Care','Wipe clean with damp cloth']] },
  headphones:   { tags: ['Wireless','Deep Bass','Long Battery'], sizes: [], features: ['Bluetooth 5.3 with stable connection','Up to 30 hours of playtime','Built-in microphone for clear calls','Soft memory-foam ear cushions'], specs: [['Connectivity','Bluetooth 5.3 / AUX'],['Battery','Up to 30 hours'],['Charging','USB-C, 10 min = 3 hrs'],['Weight','250 g']] },
  smartwatches: { tags: ['AMOLED','Fitness','Water-resistant'], sizes: [], features: ['Bright AMOLED always-on display','Heart-rate, SpO2 and sleep tracking','100+ workout modes with GPS','5 ATM water resistance'], specs: [['Display','1.4" AMOLED'],['Battery','Up to 10 days'],['Water rating','5 ATM'],['Compatibility','Android & iOS']] },
  backpacks:    { tags: ['Water-resistant','Spacious','Durable'], sizes: [], features: ['Padded compartment fits a 15" laptop','Water-resistant, tear-proof fabric','Ergonomic breathable back panel','Hidden anti-theft back pocket'], specs: [['Capacity','25 L'],['Material','Ripstop polyester'],['Laptop fit','Up to 15.6"'],['Weight','0.9 kg']] },
  accessories:  { tags: ['Classic','Premium','Everyday'], sizes: [], features: ['Premium materials, carefully finished','Designed to match any outfit','Built to hold up to daily use','Gift-ready packaging included'], specs: [['Material','Premium blend'],['Warranty','12 months'],['Origin','Imported'],['Care','Keep dry, wipe clean']] },
  fashion:      { tags: ['Soft Fabric','Modern Fit','All-season'], sizes: ['S','M','L','XL','XXL'], features: ['Soft, breathable fabric','Modern, flattering cut','Colour-fast and shrink-resistant','Easy machine-wash care'], specs: [['Fabric','Cotton blend'],['Fit','Regular'],['Care','Machine wash cold'],['Origin','Imported']] }
};

const COLORS = [['Midnight','#101827'],['Ocean','#0a6bff'],['Silver','#c9d1dc'],['Crimson','#d6334a']];

/* id, name, category, price, discount%, rating, reviews, image index, short description */
const _raw = [
  [1,'UltraBoost Sneakers','sneakers',79.99,20,4.8,124,0,'Cloud-soft cushioning meets a sleek, race-inspired silhouette. Built for the daily run and the city walk alike.'],
  [2,'Wireless Headphones','headphones',50.99,15,4.7,98,0,'Rich, balanced sound with punchy bass and a lightweight fold-flat design you can wear all day.'],
  [3,'Smart Watch Pro','smartwatches',179.99,10,4.6,76,0,'A premium smartwatch with a vivid AMOLED display, precise GPS and complete health tracking.'],
  [4,'Travel Backpack','backpacks',59.99,25,4.5,62,0,'A clean, minimal backpack with smart organisation for work days, weekends and short trips.'],
  [5,'Classic Sunglasses','accessories',40.99,18,4.4,53,0,'Timeless gold-frame sunglasses with UV400 lenses that look sharp with anything.'],
  [6,'Premium Sneakers','sneakers',89.99,10,4.9,142,1,'Our top-of-the-line sneaker: ultra-light, breathable and made to turn heads.'],
  [7,'Urban Runner','sneakers',64.99,10,4.6,88,2,'A versatile everyday runner with a soft foam sole and a clean low-profile look.'],
  [8,'Court Classic Low','sneakers',74.99,15,4.5,61,3,'Retro court style with a modern comfort footbed. Easy to dress up or down.'],
  [9,'Trail Blazer GTX','sneakers',99.99,12,4.7,47,0,'Grippy, weather-ready trail shoes for muddy paths and wet pavements.'],
  [10,'Sprint Lite','sneakers',54.99,18,4.3,95,2,'Featherweight trainers for gym sessions and quick weekday runs.'],
  [11,'BassPro Over-Ear','headphones',89.99,20,4.6,71,1,'Big drivers, deeper bass and plush ear cups for long listening sessions.'],
  [12,'AirBuds Mini','headphones',39.99,25,4.4,142,2,'Pocket-sized true wireless earbuds with a compact charging case.'],
  [13,'StudioMax ANC','headphones',149.99,10,4.8,56,3,'Adaptive active noise cancelling and studio-tuned sound for focus anywhere.'],
  [14,'Sport Neckband','headphones',24.99,30,4.3,203,0,'Sweat-proof, secure-fit neckband earphones for runs and workouts.'],
  [15,'FitBand Lite','smartwatches',49.99,20,4.4,119,1,'A slim fitness band with 14-day battery life and everyday activity tracking.'],
  [16,'Active Watch S2','smartwatches',99.99,15,4.5,82,2,'Sporty smartwatch with built-in GPS, music control and call alerts.'],
  [17,'Classic Hybrid Watch','smartwatches',129.99,12,4.3,38,3,'Analog looks with smart features hidden inside. Perfect for the office.'],
  [18,'Kids Tracker','smartwatches',34.99,10,4.2,29,1,'A colourful, rugged activity tracker designed for little wrists.'],
  [19,'Urban Commuter','backpacks',49.99,15,4.6,77,1,'Streamlined commuter pack with quick-access pockets and a padded sleeve.'],
  [20,'Hiker 40L','backpacks',84.99,10,4.7,44,2,'High-capacity trekking pack with a ventilated frame and rain cover.'],
  [21,'Laptop Slim Pack','backpacks',44.99,20,4.4,91,3,'Slim, light and professional. Holds your laptop, charger and essentials.'],
  [22,'Mini Daypack','backpacks',29.99,18,4.3,53,1,'Small but surprisingly roomy, perfect for errands and city days out.'],
  [23,'Leather Wallet','accessories',24.99,20,4.5,134,1,'Slim genuine-leather wallet with RFID protection and six card slots.'],
  [24,'Canvas Belt','accessories',17.99,10,4.2,40,2,'Durable woven belt with a brushed metal buckle. Fits waists 28–42".'],
  [25,'Wool Beanie','accessories',14.99,15,4.6,66,3,'Warm, soft knit beanie that keeps its shape wash after wash.'],
  [26,'Aviator Pro Polarized','accessories',54.99,22,4.7,58,0,'Polarized aviators with lightweight metal frames and anti-glare lenses.'],
  [27,'Essential Cotton Tee','fashion',19.99,20,4.5,210,0,'A premium heavyweight cotton tee, the one you will reach for every day.'],
  [28,'Denim Jacket','fashion',69.99,15,4.6,64,1,'A classic wash denim jacket with a flattering, structured fit.'],
  [29,'Pullover Hoodie','fashion',44.99,25,4.7,158,2,'Brushed-fleece hoodie that is warm, soft and endlessly wearable.'],
  [30,'Bomber Jacket','fashion',79.99,18,4.5,49,3,'Lightweight bomber with ribbed cuffs and a smooth satin lining.']
];

const PRODUCTS = _raw.map(([id, name, cat, price, off, rating, reviews, i, desc]) => {
  const imgs = IMG_IDS[cat];
  const old = Math.ceil(price / (1 - off / 100)) - 0.01;
  return {
    id, name, cat, price, off, rating, reviews, desc,
    old: +old.toFixed(2),
    img: unsplash(imgs[i % imgs.length]),
    gallery: [0, 1, 2, 3].map(k => unsplash(imgs[(i + k) % imgs.length])),
    isNew: id > 24 || id === 6,
    ...CAT_INFO[cat]
  };
});

const FEATURED_IDS = [1, 2, 3, 4, 5];
const getProduct = id => PRODUCTS.find(p => p.id === +id);
const getCategory = id => CATEGORIES.find(c => c.id === id);
