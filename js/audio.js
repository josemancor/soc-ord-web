// Motor de Audio Procedural para VISORD (Web Audio API)
// Genera sonidos cinematográficos sin necesidad de archivos externos.

class VisordAudio {
    constructor() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.5;
            this.activeOscillators = [];
        } catch (e) {
            console.warn("AudioContext no disponible:", e);
        }
    }
    
    stopAll() {
        try {
            if (this.masterGain && this.ctx) {
                this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
                this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
            }
        } catch(e) {}
        if (this.activeOscillators) {
            this.activeOscillators.forEach(osc => {
                try { osc.stop(this.ctx ? this.ctx.currentTime + 0.3 : 0); } catch(e){}
            });
            this.activeOscillators = [];
        }
    }

    playDrone() {
        try {
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(e => {});
            }
            if (this.masterGain) {
                this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
            }
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc1.type = 'sine';
            osc2.type = 'triangle';
            osc1.frequency.value = 55;
            osc2.frequency.value = 55.5;
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.masterGain);
            
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 3);
            
            osc1.start();
            osc2.start();
            this.activeOscillators.push(osc1, osc2);
        } catch (e) {
            console.warn("Error reproduciendo drone de audio:", e);
        }
    }
    
    playPulse() {
        try {
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(e => {});
            }
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(110, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.5);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 1);
        } catch (e) {}
    }
    
    playChime() {
        try {
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(e => {});
            }
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = 880;
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 2);
        } catch (e) {}
    }
    
    playGrandFinale() {
        try {
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(e => {});
            }
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const osc3 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc1.type = 'sawtooth';
            osc2.type = 'square';
            osc3.type = 'sine';
            
            osc1.frequency.setValueAtTime(30, this.ctx.currentTime);
            osc2.frequency.setValueAtTime(60, this.ctx.currentTime);
            osc3.frequency.setValueAtTime(15, this.ctx.currentTime);
            
            osc1.connect(gain);
            osc2.connect(gain);
            osc3.connect(gain);
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(100, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 2);
            filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 8);
            
            gain.connect(filter);
            filter.connect(this.masterGain);
            
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 10);
            
            osc1.start();
            osc2.start();
            osc3.start();
            osc1.stop(this.ctx.currentTime + 10);
            osc2.stop(this.ctx.currentTime + 10);
            osc3.stop(this.ctx.currentTime + 10);
        } catch (e) {}
    }
}
window.VisordAudio = VisordAudio;
