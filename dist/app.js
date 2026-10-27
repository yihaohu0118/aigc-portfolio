(() => {
  'use strict';
  const { projects, stages } = window.PORTFOLIO;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const grid = $('#project-grid');
  const dialog = $('#project-dialog');
  const media = $('#dialog-media');
  const loadMore = $('#load-more');
  const pageSize = 6;
  let filter = 'all';
  let visible = pageSize;
  let activeProject = null;
  let activeCollection = [];
  let returnFocus = null;
  let toastTimer;
  const pad = value => String(value).padStart(2, '0');
  const fileFor = project => project.src || ('assets/' + project.id + '.mp4');
  const filteredProjects = () => projects.filter(project => filter === 'all' || project.category === filter);

  function toast(message) {
    const node = $('#toast');
    node.textContent = message;
    node.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('visible'), 3500);
  }

  const posterObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        preparePreview(entry.target);
        posterObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '180px' }) : null;

  const pauseObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
  }) : null;

  function preparePreview(video) {
    if (video.dataset.loaded) return;
    video.dataset.loaded = 'true';
    video.preload = 'metadata';
    video.src = video.dataset.src;
    video.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(video.duration) && video.duration > 0.2) {
        video.currentTime = Math.min(0.6, video.duration / 3);
      }
    }, { once: true });
    video.load();
  }

  function createCard(project, index) {
    const article = document.createElement('article');
    article.className = 'project-card';
    article.style.animationDelay = `${(index % pageSize) * 35}ms`;
    const trigger = document.createElement('button');
    trigger.className = 'project-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-label', '播放作品：' + project.title);
    trigger.innerHTML = '<div class="project-visual"><video muted playsinline loop preload="none" aria-hidden="true" tabindex="-1"></video><div class="project-overlay"></div><span class="project-tag"></span><span class="project-play" aria-hidden="true">▶</span></div><div class="project-meta"><span class="project-number"></span><div><h3 class="project-name"></h3><p class="project-description"></p></div><span class="project-go" aria-hidden="true">↗</span></div>';
    $('.project-tag', trigger).textContent = project.kind;
    $('.project-number', trigger).textContent = pad(projects.indexOf(project) + 1);
    $('.project-name', trigger).textContent = project.title;
    $('.project-description', trigger).textContent = project.label;
    const video = $('video', trigger);
    video.muted = true;
    video.dataset.src = fileFor(project);
    if (window.MEDIA_READY) {
      video.poster = 'assets/posters/' + project.id + '.jpg';
    } else if (posterObserver) {
      posterObserver.observe(video);
    } else {
      preparePreview(video);
    }
    if (pauseObserver) pauseObserver.observe(video);
    const play = () => {
      if (reducedMotion.matches || !canHover.matches || dialog.open) return;
      preparePreview(video);
      video.play().catch(() => {});
    };
    trigger.addEventListener('pointerenter', play);
    trigger.addEventListener('pointerleave', () => video.pause());
    trigger.addEventListener('focus', play);
    trigger.addEventListener('blur', () => video.pause());
    trigger.addEventListener('click', () => {
      returnFocus = trigger;
      activeCollection = filteredProjects();
      openProject(project);
    });
    article.append(trigger);
    return article;
  }

  function renderProjects(append = false) {
    const list = filteredProjects();
    if (!append) {
      $$('video', grid).forEach(video => {
        video.pause();
        posterObserver?.unobserve(video);
        pauseObserver?.unobserve(video);
        video.removeAttribute('src');
        video.load();
      });
      grid.replaceChildren();
    }
    const start = append ? grid.children.length : 0;
    const fragment = document.createDocumentFragment();
    list.slice(start, visible).forEach((project, i) => fragment.append(createCard(project, start + i)));
    grid.append(fragment);
    loadMore.hidden = visible >= list.length;
    $('.works-count').textContent = `${pad(list.length)} 件创作 / 持续更新中`;
    $('#visible-count').textContent = `${pad(Math.min(visible, list.length))} / ${pad(list.length)}`;
    if (append) $('.project-trigger', grid.children[start])?.focus({ preventScroll: true });
  }

  $$('.filter').forEach(button => {
    const count = projects.filter(project => button.dataset.filter === 'all' || button.dataset.filter === project.category).length;
    $('sup', button).textContent = pad(count);
    button.addEventListener('click', () => {
      filter = button.dataset.filter;
      visible = pageSize;
      $$('.filter').forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      renderProjects();
    });
  });
  loadMore.addEventListener('click', () => { visible += pageSize; renderProjects(true); });

  function clearMedia() {
    $$('video', media).forEach(video => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    });
    media.replaceChildren();
  }

  function showDialog() {
    $$('video', grid).forEach(video => video.pause());
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
    dialog.scrollTop = 0;
  }

  function openProject(project) {
    activeProject = project;
    clearMedia();
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = fileFor(project);
    video.setAttribute('aria-label', project.title);
    video.addEventListener('error', () => toast('视频暂时无法加载，可以尝试「单独打开」。'));
    media.append(video);
    $('#dialog-title').textContent = project.title;
    $('#dialog-category').textContent = (project.category === 'camp' ? '训练营 AIGC' : '产品 AIGC') + ' / ' + project.kind;
    $('#dialog-description').textContent = project.description;
    $('#dialog-index').textContent = 'ARCHIVE ' + pad(projects.indexOf(project) + 1) + ' / ' + project.original;
    $('#dialog-download').href = fileFor(project);
    $('.dialog-bottom').hidden = false;
    $('#dialog-position').textContent = `${pad(activeCollection.indexOf(project) + 1)} / ${pad(activeCollection.length)}`;
    showDialog();
    video.play().catch(() => {});
  }

  function moveProject(direction) {
    if (!activeProject || activeCollection.length === 0) return;
    const index = activeCollection.indexOf(activeProject);
    openProject(activeCollection[(index + direction + activeCollection.length) % activeCollection.length]);
  }
  $('#previous-project').addEventListener('click', () => moveProject(-1));
  $('#next-project').addEventListener('click', () => moveProject(1));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    clearMedia();
    activeProject = null;
    document.body.classList.remove('dialog-open');
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  $('#open-workflow').addEventListener('click', event => {
    returnFocus = event.currentTarget;
    activeProject = null;
    clearMedia();
    const image = document.createElement('img');
    image.src = 'assets/workflow.png';
    image.alt = '训练营短片工作流：角色设定、脚本，以及与分镜画面连接的制作节点。';
    media.append(image);
    $('#dialog-title').textContent = '从想法到分镜 · 创作工作流';
    $('#dialog-category').textContent = '训练营 AIGC / MAKING OF';
    $('#dialog-index').textContent = 'PROCESS ARCHIVE';
    $('#dialog-description').textContent = '随训练营短片提供的原始工作流截图，包含角色参考、脚本和分镜。';
    $('#dialog-download').href = 'assets/workflow.png';
    $('.dialog-bottom').hidden = true;
    showDialog();
  });

  const stageTabs = $$('[data-stage]', $('.journey-tabs'));
  function setStage(index, focus = false) {
    const stage = stages[index];
    stageTabs.forEach((tab, i) => {
      tab.classList.toggle('active', index === i);
      tab.setAttribute('aria-selected', String(index === i));
      tab.tabIndex = index === i ? 0 : -1;
    });
    $('#stage-panel').dataset.stage = index;
    $('#stage-panel').setAttribute('aria-labelledby', `stage-tab-${index}`);
    $('#stage-kicker').textContent = stage.kicker;
    $('#stage-title').textContent = stage.title;
    $('#stage-description').textContent = stage.description;
    if (focus) stageTabs[index].focus();
  }
  stageTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setStage(index));
    tab.addEventListener('keydown', event => {
      const keyMap = { ArrowRight: (index + 1) % stages.length, ArrowLeft: (index - 1 + stages.length) % stages.length, Home: 0, End: stages.length - 1 };
      if (event.key in keyMap) { event.preventDefault(); setStage(keyMap[event.key], true); }
    });
  });

  const character = $('.character');
  let characterTimer;
  let inspirationIndex = 0;
  const inspirations = ['灵感 +1，继续玩！', '先试试看，再说。', '今天也要保持好奇。', '下一件作品，会是什么？'];
  character.addEventListener('click', () => {
    $('.character-message').textContent = inspirations[inspirationIndex++ % inspirations.length];
    character.classList.remove('is-happy');
    requestAnimationFrame(() => character.classList.add('is-happy'));
    clearTimeout(characterTimer);
    characterTimer = setTimeout(() => character.classList.remove('is-happy'), 2400);
  });
  $('#home').addEventListener('pointermove', event => {
    if (reducedMotion.matches || !canHover.matches) return;
    const bounds = character.getBoundingClientRect();
    const x = Math.max(-5, Math.min(5, (event.clientX - bounds.left - bounds.width / 2) / 50));
    const y = Math.max(-3, Math.min(3, (event.clientY - bounds.top - bounds.height / 2) / 70));
    $('.pupils').style.transform = `translate(${x}px, ${y}px)`;
  });
  $('#home').addEventListener('pointerleave', () => { $('.pupils').style.transform = ''; });

  const navLinks = $$('.main-nav a');
  const trackedSections = navLinks.map(link => $(link.getAttribute('href')));
  let scrollPending = false;
  function updateScroll() {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    $('.reading-progress').style.transform = `scaleX(${height > 0 ? Math.min(1, window.scrollY / height) : 0})`;
    let active = '';
    trackedSections.forEach(section => { if (section.getBoundingClientRect().top <= 160) active = '#' + section.id; });
    navLinks.forEach(link => {
      const selected = link.getAttribute('href') === active;
      link.classList.toggle('active', selected);
      if (selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
    scrollPending = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) $$('video').forEach(video => video.pause());
  });
  renderProjects();
  updateScroll();
})();
