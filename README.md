# Automatisation Windows (scripts .bat)

Pour automatiser le démarrage, la sauvegarde et la synchronisation de la base de données et des images MinIO avec Docker sur Windows, utilise les scripts batch fournis :

- **up.bat** : démarre les conteneurs, importe les images MinIO et la base de données
- **down.bat** : exporte la base de données, exporte les images MinIO et arrête les conteneurs

## Utilisation

Dans le terminal de l'ide `.\up.bat`

1. **Ouvre l’invite de commandes (CMD)**
   - Appuie sur `Win + R`, tape `cmd`, puis Entrée
   - Ou cherche "Invite de commandes" dans le menu Démarrer

2. **Va dans le dossier du projet**
   ```sh
   cd "C:\Users\tytou\Documents\ESIEA\Semestre 2 3A\UNIZA\Git\Wikicine"
   ```

3. **Démarrer et importer (tout restaurer)**
   ```sh
   up.bat
   ```

4. **Sauvegarder et arrêter (tout exporter)**
   ```sh
   down.bat
   ```

## Remarques
- Les scripts utilisent les commandes Docker, donc Docker Desktop doit être lancé.
- Adapte les noms de conteneurs dans les scripts si besoin (`wikicine-minio-1`, `wikicine-db-1`).
- Les scripts `import_db.bat` et `export_db.bat` sont appelés automatiquement.
- Tu peux aussi double-cliquer sur les fichiers `.bat` dans l'explorateur Windows pour les exécuter.

---

Pour toute l'équipe : il suffit de lancer `up.bat` pour tout démarrer, et `down.bat` pour tout sauvegarder et arrêter, sans installer d'outil supplémentaire !
