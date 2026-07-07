document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-kitchen-calculator]');

  if (!root) return;

  const form = root.querySelector('[data-calculator-form]');
  const widthInput = root.querySelector('[data-field="width"]');
  const depthInput = root.querySelector('[data-field="depth"]');

  const resultMin = root.querySelector('[data-result-min]');
  const resultMax = root.querySelector('[data-result-max]');
  const resultSummary = root.querySelector('[data-result-summary]');

  const breakdownBase = root.querySelector('[data-breakdown-base]');
  const breakdownLayout = root.querySelector('[data-breakdown-layout]');
  const breakdownOptions = root.querySelector('[data-breakdown-options]');
  const breakdownInstallation = root.querySelector('[data-breakdown-installation]');
  const messageField = root.querySelector('[data-contact-form] [data-message-field]');

  const money = new Intl.NumberFormat('ru-RU');

  const layoutRates = {
    straight: 1,
    corner: 1.08,
    u_shape: 1.18,
  };

  const facadeRates = {
    budget: 0.9,
    standard: 1,
    premium: 1.16,
  };

  const countertopRates = {
    laminate: 0,
    compact: 18000,
    stone: 42000,
  };

  const hardwareRates = {
    basic: 0.92,
    standard: 1,
    premium: 1.14,
  };

  const appliancesRates = {
    none: 0,
    basic: 32000,
    full: 68000,
  };

  const getNumber = (input, fallback) => {
    const value = Number.parseFloat(input?.value ?? '');
    return Number.isFinite(value) ? value : fallback;
  };

  const getValue = (name) => {
    const field = root.querySelector(`[name="${name}"]:checked, [name="${name}"]`);
    if (!field) return '';

    if (field.type === 'checkbox') return field.checked;
    return field.value;
  };

  const formatMoney = (value) => `${money.format(Math.round(value))} ₽`;

  const setMessage = (message) => {
    if (!messageField) return;

    messageField.value = message;
    messageField.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const calculate = () => {
    const width = Math.max(getNumber(widthInput, 3.2), 1);
    const depth = Math.max(getNumber(depthInput, 2.4), 1);
    const area = width * depth;

    const layout = getValue('layout') || 'straight';
    const facade = getValue('facade') || 'standard';
    const countertop = getValue('countertop') || 'laminate';
    const hardware = getValue('hardware') || 'standard';
    const appliances = getValue('appliances') || 'none';
    const installation = Boolean(getValue('installation'));

    const base = 42000 + area * 14500;
    const baseWithMaterials = base * facadeRates[facade] * hardwareRates[hardware];
    const layoutPrice = baseWithMaterials * layoutRates[layout];
    const optionsPrice = countertopRates[countertop] + appliancesRates[appliances];
    const installationPrice = installation ? 14000 : 0;

    const total = layoutPrice + optionsPrice + installationPrice;
    const min = total * 0.92;
    const max = total * 1.08;

    if (resultMin) resultMin.textContent = formatMoney(min);
    if (resultMax) resultMax.textContent = formatMoney(max);
    if (resultSummary) {
      resultSummary.textContent = `Площадь ${area.toFixed(1)} м², планировка ${layout === 'straight' ? 'прямая' : layout === 'corner' ? 'угловая' : 'П-образная'}.`;
    }

    if (breakdownBase) breakdownBase.textContent = formatMoney(base);
    if (breakdownLayout) breakdownLayout.textContent = formatMoney(layoutPrice - baseWithMaterials);
    if (breakdownOptions) breakdownOptions.textContent = formatMoney(optionsPrice);
    if (breakdownInstallation) breakdownInstallation.textContent = formatMoney(installationPrice);

    const layoutLabel = layout === 'straight' ? 'прямую кухню' : layout === 'corner' ? 'угловую кухню' : 'П-образную кухню';
    const facadeLabel = facade === 'budget' ? 'практичные фасады' : facade === 'standard' ? 'стандартные фасады' : 'премиальные фасады';
    const countertopLabel = countertop === 'laminate' ? 'ламинированную столешницу' : countertop === 'compact' ? 'компакт-плиту' : 'кварцевую столешницу';

    setMessage(
      `Здравствуйте! Хочу заказать кухню. Размеры помещения: ${width.toFixed(1)} x ${depth.toFixed(1)} м. Планировка: ${layoutLabel}. Фасады: ${facadeLabel}. Столешница: ${countertopLabel}. Ориентировочная стоимость: от ${money.format(Math.round(min))} ₽ до ${money.format(Math.round(max))} ₽.`
    );
  };

  form?.addEventListener('input', calculate);
  form?.addEventListener('change', calculate);
  form?.addEventListener('reset', () => window.setTimeout(calculate, 0));

  calculate();
});
