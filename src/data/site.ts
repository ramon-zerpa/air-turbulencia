export const site = {
  name: 'Air Turbulencia',
  origin: 'https://www.airturbulencia.com',
  phone: '(813) 815-1234',
  phoneHref: 'tel:+18138151234',
  email: 'contacts@airturbulencia.com',
  address: '4023 W Cayuga St, Tampa, FL 33614',
};

// Only the homepage is implemented in this review phase. Other destinations
// intentionally resolve to the existing public site, never to empty local pages.
export function pageLink(path: string) {
  return path === '/' ? '/' : `${site.origin}${path}`;
}

export const acServices = [
  ['Air Conditioning Installation', '/air-conditioning-installation-tampa/'],
  ['Air Conditioning Repair', '/ac-repair-tampa/'],
  ['Air Conditioning Maintenance', '/ac-maintenance-tampa/'],
  ['Commercial Air Conditioning', '/commercial-ac-tampa/'],
  ['Air Conditioning Emergency', '/ac-emergency-tampa/'],
  ['High Efficiency AC Systems', '/high-efficiency-ac-systems/'],
  ['AC Zone Control Systems', '/ac-zone-control-systems-tampa/'],
  ['Ductless Mini Split Systems', '/ductless-mini-split-systems-tampa/'],
  ['HVAC Heat Pumps', '/hvac-heat-pumps-tampa/'],
  ['Air Conditioning Thermostats', '/thermostat-services-tampa/'],
] as const;

export const heatingServices = [
  ['Heating Installation', '/heating-installation-tampa/'],
  ['Heating Repair', '/heating-repair-tampa/'],
  ['Heating Maintenance', '/heating-maintenance-tampa/'],
  ['Commercial Heating', '/commercial-heating-tampa/'],
  ['Heating Emergency', '/heating-emergency-tampa/'],
  ['Hybrid Heating Systems', '/hybrid-heating-systems-tampa/'],
  ['Heating Zone Control Systems', '/heating-zone-control-systems-tampa/'],
  ['Heating Furnaces', '/heating-furnaces-tampa/'],
  ['Packaged HVAC Units', '/packaged-hvac-units-tampa/'],
  ['Heat Pumps Service', '/heat-pumps-service-tampa/'],
] as const;

export const exploreLinks = [
  ['About Us', '/about-air-turbulencia/'],
  ['Why Choose Us', '/why-choose-air-turbulencia/'],
  ['Service Area', '/air-turbulencia-service-area/'],
  ['AC Financing', '/ac-financing-tampa/'],
  ['FAQs', '/hvac-tips-faqs/'],
  ['AC Tips', '/air-conditioning-tips-tampa/'],
  ['Heating Tips', '/heating-tips-tampa/'],
  ['Contact', '/contact/'],
] as const;

export const serviceAreaGroups = [
  ['Tampa', 'South Tampa', 'Carrollwood', 'Brandon'],
  ['Riverview', 'Wesley Chapel', 'Lutz', 'New Tampa'],
  ['Clearwater', 'St Petersburg', 'Palm Harbor', 'Westchase'],
];

export const faqs = [
  {
    question: 'Do you service older air conditioners?',
    answer: 'Our team works on older and newer equipment across every major make and model. Contact us to discuss the issue you’re experiencing.',
  },
  {
    question: 'How do I start planning a new AC installation?',
    answer: 'Request an in-home assessment. We evaluate your home, recommend a properly sized system and provide a clear estimate before work starts.',
  },
  {
    question: 'Can I ask about AC financing?',
    answer: 'Yes. Visit our AC Financing page or speak with our team about current options and terms.',
  },
];
