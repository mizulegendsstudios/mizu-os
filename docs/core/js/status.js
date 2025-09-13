// core/js/status.js — Widget de estado del sistema (hora, batería, conexión, volumen)

export function initializeStatusWidget() {
    // Verificar que los elementos existan
    const widgetContainer = document.getElementById('system-widget');
    if (!widgetContainer) {
        console.warn('Status widget container not found. Skipping initialization.');
        return;
    }

// Prueba de la función de fecha
const now = new Date();
const optionsDate = { day: '2-digit', month: 'short', year: '2-digit' };
let date = now.toLocaleDateString('es-ES', optionsDate)
    .replace(/ de /g, ' ')
    .replace(/\./g, '');
console.log(date); // Debería mostrar la fecha sin " de " ni puntos

        document.getElementById('widget-hora')?.textContent = time;
        document.getElementById('widget-fecha')?.textContent = date;
    }

    // Función para actualizar batería
    function updateBattery() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                const level = Math.floor(battery.level * 100);
                const pctEl = document.getElementById('widget-battery-pct');
                const icon = document.querySelector('.battery-icon');
                let levelEl = icon?.querySelector('.battery-level');

                if (!levelEl && icon) {
                    levelEl = document.createElement('div');
                    levelEl.className = 'battery-level';
                    icon.appendChild(levelEl);
                }

                if (pctEl) pctEl.textContent = `${level}%`;
                if (levelEl) levelEl.style.width = `${level}%`;

                if (icon) {
                    if (battery.charging) {
                        icon.style.color = '#10b981';
                    } else if (level < 20) {
                        icon.style.color = '#ef4444';
                    } else {
                        icon.style.color = '#10b981';
                    }
                }
            });
        } else {
            document.getElementById('widget-battery-pct')?.textContent = 'N/A';
        }
    }

    // Función para actualizar conexión
    function updateConnection() {
        const online = navigator.onLine;
        const icon = document.getElementById('widget-wifi-icon');
        const status = document.getElementById('widget-wifi-status');

        if (icon) {
            icon.className = 'fa-solid fa-wifi';
            icon.style.color = online ? '#10b981' : '#ef4444';
        }
        if (status) {
            status.textContent = online ? 'Online' : 'Offline';
        }
    }

    // Función para actualizar volumen (simulado)
    function updateVolume() {
        const volume = 75; // Valor simulado — no hay API global de volumen en navegador
        const icon = document.getElementById('widget-volume-icon');
        const pct = document.getElementById('widget-volume-pct');

        if (pct) pct.textContent = `${volume}%`;
        if (icon) {
            if (volume === 0) {
                icon.className = 'fa-solid fa-volume-off';
            } else if (volume < 50) {
                icon.className = 'fa-solid fa-volume-low';
            } else {
                icon.className = 'fa-solid fa-volume-high';
            }
        }
    }

    // Inicializar valores
    updateDateTime();
    updateBattery();
    updateConnection();
    updateVolume();

    // Eventos
    setInterval(updateDateTime, 1000);
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);

    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            battery.addEventListener('levelchange', updateBattery);
            battery.addEventListener('chargingchange', updateBattery);
        });
    }

    console.log('Status widget initialized.');
}
