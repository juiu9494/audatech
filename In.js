// Fonction principale : détecter et envoyer la localisation
async function trackLocation() {
  try {
    // Récupérer les infos publiques de l'IP via ip-api.com (gratuit, pas de clé)
    const response = await fetch('http://ip-api.com/json/?fields=status,message,country,regionName,city,zip,lat,lon,isp,org,query');
    const data = await response.json();
    
    if (data.status === 'success') {
      // Construire l'objet à envoyer
      const visitorInfo = {
        ip: data.query,
        city: data.city,
        region: data.regionName,
        country: data.country,
        zip: data.zip,
        isp: data.isp,
        latitude: data.lat,
        longitude: data.lon,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      };
      
      // Envoyer à ton endpoint Vercel / Cloudflare (à créer)
      await fetch('https://TON-PROJET.vercel.app/api/log-visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitorInfo)
      });
      
      console.log('Localisation envoyée avec succès');
    } else {
      console.warn('Géolocalisation IP impossible');
    }
  } catch (error) {
    console.error('Erreur lors du tracking :', error);
  }
}

// Lancer au chargement de la page
window.addEventListener('DOMContentLoaded', trackLocation);
