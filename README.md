# Boba Bloom

Site React/Vite immersif pour une marque de bubble tea fictive.

## Lancer en local

1. Installer Node.js 18+.
2. Dans ce dossier :
   ```bash
   npm install
   npm run dev
   ```
3. Ouvrir l'adresse affichée par Vite (souvent `http://localhost:5173`).

## Build production

```bash
npm run build
npm run preview
```

## Notes

- Panier persistant avec `localStorage`.
- Personnalisation : taille, sucre, glaçons et toppings.
- Commande simulée, aucun paiement réel.
- Expérience 3D Three.js avec rotation au doigt/souris et changement de saveur.
- Illustrations de gobelets générées en CSS, donc aucune image externe obligatoire.
- `prefers-reduced-motion` est pris en compte.
