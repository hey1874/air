/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
// =============== 1. 全局状态初始化 ===============
let currentScale = 1.0;
const MAX_SCALE = 1.5;
const MIN_SCALE = 0.4;
let isLiveMode = false;
let isDetailEditMode = false;

let currentCategory = '壁挂式'; 
let currentHpFilter = 'all';
let maxBudget = 38000; 
let cart = []; 
let pkList = []; 
let editingProduct = null;
let excelCurrentCategory = "壁挂式"; 
let hoveredImageIndex = -1;
let currentUploadIndex = -1;

const rawDatabase = {
    "壁挂式": [
        { name: "华凌/神机N8HE1 1.5匹", tags: "神机 | 电子膨胀阀", officialPrice: "2399", guidePrice: "2099", isHot: true, specs: { brand: "华凌", modelId: "KFR-35GW/N8HE1", applicableArea: "15-20㎡", coolingPower: "810W", airflow: "710m³/h", inMaxNoise: "41dB(A)", outMaxNoise: "51dB(A)", sweep: "上下/左右扫风", heatingPower: "1250W", heatingCapacity: "5000W", coolingCapacity: "3500W", inNoiseQuiet: "18dB(A)", refrigerant: "R32", voltage: "220V/50Hz", outDimensions: "802x555x350mm", inDimensions: "880x295x195mm", outWeight: "31kg", inWeight: "10.5kg", apf: "5.27", inverter: "变频", hp: "1.5匹", controlMode: "APP/遥控", type: "壁挂式", energyLevel: "一级能效", coolHeatType: "冷暖", features: "一键防直吹 自清洁，包含：室内机*1，室外机*1，遥控器*1" } },
        { name: "格力/云佳 1.5匹", tags: "销量冠军 | 稳定耐用", officialPrice: "3199", guidePrice: "2899", isHot: true, specs: { brand: "格力", modelId: "KFR-35GW/NhGc1B", applicableArea: "16-20㎡", coolingPower: "810W", airflow: "640m³/h", apf: "5.28", inverter: "变频", hp: "1.5匹", controlMode: "遥控", type: "壁挂式", energyLevel: "一级能效", coolHeatType: "冷暖" } }
    ],
    "立柜式": [
        { name: "美的/锐云 3匹", tags: "大风量 | 广角送风", officialPrice: "6499", guidePrice: "5899", isHot: true, specs: { brand: "美的", modelId: "KFR-72LW/N8XHA1", applicableArea: "30-40㎡", coolingPower: "2100W", airflow: "1300m³/h", apf: "4.42", inverter: "变频", hp: "3匹", type: "立柜式", energyLevel: "一级能效", coolHeatType: "冷暖" } }
    ],
    "风管机": [], "中央空调": []
};

function generateDynamicImage(name, category) {
    let typePath = '';
    if (category === '壁挂式') typePath = '<rect x="30" y="60" width="140" height="45" rx="10" fill="#ffffff" stroke="#3b82f6" stroke-width="4"/><line x1="50" y1="90" x2="150" y2="90" stroke="#3b82f6" stroke-width="2"/>';
    else if (category === '立柜式') typePath = '<rect x="65" y="20" width="70" height="150" rx="10" fill="#ffffff" stroke="#3b82f6" stroke-width="4"/><rect x="80" y="40" width="40" height="30" rx="5" fill="#eff6ff"/>';
    else if (category === '风管机') typePath = '<rect x="25" y="75" width="150" height="35" fill="#ffffff" stroke="#3b82f6" stroke-width="4"/>';
    else typePath = '<rect x="50" y="50" width="100" height="100" fill="#ffffff" stroke="#3b82f6" stroke-width="4" rx="10"/><circle cx="100" cy="100" r="18" fill="#ffffff" stroke="#3b82f6" stroke-width="3"/>';
    const shortBrand = name.split('/')[0].split(' ')[0] || "空调";
    const svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200" fill="#f8f9fa"><rect width="200" height="200" rx="20"/>\${typePath}<text x="100" y="188" font-family="sans-serif" font-size="16" font-weight="bold" fill="#333333" text-anchor="middle">\${shortBrand}</text></svg>\`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

let productDatabase = {};
Object.keys(rawDatabase).forEach(category => { productDatabase[category] = rawDatabase[category].map(p => ({ ...p, img: generateDynamicImage(p.name, category) })); });

// =============== 2. 通用交互与缩放逻辑 ===============
window.changeScale = function(delta) { currentScale = Math.min(Math.max(currentScale + delta, MIN_SCALE), MAX_SCALE); applyScale(); }
window.resetScale = function() { currentScale = 1.0; applyScale(); }
window.toggleLiveMode = function() { isLiveMode = !isLiveMode; currentScale = isLiveMode ? 0.85 : 1.0; applyScale(); }
function applyScale() {
    const container = document.getElementById('app-container'), display = document.getElementById('scale-display'), liveBtn = document.getElementById('btn-live-mode');
    isLiveMode = Math.abs(currentScale - 0.85) < 0.01;
    if (isLiveMode) {
        document.body.style.overflow = 'hidden';
        container.style.position = 'fixed'; container.style.top = '40px'; container.style.left = '50%'; container.style.marginLeft = '-195px';
        if (liveBtn) { liveBtn.classList.remove('bg-red-600', 'hover:bg-red-500'); liveBtn.classList.add('bg-green-600', 'hover:bg-green-500'); liveBtn.innerHTML = '<i class="fa-solid fa-video-slash"></i> 退出'; }
    } else {
        document.body.style.overflow = '';
        container.style.position = 'relative'; container.style.top = 'auto'; container.style.left = 'auto'; container.style.marginLeft = '0';
        if (liveBtn) { liveBtn.classList.remove('bg-green-600', 'hover:bg-green-500'); liveBtn.classList.add('bg-red-600', 'hover:bg-red-500'); liveBtn.innerHTML = '<i class="fa-solid fa-video"></i> 直播'; }
    }
    container.style.transform = \`scale(\${currentScale})\`; display.innerText = Math.round(currentScale * 100) + '%';
}

window.openModal = function(id) { const el = document.getElementById(id); if(el) { el.style.display = 'flex'; setTimeout(() => el.classList.add('show'), 10); } }
window.closeModal = function(id) { const el = document.getElementById(id); if(el) { el.classList.remove('show'); setTimeout(() => el.style.display = 'none', 300); } }
window.openPreview = function(src) { const img = document.getElementById('modal-image'); if(img) { img.src = src; openModal('image-modal'); } }
function findProductByName(name) { 
    for(const cat in productDatabase) {
        const found = productDatabase[cat].find(x => x.name === name);
        if (found) return found;
    }
    return null;
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        const openModals = Array.from(document.querySelectorAll('.form-modal.show, .image-modal.show, #crop-modal:not(.hidden), #batch-paste-modal:not(.hidden), #receipt-modal:not(.hidden), .excel-modal-container[style*="display: flex"]'));
        if (openModals.length > 0) {
            openModals.sort((a, b) => (parseInt(window.getComputedStyle(b).zIndex) || 0) - (parseInt(window.getComputedStyle(a).zIndex) || 0));
            if(openModals[0].id === 'crop-modal') { closeCropModal(); }
            else if(openModals[0].id === 'batch-paste-modal') { closeBatchPasteModal(); }
            else if(openModals[0].classList.contains('form-modal') || openModals[0].classList.contains('image-modal')) { closeModal(openModals[0].id); }
            else { openModals[0].style.display = 'none'; } 
        }
    }
});

// =============== 3. 前台 UI 渲染 (分类、热门、列表、筛选) ===============
const categoryIcons = { '壁挂式': 'fa-wind', '立柜式': 'fa-fan', '风管机': 'fa-bars-staggered', '中央空调': 'fa-snowflake' };

function renderSidebar() {
    const sidebar = document.getElementById('sidebar-categories'); if(!sidebar) return;
    sidebar.innerHTML = '';
    Object.keys(productDatabase).filter(k => k !== '__columns__' && k !== '__templates__').forEach(cat => {
        const div = document.createElement('div');
        div.className = \`sidebar-item relative py-3 px-2 flex flex-col items-center justify-center text-gray-500 cursor-pointer \${cat === currentCategory ? 'active' : ''}\`;
        div.onclick = () => { 
            currentCategory = cat; 
            currentHpFilter = 'all'; 
            renderSidebar(); 
            renderHpFilters(currentCategory);
            renderProducts(currentCategory); 
            renderHotProducts(currentCategory); 
            const scrollArea = document.getElementById('product-list-scroll');
            if(scrollArea) scrollArea.scrollTop = 0; 
        };
        div.innerHTML = \`<i class="fa-solid \${categoryIcons[cat] || 'fa-tag'} text-lg mb-1 \${cat === currentCategory ? 'text-blue-500' : 'text-gray-400'}"></i><span class="text-[10px] text-center w-full">\${cat}</span>\`;
        sidebar.appendChild(div);
    });
}

function renderHpFilters(cat) {
    const container = document.getElementById('hp-filter-container');
    if (!container) return;
    const products = productDatabase[cat] || [];
    
    const hpSet = new Set();
    products.forEach(p => {
        if (p.specs && p.specs.hp && p.specs.hp.trim()) {
            hpSet.add(p.specs.hp.trim());
        }
    });
    
    let hpList = Array.from(hpSet).sort((a, b) => {
        const numA = parseFloat(a.match(/[\\d\\.]+/) || 0);
        const numB = parseFloat(b.match(/[\\d\\.]+/) || 0);
        if(numA === numB) return a.localeCompare(b);
        return numA - numB;
    });
    
    let html = \`<div class="px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors border \${currentHpFilter === 'all' ? 'bg-blue-500 text-white border-blue-500 shadow-sm' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}" onclick="setHpFilter('all')">全部</div>\`;
    
    hpList.forEach(hp => {
        const isActive = currentHpFilter === hp;
        html += \`<div class="px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors border \${isActive ? 'bg-blue-500 text-white border-blue-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}" onclick="setHpFilter('\${hp}')">\${hp}</div>\`;
    });
    
    container.innerHTML = html;
    container.style.display = hpList.length > 0 ? 'flex' : 'none';
}

window.setHpFilter = function(hp) {
    currentHpFilter = hp;
    renderHpFilters(currentCategory);
    renderProducts(currentCategory);
}

function renderHotProducts(cat) {
    const container = document.getElementById('hot-container'); if(!container) return;
    const products = productDatabase[cat] || [];
    let hotOnes = products.filter(p => p.isHot).slice(0, 2); let html = '';
    for (let i = 0; i < 2; i++) {
        if (i < hotOnes.length) {
            const p = hotOnes[i]; const shortName = p.name.includes('/') ? p.name.split('/')[1] : p.name;
            html += \`<div class="hot-card bg-gray-50 p-2 rounded-xl min-w-[160px] flex items-center space-x-2 cursor-pointer shadow-sm" onclick="openDetail('\${p.name}')">
                <img src="\${p.img}" class="hot-img w-10 h-10 rounded object-cover bg-white border border-gray-100 flex-shrink-0" onclick="event.stopPropagation(); openPreview('\${p.img}')">
                <div class="flex-1 overflow-hidden"><div class="text-[11px] font-bold text-gray-800 leading-tight line-clamp-2" title="\${p.name}">\${shortName}</div><div class="text-[10px] text-red-500 mt-0.5">\${p.guidePrice === '面议' ? '面议' : '¥'+p.guidePrice} <span class="text-gray-400 line-through scale-90 inline-block">¥\${p.officialPrice}</span></div></div>
            </div>\`;
        } else {
            html += \`<div class="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 p-2 rounded-xl min-w-[160px] cursor-pointer text-gray-400" onclick="openModal('hot-choice-modal')"><i class="fa-solid fa-plus mr-2 text-gray-400"></i><span class="text-xs font-bold">添加推荐</span></div>\`;
        }
    } container.innerHTML = html;
}

function renderProducts(cat) {
    const container = document.getElementById('product-container'); if(!container) return;
    let products = productDatabase[cat] || [];
    
    if (currentHpFilter !== 'all') {
        products = products.filter(p => p.specs && p.specs.hp && p.specs.hp.trim() === currentHpFilter);
    }
    
    if (products.length === 0) return container.innerHTML = '<div style="text-align:center;padding:30px;color:#999;font-size:12px;">暂无符合条件的数据，请进入后台录入</div>';
    let html = '';
    products.forEach(p => {
        const isNego = p.guidePrice === '面议'; const inPk = pkList.some(item => item.name === p.name);
        const vsClass = inPk ? 'bg-orange-50 text-orange-500 border-orange-500' : 'text-gray-400 border-gray-300';
        html += \`<div class="product-item bg-white rounded-xl p-2 shadow-sm flex items-center relative mb-2">
            <div class="w-8 flex flex-col items-center cursor-pointer" onclick="openPreview('\${p.img}')"><img src="\${p.img}" class="w-7 h-7 rounded object-cover mb-1 border border-gray-100"><span class="text-[8px] text-gray-400 font-medium text-center">\${cat.replace('式','')}</span></div>
            <div class="flex-1 px-1 border-l border-gray-100 ml-1 flex flex-col items-center justify-center cursor-pointer overflow-hidden" onclick="openDetail('\${p.name}')">
                <div class="text-[11px] font-bold text-gray-800 leading-tight text-center w-full truncate">\${p.name}</div>
                <div class="text-[8px] bg-blue-50 text-blue-600 border border-blue-100 font-mono px-2 py-[2px] rounded-full my-0.5 max-w-full truncate">\${p.specs?.modelId || '标准款'}</div>
                <div class="text-[9px] text-orange-500 font-medium text-center w-full truncate">\${p.tags}</div>
            </div>
            <div class="w-[40px] text-center text-[10px] text-gray-500 font-medium">\${p.officialPrice}</div>
            <div class="w-[50px] flex flex-col items-center justify-center gap-1">
                <div class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer hover:bg-red-600 w-full text-center shadow-sm transition-colors" onclick="addToCart(event, '\${p.name}')">\${isNego ? '面议' : p.guidePrice}</div>
                <div class="text-[8px] border px-1 rounded cursor-pointer w-full text-center \${vsClass}" onclick="togglePK(event, '\${p.name}')">VS 对比</div>
            </div>
        </div>\`;
    }); container.innerHTML = html;
}

// =============== 4. 购物车、PK与配置清单生成功能 ===============
window.togglePK = function(e, name) {
    e.stopPropagation(); const p = findProductByName(name); if (!p) return;
    const idx = pkList.findIndex(item => item.name === name);
    if (idx > -1) pkList.splice(idx, 1); else { if (pkList.length >= 2) return alert("最多只能对比 2 款"); pkList.push(p); }
    const badge = document.getElementById('pk-badge'); if(badge){ badge.style.display = pkList.length > 0 ? 'flex' : 'none'; badge.innerText = pkList.length; }
    renderProducts(currentCategory); 
}
window.triggerPK = function() {
    if (pkList.length !== 2) return alert("请先选满 2 款产品进行对比");
    const p1 = pkList[0], p2 = pkList[1];
    document.getElementById('pk-img-1').innerHTML = \`<img src="\${p1.img}" class="w-16 h-16 object-cover mx-auto">\`; document.getElementById('pk-img-2').innerHTML = \`<img src="\${p2.img}" class="w-16 h-16 object-cover mx-auto">\`;
    document.getElementById('pk-name-1').innerText = p1.name; document.getElementById('pk-name-2').innerText = p2.name;
    document.getElementById('pk-off-1').innerText = '¥'+p1.officialPrice; document.getElementById('pk-off-2').innerText = '¥'+p2.officialPrice;
    document.getElementById('pk-guide-1').innerText = p1.guidePrice; document.getElementById('pk-guide-2').innerText = p2.guidePrice;
    document.getElementById('pk-apf-1').innerText = p1.specs?.apf||'-'; document.getElementById('pk-apf-2').innerText = p2.specs?.apf||'-';
    openModal('pk-result-modal');
}
window.clearPK = function() { pkList = []; const badge = document.getElementById('pk-badge'); if(badge){badge.style.display = 'none';} renderProducts(currentCategory); closeModal('pk-result-modal'); }

window.addToCart = function(e, name) {
    e.stopPropagation(); const p = findProductByName(name); if (!p) return;
    const itemToAdd = {...p};
    if (!itemToAdd.specs) itemToAdd.specs = {};
    if (!itemToAdd.specs.type) {
        for(let cat in productDatabase) {
            if(productDatabase[cat].find(x => x.name === itemToAdd.name)) {
                itemToAdd.specs.type = cat;
                break;
            }
        }
    }
    
    cart.push(itemToAdd); updateCartUI();
    const dot = document.createElement('div'); dot.style.cssText = \`position:fixed;left:\${e.clientX}px;top:\${e.clientY}px;width:12px;height:12px;background:#3b82f6;border-radius:50%;z-index:9999;transition:all 0.5s ease-in;\`;
    document.body.appendChild(dot); 
    const targetEl = document.getElementById('btn-cart');
    if(targetEl) {
        const target = targetEl.getBoundingClientRect();
        setTimeout(() => { dot.style.left = (target.left+10)+'px'; dot.style.top = (target.top+10)+'px'; dot.style.transform = 'scale(0.1)'; dot.style.opacity = '0'; }, 10);
    }
    setTimeout(() => dot.remove(), 550);
}

function updateCartUI() {
    let total = cart.reduce((sum, item) => sum + (parseInt(item.guidePrice) || 0), 0);
    const badge = document.getElementById('cart-badge'); 
    if(badge){ badge.style.display = cart.length > 0 ? 'flex' : 'none'; badge.innerText = cart.length; }
    
    let remaining = maxBudget - total;
    const colorClass = remaining < 0 ? 'text-red-600' : 'text-orange-600';
    const currentEl = document.getElementById('budget-current'); 
    if(currentEl) {
        currentEl.className = \`text-2xl font-black ml-2 transition-colors \${colorClass}\`;
        currentEl.innerText = \`¥\${remaining}\`; 
    }
    
    const maxEl = document.getElementById('budget-max'); if(maxEl) maxEl.innerText = \`(总预算: ¥\${maxBudget})\`;
    const container = document.getElementById('cart-items-container');
    if(!container) return;
    container.innerHTML = cart.length === 0 ? '<div class="text-center py-10 text-gray-400 text-xs">清单为空</div>' :
        cart.map((item, i) => \`<div class="flex items-center px-4 py-3 border-b border-gray-50"><img src="\${item.img}" class="w-10 h-10 rounded object-cover"><div class="flex-1 ml-3"><div class="text-xs font-bold text-gray-800">\${item.name}</div><div class="text-[10px] text-blue-500 font-bold mt-0.5">¥\${item.guidePrice}</div></div><div class="text-gray-300 hover:text-red-500 cursor-pointer px-2" onclick="cart.splice(\${i},1); updateCartUI();"><i class="fa-solid fa-trash-can"></i></div></div>\`).join('');
}

// =============== 5. 详情页与预算管理 ===============
window.openDetail = function(name) {
    const p = findProductByName(name); if (!p) return;
    editingProduct = p; isDetailEditMode = false;
    document.getElementById('detail-name').innerText = p.name;
    document.getElementById('detail-tag').innerText = p.tags;
    document.getElementById('detail-model-id').innerText = p.specs?.modelId || '-';
    document.getElementById('detail-guide-price').innerText = p.guidePrice;
    document.getElementById('detail-official-price').innerText = p.officialPrice;
    document.getElementById('detail-energy').innerText = p.specs?.energyLevel || '一级能效';
    document.getElementById('detail-features').innerText = p.features || (p.specs?.features || '暂无详细功能描述');
    
    const grid = document.getElementById('detail-specs-grid'); if(grid) {
        const specs = [
            {label: '品牌', val: p.specs?.brand}, {label: '适用面积', val: p.specs?.applicableArea},
            {label: '制冷功率', val: p.specs?.coolingPower}, {label: '循环风量', val: p.specs?.airflow},
            {label: 'APF值', val: p.specs?.apf}, {label: '变频/定频', val: p.specs?.inverter}
        ];
        grid.innerHTML = specs.map(s => \`<div class="bg-gray-50 p-3 rounded-2xl border border-gray-100"><div class="text-[9px] text-gray-400 font-bold uppercase mb-1">\${s.label}</div><div class="text-xs font-black text-gray-800">\${s.val || '-'}</div></div>\`).join('');
    }
    openModal('detail-modal');
}

window.addToCartFromDetail = function() {
    if(editingProduct) { addToCart({stopPropagation:()=>{}, clientX: window.innerWidth/2, clientY: window.innerHeight/2}, editingProduct.name); closeModal('detail-modal'); }
}

window.saveBudget = function() {
    const val = parseInt(document.getElementById('input-budget').value);
    if(isNaN(val) || val <= 0) return alert("请输入有效的预算金额");
    maxBudget = val; updateCartUI(); closeModal('budget-modal'); showToast("预算设置成功");
}

window.showToast = function(msg) {
    const container = document.getElementById('toast-container'); if(!container) return;
    const toast = document.createElement('div'); toast.className = 'toast'; toast.innerText = msg;
    container.appendChild(toast); setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

window.toggleDetailEditMode = function() {
    showToast("演示版本：请在后台管理中修改数据");
}

// =============== 11. 启动全局初始化渲染 ===============
renderSidebar(); 
renderHpFilters('壁挂式'); 
renderProducts('壁挂式'); 
renderHotProducts('壁挂式'); 
updateCartUI();
    `;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: `
<div class="zoom-controller">
    <div class="text-[10px] text-gray-400 font-bold mb-1 tracking-widest">画面缩放</div>
    <button class="zoom-btn" onclick="changeScale(0.1)" title="放大"><i class="fa-solid fa-plus"></i></button>
    <div class="scale-display" id="scale-display">100%</div>
    <button class="zoom-btn" onclick="changeScale(-0.1)" title="缩小"><i class="fa-solid fa-minus"></i></button>
    <button class="zoom-btn mt-2" onclick="resetScale()" title="重置"><i class="fa-solid fa-rotate-right"></i></button>
    <button id="btn-live-mode" class="bg-red-600 hover:bg-red-500 text-white w-10 h-10 rounded-full mt-4 flex items-center justify-center shadow-lg transition-all" onclick="toggleLiveMode()" title="直播模式"><i class="fa-solid fa-video"></i></button>
</div>

<div id="app-container" class="app-container">
    <div class="glass-panel sidebar">
        <div class="flex flex-col items-center py-4 space-y-6" id="sidebar-categories">
            <!-- 分类项由 JS 渲染 -->
        </div>
        <div class="mt-auto pb-4 flex flex-col items-center space-y-4">
            <div class="relative cursor-pointer group" onclick="openModal('cart-modal')" id="btn-cart">
                <i class="fa-solid fa-cart-shopping text-gray-400 text-xl group-hover:text-blue-500 transition-colors"></i>
                <div id="cart-badge" class="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white" style="display:none">0</div>
            </div>
            <div class="relative cursor-pointer group" onclick="triggerPK()">
                <i class="fa-solid fa-layer-group text-gray-400 text-xl group-hover:text-orange-500 transition-colors"></i>
                <div id="pk-badge" class="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white" style="display:none">0</div>
            </div>
            <div class="cursor-pointer group" onclick="openModal('admin-modal')">
                <i class="fa-solid fa-gear text-gray-400 text-xl group-hover:text-gray-600 transition-colors"></i>
            </div>
        </div>
    </div>

    <div class="main-content">
        <div class="px-4 pt-4 pb-2 flex items-center justify-between">
            <div class="flex flex-col">
                <div class="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Air Conditioner Guide</div>
                <div class="text-lg font-black text-gray-800 flex items-center">
                    空调选购数据库 <span class="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-[9px] rounded italic">PRO</span>
                </div>
            </div>
            <div class="flex items-center bg-gray-100/80 px-3 py-1.5 rounded-2xl border border-white shadow-inner">
                <i class="fa-solid fa-wallet text-orange-400 text-xs"></i>
                <span id="budget-current" class="text-lg font-black text-orange-600 ml-2">¥38000</span>
                <span id="budget-max" class="text-[9px] text-gray-400 font-bold ml-1">(总预算: ¥38000)</span>
                <i class="fa-solid fa-pen-to-square text-gray-300 ml-2 cursor-pointer hover:text-blue-500" onclick="openModal('budget-modal')"></i>
            </div>
        </div>

        <div class="px-4 py-2">
            <div class="flex items-center justify-between mb-2">
                <div class="text-[10px] text-gray-400 font-bold tracking-widest">今日推荐 / HOT</div>
                <div class="text-[9px] text-blue-500 font-bold cursor-pointer" onclick="openModal('hot-choice-modal')">管理推荐 <i class="fa-solid fa-chevron-right ml-0.5"></i></div>
            </div>
            <div class="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide" id="hot-container">
                <!-- 热门推荐由 JS 渲染 -->
            </div>
        </div>

        <div class="px-4 py-2 flex-1 flex flex-col min-h-0">
            <div class="flex items-center justify-between mb-3">
                <div class="text-[10px] text-gray-400 font-bold tracking-widest">产品列表 / DATABASE</div>
                <div class="flex items-center space-x-2" id="hp-filter-container">
                    <!-- 匹数筛选由 JS 渲染 -->
                </div>
            </div>
            <div class="flex-1 overflow-y-auto pr-1 custom-scrollbar" id="product-list-scroll">
                <div id="product-container" class="space-y-2 pb-4">
                    <!-- 产品列表由 JS 渲染 -->
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 模态框：详情页 -->
<div id="detail-modal" class="form-modal">
    <div class="detail-page">
        <div class="detail-header">
            <div class="p-4 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30" onclick="closeModal('detail-modal')">
                        <i class="fa-solid fa-chevron-left text-white"></i>
                    </div>
                    <div class="text-white font-black text-lg tracking-tight">产品详情</div>
                </div>
                <div class="flex space-x-2">
                    <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30" onclick="toggleDetailEditMode()">
                        <i id="detail-edit-icon" class="fa-solid fa-pen-to-square text-white"></i>
                    </div>
                    <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30" onclick="closeModal('detail-modal')">
                        <i class="fa-solid fa-xmark text-white"></i>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-6 text-white">
                <div id="detail-name" class="text-2xl font-black leading-tight mb-2">华凌/神机N8HE1 1.5匹</div>
                <div class="flex items-center space-x-2">
                    <span id="detail-tag" class="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-md border border-white/10">神机 | 电子膨胀阀</span>
                    <span class="text-white/60 text-[10px] font-bold">ID: <span id="detail-model-id">KFR-35GW/N8HE1</span></span>
                </div>
            </div>
        </div>
        <div class="detail-body">
            <div class="flex items-center justify-between mb-6">
                <div class="flex flex-col">
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Guide Price</div>
                    <div class="flex items-baseline">
                        <span class="text-red-500 text-sm font-black">¥</span>
                        <span id="detail-guide-price" class="text-3xl font-black text-red-500 ml-0.5">2099</span>
                        <span class="text-gray-300 text-xs line-through ml-2">¥<span id="detail-official-price">2399</span></span>
                    </div>
                </div>
                <div class="flex flex-col items-end">
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Energy Level</div>
                    <div class="bg-green-50 text-green-600 px-3 py-1 rounded-lg border border-green-100 flex items-center">
                        <i class="fa-solid fa-leaf text-[10px] mr-1.5"></i>
                        <span id="detail-energy" class="text-xs font-black">一级能效</span>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6" id="detail-specs-grid">
                <!-- 规格参数由 JS 渲染 -->
            </div>

            <div class="mb-6">
                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Core Features</div>
                <div id="detail-features" class="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    一键防直吹 自清洁，包含：室内机*1，室外机*1，遥控器*1
                </div>
            </div>

            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2" onclick="addToCartFromDetail()">
                <i class="fa-solid fa-cart-plus"></i>
                <span>加入选购清单</span>
            </button>
        </div>
    </div>
</div>

<!-- 模态框：购物车/清单 -->
<div id="cart-modal" class="form-modal">
    <div class="glass-panel w-[340px] max-h-[80%] flex flex-col overflow-hidden">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
            <div class="flex items-center">
                <i class="fa-solid fa-cart-shopping text-blue-500 mr-2"></i>
                <span class="font-black text-gray-800">选购清单</span>
            </div>
            <div class="flex items-center space-x-3">
                <span class="text-[10px] text-blue-500 font-bold cursor-pointer" onclick="cart=[]; updateCartUI();">清空</span>
                <i class="fa-solid fa-xmark text-gray-400 cursor-pointer" onclick="closeModal('cart-modal')"></i>
            </div>
        </div>
        <div id="cart-items-container" class="flex-1 overflow-y-auto custom-scrollbar bg-white/50">
            <!-- 购物车项由 JS 渲染 -->
        </div>
        <div class="p-4 bg-white border-t border-gray-100">
            <button class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black text-xs shadow-lg shadow-orange-100 transition-all flex items-center justify-center" onclick="generateReceipt()">
                <i class="fa-solid fa-file-invoice-dollar mr-2"></i> 生成配置单
            </button>
        </div>
    </div>
</div>

<!-- 模态框：预算设置 -->
<div id="budget-modal" class="form-modal">
    <div class="glass-panel w-[300px] p-6">
        <div class="flex items-center justify-between mb-6">
            <span class="font-black text-gray-800">设置总预算</span>
            <i class="fa-solid fa-xmark text-gray-400 cursor-pointer" onclick="closeModal('budget-modal')"></i>
        </div>
        <div class="relative mb-6">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">¥</span>
            <input type="number" id="input-budget" class="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-10 pr-4 text-xl font-black text-gray-800 focus:border-blue-500 outline-none transition-all" placeholder="输入金额">
        </div>
        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-blue-100 transition-all" onclick="saveBudget()">保存设置</button>
    </div>
</div>

<!-- 模态框：PK 对比 -->
<div id="pk-result-modal" class="form-modal">
    <div class="glass-panel w-[360px] overflow-hidden">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <span class="font-black text-gray-800">产品 PK 对比</span>
            <i class="fa-solid fa-xmark text-gray-400 cursor-pointer" onclick="closeModal('pk-result-modal')"></i>
        </div>
        <div class="p-4">
            <table class="pk-table">
                <thead>
                    <tr>
                        <th width="30%">参数</th>
                        <th width="35%" id="pk-img-1"></th>
                        <th width="35%" id="pk-img-2"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>名称</td><td id="pk-name-1" class="font-bold"></td><td id="pk-name-2" class="font-bold"></td></tr>
                    <tr><td>官方价</td><td id="pk-off-1"></td><td id="pk-off-2"></td></tr>
                    <tr><td>指导价</td><td id="pk-guide-1" class="text-red-500 font-bold"></td><td id="pk-guide-2" class="text-red-500 font-bold"></td></tr>
                    <tr><td>APF值</td><td id="pk-apf-1"></td><td id="pk-apf-2"></td></tr>
                </tbody>
            </table>
            <div class="mt-4 flex space-x-2">
                <button class="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs" onclick="clearPK()">清空对比</button>
                <button class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-xs" onclick="closeModal('pk-result-modal')">继续浏览</button>
            </div>
        </div>
    </div>
</div>

<!-- 图片预览 -->
<div id="image-modal" class="image-modal" onclick="closeModal('image-modal')">
    <img id="modal-image" src="" alt="预览">
</div>

<!-- 提示框 -->
<div id="toast-container" class="toast-container"></div>
    ` }} />
  );
}
