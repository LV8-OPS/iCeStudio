const menuButton = document.querySelector('.menu-button');
const mainMenu = document.querySelector('.main-nav');

if (menuButton && mainMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = mainMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

const services = {
  'vertical-simple': { title: 'Vidéo verticale simple', price: 35, type: 'video' },
  'vertical-dynamique': { title: 'Vidéo verticale dynamique', price: 56, type: 'video' },
  'publicite': { title: 'Publicité verticale', price: 84, type: 'video' },
  'publicite-sans-rushes': { title: 'Publicité sans tournage', price: 126, type: 'video' },
  'horizontal-5': { title: 'Vidéo horizontale jusqu’à 5 min', price: 70, type: 'video' },
  'horizontal-10': { title: 'Vidéo horizontale jusqu’à 10 min', price: 98, type: 'video' },
  'horizontal-20': { title: 'Vidéo horizontale de 10 à 20 min', price: 140, type: 'video' },
  'landing': { title: 'Landing page', price: 250, type: 'site' },
  'site-3': { title: 'Site vitrine jusqu’à 3 pages', price: 400, type: 'site' },
  'site-5': { title: 'Site vitrine jusqu’à 5 pages', price: 600, type: 'site' }
};

const videoOptions = [
  { id: 'subtitles', label: 'Sous-titres dynamiques', detail: '+18 € par vidéo', kind: 'fixed-per-item', value: 18 },
  { id: 'audio', label: 'Nettoyage audio', detail: '+14 € par projet', kind: 'fixed', value: 14 },
  { id: 'thumbnail', label: 'Miniature / couverture', detail: '+18 €', kind: 'fixed', value: 18 },
  { id: 'hook', label: 'Hook et appel à l’action', detail: '+18 € par vidéo', kind: 'fixed-per-item', value: 18 },
  { id: 'intro', label: 'Intro / outro simple', detail: '+28 €', kind: 'fixed', value: 28 },
  { id: 'chapters', label: 'Découpage en chapitres', detail: '+14 €', kind: 'fixed', value: 14 },
  { id: 'media', label: 'Recherche de médias et musiques', detail: '+21 €', kind: 'fixed', value: 21 },
  { id: 'color', label: 'Correction colorimétrique avancée', detail: '+15 %', kind: 'percent', value: 15 },
  { id: 'priority', label: 'Livraison prioritaire', detail: '+30 %', kind: 'percent', value: 30 },
  { id: 'rushes', label: 'Rushes longs ou désorganisés', detail: '+20 %', kind: 'percent', value: 20 },
  { id: 'creation', label: 'Création sans rushes fournis', detail: '+40 %', kind: 'percent', value: 40 },
  { id: 'motion', label: 'Animations avancées', detail: '+25 %', kind: 'percent', value: 25 }
];

const siteOptions = [
  { id: 'texts', label: 'Rédaction des textes', detail: '+75 €', kind: 'fixed', value: 75 },
  { id: 'logo', label: 'Logo simple', detail: '+50 €', kind: 'fixed', value: 50 },
  { id: 'tally', label: 'Formulaire Tally', detail: '+20 €', kind: 'fixed', value: 20 },
  { id: 'whatsapp', label: 'Bouton WhatsApp', detail: '+15 €', kind: 'fixed', value: 15 },
  { id: 'calendly', label: 'Intégration Calendly', detail: '+20 €', kind: 'fixed', value: 20 },
  { id: 'stripe', label: 'Intégration Stripe Payment Link', detail: '+30 €', kind: 'fixed', value: 30 },
  { id: 'gallery', label: 'Galerie photo ou vidéo', detail: '+40 €', kind: 'fixed', value: 40 },
  { id: 'faq', label: 'FAQ interactive', detail: '+30 €', kind: 'fixed', value: 30 },
  { id: 'deploy', label: 'Mise en ligne GitHub + Vercel', detail: '+25 €', kind: 'fixed', value: 25 },
  { id: 'domain', label: 'Connexion du nom de domaine', detail: '+25 €', kind: 'fixed', value: 25 },
  { id: 'animations', label: 'Animations avancées', detail: '+20 %', kind: 'percent', value: 20 },
  { id: 'seo', label: 'SEO renforcé', detail: '+20 %', kind: 'percent', value: 20 },
  { id: 'site-priority', label: 'Livraison prioritaire', detail: '+35 %', kind: 'percent', value: 35 }
];

const orderForm = document.querySelector('#order-form');

if (orderForm) {
  const radios = [...document.querySelectorAll('input[name="project"]')];
  const quantity = document.querySelector('#quantity');
  const extraPages = document.querySelector('#extra-pages');
  const quantityBlock = document.querySelector('#quantity-block');
  const pagesBlock = document.querySelector('#pages-block');
  const optionsList = document.querySelector('#options-list');
  const summaryTitle = document.querySelector('#summary-title');
  const basePrice = document.querySelector('#base-price');
  const summaryQuantity = document.querySelector('#summary-quantity');
  const discountValue = document.querySelector('#discount-value');
  const discountMessage = document.querySelector('#discount-message');
  const fixedSummary = document.querySelector('#fixed-summary');
  const percentSummary = document.querySelector('#percent-summary');
  const totalPrice = document.querySelector('#total-price');

  const params = new URLSearchParams(window.location.search);
  const selectedFromUrl = params.get('service');
  if (selectedFromUrl && services[selectedFromUrl]) {
    const radio = document.querySelector(`input[value="${selectedFromUrl}"]`);
    if (radio) radio.checked = true;
  }

  const euros = value => `${value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} €`;
  const selectedService = () => services[radios.find(radio => radio.checked).value];

  function renderOptions() {
    const service = selectedService();
    const options = service.type === 'video' ? videoOptions : siteOptions;
    optionsList.innerHTML = options.map(option => `<label class="option-item"><input type="checkbox" data-id="${option.id}" data-kind="${option.kind}" data-value="${option.value}"><span>${option.label}<small>${option.detail}</small></span></label>`).join('');
  }

  function getDiscount(qty) {
    if (qty >= 10) return 12;
    if (qty >= 5) return 10;
    if (qty >= 3) return 5;
    return 0;
  }

  function updateEstimate() {
    const service = selectedService();
    const isVideo = service.type === 'video';
    const qty = Math.max(1, Number(quantity.value) || 1);
    const pages = Math.max(0, Number(extraPages.value) || 0);
    const discount = isVideo ? getDiscount(qty) : 0;
    const initial = service.price * (isVideo ? qty : 1);
    const discountAmount = initial * discount / 100;
    const afterDiscount = initial - discountAmount;
    let fixed = isVideo ? 0 : pages * 50;
    let percent = 0;
    const fixedNames = [];
    const percentNames = [];

    document.querySelectorAll('#options-list input:checked').forEach(input => {
      const value = Number(input.dataset.value);
      const label = input.closest('label').querySelector('span').childNodes[0].textContent.trim();
      if (input.dataset.kind === 'fixed') {
        fixed += value;
        fixedNames.push(`${label} : +${euros(value)}`);
      }
      if (input.dataset.kind === 'fixed-per-item') {
        const amount = value * qty;
        fixed += amount;
        fixedNames.push(`${label} : +${euros(amount)}`);
      }
      if (input.dataset.kind === 'percent') {
        percent += value;
        percentNames.push(`${label} : +${value} %`);
      }
    });

    const percentageAmount = (afterDiscount + fixed) * percent / 100;
    const total = afterDiscount + fixed + percentageAmount;

    summaryTitle.textContent = service.title;
    basePrice.textContent = euros(service.price);
    summaryQuantity.textContent = isVideo ? `× ${qty}` : 'Base';
    discountValue.textContent = discountAmount ? `-${euros(discountAmount)}` : '0 €';
    discountMessage.textContent = isVideo ? (discount ? `${qty} vidéos : réduction de ${discount} % appliquée sur le prix de base.` : '1 à 2 vidéos : aucune réduction quantité.') : 'Les réductions par quantité concernent les vidéos.';
    fixedSummary.innerHTML = (pages ? `<div class="summary-line"><span>Pages supplémentaires</span><strong>+${euros(pages * 50)}</strong></div>` : '') + fixedNames.map(text => `<div class="summary-line"><span>${text.split(' : ')[0]}</span><strong>${text.split(' : ')[1]}</strong></div>`).join('');
    percentSummary.innerHTML = percentNames.map(text => `<div class="summary-line"><span>${text.split(' : ')[0]}</span><strong>${text.split(' : ')[1]}</strong></div>`).join('') + (percentageAmount ? `<div class="summary-line"><span>Suppléments en pourcentage</span><strong>+${euros(percentageAmount)}</strong></div>` : '');
    totalPrice.textContent = euros(total);
  }

  function switchProject() {
    const isVideo = selectedService().type === 'video';
    quantityBlock.classList.toggle('hidden', !isVideo);
    pagesBlock.classList.toggle('hidden', isVideo);
    renderOptions();
    updateEstimate();
  }

  radios.forEach(radio => radio.addEventListener('change', switchProject));
  optionsList.addEventListener('change', updateEstimate);
  quantity.addEventListener('input', updateEstimate);
  extraPages.addEventListener('input', updateEstimate);
  document.querySelector('#increase').addEventListener('click', () => { quantity.value = Math.min(99, (Number(quantity.value) || 1) + 1); updateEstimate(); });
  document.querySelector('#decrease').addEventListener('click', () => { quantity.value = Math.max(1, (Number(quantity.value) || 1) - 1); updateEstimate(); });
  document.querySelector('#increase-pages').addEventListener('click', () => { extraPages.value = Math.min(30, (Number(extraPages.value) || 0) + 1); updateEstimate(); });
  document.querySelector('#decrease-pages').addEventListener('click', () => { extraPages.value = Math.max(0, (Number(extraPages.value) || 0) - 1); updateEstimate(); });

  orderForm.addEventListener('submit', event => {
    event.preventDefault();
    const service = selectedService();
    const name = document.querySelector('#client-name').value;
    const email = document.querySelector('#client-email').value;
    const phone = document.querySelector('#client-phone').value;
    const deadline = document.querySelector('#client-deadline').value;
    const message = document.querySelector('#client-message').value;
    const selectedOptions = [...document.querySelectorAll('#options-list input:checked')].map(input => input.closest('label').querySelector('span').childNodes[0].textContent.trim()).join(', ') || 'Aucune';
    const body = `Bonjour iCeStudio,%0D%0A%0D%0AJe souhaite demander un devis gratuit.%0D%0A%0D%0AProjet : ${encodeURIComponent(service.title)}%0D%0AQuantité : ${encodeURIComponent(quantity.value)}%0D%0APages supplémentaires : ${encodeURIComponent(extraPages.value)}%0D%0AOptions : ${encodeURIComponent(selectedOptions)}%0D%0AEstimation affichée : ${encodeURIComponent(totalPrice.textContent)}%0D%0ADélai : ${encodeURIComponent(deadline)}%0D%0A%0D%0ANom : ${encodeURIComponent(name)}%0D%0AEmail : ${encodeURIComponent(email)}%0D%0ATéléphone : ${encodeURIComponent(phone)}%0D%0A%0D%0ADemande :%0D%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:contact@ice.studio?subject=${encodeURIComponent('Demande de devis — ' + service.title)}&body=${body}`;
  });

  switchProject();
}
