const technicians = [
  { id: 't1', name: 'Ravi Sharma', skills: ['Washing Machine','Refrigerator'], rating: 4.8, available: true },
  { id: 't2', name: 'Pooja Singh', skills: ['Microwave','Oven','Mixer'], rating: 4.7, available: true },
  { id: 't3', name: 'Akash Patel', skills: ['Iron','Small Appliances','Other'], rating: 4.6, available: false },
];

// DOM refs
const techList = document.getElementById('techList');
const techSelect = document.getElementById('techSelect');
const bookingForm = document.getElementById('bookingForm');
const bookingsModal = document.getElementById('bookingsModal');
const bookingsContent = document.getElementById('bookingsContent');
const viewBookingsBtn = document.getElementById('viewBookingsBtn');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

// Render technician cards
function renderTechnicians(){
  techList.innerHTML = '';
  techSelect.innerHTML = '';
  technicians.forEach(t => {
    const div = document.createElement('div');
    div.className = 'tech';
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <div class="avatar">${t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
        <div>
          <div class="tech-name">${t.name} <span style="color:var(--muted);font-weight:400">· ${t.rating}★</span></div>
          <div class="tech-meta">Skills: ${t.skills.join(', ')}</div>
        </div>
      </div>
      <div>
        <button class="btn" ${t.available? '': 'disabled'} data-id="${t.id}">${t.available? 'Book' : 'Unavailable'}</button>
      </div>
    `;
    techList.appendChild(div);

    // Add to select only if available
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.name} ${t.available? '(Available)' : '(Unavailable)'} `;
    if(!t.available) opt.disabled = true;
    techSelect.appendChild(opt);
  });

  // Add click handlers for Book buttons
  document.querySelectorAll('.tech .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      // select tech in form and focus date
      techSelect.value = id;
      document.getElementById('dateInput').focus();
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });
}

// Simple bookings stored in localStorage
function loadBookings(){
  try{
    const raw = localStorage.getItem('fixnow_bookings');
    return raw ? JSON.parse(raw) : [];
  }catch(e){return []}
}
function saveBookings(list){
  localStorage.setItem('fixnow_bookings', JSON.stringify(list));
}

function renderBookings(){
  const bookings = loadBookings();
  if(bookings.length === 0){
    bookingsContent.innerHTML = '<p class="small">No bookings yet.</p>';
    return;
  }
  let html = '<table><thead><tr><th>When</th><th>Service</th><th>Technician</th><th>Address</th><th>Status</th><th></th></tr></thead><tbody>';
  bookings.forEach((b, i) => {
    const tech = technicians.find(t=>t.id===b.techId) || {name:'-'};
    html += `<tr><td>${b.date} ${b.time}</td><td>${b.service}</td><td>${tech.name}</td><td>${b.address}</td><td>${b.status}</td><td><button data-idx="${i}" class="btn ghost">Cancel</button></td></tr>`;
  });
  html += '</tbody></table>';
  bookingsContent.innerHTML = html;

  // attach cancel buttons
  bookingsContent.querySelectorAll('button[data-idx]').forEach(btn => {
    btn.addEventListener('click', ()=>{
      const idx = +btn.dataset.idx;
      const bookings = loadBookings();
      bookings.splice(idx,1);
      saveBookings(bookings);
      renderBookings();
      alert('Booking cancelled');
    });
  });
}

// Form handling
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const service = document.getElementById('serviceSelect').value;
  const techId = document.getElementById('techSelect').value;
  const date = document.getElementById('dateInput').value;
  const time = document.getElementById('timeInput').value;
  const address = document.getElementById('addressInput').value.trim();

  // Basic validation
  if(!name || !phone || !date || !time || !address){
    alert('Please complete all required fields');
    return;
  }

  // Date validation: no past dates
  const chosen = new Date(date + 'T' + time);
  const now = new Date();
  if(chosen < now){
    if(!confirm('Selected date/time is in the past. Do you still want to continue?')) return;
  }

  // Create booking
  const bookings = loadBookings();
  const newBooking = { id: 'b' + Date.now(), name, phone, service, techId, date, time, address, status: 'Pending' };
  bookings.push(newBooking);
  saveBookings(bookings);

  // Reset form
  bookingForm.reset();
  techSelect.selectedIndex = 0;
  alert('Booking saved. We will call to confirm the appointment.');
});

document.getElementById('clearForm').addEventListener('click', ()=> bookingForm.reset());

viewBookingsBtn.addEventListener('click', ()=>{
  // toggle bookings area
  bookingsModal.style.display = bookingsModal.style.display === 'none' ? 'block' : 'none';
  renderBookings();
  bookingsModal.scrollIntoView({behavior:'smooth'});
});

// initial render
renderTechnicians();

// If there are no technicians available, show a friendly note
if(!technicians.some(t=>t.available)){
  const note = document.createElement('div');
  note.className = 'card';
  note.style.marginTop = '12px';
  note.innerHTML = '<strong>Note:</strong> No technicians are currently available. Please try another day.';
  document.querySelector('main').appendChild(note);
}

// Accessibility small helper: prefill today's date
const dateInput = document.getElementById('dateInput');
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth()+1).padStart(2,'0');
const dd = String(today.getDate()).padStart(2,'0');
dateInput.value = `${yyyy}-${mm}-${dd}`;