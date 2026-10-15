const header = document.querySelector<HTMLElement>('.site-header')!
const homeLink = document.querySelector<HTMLAnchorElement>('.site-header__logo')!
const menuButton = document.querySelector<HTMLButtonElement>('.site-header__menu-toggle')!
const navigation = document.querySelector<HTMLElement>('.site-header__nav')!
const navigationLinks = [...navigation.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true'
  setMenuOpen(!isOpen)
})

const setMenuOpen = (isOpen: boolean) => {
  menuButton.setAttribute('aria-expanded', String(isOpen))
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú')
  menuButton.textContent = isOpen ? '×' : '☰'
  navigation.classList.toggle('site-header__nav--open', isOpen)
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false)
    menuButton.focus()
  }
})

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false)
  })
})

const linkForSection: Record<string, string> = {
  servicios: '#servicios',
  proceso: '#servicios',
  contacto: '#contacto',
  'sobre-mi': '#sobre-mi',
  proyectos: '#proyectos',
}

let currentSectionId: string | null = null

const setCurrentSection = (sectionId: string) => {
  if (sectionId === currentSectionId) return
  currentSectionId = sectionId

  const activeHref = linkForSection[sectionId]

  if (sectionId === 'inicio') {
    homeLink.setAttribute('aria-current', 'page')
  } else {
    homeLink.removeAttribute('aria-current')
  }

  navigationLinks.forEach((link) => {
    if (link.getAttribute('href') === activeHref) {
      link.setAttribute('aria-current', 'location')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

// Deben estar en el mismo orden en que aparecen en la página
const sections = [
  ...document.querySelectorAll<HTMLElement>(
    '#inicio, #servicios, #proceso, #contacto, #sobre-mi, #proyectos',
  ),
]

const updateCurrentSection = () => {
  const activationLine = header.offsetHeight + 24

  // Última sección cuyo borde superior ya pasó la línea
  let current = sections[0]
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= activationLine) current = section
  }

  // Al final de la página, la última sección siempre gana
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  if (atBottom) current = sections[sections.length - 1]

  setCurrentSection(current.id)
}

// Throttle con requestAnimationFrame: como mucho una actualización por frame
let ticking = false
const onScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    updateCurrentSection()
    ticking = false
  })
}

window.addEventListener('scroll', onScroll, { passive: true })
window.addEventListener('resize', onScroll)
new ResizeObserver(onScroll).observe(document.body) // por si cambia el alto del contenido (fuentes, imágenes)

updateCurrentSection()

const projectForm = document.querySelector<HTMLFormElement>('#project-form')!
projectForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(projectForm)
  const body = [
    `Nombre: ${formData.get('name')}`,
    `E-mail: ${formData.get('email')}`,
    '',
    String(formData.get('proposal')),
  ].join('\n')
  const subject = encodeURIComponent(`Consulta de proyecto — ${formData.get('name')}`)
  window.location.href = `mailto:emmaquintana0307@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`
  document.querySelector('#form-note')!.textContent =
    'Se abrió tu aplicación de correo con la consulta lista para revisar y enviar.'
})

document.querySelectorAll<HTMLButtonElement>('[data-dialog]').forEach((trigger) => {
  const dialog = document.getElementById(trigger.dataset.dialog!) as HTMLDialogElement | null
  if (!dialog) return

  trigger.addEventListener('click', () => {
    dialog.showModal()
    document.body.classList.add('has-open-dialog')
  })
  dialog.addEventListener('close', () => {
    document.body.classList.remove('has-open-dialog')
  })
  dialog.querySelector<HTMLButtonElement>('.project-dialog__close')?.addEventListener('click', () => {
    dialog.close()
  })
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })
})
