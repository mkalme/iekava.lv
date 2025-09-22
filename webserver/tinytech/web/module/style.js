import  { languagePack } from './language/language.js';

// Controls the behaviour of floating windows. Such as clicking outside of it, opening, closing, etc.
class FloatingWindow {
    constructor(document, triggerButton, window) {
        this.document = document;
        this.triggerButton = triggerButton;
        this.window = window;

        this.eventHandlers = {
            beforeOpen: [],
            beforeClose: []
        };

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.closeWithEscapeKey = this.closeWithEscapeKey.bind(this);
        this.openFloatingWindow = this.openFloatingWindow.bind(this);
        this.closeFloatingWindow = this.closeFloatingWindow.bind(this);
        this.triggerButton.addEventListener('click', this.openFloatingWindow);
        
        const resizeObserver = new ResizeObserver(entries => {
            if (this.window.style.display === 'block') {
                this.setPosition();
            }
        });
        resizeObserver.observe(this.triggerButton);
    }

    addEventListener(eventType, handler) {
        if (this.eventHandlers[eventType]) {
            this.eventHandlers[eventType].push(handler);
        } else {
            console.warn(`Event type "${eventType}" is not supported. Supported events: beforeOpen, beforeClose`);
        }
    }

    removeEventListener(eventType, handler) {
        if (this.eventHandlers[eventType]) {
            const index = this.eventHandlers[eventType].indexOf(handler);
            if (index > -1) {
                this.eventHandlers[eventType].splice(index, 1);
            }
        }
    }

    fireEvent(eventType, eventData = {}) {
        if (!this.eventHandlers[eventType]) return true;
        
        const event = {
            type: eventType,
            target: this.window,
            preventDefault: false,
            ...eventData
        };

        for (const handler of this.eventHandlers[eventType]) {
            try {
                const result = handler(event);
                if (result === false || event.preventDefault) {
                    return false;
                }
            } catch (error) {
                console.error(`Error in ${eventType} event handler:`, error);
            }
        }
        
        return true;
    }

    setPosition() {
        const rect = this.triggerButton.getBoundingClientRect();
        rect.height += remToPx(1);
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        const windowRect = this.window.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Calculate initial position below the button
        let left = rect.left + scrollLeft + rect.width / 2 - windowRect.width / 2;
        let top = rect.bottom + scrollTop;
        
        // Check right edge
        if (left + windowRect.width > viewportWidth + scrollLeft) {
            left = rect.right + scrollLeft - windowRect.width;
            
            // If still clipped then align to viewport right edge
            if (left < scrollLeft) {
                left = viewportWidth + scrollLeft - windowRect.width - 10;
            }
        }
        
        // Check left edge
        if (left < scrollLeft) {
            left = scrollLeft + 10;
        }
        
        // Check top edge
        if (top < scrollTop) {
            top = scrollTop + 10;
        }
        
        this.window.style.left = left + 'px';
        this.window.style.top = top + 'px';
    }

    openFloatingWindow() {
        if (!this.fireEvent('beforeOpen')) {
            return;
        }

        this.window.style.display = 'block';
        this.setPosition();

        setTimeout(() => {
            this.document.addEventListener('click', this.handleClickOutside);
        }, 0);
        
        this.document.addEventListener('keydown', this.closeWithEscapeKey);
    }

    closeFloatingWindow() {
        if (!this.fireEvent('beforeClose')) {
            return;
        }

        this.window.style.display = 'none';

        this.document.removeEventListener('click', this.handleClickOutside);
        this.document.removeEventListener('keydown', this.closeWithEscapeKey);
    }

    closeWithEscapeKey(event) {
        if (event.key === 'Escape') {
            if (this.window.style.display === 'block') {
                this.closeFloatingWindow();
            }
        }  
    }

    handleClickOutside(event) {
        if (!this.window.contains(event.target) && !this.triggerButton.contains(event.target)) {
            this.closeFloatingWindow();
        }
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    document.body.style.transform = 'scale(0.98)';
    setTimeout(() => {
        document.body.style.transform = 'scale(1)';
    }, 150);
}

function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function setFont(scale){
    const fontSize = scale + '%';
    document.documentElement.style.fontSize = fontSize;
}

var styleWindow = new FloatingWindow (
    document,
    document.getElementById('theme-button'),
    document.getElementById('theme-window')
);

// Goes through all theme buttons in the theme floating window and extracts their theme ids and sets the click event listener
document.querySelectorAll('.floating-window .theme-button').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('theme-button-text').setAttribute("language-code", `home.titlebar.theme.${this.value}.selected`);
        languagePack.setUiLanguage(languagePack.currentLanguageId);
        applyTheme(this.value);
        styleWindow.closeFloatingWindow();
    });
});

export { FloatingWindow, setFont, applyTheme };