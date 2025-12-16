document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================
    // 1. DATA PERJALANAN
    // =======================================
    const journeyData = [
        { title: "Ini Judul 1", date: "12 | 12 | 2025", description: "Awal mula segalanya. Kita memutuskan untuk berjalan bersama dan mengukir kisah yang takkan pernah berakhir. (Contoh Deskripsi)" },
        { title: "Ini Judul 2", date: "14 | 02 | 2026", description: "Di bawah selimut bintang Bromo, kita berbagi mimpi dan janji. Momen yang membuat kita sadar betapa dalamnya perasaan ini. (Contoh Deskripsi)" },
        { title: "Ini Judul 3", date: "07 | 07 | 2026", description: "Deburan ombak dan senja yang lembut. Tempat di mana kita berdua menemukan ketenangan sejati dan melupakan hiruk pikuk dunia. (Contoh Deskripsi)" },
        { title: "Ini Judul 4", date: "18 | 10 | 2026", description: "Hari itu hujan turun deras, tetapi pelukanmu adalah tempat terhangat. Hari-hari yang sederhana namun paling bermakna. (Contoh Deskripsi)" },
        { title: "Ini Judul 5", date: "27 | 10 | 2026", description: "Setiap hari bersamamu adalah perjalanan baru. Dan petualangan kita akan terus berlanjut, selamanya. (Contoh Deskripsi)" }
        // DATA BARU
    ];
    
    // =======================================
    // 2. LOGIKA SLIDER TUMPUKAN
    // =======================================
    
    const widget = document.querySelector('.photo-widget');
    const cards = Array.from(document.querySelectorAll('.photo-card'));
    const numCards = cards.length;
    
    // Elemen Teks
    const titleEl = document.getElementById('recap-title');
    const dateEl = document.getElementById('recap-date');
    const descriptionEl = document.getElementById('recap-description');

    if (numCards === 0 || numCards !== journeyData.length) return;

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    
    // --- Fungsi Utama untuk Memperbarui Tampilan ---
    const updateCarousel = (newIndex) => {
        // Tentukan indeks baru (dengan Looping tak terbatas)
        currentIndex = (newIndex + numCards) % numCards;

        // Reset semua kelas
        cards.forEach(card => {
            card.className = 'photo-card';
            card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        // Tentukan kartu prev, center, dan next
        const prevIndex = (currentIndex - 1 + numCards) % numCards;
        const nextIndex = (currentIndex + 1) % numCards;
        
        // Terapkan kelas CSS Tumpukan
        cards[currentIndex].classList.add('active-center');
        cards[prevIndex].classList.add('active-left');
        cards[nextIndex].classList.add('active-right');
        
        // Perbarui Teks
        titleEl.textContent = journeyData[currentIndex].title;
        dateEl.textContent = journeyData[currentIndex].date;
        descriptionEl.textContent = journeyData[currentIndex].description;
    };
    
    // --- Fungsi Geser (Drag Event Handler) ---
    const handleDragEnd = (endX) => {
        const diff = endX - startX;
        
        // Jarak minimal untuk dianggap sebagai swipe
        if (Math.abs(diff) > 50) { 
            
            // Tambahkan kelas exit ke kartu yang sedang bergeser keluar
            cards[currentIndex].classList.add(diff > 0 ? 'exit-right' : 'exit-left');
            
            // Tentukan indeks baru (geser ke kiri = index + 1)
            const newIndex = diff < 0 ? currentIndex + 1 : currentIndex - 1;
            
            // Hapus transisi pada kartu yang sedang di-drag
            cards[currentIndex].style.transition = 'none';

            // Tunggu transisi exit selesai (0.5s) sebelum update ke posisi baru
            setTimeout(() => {
                // Hapus kelas exit sebelum update
                cards[currentIndex].classList.remove('exit-right', 'exit-left');
                cards[currentIndex].style.transform = ''; // Reset transform
                updateCarousel(newIndex);
            }, 500); 

        } else {
            // Jika geseran terlalu pendek, kembalikan posisi ke tengah
            cards[currentIndex].style.transform = '';
            cards[currentIndex].style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    };
    
    // --- 3. Event Listeners ---

    // Mouse Down / Touch Start
    widget.addEventListener('mousedown', (e) => {
        e.preventDefault(); 
        isDragging = true;
        startX = e.pageX;
        widget.classList.add('dragging');
    });
    widget.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        isDragging = true;
        startX = e.touches[0].pageX;
        widget.classList.add('dragging');
    });

    // Mouse Up / Touch End
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        widget.classList.remove('dragging');
        handleDragEnd(e.pageX);
    });
    document.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        widget.classList.remove('dragging');
        handleDragEnd(e.changedTouches[0].pageX);
    });

    // Mouse Move / Touch Move (Digunakan untuk efek visual drag)
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = e.pageX - startX;
        // Memindahkan kartu yang aktif secara visual saat drag
        cards[currentIndex].style.transform = `translateX(${diff * 0.5}px) rotate(0deg)`;
        cards[currentIndex].style.transition = 'none'; 
    });
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = e.touches[0].pageX - startX;
        cards[currentIndex].style.transform = `translateX(${diff * 0.5}px) rotate(0deg)`;
        cards[currentIndex].style.transition = 'none';
    });
    
    // Inisialisasi awal
    updateCarousel(0);
});