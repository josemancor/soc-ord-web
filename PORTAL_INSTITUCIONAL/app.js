// Funciones básicas para el Portal SOC_ORD

document.addEventListener('DOMContentLoaded', () => {
    // Evitar envío por defecto de los formularios
    document.getElementById('form-ip').addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Autenticación IP: Conectando con API Institucional...");
        // Aquí iría el fetch() al Backend FastAPI para login IP
    });

    document.getElementById('form-student').addEventListener('submit', (e) => {
        e.preventDefault();
        abrirCuestionario();
    });
});

function abrirCuestionario() {
    const studentId = document.getElementById('student-id').value.trim();
    if (!studentId) {
        alert("Por favor, introduce tu ID Telemático.");
        return;
    }
    
    // Aquí el backend validaría que el ID Telemático pertenece a un grupo activo
    
    const modal = document.getElementById('cuestionario-modal');
    modal.style.display = 'flex';
    
    // Pequeña animación de entrada al modal
    const modalContent = modal.querySelector('div');
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.95)';
    
    requestAnimationFrame(() => {
        modalContent.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    });
}

function cerrarCuestionario() {
    const modal = document.getElementById('cuestionario-modal');
    const modalContent = modal.querySelector('div');
    
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        // Limpiar input si lo cerramos
        document.getElementById('student-id').value = '';
    }, 300);
}
