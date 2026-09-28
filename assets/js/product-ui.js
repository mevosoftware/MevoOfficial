/* ============================================================
   MEVO SCHOOL — Product UI templates
   Pure string builders that render realistic application chrome.
   Kept separate from behaviour (app.js) so the interfaces can be
   reused in features, the tour, the phone and the ecosystem panel.
   ============================================================ */
(function (w) {
  'use strict';

  var ic = function (n, s) { return '<svg width="' + (s || 14) + '" height="' + (s || 14) + '"><use href="#i-' + n + '"/></svg>'; };
  var av = function (t, cls) { return '<span class="ava ' + (cls || '') + '">' + t + '</span>'; };

  /* ---------- window shell ---------- */
  function shell(o) {
    o = o || {};
    var side = o.side === false ? '' :
      '<aside class="app__side">' +
        '<div class="app__brand"><svg class="mk" viewBox="0 0 24 24"><rect width="24" height="24" rx="6.5" fill="#03045E"/><path d="M6 17.2V7.4l6 5.1 6-5.1v9.8" stroke="#fff" stroke-width="2.1" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg><b>Mevo School</b></div>' +
        (o.nav || []).map(function (n) {
          return n.group
            ? '<div class="nv__group">' + n.group + '</div>'
            : '<a class="nv' + (n.on ? ' is-on' : '') + '">' + ic(n.i) + ' ' + n.t + '</a>';
        }).join('') +
        '<div class="nv__spacer"></div><a class="nv">' + ic('settings') + ' Settings</a>' +
      '</aside>';

    return '<div class="app" data-chart-scope>' +
      (o.bar === false ? '' :
        '<div class="app__bar"><span class="app__dots"><i></i><i></i><i></i></span>' +
        '<span class="app__url">app.mevoschool.com/' + (o.path || 'dashboard') + '</span>' +
        '<span class="pill pill--flat"><span class="dot-live"></span> Live</span></div>') +
      '<div class="app__shell"' + (o.side === false ? ' style="grid-template-columns:1fr"' : '') + '>' + side +
        '<div class="app__main">' +
          '<div class="app__head"><div><div class="app__title">' + o.title + '</div>' +
          (o.sub ? '<div class="app__sub">' + o.sub + '</div>' : '') + '</div>' +
          '<div class="app__tools">' + (o.tools || '') + '</div></div>' +
          '<div class="app__body">' + o.body + '</div>' +
        '</div>' +
      '</div></div>';
  }

  var navDefault = function (on) {
    return [
      { i: 'dashboard', t: 'Dashboard', on: on === 'dashboard' },
      { i: 'students', t: 'Students', on: on === 'students' },
      { i: 'teachers', t: 'Teachers', on: on === 'teachers' },
      { i: 'attendance', t: 'Attendance', on: on === 'attendance' },
      { group: 'Academics' },
      { i: 'results', t: 'Results', on: on === 'results' },
      { i: 'fees', t: 'Fees', on: on === 'fees' },
      { i: 'notices', t: 'Notices', on: on === 'notices' },
      { i: 'reports', t: 'Reports', on: on === 'reports' }
    ];
  };

  /* ---------- small pieces ---------- */
  function metric(k, v, d, opts) {
    opts = opts || {};
    return '<div class="mt"><div class="mt__k">' + k + '</div>' +
      '<div class="mt__v tnum" data-count="' + v + '"' +
      (opts.dec ? ' data-dec="' + opts.dec + '"' : '') +
      (opts.suffix ? ' data-suffix="' + opts.suffix + '"' : '') +
      (opts.prefix ? ' data-prefix="' + opts.prefix + '"' : '') + '>0</div>' +
      (d ? '<div class="mt__d' + (opts.down ? ' is-down' : '') + '">' + d + '</div>' : '') + '</div>';
  }

  function lineChart(title, sub, pts, badge) {
    var w = 420, h = 120;
    var d = pts.map(function (p, i) {
      return (i ? 'L' : 'M') + (i * (w / (pts.length - 1))).toFixed(1) + ' ' + (h - (p - 60) / 40 * h).toFixed(1);
    }).join(' ');
    return '<div class="chart"><div class="chart__hd"><div><div class="chart__t">' + title +
      '</div><div class="chart__s">' + sub + '</div></div>' + (badge || '') + '</div>' +
      '<svg viewBox="0 0 ' + w + ' ' + (h + 4) + '" preserveAspectRatio="none" role="img" aria-label="' + title + '">' +
      '<line class="gridline" x1="0" y1="10" x2="420" y2="10"/><line class="gridline" x1="0" y1="60" x2="420" y2="60"/><line class="gridline" x1="0" y1="110" x2="420" y2="110"/>' +
      '<path class="area-fill" d="' + d + ' L' + w + ' ' + h + ' L0 ' + h + ' Z" fill="url(#gA)"/>' +
      '<path class="draw" d="' + d + '" fill="none" stroke="#03045E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg></div>';
  }

  function bars(title, sub, data) {
    var max = Math.max.apply(null, data.map(function (d) { return d.v; }));
    var bw = 100 / data.length;
    return '<div class="chart"><div class="chart__hd"><div><div class="chart__t">' + title +
      '</div><div class="chart__s">' + sub + '</div></div></div>' +
      '<svg viewBox="0 0 220 120" role="img" aria-label="' + title + '">' +
      '<line class="gridline" x1="0" y1="100" x2="220" y2="100"/>' +
      data.map(function (d, i) {
        var hgt = (d.v / max) * 76;
        var x = i * (220 / data.length) + 6;
        return '<rect class="bar" x="' + x.toFixed(1) + '" y="' + (100 - hgt).toFixed(1) + '" width="' +
          (220 / data.length - 12).toFixed(1) + '" height="' + hgt.toFixed(1) + '" rx="3" fill="' +
          (d.mute ? '#c9d6ff' : '#03045E') + '" style="animation-delay:' + (i * 70) + 'ms"/>' +
          '<text class="axis-t" x="' + (x + (220 / data.length - 12) / 2).toFixed(1) + '" y="113" text-anchor="middle">' + d.k + '</text>';
      }).join('') + '</svg></div>';
  }

  function attGrid(n, absentEvery) {
    var out = '';
    for (var i = 0; i < n; i++) {
      var lv = (i % absentEvery === 0) ? 'ab' : ('l' + (1 + (i * 7 % 4)));
      out += '<i class="' + lv + '" style="animation-delay:' + (i * 9) + 'ms"></i>';
    }
    return '<div class="att-grid">' + out + '</div>';
  }

  function table(cols, rows) {
    return '<div class="tbl-scroll"><table class="tbl"><thead><tr>' +
      cols.map(function (c) { return '<th' + (c.r ? ' class="r"' : '') + '>' + c.t + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(function (r) {
        return '<tr>' + r.map(function (c, i) {
          return '<td' + (cols[i] && cols[i].r ? ' class="r"' : '') + '>' + c + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  function user(initials, name, meta) {
    return '<span class="cell-u">' + av(initials, 'ava--sm') + '<span><b>' + name + '</b><span>' + meta + '</span></span></span>';
  }

  var toolsStd = '<span class="srch">' + ic('search', 12) + ' Search…</span><button class="btn-x">' + ic('filter', 12) + ' Filter</button>';

  /* ============================================================
     FEATURE INTERFACES
     ============================================================ */
  var UI = {};

  UI.student = function () {
    return shell({
      path: 'students/MEVO-2451', title: 'Aarav Sharma', sub: 'MEVO-2451 · Class IX–B · Active',
      nav: navDefault('students'),
      tools: '<button class="btn-x">' + ic('reports', 12) + ' Record</button><button class="btn-x btn-x--solid">Edit</button>',
      body:
        '<div style="display:flex;gap:14px;align-items:center;border:1px solid var(--line);border-radius:10px;padding:13px">' +
          av('AS', 'ava--lg ava--navy') +
          '<div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:620;letter-spacing:-.024em">Aarav Sharma</div>' +
          '<div style="font-size:11.4px;color:var(--gray-soft);margin-top:2px">Guardian: R. Sharma · +91 ••••• 42310 · Admitted 2021</div></div>' +
          '<span class="pill pill--ok"><i class="dot"></i> Enrolled</span>' +
        '</div>' +
        '<div class="mt-row">' +
          '<div class="mt"><div class="mt__k">Class</div><div class="mt__v">IX–B</div><div class="mt__d">Section B · 42 students</div></div>' +
          metric('Attendance', 94.2, 'Term to date', { dec: 1, suffix: '%' }) +
          metric('Average', 86, 'Term 1', { suffix: '%' }) +
          '<div class="mt"><div class="mt__k">Fee status</div><div class="mt__v" style="font-size:16px;color:var(--green)">Paid</div><div class="mt__d">Receipt #10482</div></div>' +
        '</div>' +
        '<div class="app__split" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
          bars('Subject performance', 'Term 1 averages', [
            { k: 'Math', v: 88 }, { k: 'Sci', v: 82 }, { k: 'Eng', v: 91 }, { k: 'SST', v: 76, mute: true }, { k: 'Hin', v: 84 }
          ]) +
          '<div class="chart"><div class="chart__hd"><div><div class="chart__t">Attendance pattern</div><div class="chart__s">Last 60 school days</div></div></div>' +
          attGrid(60, 17) +
          '<div class="chart__legend"><span><i style="background:#03045E"></i> Present</span><span><i style="background:#f6dde4"></i> Absent</span></div></div>' +
        '</div>'
    });
  };

  UI.teacher = function () {
    return shell({
      path: 'teachers', title: 'Teachers', sub: '74 staff · 6 departments',
      nav: navDefault('teachers'), tools: toolsStd + '<button class="btn-x btn-x--solid">' + ic('plus', 12) + ' Add</button>',
      body:
        '<div class="mt-row">' +
          metric('Teaching staff', 74, '6 departments') +
          metric('Classes today', 168, 'Across 3 blocks') +
          metric('Attendance marked', 91, 'By 09:40', { suffix: '%' }) +
          metric('Pending actions', 6, 'Follow-ups', { down: true }) +
        '</div>' +
        table(
          [{ t: 'Teacher' }, { t: 'Department' }, { t: 'Classes' }, { t: 'Today' }, { t: 'Status', r: true }],
          [
            [user('SK', 'S. Kulkarni', 'skulkarni@school.edu'), 'Mathematics', 'IX–B, X–A, X–C', '4 periods', '<span class="pill pill--ok">Complete</span>'],
            [user('MN', 'M. Nair', 'mnair@school.edu'), 'Science', 'VII–A, VIII–B', '5 periods', '<span class="pill pill--ok">Complete</span>'],
            [user('RD', 'R. Das', 'rdas@school.edu'), 'English', 'X–C, XI–A', '3 periods', '<span class="pill pill--warn">1 pending</span>'],
            [user('PV', 'P. Verma', 'pverma@school.edu'), 'Social Studies', 'VI–A, VI–B', '4 periods', '<span class="pill pill--ok">Complete</span>'],
            [user('AK', 'A. Khan', 'akhan@school.edu'), 'Computer Sci.', 'IX–A, XI–B', '2 periods', '<span class="pill">Scheduled</span>']
          ]
        )
    });
  };

  UI.attendance = function () {
    return shell({
      path: 'attendance', title: 'Attendance · Class IX–B', sub: 'Monday, 28 September · Period 1',
      nav: navDefault('attendance'),
      tools: '<span class="pill pill--flat">42 students</span><button class="btn-x btn-x--solid">' + ic('check', 12) + ' Submit</button>',
      body:
        '<div class="mt-row">' +
          metric('Present', 40, 'Marked just now') +
          metric('Absent', 2, 'Guardians notified', { down: true }) +
          metric('Class rate', 95.2, 'Today', { dec: 1, suffix: '%' }) +
          metric('School rate', 96.4, 'All classes', { dec: 1, suffix: '%' }) +
        '</div>' +
        '<div class="chart"><div class="chart__hd"><div><div class="chart__t">Roll call</div><div class="chart__s">Tap a student to toggle presence</div></div><span class="pill pill--ok">40 / 42 present</span></div>' +
        attGrid(42, 19) +
        '<div class="chart__legend"><span><i style="background:#03045E"></i> Present</span><span><i style="background:#f6dde4"></i> Absent</span><span><i style="background:#c9d6ff"></i> Late</span></div></div>' +
        lineChart('Section trend', 'IX–B · last 12 weeks', [92, 94, 93, 95, 94, 96, 95, 97, 96, 95, 97, 96], '<span class="pill pill--ok">Above target</span>')
    });
  };

  UI.results = function () {
    return shell({
      path: 'results', title: 'Results · Term 1', sub: 'Class X · all sections',
      nav: navDefault('results'), tools: '<button class="btn-x">' + ic('download', 12) + ' Export</button><button class="btn-x btn-x--solid">Publish</button>',
      body:
        '<div class="app__split" style="display:grid;grid-template-columns:1.3fr 1fr;gap:12px">' +
          bars('Subject averages', 'Class X · Term 1', [
            { k: 'Math', v: 79 }, { k: 'Sci', v: 84 }, { k: 'Eng', v: 88 }, { k: 'SST', v: 72, mute: true }, { k: 'Hin', v: 81 }, { k: 'CS', v: 90 }
          ]) +
          '<div class="chart"><div class="chart__hd"><div><div class="chart__t">Grade distribution</div><div class="chart__s">126 students</div></div></div>' +
          ['A · 38', 'B · 47', 'C · 29', 'D · 12'].map(function (g, i) {
            var pc = [30, 37, 23, 10][i];
            return '<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;font-size:11.4px;margin-bottom:5px"><span>' + g + '</span><span class="muted">' + pc + '%</span></div>' +
              '<div class="meter"><i style="--w:' + pc * 2.4 + '%;transition-delay:' + (i * 100) + 'ms"></i></div></div>';
          }).join('') + '</div>' +
        '</div>' +
        table(
          [{ t: 'Student' }, { t: 'Class' }, { t: 'Total' }, { t: 'Average' }, { t: 'Grade', r: true }],
          [
            [user('AS', 'Aarav Sharma', 'MEVO-2451'), 'X–A', '<span class="num">516 / 600</span>', '<span class="num">86.0%</span>', '<span class="pill pill--ok">A</span>'],
            [user('IK', 'Ishita Kaur', 'MEVO-2388'), 'X–A', '<span class="num">534 / 600</span>', '<span class="num">89.0%</span>', '<span class="pill pill--ok">A</span>'],
            [user('RM', 'Rohan Mehta', 'MEVO-2410'), 'X–B', '<span class="num">462 / 600</span>', '<span class="num">77.0%</span>', '<span class="pill">B</span>'],
            [user('SN', 'Sara Noor', 'MEVO-2433'), 'X–C', '<span class="num">408 / 600</span>', '<span class="num">68.0%</span>', '<span class="pill pill--warn">C</span>']
          ]
        )
    });
  };

  UI.fees = function () {
    return shell({
      path: 'fees', title: 'Fees · Term 2', sub: 'Collection overview',
      nav: navDefault('fees'), tools: toolsStd + '<button class="btn-x btn-x--solid">' + ic('plus', 12) + ' Receipt</button>',
      body:
        '<div class="mt-row">' +
          metric('Collected', 82, 'Of term total', { suffix: '%' }) +
          metric('Receipts issued', 1043, 'This term') +
          metric('Pending students', 241, 'Across 14 classes', { down: true }) +
          metric('Collected today', 46, 'Payments recorded') +
        '</div>' +
        '<div class="app__split" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
          bars('Collection by class group', 'Term 2', [
            { k: 'I–III', v: 88 }, { k: 'IV–VI', v: 94 }, { k: 'VII', v: 61, mute: true }, { k: 'VIII–IX', v: 86 }, { k: 'X–XII', v: 58, mute: true }
          ]) +
          '<div class="chart"><div class="chart__hd"><div><div class="chart__t">Recent receipts</div><div class="chart__s">Last 4 payments</div></div></div>' +
          [['#10482', 'Aarav Sharma · IX–B', 'Term 2'], ['#10481', 'Ishita Kaur · X–A', 'Term 2'], ['#10480', 'Rohan Mehta · X–B', 'Term 2 (part)'], ['#10479', 'Sara Noor · X–C', 'Term 2']]
            .map(function (r) {
              return '<div class="lrow"><span class="ava ava--sm">₹</span><span class="lrow__b"><span class="lrow__t">' + r[1] + '</span><span class="lrow__m">Receipt ' + r[0] + ' · ' + r[2] + '</span></span><span class="pill pill--ok">Paid</span></div>';
            }).join('') + '</div>' +
        '</div>' +
        table(
          [{ t: 'Student' }, { t: 'Class' }, { t: 'Structure' }, { t: 'Balance' }, { t: 'Status', r: true }],
          [
            [user('AS', 'Aarav Sharma', 'MEVO-2451'), 'IX–B', 'Standard', '<span class="num">0</span>', '<span class="pill pill--ok">Paid</span>'],
            [user('RM', 'Rohan Mehta', 'MEVO-2410'), 'X–B', 'Standard', '<span class="num">4,500</span>', '<span class="pill pill--warn">Part paid</span>'],
            [user('SN', 'Sara Noor', 'MEVO-2433'), 'X–C', 'Concession', '<span class="num">7,200</span>', '<span class="pill pill--bad">Pending</span>']
          ]
        )
    });
  };

  UI.admissions = function () {
    var stages = [
      { k: 'Enquiry', n: 34, w: 100 }, { k: 'Application', n: 21, w: 62 },
      { k: 'Assessment', n: 14, w: 41 }, { k: 'Offer', n: 9, w: 27 }, { k: 'Enrolled', n: 7, w: 21 }
    ];
    return shell({
      path: 'admissions', title: 'Admissions · 2026 intake', sub: '34 applicants in pipeline',
      nav: navDefault(''), tools: '<button class="btn-x">' + ic('filter', 12) + ' Stage</button><button class="btn-x btn-x--solid">' + ic('plus', 12) + ' New</button>',
      body:
        '<div class="chart"><div class="chart__hd"><div><div class="chart__t">Pipeline</div><div class="chart__s">Enquiry through enrolment</div></div><span class="pill">2026 intake</span></div>' +
        stages.map(function (s, i) {
          return '<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;font-size:11.6px;margin-bottom:5px"><span style="font-weight:550">' + s.k + '</span><span class="muted num">' + s.n + ' applicants</span></div>' +
            '<div class="meter' + (i === 4 ? ' meter--ok' : '') + '"><i style="--w:' + s.w + '%;transition-delay:' + (i * 90) + 'ms"></i></div></div>';
        }).join('') + '</div>' +
        table(
          [{ t: 'Applicant' }, { t: 'Applying for' }, { t: 'Documents' }, { t: 'Stage', r: true }],
          [
            [user('NA', 'Nikhil Arora', 'APP-0341'), 'Class VI', '<span class="pill pill--ok">Complete</span>', '<span class="pill">Assessment</span>'],
            [user('TS', 'Tara Singh', 'APP-0339'), 'Class I', '<span class="pill pill--warn">2 missing</span>', '<span class="pill">Application</span>'],
            [user('ZK', 'Zoya Khan', 'APP-0336'), 'Class IX', '<span class="pill pill--ok">Complete</span>', '<span class="pill pill--ok">Offer</span>'],
            [user('DV', 'Dev Patel', 'APP-0330'), 'Class VI', '<span class="pill pill--ok">Complete</span>', '<span class="pill pill--ok">Enrolled</span>']
          ]
        )
    });
  };

  UI.notices = function () {
    return shell({
      path: 'notices', title: 'Notices', sub: 'Published · scheduled · drafts',
      nav: navDefault('notices'), tools: '<button class="btn-x">Drafts (2)</button><button class="btn-x btn-x--solid">' + ic('plus', 12) + ' New notice</button>',
      body:
        '<div style="border:1px solid var(--line);border-radius:10px;padding:14px">' +
          '<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start">' +
            '<div><div style="font-size:14px;font-weight:600;letter-spacing:-.022em">Half-yearly examination timetable</div>' +
            '<div style="font-size:11.4px;color:var(--gray-soft);margin-top:3px">Published 2 hours ago by Academic Office</div></div>' +
            '<span class="pill pill--ok"><i class="dot"></i> Published</span>' +
          '</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">' +
            ['All classes', 'Teachers', 'Guardians'].map(function (t) { return '<span class="pill pill--flat">' + t + '</span>'; }).join('') +
          '</div>' +
          '<div style="margin-top:14px"><div style="display:flex;justify-content:space-between;font-size:11.4px;margin-bottom:6px"><span>Read by audience</span><span class="muted">78%</span></div><div class="meter"><i style="--w:78%"></i></div></div>' +
        '</div>' +
        table(
          [{ t: 'Notice' }, { t: 'Audience' }, { t: 'Published' }, { t: 'Read', r: true }],
          [
            ['<b style="font-weight:550">Parent–teacher meeting</b>', 'Classes VI–X', 'Yesterday', '<span class="num">64%</span>'],
            ['<b style="font-weight:550">Annual sports day trials</b>', 'All classes', '2 days ago', '<span class="num">81%</span>'],
            ['<b style="font-weight:550">Library closure notice</b>', 'Teachers', '3 days ago', '<span class="num">92%</span>'],
            ['<b style="font-weight:550">Fee reminder · Term 2</b>', 'Guardians', 'Scheduled', '<span class="pill pill--warn">Pending</span>']
          ]
        )
    });
  };

  UI.reports = function () {
    return shell({
      path: 'reports', title: 'Reports', sub: 'Generated from live records',
      nav: navDefault('reports'), tools: '<button class="btn-x">' + ic('clock', 12) + ' Term 1</button><button class="btn-x btn-x--solid">' + ic('download', 12) + ' Export</button>',
      body:
        '<div class="mt-row">' +
          metric('Reports available', 24, 'Across 6 modules') +
          metric('Generated this term', 318, 'By 11 staff') +
          metric('Scheduled', 6, 'Weekly and monthly') +
          metric('Exports', 142, 'Last 30 days') +
        '</div>' +
        lineChart('School attendance · 12 weeks', 'All classes combined', [91, 93, 92, 94, 95, 94, 96, 95, 96, 97, 96, 97], '<span class="pill pill--ok">Report ready</span>') +
        table(
          [{ t: 'Report' }, { t: 'Module' }, { t: 'Scope' }, { t: 'Updated', r: true }],
          [
            ['<b style="font-weight:550">Attendance summary</b>', 'Attendance', 'All classes · Term 1', 'Today'],
            ['<b style="font-weight:550">Fee collection statement</b>', 'Fees', 'Term 2', 'Today'],
            ['<b style="font-weight:550">Academic performance</b>', 'Results', 'Class X · Term 1', 'Yesterday'],
            ['<b style="font-weight:550">Admissions funnel</b>', 'Admissions', '2026 intake', '2 days ago']
          ]
        )
    });
  };

  UI.principal = function () {
    return shell({
      path: 'dashboard', title: 'School overview', sub: 'Greenfield Public School · Term 2',
      nav: navDefault('dashboard'),
      tools: '<button class="btn-x">' + ic('clock', 12) + ' This week</button><button class="btn-x">' + ic('download', 12) + ' Export</button>',
      body:
        '<div class="mt-row">' +
          metric('Total students', 1284, '+18 this term') +
          metric('Teachers', 74, '6 departments') +
          metric('Attendance today', 96.4, '+1.2% vs last week', { dec: 1, suffix: '%' }) +
          metric('Fee collection', 82, '18% pending', { suffix: '%', down: true }) +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1.5fr 1fr;gap:12px" class="app__split">' +
          lineChart('Attendance trends', 'Last 12 weeks · all classes', [90, 92, 91, 93, 94, 93, 95, 96, 95, 96, 97, 96], '<span class="pill pill--ok">Stable</span>') +
          '<div class="chart"><div class="chart__hd"><div><div class="chart__t">Academic performance</div><div class="chart__s">Average by class group</div></div></div>' +
          [['Classes I–V', 84], ['Classes VI–VIII', 79], ['Classes IX–X', 81], ['Classes XI–XII', 76]].map(function (r, i) {
            return '<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;font-size:11.4px;margin-bottom:5px"><span>' + r[0] + '</span><span class="muted num">' + r[1] + '%</span></div>' +
              '<div class="meter"><i style="--w:' + r[1] + '%;transition-delay:' + (i * 90) + 'ms"></i></div></div>';
          }).join('') + '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px" class="app__split">' +
          '<div class="chart"><div class="chart__hd"><div><div class="chart__t">Class overview</div><div class="chart__s">Today · attendance by class</div></div></div>' +
          table([{ t: 'Class' }, { t: 'Students' }, { t: 'Present' }, { t: 'Rate', r: true }], [
            ['IX–A', '<span class="num">44</span>', '<span class="num">43</span>', '<span class="pill pill--ok">97.7%</span>'],
            ['IX–B', '<span class="num">42</span>', '<span class="num">40</span>', '<span class="pill pill--ok">95.2%</span>'],
            ['X–A', '<span class="num">41</span>', '<span class="num">39</span>', '<span class="pill pill--ok">95.1%</span>'],
            ['X–C', '<span class="num">38</span>', '<span class="num">33</span>', '<span class="pill pill--warn">86.8%</span>']
          ]) + '</div>' +
          '<div class="chart"><div class="chart__hd"><div><div class="chart__t">Recent notices</div><div class="chart__s">Published this week</div></div><button class="btn-x">All</button></div>' +
          [['Half-yearly exam timetable', 'All classes · 2h ago'], ['Parent–teacher meeting', 'Classes VI–X · Yesterday'], ['Annual sports day trials', 'All classes · 2 days ago'], ['Library closure notice', 'Teachers · 3 days ago']]
            .map(function (r) {
              return '<div class="lrow">' + av('N', 'ava--sm') + '<span class="lrow__b"><span class="lrow__t">' + r[0] + '</span><span class="lrow__m">' + r[1] + '</span></span></div>';
            }).join('') + '</div>' +
        '</div>'
    });
  };

  /* Tour panes reuse the same interfaces */
  UI.overview = UI.principal;
  UI.students = UI.student;
  UI.teachers = UI.teacher;

  /* ============================================================
     COMPACT PREVIEWS (ecosystem panel)
     ============================================================ */
  UI.mini = {
    students: '<div class="panel" style="padding:10px">' +
      ['Aarav Sharma|IX–B|AS', 'Ishita Kaur|X–A|IK', 'Rohan Mehta|X–B|RM'].map(function (s) {
        var p = s.split('|');
        return '<div class="lrow">' + av(p[2], 'ava--sm') + '<span class="lrow__b"><span class="lrow__t">' + p[0] + '</span><span class="lrow__m">Class ' + p[1] + ' · Active</span></span><span class="pill pill--ok">Enrolled</span></div>';
      }).join('') + '</div>',
    teachers: '<div class="panel" style="padding:10px">' +
      ['S. Kulkarni|Mathematics|SK', 'M. Nair|Science|MN', 'R. Das|English|RD'].map(function (s) {
        var p = s.split('|');
        return '<div class="lrow">' + av(p[2], 'ava--sm') + '<span class="lrow__b"><span class="lrow__t">' + p[0] + '</span><span class="lrow__m">' + p[1] + '</span></span></div>';
      }).join('') + '</div>',
    attendance: '<div class="panel" style="padding:12px">' + attGrid(36, 13) + '</div>',
    results: '<div class="panel" style="padding:12px">' +
      [['Mathematics', 79], ['Science', 84], ['English', 88]].map(function (r, i) {
        return '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:11.6px;margin-bottom:5px"><span>' + r[0] + '</span><span class="muted num">' + r[1] + '%</span></div><div class="meter"><i style="--w:' + r[1] + '%;transition-delay:' + (i * 90) + 'ms"></i></div></div>';
      }).join('') + '</div>',
    fees: '<div class="panel" style="padding:12px"><div style="display:flex;justify-content:space-between;font-size:11.6px"><span>Term 2 collection</span><span class="muted num">82%</span></div><div class="meter" style="margin-top:6px"><i style="--w:82%"></i></div>' +
      '<div class="lrow" style="margin-top:8px">' + av('₹', 'ava--sm') + '<span class="lrow__b"><span class="lrow__t">Receipt #10482</span><span class="lrow__m">Aarav Sharma · Term 2</span></span><span class="pill pill--ok">Paid</span></div></div>',
    admissions: '<div class="panel" style="padding:12px">' +
      [['Enquiry', 100], ['Application', 62], ['Offer', 27]].map(function (r, i) {
        return '<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:11.6px;margin-bottom:5px"><span>' + r[0] + '</span><span class="muted num">' + r[1] + '%</span></div><div class="meter"><i style="--w:' + r[1] + '%;transition-delay:' + (i * 90) + 'ms"></i></div></div>';
      }).join('') + '</div>',
    notices: '<div class="panel" style="padding:10px">' +
      [['Exam timetable', 'All classes · 2h ago'], ['Parent–teacher meeting', 'VI–X · Yesterday']].map(function (r) {
        return '<div class="lrow">' + av('N', 'ava--sm') + '<span class="lrow__b"><span class="lrow__t">' + r[0] + '</span><span class="lrow__m">' + r[1] + '</span></span></div>';
      }).join('') + '</div>',
    reports: '<div class="panel" style="padding:12px">' +
      table([{ t: 'Report' }, { t: 'Updated', r: true }], [
        ['Attendance summary', 'Today'], ['Fee statement', 'Today'], ['Performance', 'Yesterday']
      ]) + '</div>',
    principal: '<div class="panel" style="padding:12px"><div class="mt-row" style="grid-template-columns:1fr 1fr">' +
      metric('Students', 1284, '') + metric('Attendance', 96.4, '', { dec: 1, suffix: '%' }) + '</div></div>'
  };

  /* ============================================================
     ECOSYSTEM MODULE DATA
     ============================================================ */
  UI.modules = [
    { id: 'students', t: 'Students', i: 'students', x: 50, y: 9, k: 'Module 01', h: 'Student records', p: 'Profiles, classes and sections with academic history attached to every student.', pts: ['Guardian and contact details', 'Class and section assignment', 'Fee and attendance context'] },
    { id: 'teachers', t: 'Teachers', i: 'teachers', x: 84, y: 22, k: 'Module 02', h: 'Teacher records', p: 'Staff details, subject allocation and the workload of the current day.', pts: ['Subject and section allocation', 'Daily timetable', 'Pending actions'] },
    { id: 'attendance', t: 'Attendance', i: 'attendance', x: 92, y: 50, k: 'Module 03', h: 'Daily attendance', p: 'One pass to mark a class, with patterns visible across the whole term.', pts: ['Class-wise marking', 'Section and school views', 'Term patterns'] },
    { id: 'results', t: 'Results', i: 'results', x: 84, y: 78, k: 'Module 04', h: 'Results & performance', p: 'Marks entry that becomes grades, averages and comparisons automatically.', pts: ['Structured marks entry', 'Grades and averages', 'Term comparison'] },
    { id: 'fees', t: 'Fees', i: 'fees', x: 50, y: 91, k: 'Module 05', h: 'Fees management', p: 'Structures, invoices, receipts and pending balances in one ledger.', pts: ['Fee structures per class', 'Receipts on collection', 'Live pending balances'] },
    { id: 'admissions', t: 'Admissions', i: 'admissions', x: 16, y: 78, k: 'Module 06', h: 'Admissions pipeline', p: 'Every applicant moves through clear stages from enquiry to enrolment.', pts: ['Stage-based pipeline', 'Documents per applicant', 'Enrolment creates a student'] },
    { id: 'notices', t: 'Notices', i: 'notices', x: 8, y: 50, k: 'Module 07', h: 'Notices', p: 'Publish to the school or to specific classes, and see what was read.', pts: ['Targeted audiences', 'Scheduled notices', 'Read tracking'] },
    { id: 'reports', t: 'Reports', i: 'reports', x: 16, y: 22, k: 'Module 08', h: 'Reports', p: 'Standard reports across every module, generated from live records.', pts: ['Attendance and academics', 'Fees and admissions', 'Export for meetings'] },
    { id: 'principal', t: 'Principal Dashboard', i: 'dashboard', x: 50, y: 50, hidden: true, k: 'Module 09', h: 'Principal dashboard', p: 'The school-level view: attendance, collections, performance and notices.', pts: ['School-wide metrics', 'Drill into any class', 'Works on mobile'] }
  ];

  /* ============================================================
     PHONE SCREENS
     ============================================================ */
  var tabbar = function (on) {
    var t = [['home', 'Home'], ['students', 'Students'], ['attendance', 'Attend'], ['fees', 'Fees'], ['notices', 'Notices']];
    return '<div class="ph-tabbar">' + t.map(function (x) {
      return '<button class="' + (x[0] === on ? 'is-on' : '') + '">' + ic(x[0] === 'home' ? 'home' : x[0], 18) + '<span>' + x[1] + '</span></button>';
    }).join('') + '</div>';
  };
  var status = '<div class="ph-status"><span>9:41</span><span class="r">' + ic('globe', 11) + ic('bolt', 11) + '</span></div>';

  function phone(inner, on) {
    return '<div class="phone__notch"></div><div class="phone__screen">' + status +
      '<div class="ph-body">' + inner + '</div>' + tabbar(on) + '</div>';
  }

  UI.screens = {
    dash: function () {
      return phone(
        '<div class="ph-h">Good morning,<br>Principal Rao</div><div class="ph-sub">Greenfield Public School · Today</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px">' +
          '<div class="ph-card"><div class="mt__k">Attendance</div><div class="mt__v tnum" data-count="96.4" data-dec="1" data-suffix="%">0%</div><div class="mt__d">+1.2%</div></div>' +
          '<div class="ph-card"><div class="mt__k">Students</div><div class="mt__v tnum" data-count="1284">0</div><div class="mt__d">+18</div></div>' +
          '<div class="ph-card"><div class="mt__k">Fees</div><div class="mt__v tnum" data-count="82" data-suffix="%">0%</div><div class="mt__d is-down">18% due</div></div>' +
          '<div class="ph-card"><div class="mt__k">Teachers</div><div class="mt__v tnum" data-count="74">0</div><div class="mt__d">6 depts</div></div>' +
        '</div>' +
        '<div class="ph-card" style="margin-top:10px"><div class="chart__t">Attendance · 12 weeks</div>' +
        '<svg viewBox="0 0 220 64" preserveAspectRatio="none" style="width:100%;height:60px;margin-top:8px">' +
        '<path class="area-fill" d="M0 48 L40 40 L80 44 L120 28 L160 32 L220 14 L220 64 L0 64 Z" fill="url(#gA)"/>' +
        '<path class="draw" d="M0 48 L40 40 L80 44 L120 28 L160 32 L220 14" fill="none" stroke="#03045E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '<div class="ph-card ph-touch" style="margin-top:10px;display:flex;align-items:center;gap:10px">' + av('N', 'ava--sm') +
        '<div style="flex:1;min-width:0"><div class="lrow__t">Exam timetable published</div><div class="lrow__m">All classes · 2h ago</div></div>' + ic('arw', 14) + '</div>',
        'home');
    },
    student: function () {
      return phone(
        '<div style="display:flex;align-items:center;gap:11px;margin-top:6px">' + av('AS', 'ava--lg ava--navy') +
        '<div><div class="ph-h" style="font-size:17px">Aarav Sharma</div><div class="ph-sub">MEVO-2451 · Class IX–B</div></div></div>' +
        '<div style="display:flex;gap:6px;margin-top:12px"><span class="pill pill--ok">Enrolled</span><span class="pill">Fees paid</span></div>' +
        '<div class="ph-card" style="margin-top:12px"><div class="mt__k">Attendance · term</div>' +
        '<div class="mt__v tnum" data-count="94.2" data-dec="1" data-suffix="%">0%</div>' +
        '<div class="meter meter--ok" style="margin-top:8px"><i style="--w:94%"></i></div></div>' +
        '<div class="ph-card" style="margin-top:10px"><div class="chart__t" style="margin-bottom:10px">Subjects · Term 1</div>' +
        [['Mathematics', 88], ['Science', 82], ['English', 91], ['Social Studies', 76]].map(function (r, i) {
          return '<div style="margin-bottom:9px"><div style="display:flex;justify-content:space-between;font-size:11.4px;margin-bottom:4px"><span>' + r[0] + '</span><span class="muted num">' + r[1] + '%</span></div><div class="meter"><i style="--w:' + r[1] + '%;transition-delay:' + (i * 80) + 'ms"></i></div></div>';
        }).join('') + '</div>' +
        '<button class="btn btn--sm" style="width:100%;margin-top:12px;height:46px">View full record</button>',
        'students');
    },
    att: function () {
      return phone(
        '<div class="ph-h">Attendance</div><div class="ph-sub">Class IX–B · Period 1 · Today</div>' +
        '<div class="ph-card" style="margin-top:12px;display:flex;justify-content:space-between;align-items:center">' +
        '<div><div class="mt__k">Present</div><div class="mt__v">40 / 42</div></div><span class="pill pill--ok">95.2%</span></div>' +
        '<div style="margin-top:12px">' +
        [['AS', 'Aarav Sharma', 1], ['IK', 'Ishita Kaur', 1], ['RM', 'Rohan Mehta', 0], ['SN', 'Sara Noor', 1], ['DV', 'Dev Patel', 1]].map(function (r) {
          return '<div class="ph-card ph-touch" style="margin-bottom:8px;display:flex;align-items:center;gap:10px">' + av(r[0], 'ava--sm') +
            '<div style="flex:1"><div class="lrow__t">' + r[1] + '</div><div class="lrow__m">Roll ' + (10 + r[1].length) + '</div></div>' +
            '<span class="pill ' + (r[2] ? 'pill--ok">Present' : 'pill--bad">Absent') + '</span></div>';
        }).join('') + '</div>' +
        '<button class="btn btn--sm" style="width:100%;height:48px">Submit attendance</button>',
        'attendance');
    },
    fees: function () {
      return phone(
        '<div class="ph-h">Fees</div><div class="ph-sub">Term 2 · collection</div>' +
        '<div class="ph-card" style="margin-top:12px"><div class="mt__k">Collected this term</div>' +
        '<div class="mt__v tnum" data-count="82" data-suffix="%">0%</div><div class="meter" style="margin-top:8px"><i style="--w:82%"></i></div>' +
        '<div class="lrow__m" style="margin-top:8px">241 students pending across 14 classes</div></div>' +
        '<div style="margin-top:12px">' +
        [['AS', 'Aarav Sharma', 'IX–B', 'ok', 'Paid'], ['RM', 'Rohan Mehta', 'X–B', 'warn', 'Part'], ['SN', 'Sara Noor', 'X–C', 'bad', 'Due']].map(function (r) {
          return '<div class="ph-card ph-touch" style="margin-bottom:8px;display:flex;align-items:center;gap:10px">' + av(r[0], 'ava--sm') +
            '<div style="flex:1"><div class="lrow__t">' + r[1] + '</div><div class="lrow__m">Class ' + r[2] + ' · Term 2</div></div>' +
            '<span class="pill pill--' + r[3] + '">' + r[4] + '</span></div>';
        }).join('') + '</div>' +
        '<button class="btn btn--sm" style="width:100%;height:48px">Record payment</button>',
        'fees');
    },
    notices: function () {
      return phone(
        '<div class="ph-h">Notices</div><div class="ph-sub">Published this week</div>' +
        '<div style="margin-top:12px">' +
        [['Half-yearly exam timetable', 'All classes · 2h ago', '78%'], ['Parent–teacher meeting', 'Classes VI–X · Yesterday', '64%'], ['Annual sports day trials', 'All classes · 2 days ago', '81%'], ['Library closure', 'Teachers · 3 days ago', '92%']].map(function (r) {
          return '<div class="ph-card ph-touch" style="margin-bottom:9px">' +
            '<div style="display:flex;gap:9px;align-items:flex-start">' + av('N', 'ava--sm') +
            '<div style="flex:1;min-width:0"><div class="lrow__t" style="white-space:normal">' + r[0] + '</div><div class="lrow__m">' + r[1] + '</div></div></div>' +
            '<div style="display:flex;justify-content:space-between;font-size:10.6px;margin-top:9px;color:var(--gray-soft)"><span>Read</span><span>' + r[2] + '</span></div>' +
            '<div class="meter" style="margin-top:4px"><i style="--w:' + r[2] + '"></i></div></div>';
        }).join('') + '</div>' +
        '<button class="btn btn--sm" style="width:100%;height:48px">New notice</button>',
        'notices');
    }
  };

  /* ============================================================
     SECURITY VISUALS (abstract, technical — no padlocks)
     ============================================================ */
  UI.svis = {
    access: '<svg viewBox="0 0 300 96" fill="none" aria-hidden="true">' +
      '<rect x="1" y="1" width="298" height="94" rx="8" stroke="#e7eaf2"/>' +
      [0, 1, 2].map(function (i) {
        return '<g opacity="' + (1 - i * .25) + '"><rect x="' + (22 + i * 90) + '" y="30" width="56" height="36" rx="6" stroke="#03045E" stroke-width="1.2"/>' +
          '<circle cx="' + (50 + i * 90) + '" cy="48" r="4" fill="#03045E"/></g>' +
          (i < 2 ? '<path d="M' + (78 + i * 90) + ' 48 h34" stroke="#03045E" stroke-width="1.2" stroke-dasharray="3 4"/>' : '');
      }).join('') + '</svg>',
    roles: '<svg viewBox="0 0 300 96" fill="none" aria-hidden="true">' +
      '<rect x="1" y="1" width="298" height="94" rx="8" stroke="#e7eaf2"/>' +
      '<circle cx="60" cy="48" r="16" stroke="#03045E" stroke-width="1.4"/>' +
      [24, 48, 72].map(function (y, i) {
        return '<path d="M76 48 C 120 48, 130 ' + y + ', 172 ' + y + '" stroke="#03045E" stroke-width="1.1" opacity="' + (.9 - i * .2) + '"/>' +
          '<rect x="176" y="' + (y - 9) + '" width="100" height="18" rx="5" fill="#eef2fc"/>';
      }).join('') + '</svg>',
    arch: '<svg viewBox="0 0 300 96" fill="none" aria-hidden="true">' +
      '<rect x="1" y="1" width="298" height="94" rx="8" stroke="#e7eaf2"/>' +
      [0, 1, 2, 3].map(function (i) {
        return '<rect x="' + (20 + i * 70) + '" y="20" width="52" height="24" rx="5" stroke="#03045E" stroke-width="1.1" opacity=".85"/>' +
          '<path d="M' + (46 + i * 70) + ' 44 v14 h' + (i < 3 ? '' : '') + '" stroke="#03045E" stroke-width="1" opacity=".5"/>';
      }).join('') +
      '<path d="M46 58 H256" stroke="#03045E" stroke-width="1" opacity=".5"/>' +
      '<rect x="60" y="64" width="180" height="20" rx="6" fill="#03045E" opacity=".92"/>' +
      '<text x="150" y="78" text-anchor="middle" fill="#fff" font-size="9" font-family="IBM Plex Mono, monospace" letter-spacing="1.4">SHARED DATA LAYER</text></svg>'
  };

  UI.perm = function () {
    var mods = ['Students', 'Attendance', 'Fees', 'Results', 'Notices'];
    var roles = ['Principal', 'Admin', 'Teacher'];
    var m = { Principal: ['R', 'R', 'R', 'R', 'RW'], Admin: ['RW', 'RW', 'RW', 'R', 'RW'], Teacher: ['R', 'RW', '—', 'RW', 'R'] };
    return '<table class="tbl" style="font-size:11.6px"><thead><tr><th>Module</th>' +
      roles.map(function (r) { return '<th class="r">' + r + '</th>'; }).join('') + '</tr></thead><tbody>' +
      mods.map(function (mod, i) {
        return '<tr><td style="padding-left:12px">' + mod + '</td>' + roles.map(function (r) {
          var v = m[r][i];
          var cls = v === '—' ? 'pill--flat' : (v === 'RW' ? 'pill--ok' : '');
          return '<td class="r" style="padding-right:12px"><span class="pill ' + cls + '">' + v + '</span></td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  };

  /* ============================================================
     FAQ
     ============================================================ */
  UI.faq = [
    ['What is Mevo School?', 'Mevo School is school management software. It brings students, teachers, attendance, results, fees, admissions, notices and reporting into a single connected platform, so a school runs on one set of records instead of many separate files and tools.'],
    ['Who can use Mevo School?', 'The platform is designed for principals, school administrators and teachers. Each role signs in to a view built around the work they actually do — a teacher marks attendance and enters marks, an administrator manages records and fees, a principal reviews the school overall.'],
    ['Can multiple schools use the platform?', 'Yes. Each school operates as its own workspace with its own records, staff accounts and permissions. Institutions and groups managing more than one school can bring them together under a single account on the Institution plan.'],
    ['Does Mevo School support teachers and students?', 'Teachers get their own workspace for attendance, marks entry, class lists and notices. Student information lives in a structured record that teachers and administrators can reference, with access controlled by role.'],
    ['Can school administrators manage fees?', 'Administrators can define fee structures by class or category, issue invoices, record payments, generate receipts and track pending balances at student, class or school level.'],
    ['Can principals view school performance?', 'The principal dashboard brings together total students and teachers, attendance for the day, fee collection, academic performance by class group, attendance trends and recent notices — with the ability to drill into any class.'],
    ['Is Mevo School mobile friendly?', 'Yes. The mobile experience is designed specifically for touch rather than being a shrunken desktop layout: large targets, bottom navigation and short paths to the screens used most often on a phone.'],
    ['How do I get started?', 'Choose a plan and create your school account, or talk to us if you would like help moving existing records. Setup starts with your classes and sections, after which students, teachers and fee structures can be added.']
  ];

  w.MevoUI = UI;
})(window);
