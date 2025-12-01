// GLSL keywords for autocomplete
const GLSL_KEYWORDS = [
    'attribute', 'const', 'uniform', 'varying', 'break', 'continue', 'if', 'else', 'for', 'while', 'do',
    'return', 'void', 'float', 'int', 'bool', 'true', 'false', 'vec2', 'vec3', 'vec4', 'mat2', 'mat3',
    'mat4', 'sampler2D', 'samplerCube', 'precision', 'highp', 'mediump', 'lowp', 'discard', 'in',
    'out', 'inout', 'layout', 'struct', 'gl_Position', 'gl_FragColor'
];

// Create the CodeMirror editor
const editor = CodeMirror.fromTextArea(document.getElementById('glsl'), {
    mode: 'x-shader/x-fragment',
    theme: '3024-night',
    lineNumbers: true,
    matchBrackets: true,
    indentWithTabs: true,
    indentUnit: 4,
    tabSize: 4,
    extraKeys: { 'Ctrl-Space': cm => CodeMirror.showHint(cm, CodeMirror.hint.glsl) }
});

// GLSL autocomplete helper
CodeMirror.registerHelper('hint', 'glsl', function (cm) {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const start = token.start;
    const end = cur.ch;
    const word = token.string.slice(0, end - start);
    const list = GLSL_KEYWORDS.filter(k => k.startsWith(word));
    return {
        list: list.length ? list : GLSL_KEYWORDS,
        from: CodeMirror.Pos(cur.line, start),
        to: CodeMirror.Pos(cur.line, end)
    };
});

// Refresh editor after layout
window.addEventListener('load', () => {
    editor.refresh();
    editor.focus();
});

// ---- Dynamic Theme Loader ----
const themes = [
    '3024-night', '3024-day', 'abcdef', 'ambiance', 'base16-dark', 'base16-light', 'blackboard',
    'cobalt', 'colorforth', 'dracula', 'eclipse', 'elegant', 'erlang-dark', 'hopscotch', 'icecoder',
    'isotope', 'lesser-dark', 'liquibyte', 'material', 'mbo', 'mdn-like', 'monokai', 'midnight',
    'neat', 'neo', 'night', 'panda-syntax', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark',
    'rubyblue', 'the-matrix', 'tomorrow-night-bright',
    'tomorrow-night-eighties', 'ttcn', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'yeti', 'zenburn'
];

const themeSelector = document.getElementById('themeSelector');

// Populate the dropdown
themes.forEach(t => {
    const option = document.createElement('option');
    option.value = t;
    option.textContent = t;
    themeSelector.appendChild(option);
});

// Load theme CSS dynamically
function loadTheme(themeName) {
    const id = 'cm-theme-' + themeName;
    if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://cdn.jsdelivr.net/npm/codemirror@5.65.13/theme/${themeName}.css`;
        link.id = id;
        document.head.appendChild(link);
    }
    editor.setOption('theme', themeName);
}

// Theme selection handlers
themeSelector.addEventListener('change', e => {
    loadTheme(e.target.value);
});

// Set default selected theme
themeSelector.value = 'lesser-dark';
loadTheme(themeSelector.value);

const shaderPresets = [
    { name: "Empty", path: "code_editor/fragment_presets/empty.frag" },
    { name: "Pink Glow", path: "code_editor/fragment_presets/pink_glow.frag" },
    { name: "Pulsing Red", path: "code_editor/fragment_presets/pulsing_red.frag" },
    { name: "Moving Gradient", path: "code_editor/fragment_presets/moving_gradient.frag" },
    { name: "Wavy Stripes", path: "code_editor/fragment_presets/wavy_stripes.frag" },
    { name: "Circular Rainbow", path: "code_editor/fragment_presets/circular_rainbow.frag" },
    { name: "Checkerboard", path: "code_editor/fragment_presets/checkerboard.frag" },
    { name: "Plasma", path: "code_editor/fragment_presets/plasma.frag" },
    { name: "Complex Fractal", path: "code_editor/fragment_presets/complex_fractal.frag" },
    { name: "Ray Marching", path: "code_editor/fragment_presets/ray_marching.frag" }
];

const presetSelector = document.getElementById('shaderPreset');

// Populate dropdown
shaderPresets.forEach((preset, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = preset.name;
    presetSelector.appendChild(option);
});

presetSelector.addEventListener('change', async e => {
    const preset = shaderPresets[e.target.value];
    if (preset) {
        try {
            const response = await fetch(preset.path);
            if (!response.ok) throw new Error("Failed to load shader file");
            const code = await response.text();
            editor.setValue(code);
            editor.focus();
        } catch (err) {
            console.error(err);
            alert("Error loading shader: " + err.message);
        }
    }
});

// Load first preset on page load
(async () => {
    const firstPreset = shaderPresets[0];
    const response = await fetch(firstPreset.path);
    const code = await response.text();
    editor.setValue(code);
})();
