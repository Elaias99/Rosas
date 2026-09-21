import { seeded } from '../lib/botanical';

interface Track { file: string; title: string; artist: string }

// Canciones que le gustan, dejadas en public/audio/. Sin datos ID3 (se
// revisó): los títulos se arman a mano a partir del nombre de archivo.
const PLAYLIST: Track[] = [
  { file: 'earfquake.mp3', title: 'Earfquake', artist: 'Tyler, The Creator' },
  { file: 'see-you-again.mp3', title: 'See You Again', artist: 'Tyler, The Creator & Kali Uchis' },
  { file: 'are-we-still-friends.mp3', title: 'Are We Still Friends?', artist: 'Tyler, The Creator' },
  { file: 'she.mp3', title: 'She', artist: 'Tyler, The Creator (feat. Frank Ocean)' },
  { file: 'speed-demon.mp3', title: 'Speed Demon', artist: 'Justin Bieber' },
  { file: 'daisies.mp3', title: 'Daisies', artist: 'Justin Bieber' },
];

class FloralGift extends HTMLElement {
  private controller = new AbortController();
  private timers: number[] = [];
  private run = 0;
  private busy = false;
  private ready: Promise<unknown> = Promise.resolve();
  private trackIndex = 0;

  connectedCallback() {
    const signal = this.controller.signal;
    this.ready = Promise.allSettled(['/flowers/rose-yellow.webp', '/flowers/ivory-posy-yellow.webp'].map((src) => {
      const image = new Image(); image.src = src; return image.decode();
    }));
    this.loadTrack(0);
    this.querySelector<HTMLAnchorElement>('[data-open]')?.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); void this.open();
    }, { signal });
    this.querySelector('[data-skip]')?.addEventListener('click', () => this.reveal(), { signal });
    this.querySelector('[data-player-toggle]')?.addEventListener('click', () => {
      const audio = this.audio();
      if (!audio) return;
      if (audio.paused) void this.playAudio();
      else { audio.pause(); this.setPlayerUI(false); }
    }, { signal });
    this.querySelector('[data-player-next]')?.addEventListener('click', () => { void this.next(); }, { signal });
    this.audio()?.addEventListener('ended', () => { void this.next(); }, { signal });
    this.querySelector<HTMLButtonElement>('[data-replay]')!.hidden = false;
    this.querySelector('[data-replay]')?.addEventListener('click', () => { this.reset(); void this.open(); }, { signal });
    this.querySelector<HTMLAnchorElement>('[data-back]')?.addEventListener('click', (event) => {
      event.preventDefault(); this.reset(); this.querySelector<HTMLElement>('[data-open]')?.focus();
    }, { signal });
    if (this.dataset.opened === 'true') { this.reset(); void this.open(); }
    window.addEventListener('resize', () => {
      if (this.dataset.phase === 'message') this.populate();
    }, { signal });
  }

  disconnectedCallback() { this.run++; this.clearTimers(); this.controller.abort(); }
  private later(action: () => void, delay: number) { this.timers.push(window.setTimeout(action, delay)); }
  private clearTimers() { this.timers.forEach(clearTimeout); this.timers = []; }

  private audio() { return this.querySelector<HTMLAudioElement>('[data-audio]'); }

  private loadTrack(index: number) {
    const track = PLAYLIST[index];
    const audio = this.audio();
    if (!track || !audio) return;
    this.trackIndex = index;
    audio.src = `/audio/${encodeURIComponent(track.file)}`;
    const title = this.querySelector('[data-player-title]');
    const artist = this.querySelector('[data-player-artist]');
    if (title) title.textContent = track.title;
    if (artist) artist.textContent = track.artist;
  }

  private setPlayerUI(playing: boolean) {
    const player = this.querySelector<HTMLElement>('[data-player]');
    const button = this.querySelector<HTMLButtonElement>('[data-player-toggle]');
    if (!player || !button) return;
    player.hidden = false;
    button.dataset.playing = String(playing);
    button.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  }

  private async playAudio() {
    const audio = this.audio();
    if (!audio) return;
    if (!audio.src) this.loadTrack(this.trackIndex);
    try {
      await audio.play();
      this.setPlayerUI(true);
    } catch {
      // El navegador bloqueó el autoplay (sin gesto del usuario): se deja
      // el reproductor visible en pausa para que lo active con un toque.
      this.setPlayerUI(false);
    }
  }

  private async next() {
    this.loadTrack((this.trackIndex + 1) % PLAYLIST.length);
    await this.playAudio();
  }

  private populate() {
    const field = this.querySelector<HTMLElement>('[data-field]')!;
    const width = window.innerWidth, height = window.innerHeight;
    const stride = Math.max(90, Math.min(180, Math.min(width, height) * .245));
    const cols = Math.ceil(width / stride) + 1, rows = Math.ceil(height / stride) + 1;
    const rand = seeded(200926);
    const bouquet = this.querySelector('[data-bouquet]')!.getBoundingClientRect();
    const originX = width / 2;
    const originY = bouquet.height ? bouquet.top + bouquet.height * .32 : height * .43;
    const maxDistance = Math.hypot(width / 2, height * .65);
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * stride + (rand() - .5) * stride * .36;
        const y = row * stride + (rand() - .5) * stride * .36;
        const flower = document.createElement('img');
        flower.className = 'field-flower';
        flower.src = rand() > .58 ? '/flowers/rose-yellow.webp' : '/flowers/ivory-posy-yellow.webp';
        flower.alt = ''; flower.width = 512; flower.height = 512;
        const size = stride * (1.85 + rand() * .45);
        const delay = Math.hypot(x - originX, y - originY) / maxDistance * 1.15;
        flower.style.cssText = `--x:${x / width * 100}%;--y:${y / height * 100}%;--size:${size}px;--turn:${rand() * 360}deg;--delay:${delay}s;--dx:${originX - x}px;--dy:${originY - y}px;`;
        fragment.append(flower);
      }
    }
    field.replaceChildren(fragment);
  }

  private async open() {
    if (this.busy) return;
    this.busy = true;
    const token = ++this.run;
    this.querySelector('[data-open]')!.setAttribute('aria-disabled', 'true');
    this.querySelector('[data-hint]')!.textContent = 'Un instante, tus flores están por abrirse…';
    // Se dispara acá, todavía dentro del gesto de clic sincrónico, para que
    // el navegador permita el audio con sonido.
    void this.playAudio();
    // Bound asset waiting on slow connections so the gift always opens.
    await Promise.race([this.ready, new Promise(resolve => this.later(() => resolve(null), 2200))]);
    if (token !== this.run || !this.isConnected) return;
    this.populate();
    this.querySelector<HTMLElement>('[data-welcome]')!.inert = true;
    this.querySelector('[data-status]')!.textContent = 'Tus flores están floreciendo.';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this.reveal(); return; }
    this.dataset.phase = 'opening';
    const skip = this.querySelector<HTMLButtonElement>('[data-skip]')!;
    skip.hidden = false; skip.focus({ preventScroll: true });
    this.later(() => { this.dataset.phase = 'bloom'; }, 180);
    // Three-second flower wave, then a full-screen pause to enjoy it.
    this.later(() => this.reveal(), 5900);
  }

  private reveal() {
    this.clearTimers(); this.dataset.phase = 'message'; this.busy = false;
    this.querySelector<HTMLButtonElement>('[data-skip]')!.hidden = true;
    this.querySelector<HTMLElement>('[data-message]')!.inert = false;
    this.querySelector('[data-status]')!.textContent = '';
    this.querySelector<HTMLElement>('#message-title')?.focus({ preventScroll: true });
  }

  private reset() {
    this.run++; this.clearTimers(); this.busy = false; this.dataset.phase = 'welcome';
    this.querySelector<HTMLElement>('[data-welcome]')!.inert = false;
    this.querySelector<HTMLElement>('[data-message]')!.inert = true;
    this.querySelector<HTMLButtonElement>('[data-skip]')!.hidden = true;
    this.querySelector('[data-open]')!.removeAttribute('aria-disabled');
    this.querySelector('[data-hint]')!.textContent = 'Hecho con cariño, solo para sacarte una sonrisa.';
    this.querySelector('[data-status]')!.textContent = '';
    const audio = this.audio();
    if (audio) { audio.pause(); audio.currentTime = 0; }
    this.loadTrack(0);
    this.querySelector<HTMLElement>('[data-player]')!.hidden = true;
  }
}
if (!customElements.get('floral-gift')) customElements.define('floral-gift', FloralGift);
