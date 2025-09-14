// --- helpers ---
const $ = id => document.getElementById(id);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function hexToRgbA(hex, a = 1) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    return {
        r: (n >> 16) & 255,
        g: (n >> 8) & 255,
        b: n & 255,
        a: Math.min(1, Math.max(0, a))
    };
}

function rgbToSwift({ r, g, b, a }) {
    const f = n => (n / 255).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    const af = a.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    return `Color(red: ${f(r)}, green: ${f(g)}, blue: ${f(b)}, opacity: ${af})`;
}

const cssStop = s => {
    const { r, g, b, a } = hexToRgbA(s.color, s.opacity);
    return `rgba(${r},${g},${b},${a}) ${s.pos}%`;
};

// refs
const typeLinear = $('typeLinear'),
    typeRadial = $('typeRadial'),
    typeAngular = $('typeAngular');

const linearControls = $('linearControls'),
    radialControls = $('radialControls'),
    angularControls = $('angularControls');

const angleEl = $('angle'),
    cX = $('centerX'),
    cY = $('centerY'),
    sR = $('startR'),
    eR = $('endR'),
    aCX = $('aCenterX'),
    aCY = $('aCenterY'),
    aStart = $('aStartAngle');

const stopsEl = $('stops'),
    preview = $('preview');

const pngSizeEl = $('pngSize'),
    packSizesEl = $('packSizes'),
    cssCodeMiniEl = $('cssCodeMini'),
    swiftCodeMiniEl = $('swiftCodeMini');

// --- stop rows ---
function makeStopRow({ color = '#1a1a40', pos = 0, opacity = 1 } = {}) {
    const row = document.createElement('div');
    row.className = 'stop-row';
    row.draggable = true;

    const handle = document.createElement('span');
    handle.className = 'sortable-handle';
    handle.textContent = '☰';

    const picker = document.createElement('input');
    picker.type = 'color';
    picker.value = color;
    picker.className = 'form-control form-control-color';
    picker.addEventListener('input', updateAll);

    const posInput = document.createElement('input');
    posInput.type = 'number';
    posInput.className = 'form-control pos';
    posInput.min = '0'; posInput.max = '100'; posInput.step = '1';
    posInput.value = String(pos);
    posInput.addEventListener('input', () => {
        posInput.value = String(clamp(Number(posInput.value || 0), 0, 100));
        updateAll();
    });
    const pct = document.createElement('span');
    pct.className = 'text-secondary';
    pct.textContent = '%';

    const opaInput = document.createElement('input');
    opaInput.type = 'number';
    opaInput.className = 'form-control opa';
    opaInput.min = '0'; opaInput.max = '100'; opaInput.step = '1';
    opaInput.value = String(Math.round(opacity * 100));
    opaInput.addEventListener('input', () => {
        opaInput.value = String(clamp(Number(opaInput.value || 100), 0, 100));
        updateAll();
    });
    const opaPct = document.createElement('span');
    opaPct.className = 'text-secondary';
    opaPct.textContent = '%';

    const del = document.createElement('button');
    del.className = 'btn btn-outline-danger btn-sm';
    del.textContent = 'Remove';
    del.addEventListener('click', () => {
        if (stopsEl.children.length > 1) { row.remove(); updateAll(); }
        else alert('At least one color stop is required.');
    });

    // drag sort
    row.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', 'drag');
        row.classList.add('opacity-75');
        window._dragEl = row;
    });
    row.addEventListener('dragend', () => {
        row.classList.remove('opacity-75');
        window._dragEl = null;
        updateAll();
    });
    row.addEventListener('dragover', e => {
        e.preventDefault();
        if (!window._dragEl || window._dragEl === row) return;
        const r = row.getBoundingClientRect();
        const before = (e.clientY - r.top) < r.height / 2;
        stopsEl.insertBefore(window._dragEl, before ? row : row.nextSibling);
    });

    [handle, picker, posInput, pct, opaInput, opaPct, del].forEach(n => row.appendChild(n));
    return row;
}

function readStops() {
    const arr = [];
    [...stopsEl.children].forEach(row => {
        const inputs = row.querySelectorAll('input');
        arr.push({
            color: inputs[0].value,
            pos: clamp(Number(inputs[1].value || 0), 0, 100),
            opacity: clamp(Number(inputs[2].value || 100), 0, 100) / 100
        });
    });
    arr.sort((a, b) => a.pos - b.pos);
    return arr;
}

// --- preview + code ---
function updatePreview() {
    const stops = readStops(); let css;
    if (typeLinear.checked) {
        css = `linear-gradient(${Number(angleEl.value || 0)}deg, ${stops.map(cssStop).join(', ')})`;
    } else if (typeRadial.checked) {
        css = `radial-gradient(circle at ${clamp(Number(cX.value || 50), 0, 100)}% ${clamp(Number(cY.value || 50), 0, 100)}%, ${stops.map(cssStop).join(', ')})`;
    } else {
        css = `conic-gradient(from ${Number(aStart.value || 0)}deg at ${clamp(Number(aCX.value || 50), 0, 100)}% ${clamp(Number(aCY.value || 50), 0, 100)}%, ${stops.map(cssStop).join(', ')})`;
    }
    preview.style.background = css;
    if (cssCodeMiniEl) cssCodeMiniEl.textContent = `background: ${css};`;
}

function updateSwift() {
    const stops = readStops();
    const swiftColors = stops.map(s => rgbToSwift(hexToRgbA(s.color, s.opacity))).join(",\n        ");
    let swiftText = '';
    if (typeLinear.checked) {
        const ang = Number(angleEl.value || 0) * Math.PI / 180, vx = Math.cos(ang), vy = Math.sin(ang);
        const m = Math.max(Math.abs(vx), Math.abs(vy)) || 1, nx = vx / m, ny = vy / m;
        const sx = (0.5 - 0.5 * nx).toFixed(3), sy = (0.5 - 0.5 * ny).toFixed(3),
            ex = (0.5 + 0.5 * nx).toFixed(3), ey = (0.5 + 0.5 * ny).toFixed(3);
        swiftText = `let gradient = LinearGradient(
    gradient: Gradient(colors: [
        ${swiftColors}
    ]),
    startPoint: UnitPoint(x: ${sx}, y: ${sy}),
    endPoint: UnitPoint(x: ${ex}, y: ${ey})
)`;
    } else if (typeRadial.checked) {
        const cx = (clamp(Number(cX.value || 50), 0, 100) / 100).toFixed(3),
            cy = (clamp(Number(cY.value || 50), 0, 100) / 100).toFixed(3);
        const sr = (clamp(Number(sR.value || 0), 0, 100) / 100).toFixed(3),
            er = (clamp(Number(eR.value || 100), 1, 100) / 100).toFixed(3);
        swiftText = `let gradient = RadialGradient(
    gradient: Gradient(colors: [
        ${swiftColors}
    ]),
    center: UnitPoint(x: ${cx}, y: ${cy}),
    startRadius: ${sr},
    endRadius: ${er}
)`;
    } else {
        const cx = (clamp(Number(aCX.value || 50), 0, 100) / 100).toFixed(3),
            cy = (clamp(Number(aCY.value || 50), 0, 100) / 100).toFixed(3);
        const sa = Number(aStart.value || 0);
        swiftText = `let gradient = AngularGradient(
    gradient: Gradient(colors: [
        ${swiftColors}
    ]),
    center: UnitPoint(x: ${cx}, y: ${cy}),
    startAngle: .degrees(${sa}),
    endAngle: .degrees(${sa + 360})
)`;
    }
    if (swiftCodeMiniEl) swiftCodeMiniEl.textContent = swiftText;
}

function updateAll() {
    $('angleVal').textContent = `${angleEl.value}°`;
    $('aStartAngleVal').textContent = `${aStart.value}°`;
    updatePreview(); updateSwift();
}

// --- PNG generation ---
const canvas = document.createElement('canvas');
// (drawToCanvas, downloadPNG, parsePackSizes, downloadPack stay the same as in your version)

// --- wire ---
function wire() {
    [angleEl, cX, cY, sR, eR, aCX, aCY, aStart].forEach(el => el.addEventListener('input', updateAll));
    $('addStop').addEventListener('click', () => {
        stopsEl.appendChild(makeStopRow({ color: '#4d4dff', pos: 50, opacity: 1 }));
        updateAll();
    });
    $('resetStops').addEventListener('click', initDefaults);

    typeLinear.addEventListener('change', () => { linearControls.style.display = 'block'; radialControls.style.display = 'none'; angularControls.style.display = 'none'; updateAll(); });
    typeRadial.addEventListener('change', () => { linearControls.style.display = 'none'; radialControls.style.display = 'block'; angularControls.style.display = 'none'; updateAll(); });
    typeAngular.addEventListener('change', () => { linearControls.style.display = 'none'; radialControls.style.display = 'none'; angularControls.style.display = 'block'; updateAll(); });

    $('downloadPNG').addEventListener('click', downloadPNG);
    $('downloadPack').addEventListener('click', downloadPack);
    $('exportIOSZip').addEventListener('click', exportIOSZip);
    $('copyEmailLink').addEventListener('click', e => {
        e.preventDefault();
        navigator.clipboard.writeText('friends@preceptress.ai')
            .then(() => alert('📋 Email copied: friends@preceptress.ai'));
    });
}

// --- initDefaults() stays unchanged from your version ---

// --- vibe switcher ---
const VIBES = [
    {
        name: 'Electric',
        css: 'radial-gradient(140% 70% at 80% 0%, #6a79ff55, transparent 60%),' +
            'radial-gradient(140% 70% at 0% 100%, #00ffd555, transparent 60%), #0b0f18'
    },
    {
        name: 'Sepia',
        css: 'radial-gradient(140% 70% at 80% 0%, #b2892d44, transparent 60%),' +
            'radial-gradient(140% 70% at 0% 100%, #4e2a0444, transparent 60%), #0e0b08'
    }
];

function initVibeSwitcher() {
    const screen = $('iphoneScreenMini');
    const toast = $('vibeToast');
    if (!screen) return;

    let idx = 0, flashTimer;

    const applyVibe = () => {
        const v = VIBES[idx % VIBES.length];
        screen.style.background = v.css;
        if (toast) {
            toast.textContent = v.name;
            toast.classList.remove('flash');
            toast.offsetHeight; // reflow to restart animation
            toast.classList.add('flash');
            clearTimeout(flashTimer);
            flashTimer = setTimeout(() => toast.classList.remove('flash'), 900);
        }
        idx++;
    };

    applyVibe();
    screen.addEventListener('click', applyVibe);
    screen.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') applyVibe();
    });
}

// --- boot ---
(function boot() {
    initDefaults();
    wire();
    updateAll();

    // disable auto-sync for vibe demo (we want it independent)
    initVibeSwitcher();
})();