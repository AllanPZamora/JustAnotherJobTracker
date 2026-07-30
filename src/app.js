const addRowBtn = document.getElementById('add-row-btn');
const tableBody = document.getElementById('job-table-body');
const STORAGE_KEY = 'jobTrackerRows';

const modal = document.getElementById('job-modal');
const modalTitle = document.getElementById('modal-title');
const jobForm = document.getElementById('job-form');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const workModeBtns = document.querySelectorAll('.work-mode-btn');

const fieldCompany = document.getElementById('field-company');
const fieldRole = document.getElementById('field-role');
const fieldStatus = document.getElementById('field-status');
const fieldSalary = document.getElementById('field-salary');
const fieldLocation = document.getElementById('field-location');
const fieldDate = document.getElementById('field-date');
const fieldFollowup = document.getElementById('field-followup');
const fieldLink = document.getElementById('field-link');
const fieldNotes = document.getElementById('field-notes');

let editingRow = null;
let selectedWorkMode = '';
let pendingDeleteRow = null;

const deleteModal = document.getElementById('delete-modal');
const deleteModalText = document.getElementById('delete-modal-text');
const deleteCancelBtn = document.getElementById('delete-cancel-btn');
const deleteConfirmBtn = document.getElementById('delete-confirm-btn');

const notesModal = document.getElementById('notes-modal');
const notesModalTitle = document.getElementById('notes-modal-title');
const notesModalSubtitle = document.getElementById('notes-modal-subtitle');
const notesModalSalary = document.getElementById('notes-modal-salary');
const notesModalBody = document.getElementById('notes-modal-body');
const notesCloseBtn = document.getElementById('notes-close-btn');

const searchInput = document.getElementById('search-input');
const locationFilter = document.getElementById('location-filter');
const sortSelect = document.getElementById('sort-select');
const sortDirectionBtn = document.getElementById('sort-direction-btn');
let sortDirection = 'desc';

const statusTabsContainer = document.getElementById('status-tabs');
let currentStatusFilter = 'All';

const viewTableBtn = document.getElementById('view-table-btn');
const viewAnalyticsBtn = document.getElementById('view-analytics-btn');
const tableView = document.getElementById('table-view');
const analyticsView = document.getElementById('analytics-view');

const resetDataBtn = document.getElementById('reset-data-btn');
const resetModal = document.getElementById('reset-modal');
const resetCancelBtn = document.getElementById('reset-cancel-btn');
const resetConfirmBtn = document.getElementById('reset-confirm-btn');

function openResetModal() {
  resetModal.classList.remove('hidden');
  resetModal.classList.add('flex');
}

function closeResetModal() {
  resetModal.classList.add('hidden');
  resetModal.classList.remove('flex');
}

resetDataBtn.addEventListener('click', openResetModal);
resetCancelBtn.addEventListener('click', closeResetModal);
resetModal.addEventListener('click', (event) => {
  if (event.target === resetModal) closeResetModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !resetModal.classList.contains('hidden')) closeResetModal();
});
resetConfirmBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  loadFromStorage();
  currentStatusFilter = 'All';
  refreshStatusTabStyles();
  closeResetModal();
});

const statusStyles = {
  Wishlist:     'bg-white text-slate-600 border border-slate-300',
  Applied:      'bg-blue-100 text-blue-700',
  Interviewing: 'bg-amber-100 text-amber-700',
  Offer:        'bg-emerald-100 text-emerald-700',
  Rejected:     'bg-rose-100 text-rose-700',
  Ghosted:      'bg-gray-100 text-gray-500',
};
const statusOptions = Object.keys(statusStyles);
fieldStatus.innerHTML = statusOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('');

const defaultRows = [
  {
    company: 'Company Name Here',
    role: 'Position Name Here',
    status: 'Wishlist',
    salary: 'Salary Range Here',
    location: 'City, State',
    workMode: 'ONSITE',
    date: '2026-01-01',
    followUp: '',
    link: '',
    notes: 'This is the notes section — click the eye icon on any row to see it. You can jot down salary details, interview prep, recruiter conversations, or anything else you want to remember about this application.',
  },
  {
    company: 'Company Name Here',
    role: 'Position Name Here',
    status: 'Applied',
    salary: 'Salary Range Here',
    location: 'City, State',
    workMode: 'HYBRID',
    date: '2026-01-05',
    followUp: '2026-01-20',
    link: '',
    notes: 'This is the notes section — click the eye icon on any row to see it. You can jot down salary details, interview prep, recruiter conversations, or anything else you want to remember about this application.',
  },
  {
    company: 'Company Name Here',
    role: 'Position Name Here',
    status: 'Interviewing',
    salary: 'Salary Range Here',
    location: 'City, State',
    workMode: 'REMOTE',
    date: '2026-01-10',
    followUp: '2026-01-25',
    link: '',
    notes: 'This is the notes section — click the eye icon on any row to see it. You can jot down salary details, interview prep, recruiter conversations, or anything else you want to remember about this application.',
  },
];

const icons = {
  link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"/><path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.808a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd"/></svg>`,
  eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/><path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>`,
  pin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.109.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.274 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd"/></svg>`,
};

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const locationValue = locationFilter.value;

  Array.from(tableBody.querySelectorAll('tr')).forEach(row => {
    const company = (row.dataset.company || '').toLowerCase();
    const role = (row.dataset.role || '').toLowerCase();
    const notes = (row.dataset.notes || '').toLowerCase();
    const status = row.querySelector('.status-wrapper')?.dataset.value;

    const matchesSearch = !searchTerm ||
      company.includes(searchTerm) ||
      role.includes(searchTerm) ||
      notes.includes(searchTerm);

    const matchesLocation = locationValue === 'All' || row.dataset.workMode === locationValue;
    const matchesStatus = currentStatusFilter === 'All' || status === currentStatusFilter;

    row.style.display = (matchesSearch && matchesLocation && matchesStatus) ? '' : 'none';
  });

  updateStatusTabCounts();
}

function tabActiveClasses(status) {
  if (status === 'All') return 'bg-slate-800 text-white';
  return (statusStyles[status] || '').replace('bg-white', 'bg-white ring-1 ring-inset ring-slate-400');
}

function tabInactiveClasses(status) {
  if (status === 'All') return 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50';
  const base = statusStyles[status] || '';
  return `${base} opacity-50 hover:opacity-100`;
}

function refreshStatusTabStyles() {
  statusTabsContainer.querySelectorAll('.status-tab-btn').forEach(btn => {
    const status = btn.dataset.statusFilter;
    const isActive = status === currentStatusFilter;
    const allPossibleClasses = ['bg-slate-800', 'text-white', 'bg-white', 'text-slate-600', 'border', 'border-slate-300', 'hover:bg-slate-50', 'opacity-50', 'hover:opacity-100', 'ring-1', 'ring-inset', 'ring-slate-400',
      ...Object.values(statusStyles).flatMap(c => c.split(' '))];
    btn.classList.remove(...new Set(allPossibleClasses));
    const newClasses = (isActive ? tabActiveClasses(status) : tabInactiveClasses(status)).split(' ').filter(Boolean);
    btn.classList.add(...newClasses);
  });
}

function updateStatusTabCounts() {
  const allRows = Array.from(tableBody.querySelectorAll('tr'));
  statusTabsContainer.querySelectorAll('.status-tab-btn').forEach(btn => {
    const status = btn.dataset.statusFilter;
    const count = status === 'All'
      ? allRows.length
      : allRows.filter(row => row.querySelector('.status-wrapper')?.dataset.value === status).length;
    btn.querySelector('.status-tab-count').textContent = count;
  });
}

statusTabsContainer.addEventListener('click', (event) => {
  const btn = event.target.closest('.status-tab-btn');
  if (!btn) return;
  currentStatusFilter = btn.dataset.statusFilter;
  refreshStatusTabStyles();
  applyFilters();
});

refreshStatusTabStyles();

searchInput.addEventListener('input', applyFilters);
locationFilter.addEventListener('change', applyFilters);

function applySort() {
  const field = sortSelect.value;
  const rows = Array.from(tableBody.querySelectorAll('tr')).map(getRowData);

  rows.sort((a, b) => {
    let result;
    if (field === 'company') {
      result = (a.company || '').localeCompare(b.company || '');
    } else {
      const valA = a[field] || '';
      const valB = b[field] || '';
      if (!valA && !valB) result = 0;
      else if (!valA) result = 1;
      else if (!valB) result = -1;
      else result = valA.localeCompare(valB);
    }
    return sortDirection === 'asc' ? result : -result;
  });

  renderRows(rows);
}

sortSelect.addEventListener('change', applySort);
sortDirectionBtn.addEventListener('click', () => {
  sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  sortDirectionBtn.classList.toggle('rotate-180', sortDirection === 'asc');
  applySort();
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const terminalStatuses = ['Offer', 'Rejected', 'Ghosted'];

function buildFollowUpHtml(status, followUpValue) {
  if (terminalStatuses.includes(status)) {
    return '<span class="text-slate-400 italic">Closed</span>';
  }
  return `
    <span class="hidden sm:inline">${followUpValue || '—'}</span>
    <span class="sm:hidden">${followUpValue ? shortDate(followUpValue) : '—'}</span>
  `;
}

function switchView(view) {
  const isTable = view === 'table';

  tableView.classList.toggle('hidden', !isTable);
  analyticsView.classList.toggle('hidden', isTable);

  viewTableBtn.classList.toggle('bg-slate-100', isTable);
  viewTableBtn.classList.toggle('text-slate-800', isTable);
  viewTableBtn.classList.toggle('font-medium', isTable);
  viewTableBtn.classList.toggle('text-slate-500', !isTable);

  viewAnalyticsBtn.classList.toggle('bg-slate-100', !isTable);
  viewAnalyticsBtn.classList.toggle('text-slate-800', !isTable);
  viewAnalyticsBtn.classList.toggle('font-medium', !isTable);
  viewAnalyticsBtn.classList.toggle('text-slate-500', isTable);
}

const sankeyNodeColors = {
  Applications: '#64748b',
  Wishlist:     '#cbd5e1',
  Applied:      '#3b82f6',
  Interviewing: '#f59e0b',
  Offer:        '#10b981',
  Rejected:     '#f43f5e',
  Ghosted:      '#9ca3af',
};

function renderSankeyChart() {
  const { nodeLabels, links } = buildSankeyFlowData();
  const container = document.getElementById('sankey-chart');

  if (links.length === 0) {
    container.innerHTML = '<p class="text-center text-slate-400 text-sm py-10">Not enough status changes yet to show a funnel. Update a few job statuses to see this fill in.</p>';
    return;
  }

  const labelIndex = Object.fromEntries(nodeLabels.map((label, i) => [label, i]));

  const data = [{
    type: 'sankey',
    orientation: 'h',
    node: {
      label: nodeLabels,
      color: nodeLabels.map(label => sankeyNodeColors[label] || '#94a3b8'),
      pad: 16,
      thickness: 18,
      line: { color: '#ffffff', width: 1 },
    },
    link: {
      source: links.map(l => labelIndex[l.source]),
      target: links.map(l => labelIndex[l.target]),
      value: links.map(l => l.value),
      color: links.map(l => (sankeyNodeColors[l.target] || '#94a3b8') + '55'),
    },
  }];

  const layout = {
    font: { size: 12, family: 'inherit' },
    margin: { l: 10, r: 10, t: 10, b: 10 },
    height: 420,
  };

  Plotly.newPlot('sankey-chart', data, layout, { responsive: true, displayModeBar: false });
}

viewTableBtn.addEventListener('click', () => switchView('table'));
viewAnalyticsBtn.addEventListener('click', () => {
  switchView('analytics');
  renderStatCards();
  renderSankeyChart();
});

function getAllJobsData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultRows;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return defaultRows;
  }
}

function buildSankeyFlowData() {
  const jobs = getAllJobsData();
  const flowCounts = {}; // key: "source→target", value: count

  jobs.forEach(job => {
    let history = job.history;
    if (!Array.isArray(history) || history.length === 0) {
      history = [{ status: job.status || 'Applied', date: job.date || todayISO() }];
    }

    // Edge from the starting point into the job's first recorded stage
    addFlow('Applications', history[0].status);

    // Edges between each consecutive stage change
    for (let i = 0; i < history.length - 1; i++) {
      addFlow(history[i].status, history[i + 1].status);
    }
  });

  function addFlow(source, target) {
    if (source === target) return; // skip no-op transitions
    const key = `${source}→${target}`;
    flowCounts[key] = (flowCounts[key] || 0) + 1;
  }

  const links = Object.entries(flowCounts).map(([key, value]) => {
    const [source, target] = key.split('→');
    return { source, target, value };
  });

  const nodeLabels = Array.from(
    new Set(links.flatMap(link => [link.source, link.target]))
  );

  return { nodeLabels, links };
}

function computeStats() {
  const jobs = getAllJobsData();
  const appliedJobs = jobs.filter(job => job.status !== 'Wishlist');
  const total = appliedJobs.length;

  const hasReachedStage = (job, stages) => {
    if (stages.includes(job.status)) return true;
    return Array.isArray(job.history) && job.history.some(h => stages.includes(h.status));
  };

  const responded = appliedJobs.filter(job => hasReachedStage(job, ['Interviewing', 'Offer', 'Rejected'])).length;
  const interviewed = appliedJobs.filter(job => hasReachedStage(job, ['Interviewing', 'Offer'])).length;
  const offered = appliedJobs.filter(job => hasReachedStage(job, ['Offer'])).length;

  const pct = (count) => total === 0 ? '—' : `${Math.round((count / total) * 100)}%`;

  return {
    total,
    responseRate: pct(responded),
    interviewRate: pct(interviewed),
    offerRate: pct(offered),
  };
}

function renderStatCards() {
  const stats = computeStats();
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-response-rate').textContent = stats.responseRate;
  document.getElementById('stat-interview-rate').textContent = stats.interviewRate;
  document.getElementById('stat-offer-rate').textContent = stats.offerRate;
}

function initials(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

function shortDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${year.slice(-2)}-${month}-${day}`;
}

function createRow(data = {}) {
  const row = document.createElement('tr');
  row.className = 'align-top';

  const status = data.status || 'Applied';
  const statusClass = statusStyles[status] || statusStyles.Applied;

  row.innerHTML = `
    <td class="px-4 py-3">
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 shrink-0 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center">
          ${initials(data.company)}
        </div>
        <div class="min-w-0">
          <div class="font-semibold text-slate-800 cell-truncate">${data.role || '—'}</div>
          <div class="text-slate-400 text-sm cell-truncate">${data.company || '—'}</div>
        </div>
      </div>
    </td>
    <td class="px-4 py-3">
      <div class="relative inline-block status-wrapper" data-value="${status}">
        <button type="button" class="status-trigger inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md ${statusClass}">
          <span class="status-label">${status}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 opacity-60">
            <path fill-rule="evenodd" d="M5.22 7.22a.75.75 0 011.06 0L10 10.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 8.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>
        <div class="status-dropdown hidden absolute left-0 mt-1 z-20 bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden text-xs w-32">
          ${statusOptions.map(opt => `<button type="button" class="status-option block w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700" data-value="${opt}">${opt}</button>`).join('')}
        </div>
      </div>
    </td>
    <td class="px-4 py-3">
      <div class="cell-truncate text-slate-700">${data.location || '—'}</div>
      ${data.workMode ? `<span class="inline-flex items-center gap-1 mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">${icons.pin}${data.workMode}</span>` : ''}
    </td>
    <td class="px-4 py-3 cell-truncate">
      <span class="hidden sm:inline">${data.date || '—'}</span>
      <span class="sm:hidden">${data.date ? shortDate(data.date) : '—'}</span>
    </td>
    <td class="px-4 py-3 cell-truncate followup-cell">
      ${buildFollowUpHtml(status, data.followUp)}
    </td>
    <td class="px-4 py-3">
      <div class="flex items-center gap-2 text-slate-400">
        <button class="view-notes-btn hover:text-slate-700" title="View details">${icons.eye}</button>
        <button class="link-btn hover:text-slate-700" title="Open job link">${icons.link}</button>
        <button class="edit-row-btn hover:text-slate-700" title="Edit">${icons.edit}</button>
        <button class="delete-row-btn hover:text-red-500" title="Delete">${icons.trash}</button>
      </div>
    </td>
  `;

  row.dataset.link = data.link || '';
  row.dataset.notes = data.notes || '';
  row.dataset.company = data.company || '';
  row.dataset.role = data.role || '';
  row.dataset.workMode = data.workMode || '';
  row.dataset.location = data.location || '';
  row.dataset.salary = data.salary || '';
  row.dataset.date = data.date || '';
  row.dataset.followUp = data.followUp || '';

  const history = data.history && data.history.length
    ? data.history
    : [{ status, date: data.date || todayISO() }];
  row.dataset.history = JSON.stringify(history);

  return row;
}

function getRowData(row) {
  let history = [];
  try {
    history = JSON.parse(row.dataset.history || '[]');
  } catch (e) {
    history = [];
  }

  return {
    company: row.dataset.company || '',
    role: row.dataset.role || '',
    status: row.querySelector('.status-wrapper').dataset.value,
    salary: row.dataset.salary || '',
    workMode: row.dataset.workMode || '',
    location: row.dataset.location || '',
    date: row.dataset.date || '',
    followUp: row.dataset.followUp || '',
    link: row.dataset.link || '',
    notes: row.dataset.notes || '',
    history: history,
  };
}

function saveToStorage() {
  const rows = Array.from(tableBody.querySelectorAll('tr')).map(getRowData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function renderRows(rows) {
  tableBody.innerHTML = '';
  rows.forEach(data => tableBody.appendChild(createRow(data)));
  applyFilters();
}

function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    renderRows(defaultRows);
    return;
  }
  try {
    const rows = JSON.parse(saved);
    renderRows(rows);
  } catch (e) {
    renderRows(defaultRows);
  }
}

function openNotesModal(row) {
  const role = row?.dataset.role || 'Untitled role';
  const company = row?.dataset.company || '';
  const salary = row?.dataset.salary || '';
  const notes = row?.dataset.notes || '';

  notesModalTitle.textContent = role;
  notesModalSubtitle.textContent = company;
  notesModalSalary.textContent = salary || 'Not specified';
  notesModalBody.textContent = notes || 'No notes added yet.';

  notesModal.classList.remove('hidden');
  notesModal.classList.add('flex');
}

function closeNotesModal() {
  notesModal.classList.add('hidden');
  notesModal.classList.remove('flex');
}

notesCloseBtn.addEventListener('click', closeNotesModal);
notesModal.addEventListener('click', (event) => {
  if (event.target === notesModal) closeNotesModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !notesModal.classList.contains('hidden')) closeNotesModal();
});

function openDeleteModal(row) {
  pendingDeleteRow = row;
  const roleName = row?.dataset.role || 'this entry';
  const companyName = row?.dataset.company ? ` at ${row.dataset.company}` : '';
  deleteModalText.textContent = `"${roleName}${companyName}" will be permanently removed.`;
  deleteModal.classList.remove('hidden');
  deleteModal.classList.add('flex');
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  deleteModal.classList.remove('flex');
  pendingDeleteRow = null;
}

deleteCancelBtn.addEventListener('click', closeDeleteModal);
deleteModal.addEventListener('click', (event) => {
  if (event.target === deleteModal) closeDeleteModal();
});
deleteConfirmBtn.addEventListener('click', () => {
  if (pendingDeleteRow) {
    pendingDeleteRow.remove();
    saveToStorage();
  }
  closeDeleteModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !deleteModal.classList.contains('hidden')) closeDeleteModal();
});
function setWorkMode(mode) {
  selectedWorkMode = mode;
  workModeBtns.forEach(btn => {
    const active = btn.dataset.mode === mode;
    btn.classList.toggle('bg-slate-800', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('text-slate-600', !active);
  });
}

workModeBtns.forEach(btn => {
  btn.addEventListener('click', () => setWorkMode(btn.dataset.mode));
});

function openModal(mode, row = null) {
  editingRow = mode === 'edit' ? row : null;
  modalTitle.textContent = mode === 'edit' ? 'Edit Job Application' : 'Track New Job Application';

  if (mode === 'edit' && row) {
    fieldCompany.value = row.dataset.company || '';
    fieldRole.value = row.dataset.role || '';
    fieldStatus.value = row.querySelector('.status-wrapper').dataset.value;
    fieldSalary.value = row.dataset.salary || '';
    fieldLocation.value = row.dataset.location || '';
    fieldDate.value = row.dataset.date || '';
    fieldFollowup.value = row.dataset.followUp || '';
    fieldLink.value = row.dataset.link || '';
    fieldNotes.value = row.dataset.notes || '';
    setWorkMode(row.dataset.workMode || 'REMOTE');
  } else {
    jobForm.reset();
    fieldStatus.value = 'Applied';
    setWorkMode('REMOTE');
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  fieldCompany.focus();
}

function closeModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  editingRow = null;
}

modalCloseBtn.addEventListener('click', closeModal);
modalCancelBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

jobForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const newStatus = fieldStatus.value;
  let history = [];

  if (editingRow) {
    const previous = getRowData(editingRow);
    history = previous.history || [];
    if (previous.status !== newStatus) {
      history = [...history, { status: newStatus, date: todayISO() }];
    }
  } else {
    history = [{ status: newStatus, date: fieldDate.value || todayISO() }];
  }

  const data = {
    company: fieldCompany.value.trim(),
    role: fieldRole.value.trim(),
    status: newStatus,
    salary: fieldSalary.value.trim(),
    workMode: selectedWorkMode,
    location: fieldLocation.value.trim(),
    date: fieldDate.value,
    followUp: fieldFollowup.value,
    link: fieldLink.value.trim(),
    notes: fieldNotes.value.trim(),
    history: history,
  };

  const newRow = createRow(data);

  if (editingRow) {
    editingRow.replaceWith(newRow);
  } else {
    tableBody.appendChild(newRow);
  }

  saveToStorage();
  applyFilters();
  closeModal();
});

addRowBtn.addEventListener('click', () => openModal('add'));

tableBody.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('.delete-row-btn');
  const editBtn = event.target.closest('.edit-row-btn');
  const linkBtn = event.target.closest('.link-btn');
  const viewBtn = event.target.closest('.view-notes-btn');

  if (viewBtn) {
    const row = viewBtn.closest('tr');
    if (row) openNotesModal(row);
    return;
  }

  if (deleteBtn) {
    const row = deleteBtn.closest('tr');
    if (row) openDeleteModal(row);
    return;
  }

  if (editBtn) {
    const row = editBtn.closest('tr');
    if (row) openModal('edit', row);
    return;
  }

  if (linkBtn) {
    const row = linkBtn.closest('tr');
    const link = row?.dataset.link;
    if (link) window.open(link, '_blank');
    else console.log('No job link saved for this row yet.');
    return;
  }
});

function closeAllStatusDropdowns() {
  document.querySelectorAll('.status-dropdown').forEach(dd => {
    dd.classList.add('hidden');
    dd.style.position = '';
    dd.style.top = '';
    dd.style.left = '';
  });
}

tableBody.addEventListener('click', (event) => {
  const trigger = event.target.closest('.status-trigger');
  const option = event.target.closest('.status-option');

  if (trigger) {
    const dropdown = trigger.nextElementSibling;
    const isOpen = !dropdown.classList.contains('hidden');
    closeAllStatusDropdowns();

    if (!isOpen) {
      const rect = trigger.getBoundingClientRect();

      // Measure the dropdown's height without flashing it visibly
      dropdown.style.visibility = 'hidden';
      dropdown.classList.remove('hidden');
      const dropdownHeight = dropdown.offsetHeight;
      dropdown.classList.add('hidden');
      dropdown.style.visibility = '';

      const spaceBelow = window.innerHeight - rect.bottom;
      const margin = 8;
      const openUpward = spaceBelow < dropdownHeight + margin && rect.top > spaceBelow;

      dropdown.style.position = 'fixed';
      dropdown.style.left = `${rect.left}px`;
      dropdown.style.top = openUpward
        ? `${rect.top - dropdownHeight - 4}px`
        : `${rect.bottom + 4}px`;

      dropdown.classList.remove('hidden');
    }
    return;
  }

  if (option) {
    const wrapper = option.closest('.status-wrapper');
    const row = wrapper.closest('tr');
    const previousStatus = wrapper.dataset.value;
    const newStatus = option.dataset.value;
    const trigger = wrapper.querySelector('.status-trigger');
    const label = wrapper.querySelector('.status-label');

    wrapper.dataset.value = newStatus;
    label.textContent = newStatus;

    if (newStatus !== previousStatus) {
      let history = [];
      try {
        history = JSON.parse(row.dataset.history || '[]');
      } catch (e) {
        history = [];
      }
      history.push({ status: newStatus, date: todayISO() });
      row.dataset.history = JSON.stringify(history);
    }

    const followUpCell = row.querySelector('.followup-cell');
    if (followUpCell) {
      followUpCell.innerHTML = buildFollowUpHtml(newStatus, row.dataset.followUp);
    }

    const allStatusClasses = Object.values(statusStyles).flatMap(c => c.split(' '));
    trigger.classList.remove(...allStatusClasses);
    trigger.classList.add(...(statusStyles[newStatus] || statusStyles.Applied).split(' '));

    closeAllStatusDropdowns();
    saveToStorage();
    return;
  }
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.status-wrapper')) closeAllStatusDropdowns();
});

window.addEventListener('scroll', closeAllStatusDropdowns, true);

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
});