# 1. Image officielle Node.js
FROM node:18

# 2. Créer un dossier de travail dans le conteneur
WORKDIR /app

# Ajout : forcer l'installation des devDependencies
ENV NODE_ENV=development

# 3. Copier les fichiers de configuration du projet (pour cache Docker)
COPY package*.json ./

# 4. Installer les dépendances React, Vite, Tailwind, DaisyUI, etc.
RUN npm install && npm install gsap ogl && npm install -g vite && ls -l node_modules/.bin && npx vite --version

# 5. Copier le reste des fichiers du frontend
COPY . .

# 6. Exposer le port utilisé par Vite (par défaut 3000 ici)
EXPOSE 3000

# 7. Lancer le serveur de développement avec Vite en mode Docker-compatible
CMD ["npm", "run", "dev"]
